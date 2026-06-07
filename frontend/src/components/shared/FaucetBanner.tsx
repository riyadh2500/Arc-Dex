'use client'

// Arc Network — Faucet Banner
// Shows a dismissible banner when the user is on Arc Testnet and their
// native USDC balance is below LOW_BALANCE_THRESHOLD.
// Faucet: https://faucet.circle.com
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useState } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { formatUnits } from 'viem'
import { ARC_CHAIN_ID } from '@/config/tokens'

const FAUCET_URL = process.env.NEXT_PUBLIC_FAUCET_URL ?? 'https://faucet.circle.com'

/**
 * Show banner when native USDC balance is below this threshold.
 * Arc native decimals = 18, so 1e18 = 1 USDC.
 */
const LOW_BALANCE_THRESHOLD = BigInt('2000000000000000000') // 2 USDC

export default function FaucetBanner() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [dismissed, setDismissed] = useState(false)

  const { data: balance } = useBalance({
    address,
    query: { enabled: isConnected && chainId === ARC_CHAIN_ID },
  })

  // Only show on Arc Testnet with a low / zero balance
  const isArcTestnet = chainId === ARC_CHAIN_ID
  const isLowBalance = !balance || balance.value < LOW_BALANCE_THRESHOLD
  const shouldShow   = isConnected && isArcTestnet && isLowBalance && !dismissed

  if (!shouldShow) return null

  const balanceFormatted = balance
    ? parseFloat(formatUnits(balance.value, 18)).toFixed(4)
    : '0.0000'

  return (
    <div
      role="alert"
      className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-3
                 flex items-center justify-between gap-4 text-sm"
    >
      {/* Left: icon + message */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Fuel / drop icon */}
        <svg
          className="w-5 h-5 shrink-0 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1M4.22 4.22l.7.7m13.86 13.86.7.7M3 12H2m20 0h-1M4.22 19.78l.7-.7M19.08 4.92l.7-.7
               M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <span className="truncate">
          <span className="font-semibold text-amber-300">Low testnet USDC</span>
          {' '}— your balance is{' '}
          <span className="font-mono">{balanceFormatted} USDC</span>.
          Get free testnet USDC from the Arc faucet.
        </span>
      </div>

      {/* Right: action + dismiss */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={FAUCET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                     text-black font-semibold px-3 py-1 transition-colors text-xs"
        >
          Get USDC →
        </a>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss faucet banner"
          className="p-1 rounded hover:bg-white/10 transition-colors text-amber-400"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
