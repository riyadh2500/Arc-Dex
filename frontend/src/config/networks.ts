// Arc Network — chain / network configuration
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// Arc is an EVM-compatible Layer-1 blockchain.
// Native gas token : USDC (not ETH)
// Chain ID         : 5042002 (testnet)
// Docs             : https://docs.arc.io

import { defineChain } from 'viem'
import { ChainConfig } from '@/types/chain'

// ── viem chain definition ────────────────────────────────────────────────────

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 18, // native USDC uses 18 decimals at the msg.value level
  },
  rpcUrls: {
    default: {
      http:      ['https://rpc.testnet.arc.network'],
      webSocket: ['wss://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url:  'https://testnet.arcscan.app',
    },
  },
  testnet: true,
})

// ── App-level chain config ───────────────────────────────────────────────────

export const ARC_TESTNET_CONFIG: ChainConfig = {
  id:        5042002,
  name:      'Arc Testnet',
  shortName: 'ARC',
  rpcUrl:    'https://rpc.testnet.arc.network',
  explorerUrl: 'https://testnet.arcscan.app',
  nativeCurrency: {
    name:     'USD Coin',
    symbol:   'USDC',
    decimals: 18,
  },
  logoUrl: '/tokens/usdc.svg',
  testnet: true,
}

export const LOCALHOST_CONFIG: ChainConfig = {
  id:        31337,
  name:      'Localhost',
  shortName: 'LOCAL',
  rpcUrl:    'http://127.0.0.1:8545',
  explorerUrl: 'http://localhost:8545',
  nativeCurrency: {
    name:     'USD Coin',   // MockWUSDC on local
    symbol:   'USDC',
    decimals: 18,
  },
  logoUrl: '/tokens/usdc.svg',
  testnet: true,
}

// ── Active chain (driven by env) ─────────────────────────────────────────────

export const SUPPORTED_CHAINS = [arcTestnet] as const

/** The chain the app targets in production. */
export const DEFAULT_CHAIN = arcTestnet
