const { Worker } = require('bullmq')
const axios = require('axios')
const redis = require('../config/redis')
const WebhookLog = require('../models/WebhookLog')
const logger = require('../utils/logger')

const webhookWorker = new Worker('webhooks', async (job) => {
  const { webhookUrl, eventData, subscriptionId, eventId } = job.data

  logger.info(`Processing webhook delivery for ${webhookUrl} — attempt ${job.attemptsMade + 1}`)

  try {
    // Step 1 — send POST request to user's webhook URL
    const response = await axios.post(webhookUrl, eventData, {
      timeout: 5000, // wait max 5 seconds for response
      headers: {
        'Content-Type': 'application/json',
        'x-chainwatch-event': 'Transfer', // so user knows it came from ChainWatch
      },
    })

    // Step 2 — log successful delivery
    await WebhookLog.create({
      subscriptionId,
      eventId,
      webhookUrl,
      status: 'success',
      statusCode: response.status,
      attempt: job.attemptsMade + 1,
      error: null,
    })

    logger.success(`Webhook delivered successfully to ${webhookUrl}`)

    return { success: true, statusCode: response.status }

  } catch (error) {
    const statusCode = error.response?.status || null
    const errorMessage = error.message || 'Unknown error'

    // Step 3 — log failed delivery attempt
    await WebhookLog.create({
      subscriptionId,
      eventId,
      webhookUrl,
      status: 'failed',
      statusCode,
      attempt: job.attemptsMade + 1,
      error: errorMessage,
    })

    logger.error(`Webhook delivery failed for ${webhookUrl} — ${errorMessage}`)

    // Step 4 — throw error so BullMQ knows to retry
    throw new Error(errorMessage)
  }

}, { connection: redis })

// worker events
webhookWorker.on('completed', (job) => {
  logger.success(`Job ${job.id} completed successfully`)
})

webhookWorker.on('failed', (job, error) => {
  logger.error(`Job ${job.id} failed after all attempts — ${error.message}`)
})

webhookWorker.on('error', (error) => {
  logger.error('Worker error', error.message)
})

module.exports = webhookWorker