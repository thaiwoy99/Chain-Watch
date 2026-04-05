const { ethers } = require('ethers')
const { createEvent, eventExists } = require('../services/eventService')
const { getActiveSubscriptionsByNetwork } = require('../services/subscriptionService')
const { getTokenLogo } = require('../services/tokenService')
const webhookQueue = require('../queues/webhookQueue')
const logger = require('../utils/logger')

const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)'
]

const startTransferListener = async (network, wsUrl) => {
  logger.info(`Starting listener for ${network}...`)

  try {
    // Step 1 — connect to blockchain via WebSocket
    const provider = new ethers.WebSocketProvider(wsUrl)

    // Step 2 — handle WebSocket errors without crashing
    provider.websocket.on('error', (error) => {
      logger.error(`WebSocket error on ${network} — ${error.message}`)
    })

    provider.websocket.on('close', () => {
      logger.error(`WebSocket closed for ${network}`)
    })

    // Step 3 — load all active subscriptions for this network
    const subscriptions = await getActiveSubscriptionsByNetwork(network)

    if (subscriptions.length === 0) {
      logger.info(`No active subscriptions for ${network}`)
      return
    }

    logger.info(`Watching ${subscriptions.length} address(es) on ${network}`)

    // Step 4 — attach a listener for each subscription
    for (const subscription of subscriptions) {
      attachListener(provider, subscription, network)
    }

  } catch (error) {
    logger.error(`Failed to start listener for ${network} — skipping`, error.message)
  }
}

const attachListener = (provider, subscription, network) => {
  const { address, webhookUrl, _id: subscriptionId } = subscription

  logger.info(`Watching address ${address} on ${network}`)

  const filter = {
    topics: [
      ethers.id('Transfer(address,address,uint256)'),
      null,
      ethers.zeroPadValue(address, 32)
    ]
  }

  provider.on(filter, async (log) => {
    try {
      logger.info(`Transfer detected for ${address} on ${network}`)

      const txHash = log.transactionHash

      const alreadyProcessed = await eventExists(txHash)
      if (alreadyProcessed) {
        logger.info(`Duplicate event detected — skipping ${txHash}`)
        return
      }

      const iface = new ethers.Interface(ERC20_ABI)
      const parsed = iface.parseLog(log)
      const from = parsed.args[0]
      const to = parsed.args[1]
      const value = parsed.args[2].toString()
      const contractAddress = log.address

      const tokenLogo = await getTokenLogo(contractAddress, network)

      const savedEvent = await createEvent({
        subscriptionId,
        network,
        contractAddress,
        from,
        to,
        value,
        txHash,
        blockNumber: log.blockNumber,
        tokenLogo,
      })

      logger.success(`Event saved to MongoDB — ${txHash}`)

      await webhookQueue.add('deliver', {
        webhookUrl,
        subscriptionId,
        eventId: savedEvent._id,
        eventData: {
          event: 'Transfer',
          network,
          contractAddress,
          from,
          to,
          value,
          txHash,
          blockNumber: log.blockNumber,
          tokenLogo,
          timestamp: new Date().toISOString(),
        }
      })

      logger.success(`Webhook job added to queue for ${webhookUrl}`)

    } catch (error) {
      logger.error(`Error processing transfer event`, error.message)
    }
  })
}

module.exports = { startTransferListener, attachListener }