// Arc Network — token list configuration
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// Arc's native gas token is USDC (not ETH).
// ERC-20 USDC uses 6 decimals; native USDC uses 18 (for msg.value).
// This list uses the ERC-20 representation (6 decimals) for display/swaps.

import { Token } from '@/types/token'

export const ARC_CHAIN_ID = 5042002

// ── Native USDC (Arc) — treat as the "ETH" of this chain ────────────────────
export const NATIVE_USDC: Token = {
  address:   'NATIVE',
  name:      'USD Coin',
  symbol:    'USDC',
  decimals:  18,  // native msg.value decimals
  logoURI:   '/tokens/usdc.svg',
  chainId:   ARC_CHAIN_ID,
  isNative:  true,
}

// ── WUSDC — wrapped native USDC (ERC-20, set address after deploy) ───────────
export const WUSDC: Token = {
  address:          process.env.NEXT_PUBLIC_WETH_ARC_TESTNET ?? '',
  name:             'Wrapped USDC (Arc)',
  symbol:           'WUSDC',
  decimals:         18,
  logoURI:          '/tokens/usdc.svg',
  chainId:          ARC_CHAIN_ID,
  isWrappedNative:  true,
}

// ── USDT (example ERC-20 on Arc testnet) ─────────────────────────────────────
export const USDT: Token = {
  address:  '',   // fill after deploying MockERC20 for USDT on testnet
  name:     'Tether USD',
  symbol:   'USDT',
  decimals: 6,
  logoURI:  '/tokens/usdt.svg',
  chainId:  ARC_CHAIN_ID,
}

// ── Default token list ────────────────────────────────────────────────────────
export const DEFAULT_TOKEN_LIST: Token[] = [
  NATIVE_USDC,
  WUSDC,
  USDT,
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getTokenByAddress(address: string): Token | undefined {
  return DEFAULT_TOKEN_LIST.find(
    t => t.address.toLowerCase() === address.toLowerCase()
  )
}

export function isNativeToken(token: Token): boolean {
  return token.address === 'NATIVE' || !!token.isNative
}
