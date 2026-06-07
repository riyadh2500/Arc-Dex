// Arc Network — token type definitions
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

export interface Token {
  address: string          // '0x...' or 'NATIVE' for native USDC on Arc
  name: string
  symbol: string
  /** ERC-20 decimals (6 for USDC ERC-20, 18 for native / WUSDC) */
  decimals: number
  logoURI?: string
  chainId: number
  /** True if this is the native gas token (USDC on Arc) */
  isNative?: boolean
  /** True if this is the wrapped native token (WUSDC on Arc) */
  isWrappedNative?: boolean
}

export interface TokenBalance extends Token {
  balance: bigint
  balanceFormatted: string
  balanceUSD?: number
}
