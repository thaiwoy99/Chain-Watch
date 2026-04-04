const { Queue } = require('bullmq')
const redis = require('../config/redis')

const webhookQueue = new Queue('webhooks', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
})

webhookQueue.on('error', (error) => {
  console.error('Webhook queue error:', error.message)
})

module.exports = webhookQueue