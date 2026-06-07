// Fix: import from 'hardhat/config', not 'hardhat/types'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
import * as dotenv from 'dotenv'

dotenv.config()

// ─────────────────────────────────────────────────────────────────────────────
// ARC NETWORK — Key facts (https://docs.arc.io)
// ─────────────────────────────────────────────────────────────────────────────
// Arc is a purpose-built Layer-1 blockchain for stablecoin-native DeFi.
//
// Key differences from Ethereum mainnet:
//  • Gas token    : USDC (not ETH) — all fees are denominated in USDC
//  • Chain ID     : 5042002 (testnet)
//  • Finality     : Deterministic & instant (<1 s) — single confirmation is safe
//  • Consensus    : Malachite BFT (Tendermint-based), permissioned validators
//  • EVM target   : Osaka hard fork, full EVM compatibility
//  • Block time   : ~0.48 s on testnet
//  • PREVRANDAO   : Always 0 — use a VRF oracle for randomness instead
//  • SELFDESTRUCT : Not allowed during deployment (prevents burning USDC)
//  • Timestamps   : Wall-clock time; sub-second blocks may share the same value
//
// Faucet  : https://faucet.circle.com
// Explorer: https://testnet.arcscan.app
// ─────────────────────────────────────────────────────────────────────────────

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: false,
    },
    localhost: {
      url: process.env.RPC_URL || 'http://127.0.0.1:8545',
      chainId: 31337,
    },

    // ── Arc Testnet ──────────────────────────────────────────────────────────
    // EVM-compatible Layer-1 with USDC as gas (Chain ID 5042002).
    // Docs    : https://docs.arc.io/arc/references/rpc-endpoints
    // Explorer: https://testnet.arcscan.app
    // Faucet  : https://faucet.circle.com
    //
    // Required .env variables:
    //   ARC_PRIVATE_KEY          — deployer private key
    //   ARC_RPC_URL              — optional RPC override
    //   ARC_TOKEN_CREATION_FEE   — optional fee override (default "0.5" USDC)
    //   ARC_FEE_RECEIVER         — optional fee receiver address
    arcTestnet: {
      url: process.env.ARC_RPC_URL || 'https://rpc.testnet.arc.network',
      chainId: 5042002,
      accounts: process.env.ARC_PRIVATE_KEY ? [process.env.ARC_PRIVATE_KEY] : [],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
    deploy: './deploy',
    deployments: './deployments',
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
  },
}

export default config
