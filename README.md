# ChainWatch 🔗

A production-grade Web3 backend service that watches blockchain addresses 
and instantly notifies your app via webhooks whenever ERC20 token transfers 
are detected — similar to Alchemy Notify but self-hosted.

## What It Does

- Monitors wallet addresses across multiple EVM testnets simultaneously
- Detects ERC20 Transfer events in real time using WebSocket connections
- Delivers webhook notifications to any URL you register
- Automatically retries failed deliveries with exponential backoff
- Prevents duplicate notifications using idempotency checks
- Caches token logos in Redis for fast responses

## Supported Networks

| Network | Testnet |
|---|---|
| Ethereum | Sepolia |
| Polygon | Amoy |
| Base | Base Sepolia |
| BNB Smart Chain | BSC Testnet |

## Tech Stack

- **Node.js + Express** — API layer
- **ethers.js** — Blockchain listener
- **MongoDB + Mongoose** — Persistent storage
- **BullMQ + Redis** — Job queue and webhook delivery
- **Alchemy** — WebSocket RPC provider

## System Design
