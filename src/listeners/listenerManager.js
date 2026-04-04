const NETWORKS = require('../config/networks')
const { startTransferListener } = require('./transferListener')
const logger = require('../utils/logger')

const startAllListeners = async () => {
  logger.info('Starting blockchain listeners...')

  for (const [networkName, networkConfig] of Object.entries(NETWORKS)) {
    if (!networkConfig.wsUrl) {
      logger.error(`No WebSocket URL found for ${networkName} — skipping`)
      continue
    }

    await startTransferListener(networkName, networkConfig.wsUrl)
  }

  logger.success('All blockchain listeners started')
}

module.exports = { startAllListeners }