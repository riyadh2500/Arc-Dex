// Arc Network — app settings store (Zustand)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // Swap settings
  slippageTolerance: number   // percent, e.g. 0.5 = 0.5 %
  deadline: number            // minutes
  // Display
  theme: 'dark' | 'light' | 'system'
  // Arc: USDC-denominated USD price display
  // On Arc the native token IS USDC so 1 native = $1 always.
  // For user-created tokens we store a manual override until an oracle is integrated.
  nativeUsdPrice: number

  // Actions
  setSlippageTolerance: (v: number) => void
  setDeadline: (v: number) => void
  setTheme: (v: 'dark' | 'light' | 'system') => void
  setNativeUsdPrice: (v: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      slippageTolerance: 0.5,
      deadline:          20,
      theme:             'dark',
      // Arc: native token = USDC → always $1
      nativeUsdPrice:    1,

      setSlippageTolerance: (v) => set({ slippageTolerance: v }),
      setDeadline:          (v) => set({ deadline: v }),
      setTheme:             (v) => set({ theme: v }),
      setNativeUsdPrice:    (v) => set({ nativeUsdPrice: v }),
    }),
    { name: 'dex-settings' }
  )
)

export default useSettingsStore
