// Arc Network — swap store (Zustand)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// On Arc the default "from" token is native USDC (the gas token).
// No ETH or WETH — USDC and WUSDC are the base pair assets.

import { create } from 'zustand'
import { Token } from '@/types/token'
import { NATIVE_USDC, WUSDC } from '@/config/tokens'

interface SwapState {
  tokenIn:   Token | null
  tokenOut:  Token | null
  amountIn:  string
  amountOut: string
  /** Price impact as a percentage */
  priceImpact: number | null
  /** Minimum received after slippage */
  minimumReceived: string
  isLoading: boolean
  error: string | null

  // Actions
  setTokenIn:         (token: Token | null) => void
  setTokenOut:        (token: Token | null) => void
  setAmountIn:        (amount: string) => void
  setAmountOut:       (amount: string) => void
  setPriceImpact:     (v: number | null) => void
  setMinimumReceived: (v: string) => void
  setIsLoading:       (v: boolean) => void
  setError:           (v: string | null) => void
  switchTokens:       () => void
  reset:              () => void
}

export const useSwapStore = create<SwapState>((set, get) => ({
  // Arc defaults: USDC → WUSDC
  tokenIn:          NATIVE_USDC,
  tokenOut:         WUSDC.address ? WUSDC : null,
  amountIn:         '',
  amountOut:        '',
  priceImpact:      null,
  minimumReceived:  '',
  isLoading:        false,
  error:            null,

  setTokenIn:         (token)  => set({ tokenIn: token, amountOut: '', error: null }),
  setTokenOut:        (token)  => set({ tokenOut: token, amountOut: '', error: null }),
  setAmountIn:        (amount) => set({ amountIn: amount }),
  setAmountOut:       (amount) => set({ amountOut: amount }),
  setPriceImpact:     (v)      => set({ priceImpact: v }),
  setMinimumReceived: (v)      => set({ minimumReceived: v }),
  setIsLoading:       (v)      => set({ isLoading: v }),
  setError:           (v)      => set({ error: v }),

  switchTokens: () => {
    const { tokenIn, tokenOut, amountIn, amountOut } = get()
    set({
      tokenIn:   tokenOut,
      tokenOut:  tokenIn,
      amountIn:  amountOut,
      amountOut: amountIn,
      error:     null,
    })
  },

  reset: () => set({
    tokenIn:          NATIVE_USDC,
    tokenOut:         WUSDC.address ? WUSDC : null,
    amountIn:         '',
    amountOut:        '',
    priceImpact:      null,
    minimumReceived:  '',
    isLoading:        false,
    error:            null,
  }),
}))

export default useSwapStore
