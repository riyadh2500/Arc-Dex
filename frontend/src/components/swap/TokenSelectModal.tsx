'use client'

// Arc Network — Token Select Modal
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useState, useMemo } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { Token } from '@/types/token'
import { useTokenListStore } from '@/stores/useTokenListStore'
import { ARC_CHAIN_ID } from '@/config/tokens'

interface Props {
  onSelect: (token: Token) => void
  onClose:  () => void
  exclude?: string // address to exclude (the other selected token)
}

export default function TokenSelectModal({ onSelect, onClose, exclude }: Props) {
  const [search, setSearch] = useState('')
  const getAllTokens = useTokenListStore(s => s.getAllTokens)
  const { address } = useAccount()

  const tokens = useMemo(() => {
    const all = getAllTokens()
    return all.filter(t => {
      if (exclude && t.address.toLowerCase() === exclude.toLowerCase()) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
      )
    })
  }, [search, exclude, getAllTokens])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1117] shadow-2xl flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="text-base font-semibold text-white">Select Token</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Search name, symbol or address"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5
                         text-sm text-white placeholder-zinc-500 outline-none
                         focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="border-t border-white/10" />

        {/* Token list */}
        <div className="overflow-y-auto flex-1">
          {tokens.length === 0 ? (
            <p className="text-center text-zinc-500 text-sm py-8">No tokens found</p>
          ) : (
            tokens.map(token => (
              <TokenRow
                key={token.address}
                token={token}
                walletAddress={address}
                onSelect={() => { onSelect(token); onClose() }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function TokenRow({
  token,
  walletAddress,
  onSelect,
}: {
  token: Token
  walletAddress?: string
  onSelect: () => void
}) {
  const { data: bal } = useBalance({
    address: walletAddress as `0x${string}` | undefined,
    token:   token.isNative ? undefined : (token.address as `0x${string}`),
    chainId: ARC_CHAIN_ID,
    query:   { enabled: !!walletAddress },
  })

  const balDisplay = bal
    ? parseFloat(formatUnits(bal.value, token.decimals)).toFixed(4)
    : null

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors text-left"
    >
      {/* Logo */}
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
        {token.logoURI ? (
          <img src={token.logoURI} alt={token.symbol} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-white">{token.symbol.slice(0, 2)}</span>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{token.symbol}</p>
        <p className="text-xs text-zinc-400 truncate">{token.name}</p>
      </div>

      {/* Balance */}
      {balDisplay && (
        <span className="text-sm text-zinc-300 font-mono shrink-0">{balDisplay}</span>
      )}
    </button>
  )
}
