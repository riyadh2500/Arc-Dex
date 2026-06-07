'use client'

// ARC DEX — Privy v3 + Wagmi provider
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useEffect } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider as WagmiProviderBase, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { arcTestnet } from '@/config/networks'

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ?? 'https://rpc.testnet.arc.network'
    ),
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries:   { staleTime: 10_000, refetchInterval: 12_000, retry: false },
    mutations: { retry: false },
  },
})

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? 'clpispdty00enmiy0xs3t42g8'

const SUPPRESSED = ['farcaster', 'stripe', 'solana', 'mini-app', 'Failed to fetch', 'NetworkError', 'Load failed', 'privy']

function useSuppressBackgroundErrors() {
  useEffect(() => {
    const orig = console.error
    console.error = (...args: unknown[]) => {
      const msg = args.join(' ').toLowerCase()
      if (SUPPRESSED.some(p => msg.includes(p.toLowerCase()))) return
      orig(...args)
    }
    function onReject(e: PromiseRejectionEvent) {
      const msg = (e.reason?.message ?? String(e.reason ?? '')).toLowerCase()
      if (SUPPRESSED.some(p => msg.includes(p.toLowerCase()))) e.preventDefault()
    }
    window.addEventListener('unhandledrejection', onReject)
    return () => { console.error = orig; window.removeEventListener('unhandledrejection', onReject) }
  }, [])
}

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
          walletList: ['metamask', 'coinbase_wallet', 'wallet_connect', 'rainbow', 'phantom', 'detected_wallets'],
        },
        loginMethods:    ['wallet', 'google', 'email'],
        defaultChain:    arcTestnet,
        supportedChains: [arcTestnet],
        // Privy v3: embeddedWallets.ethereum (not top-level createOnLogin)
        embeddedWallets: {
          ethereum: { createOnLogin: 'users-without-wallets' },
        },
      }}
    >
      <InnerProviders>{children}</InnerProviders>
    </PrivyProvider>
  )
}
