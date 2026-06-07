// Arc Network — chain type definitions
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

export interface ChainConfig {
  id: number
  name: string
  shortName: string
  rpcUrl: string
  explorerUrl: string
  /** Native currency — on Arc this is USDC */
  nativeCurrency: {
    name: string
    symbol: string
    /** Decimals used by wallets / msg.value (18 on Arc) */
    decimals: number
  }
  logoUrl: string
  /** True for testnet chains */
  testnet: boolean
}
