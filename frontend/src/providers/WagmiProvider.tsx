'use client'

// ARC DEX — Privy v3 + Wagmi provider
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// Privy v3 handles:
//   • Google / Gmail login (social)
//   • Email login
//   • MetaMask, Coinbase Wallet, WalletConnect, Rainbow,
//     Phantom, Trust Wallet, Zerion, Rabby, Brave, Ledger,
//     and any other injected wallet
//   • Embedded smart wallet for social-login users (no wallet needed)
//
// Chain: Arc Testnet (ID 5042002) — native gas = USDC

import React, { useEffect } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider as WagmiProviderBase, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { arcTestnet } from '@/config/networks'

// ── Wagmi config ─────────────────────────────────────────────────────────────

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ?? 'https://rpc.testnet.arc.network'
    ),
  },
})

// ── React Query client ────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:       10_000,
      refetchInterval: 12_000,
      // Don't surface background query errors to the UI
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? 'clpispdty00enmiy0xs3t42g8'

// ── Suppress known noisy background errors from Privy / wagmi init ────────────
const SUPPRESSED_PATTERNS = [
  'farcaster',
  'stripe',
  'solana',
  'mini-app',
  'Failed to fetch',
  'NetworkError',
  'Load failed',
  'privy',
]

function useSuppressBackgroundErrors() {
  useEffect(() => {
    const originalError = console.error
    console.error = (...args: unknown[]) => {
      const msg = args.join(' ').toLowerCase()
      if (SUPPRESSED_PATTERNS.some(p => msg.includes(p.toLowerCase()))) return
      originalError(...args)
    }

    // Suppress unhandled promise rejections from background lib init
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      const msg = (event.reason?.message ?? String(event.reason ?? '')).toLowerCase()
      if (SUPPRESSED_PATTERNS.some(p => msg.includes(p.toLowerCase()))) {
        event.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      console.error = originalError
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])
}

// ── Provider ─────────────────────────────────────────────────────────────────

function InnerProviders({ children }: { children: React.ReactNode }) {
  useSuppressBackgroundErrors()
  return (
    <WagmiProviderBase config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProviderBase>
  )
}

export default function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme:           'dark',
          accentColor:     '#3b82f6',
          logo:            '/logo.svg',
          walletChainType: 'ethereum-only',
          walletList: [
            'metamask',
            'coinbase_wallet',
            'wallet_connect',
            'rainbow',
            'phantom',
            'detected_wallets',
          ],
        },
        loginMethods: ['wallet', 'google', 'email'],
        defaultChain:    arcTestnet,
        supportedChains: [arcTestnet],
        embeddedWallets: {
          ethereum: { createOnLogin: 'users-without-wallets' },
        },
      }}
    >
      <InnerProviders>
        {children}
      </InnerProviders>
    </PrivyProvider>
  )
}
