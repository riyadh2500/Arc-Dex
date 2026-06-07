'use client'

// ARC DEX — Explore (ArcScan Explorer)
// Source: https://testnet.arcscan.app
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useState } from 'react'

const ARCSCAN = 'https://testnet.arcscan.app'

const QUICK_LINKS = [
  { label: 'Latest Blocks',       href: `${ARCSCAN}/blocks`,          icon: '🧱', color: 'text-blue-400'   },
  { label: 'Latest Transactions', href: `${ARCSCAN}/txs`,             icon: '⚡', color: 'text-purple-400' },
  { label: 'Top Accounts',        href: `${ARCSCAN}/accounts`,        icon: '👤', color: 'text-green-400'  },
  { label: 'Verified Contracts',  href: `${ARCSCAN}/verified-contracts`, icon: '📄', color: 'text-cyan-400' },
  { label: 'Token Transfers',     href: `${ARCSCAN}/token-transfers`,  icon: '🔄', color: 'text-pink-400'  },
  { label: 'Gas Tracker',         href: `${ARCSCAN}/gas-tracker`,     icon: '⛽', color: 'text-amber-400'  },
]

const STATS = [
  { label: 'Block Time',    value: '~0.5s',      color: 'text-blue-400'   },
  { label: 'Gas Token',     value: 'USDC',        color: 'text-emerald-400'},
  { label: 'Chain ID',      value: '5042002',     color: 'text-purple-400' },
  { label: 'Finality',      value: 'Instant',     color: 'text-green-400'  },
]

export default function ExplorePage() {
  const [search, setSearch] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    window.open(`${ARCSCAN}/search?q=${encodeURIComponent(search.trim())}`, '_blank')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-12">
      {/* BG glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px]
                        rounded-full bg-cyan-600/8 blur-[130px]" />
      </div>

      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30
                          bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            ArcScan — Arc Testnet Explorer
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Explore{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Arc Testnet
            </span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Search blocks, transactions, addresses, and tokens on Arc Testnet.
            Powered by <a href={ARCSCAN} target="_blank" rel="noopener noreferrer"
            className="text-cyan-400 hover:underline">ArcScan</a>.
          </p>
        </div>

        {/* ── Search ── */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by address, tx hash, block number, token…"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50
                           rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-500
                           outline-none transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500
                         text-white font-semibold text-sm transition-colors
                         shadow-lg shadow-cyan-900/30 shrink-0"
            >
              Search
            </button>
          </div>
          <p className="text-xs text-zinc-600 mt-2 ml-1">
            Searches open in ArcScan — testnet.arcscan.app
          </p>
        </form>

        {/* ── Network stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STATS.map(s => (
            <div key={s.label}
                 className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Quick links grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {QUICK_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-white/10
                         bg-[#0f1117] hover:border-white/20 hover:bg-white/5
                         p-4 transition-all"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className={`text-sm font-medium text-zinc-300
                               group-hover:${link.color} transition-colors`}>
                {link.label}
              </span>
              <svg className="w-4 h-4 text-zinc-600 ml-auto shrink-0" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0
                     005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5
                     6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ))}
        </div>

        {/* ── Embedded ArcScan iframe ── */}
        <div className="rounded-3xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3
                          border-b border-white/10 bg-[#0f1117]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs text-zinc-500 ml-2 font-mono">testnet.arcscan.app</span>
            </div>
            <a
              href={ARCSCAN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              Open full explorer
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0
                     005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5
                     6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
          <iframe
            src={ARCSCAN}
            title="ArcScan — Arc Testnet Explorer"
            className="w-full"
            style={{ height: '70vh', border: 'none', background: '#fff' }}
            allow="clipboard-write"
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          ArcScan is powered by{' '}
          <a href="https://www.blockscout.com/" target="_blank" rel="noopener noreferrer"
             className="text-zinc-500 hover:underline">Blockscout</a>
          {' '}· Arc Testnet · Chain ID 5042002
        </p>
      </div>
    </div>
  )
}
