// Arc Network — pair / pool type definitions
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import { Token } from './token'

export interface Pair {
  address: string
  token0: Token
  token1: Token
  reserve0: bigint
  reserve1: bigint
  totalSupply: bigint
  /** LP token address (same as pair address) */
  lpToken: string
}

export interface LiquidityPosition {
  pair: Pair
  lpBalance: bigint
  lpBalanceFormatted: string
  /** User's share of the pool 0–100 */
  poolShare: number
  token0Amount: bigint
  token1Amount: bigint
}
