const NETWORKS = {
  sepolia: {
    name: 'Ethereum Sepolia',
    wsUrl: process.env.ALCHEMY_SEPOLIA_WS_URL,
    chainId: 11155111,
    isTestnet: true,
  },
  amoy: {
    name: 'Polygon Amoy',
    wsUrl: process.env.ALCHEMY_AMOY_WS_URL,
    chainId: 80002,
    isTestnet: true,
  },
  baseSepolia: {
    name: 'Base Sepolia',
    wsUrl: process.env.ALCHEMY_BASE_SEPOLIA_WS_URL,
    chainId: 84532,
    isTestnet: true,
  },
  bscTestnet: {
    name: 'BNB Smart Chain Testnet',
    wsUrl: process.env.BSC_TESTNET_WS_URL,
    chainId: 97,
    isTestnet: true,
  },
}

module.exports = NETWORKS