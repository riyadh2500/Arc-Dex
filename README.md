# Arc DEX

A stablecoin-native decentralised exchange built on **Arc Network** — an EVM-compatible Layer-1 blockchain where **USDC is the native gas token**.

## Live demo
> Deploy contracts to Arc Testnet then run the frontend locally.

## Features
- 🔄 **Swap** — token swaps via AMM (DEXRouter)
- 💸 **Send / Receive** — send USDC with QR code receive
- 💰 **Balance** — live USDC balance on Arc Testnet
- 🌐 **Ecosystem** — 110+ Arc Network partners
- 📊 **Dashboard** — Arc network stats and resources
- 🦊 **Wallets** — MetaMask, WalletConnect, Coinbase, Phantom, Rainbow + Google login via Privy

## Tech stack
| Layer | Tech |
|---|---|
| Smart contracts | Solidity 0.8.20, Hardhat, OpenZeppelin |
| Network | Arc Testnet (Chain ID 5042002, USDC gas) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Web3 | Wagmi v2, Viem v2, Privy v3 |
| State | Zustand v5, TanStack Query v5 |

## Quick start

### 1. Frontend
```bash
cd frontend
cp .env.example .env.local
# Fill in .env.local
npm install
npm run dev
```
Open http://localhost:3000

### 2. Contracts
```bash
cd contracts
cp .env.example .env
# Add ARC_PRIVATE_KEY to .env
npm install
npx hardhat compile
npm run deploy:arc
```

## Arc Testnet
| Field | Value |
|---|---|
| Chain ID | 5042002 |
| RPC | https://rpc.testnet.arc.network |
| Explorer | https://testnet.arcscan.app |
| Faucet | https://faucet.circle.com |
| Gas token | USDC |

## Builder
[@riyadhisla58886](https://x.com/riyadhisla58886)
