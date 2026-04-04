const axios = require('axios')
const { ethers } = require('ethers')
const redis = require('../config/redis')
const CHAIN_TO_TRUST_WALLET = require('../utils/chainMapper')
const logger = require('../utils/logger')

const getTokenLogo = async (contractAddress, network) => {
  try {
    // Step 1 — checksum the address
    const checksumAddress = ethers.getAddress(contractAddress)
    const chain = CHAIN_TO_TRUST_WALLET[network] || 'ethereum'
    const cacheKey = `logo:${network}:${checksumAddress}`

    // Step 2 — check Redis cache first
    const cached = await redis.get(cacheKey)
    if (cached) {
      logger.info(`Token logo served from cache for ${checksumAddress}`)
      return cached
    }

    // Step 3 — fetch from Trust Wallet
    const trustWalletUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${checksumAddress}/logo.png`

    await axios.head(trustWalletUrl)

    // Step 4 — save to Redis for 24 hours
    await redis.set(cacheKey, trustWalletUrl, 'EX', 86400)

    logger.info(`Token logo fetched from Trust Wallet for ${checksumAddress}`)
    return trustWalletUrl

  } catch {
    // Step 5 — fallback to CoinGecko
    return await getLogoFromCoinGecko(contractAddress, network)
  }
}

const getLogoFromCoinGecko = async (address, network) => {
  const COINGECKO_PLATFORM = {
    sepolia: 'ethereum',
    amoy: 'polygon-pos',
    baseSepolia: 'base',
    bscTestnet: 'binance-smart-chain',
  }

  try {
    const platform = COINGECKO_PLATFORM[network] || 'ethereum'
    const url = `https://api.coingecko.com/api/v3/coins/${platform}/contract/${address}`
    const { data } = await axios.get(url)

    logger.info(`Token logo fetched from CoinGecko for ${address}`)
    return data.image?.small || null

  } catch {
    logger.error(`No token logo found for ${address}`)
    return null
  }
}

module.exports = { getTokenLogo }
