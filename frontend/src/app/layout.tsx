// ARC DEX — root layout
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import WagmiProvider from '@/providers/WagmiProvider'
import FaucetBanner from '@/components/shared/FaucetBanner'
import Navbar from '@/components/shared/Navbar'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:       'ARC DEX — Stablecoin-Native Exchange on Arc Network',
  description: 'ARC DEX is a decentralised exchange built on Arc Network — EVM-compatible L1 with USDC as native gas, instant finality, and 100+ ecosystem partners.',
  keywords:    ['ARC DEX', 'Arc Network', 'USDC', 'DEX', 'DeFi', 'swap', 'liquidity', 'stablecoin'],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
  },
  openGraph: {
    title:       'ARC DEX',
    description: 'Swap, provide liquidity, and launch tokens on Arc Network — USDC-native DeFi.',
    siteName:    'ARC DEX',
    type:        'website',
    images:      [{ url: '/logo.svg', width: 200, height: 200, alt: 'ARC DEX Logo' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WagmiProvider>
          <FaucetBanner />
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="bottom-right"
            theme="dark"
            visibleToasts={3}
            closeButton
            toastOptions={{
              style: {
                background: '#0f1117',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '13px',
              },
            }}
          />
        </WagmiProvider>
      </body>
    </html>
  )
}
