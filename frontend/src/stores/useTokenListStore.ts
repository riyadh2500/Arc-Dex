// Arc Network — token list store (Zustand)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Token } from '@/types/token'
import { DEFAULT_TOKEN_LIST, ARC_CHAIN_ID } from '@/config/tokens'

interface TokenListState {
  tokens: Token[]
  customTokens: Token[]

  // Actions
  addCustomToken: (token: Token) => void
  removeCustomToken: (address: string) => void
  getAllTokens: () => Token[]
}

export const useTokenListStore = create<TokenListState>()(
  persist(
    (set, get) => ({
      tokens:       DEFAULT_TOKEN_LIST,
      customTokens: [],

      addCustomToken: (token) => {
        const existing = get().customTokens.find(
          t => t.address.toLowerCase() === token.address.toLowerCase() &&
               t.chainId === token.chainId
        )
        if (!existing) {
          set(s => ({ customTokens: [...s.customTokens, token] }))
        }
      },

      removeCustomToken: (address) => {
        set(s => ({
          customTokens: s.customTokens.filter(
            t => t.address.toLowerCase() !== address.toLowerCase()
          ),
        }))
      },

      getAllTokens: () => {
        const { tokens, customTokens } = get()
        return [
          ...tokens.filter(t => t.chainId === ARC_CHAIN_ID),
          ...customTokens.filter(t => t.chainId === ARC_CHAIN_ID),
        ]
      },
    }),
    { name: 'dex-token-list' }
  )
)

export default useTokenListStore
