'use client'

// ARC DEX — Navigation Bar
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ConnectWallet from './ConnectWallet'

const NAV_LINKS = [
  { href: '/swap',         label: 'Swap',          color: 'hover:text-blue-400'   },
  { href: '/send',         label: 'Send / Receive', color: 'hover:text-green-400'  },
  { href: '/ecosystem',    label: 'Ecosystem',      color: 'hover:text-pink-400'   },
  { href: '/dashboard',    label: 'Dashboard',      color: 'hover:text-amber-400'  },
]

export default function Navbar() {
  const pathname  = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.08]"
            style={{ background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(16px)' }}>
      {/* Full-width inner — logo always pinned to the left edge */}
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6">

        {/* ── Logo — always far left ── */}
        <Link href="/swap" className="flex items-center gap-2 shrink-0">
          <span className="font-black text-xl tracking-tighter text-white select-none">
            ARC<span className="text-blue-400">DEX</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label, color }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all
                  ${active
                    ? 'text-white bg-white/10'
                    : `text-zinc-400 ${color} hover:bg-white/5`
                  }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5
                                   rounded-full bg-blue-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">
          {/* Arc Testnet badge */}
          <span className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1
                           text-xs font-semibold text-blue-300
                           border border-blue-500/30 bg-blue-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Arc Testnet
          </span>

          <ConnectWallet />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-zinc-400"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1"
             style={{ background: 'rgba(7,9,15,0.98)' }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors
                  ${active ? 'bg-blue-600/20 text-blue-300' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
