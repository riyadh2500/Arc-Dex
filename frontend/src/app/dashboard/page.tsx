'use client'

// ARC DEX — Dashboard
// Inspired by Arc Testnet Dashboard (arc-testnet-dashboard.html)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React from 'react'
import Link from 'next/link'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { formatUnits } from 'viem'
import { ARC_CHAIN_ID } from '@/config/tokens'
import ConnectWallet from '@/components/shared/ConnectWallet'

// ── Network stats (live-feel with Arc testnet data) ───────────────────────────
const NETWORK_STATS = [
  { label: 'Avg weekly cost',      value: '$0.0001',  sub: '↓ 99% cheaper',   color: 'text-emerald-400' },
  { label: 'Weekly transactions',  value: '127K',     sub: '↑ 15% this week', color: 'text-blue-400'    },
  { label: 'Contracts deployed',   value: '2,847',    sub: '↑ 342 new',       color: 'text-purple-400'  },
  { label: 'Active accounts',      value: '8,932',    sub: '↑ 23% growth',    color: 'text-cyan-400'    },
]

// ── Why build on Arc ──────────────────────────────────────────────────────────
const WHY_BUILD = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'USDC native gas',
    desc:  'Predictable dollar-denominated fees, no volatile tokens.',
    color: 'text-emerald-400',
    bg:    'bg-emerald-500/10',
    border:'border-emerald-500/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
      </svg>
    ),
    title: 'Sub-second finality',
    desc:  'Deterministic settlement eliminates counterparty risk.',
    color: 'text-blue-400',
    bg:    'bg-blue-500/10',
    border:'border-blue-500/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    ),
    title: 'Privacy built-in',
    desc:  'Opt-in configurable privacy for compliance.',
    color: 'text-purple-400',
    bg:    'bg-purple-500/10',
    border:'border-purple-500/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
      </svg>
    ),
    title: 'Circle integration',
    desc:  'USDC, CCTP, Gateway — all native to the protocol.',
    color: 'text-cyan-400',
    bg:    'bg-cyan-500/10',
    border:'border-cyan-500/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
      </svg>
    ),
    title: 'Multichain hub',
    desc:  'Route liquidity across Ethereum, Solana, and more.',
    color: 'text-pink-400',
    bg:    'bg-pink-500/10',
    border:'border-pink-500/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
      </svg>
    ),
    title: 'AI-native',
    desc:  'Enable agentic economic activity at scale.',
    color: 'text-amber-400',
    bg:    'bg-amber-500/10',
    border:'border-amber-500/20',
  },
]

// ── What Arc enables ──────────────────────────────────────────────────────────
const ARC_ENABLES = [
  { icon: '💸', title: 'Peer-to-peer payments',  desc: 'Instant, low-cost stablecoin transfers'      },
  { icon: '🔄', title: 'Stablecoin FX',          desc: 'Real-time onchain currency exchange'          },
  { icon: '🏦', title: 'Treasury management',    desc: 'Programmable liquidity & automation'          },
  { icon: '📈', title: 'Capital markets',         desc: 'Real-time settlement & collateral'            },
  { icon: '🤝', title: 'Lending & borrowing',    desc: 'Instant settlement with smart collateral'     },
  { icon: '🌍', title: 'Cross-border payments',  desc: 'Global payouts with predictable fees'         },
]

// ── Quick links ───────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { icon: '📄', label: 'Documentation', desc: 'Guides, APIs, and tutorials',  href: 'https://docs.arc.io',              color: 'hover:border-blue-500/40'   },
  { icon: '🚰', label: 'Faucet',        desc: 'Get testnet USDC & EURC',       href: 'https://faucet.circle.com',        color: 'hover:border-emerald-500/40' },
  { icon: '🔍', label: 'Explorer',      desc: 'Inspect transactions',          href: 'https://testnet.arcscan.app',      color: 'hover:border-cyan-500/40'   },
  { icon: '🧰', label: 'App Kits',      desc: 'Ship faster with SDKs',         href: 'https://www.arc.io/app-kits',      color: 'hover:border-purple-500/40' },
]

// ── Resources ─────────────────────────────────────────────────────────────────
const RESOURCES = [
  { icon: '📘', label: 'ARC whitepaper',           desc: 'A coordination asset for Arc',      href: 'https://www.arc.io/arc-token-whitepaper' },
  { icon: '🔐', label: 'Post-Quantum whitepaper',  desc: 'Long-term blockchain security',     href: 'https://www.arc.io/litepaper'             },
  { icon: '📋', label: 'Arc litepaper',            desc: "Discover Arc's infrastructure",     href: 'https://www.arc.io/litepaper'             },
  { icon: '✍️', label: 'Blog',                     desc: 'Read insights and updates',         href: 'https://www.arc.io/blog'                  },
]

// ── Community ─────────────────────────────────────────────────────────────────
const COMMUNITY = [
  { icon: '💬', label: 'Discord',         desc: 'Join 5K+ builders',   href: 'https://discord.com/invite/buildonarc', color: 'hover:border-indigo-500/40' },
  { icon: '🐦', label: 'Follow @arc',    desc: 'Latest updates',       href: 'https://x.com/arc',                    color: 'hover:border-sky-500/40'    },
  { icon: '👤', label: 'Builder AJMUL',  desc: 'Follow on X',          href: 'https://x.com/riyadhisla58886',        color: 'hover:border-blue-500/40'   },
]

// ── Wallet balance widget ─────────────────────────────────────────────────────
function WalletWidget() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: bal } = useBalance({
    address, chainId: ARC_CHAIN_ID,
    query: { enabled: isConnected && chainId === ARC_CHAIN_ID, refetchInterval: 8000 },
  })
  const usdc = bal ? parseFloat(formatUnits(bal.value, 18)) : 0

  if (!isConnected) return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-5 flex flex-col gap-3">
      <p className="text-sm text-zinc-400">Connect wallet to see your balance</p>
      <ConnectWallet />
    </div>
  )

  return (
    <div className="rounded-2xl border border-blue-500/20 p-5"
         style={{ background: 'linear-gradient(135deg, #0c1a3d 0%, #0f1117 100%)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
        <span className="text-xs text-zinc-400">Arc Testnet · Connected</span>
      </div>
      <p className="text-3xl font-extrabold text-white">
        {usdc.toLocaleString('en-US', { minimumFractionDigits: 4 })}
        <span className="text-blue-400 text-lg ml-2">USDC</span>
      </p>
      <p className="text-zinc-500 text-sm mt-1">
        ≈ ${usdc.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
      </p>
      <p className="text-zinc-600 text-xs mt-2 font-mono truncate">{address}</p>
      <div className="flex gap-2 mt-4">
        <Link href="/swap"
              className="flex-1 text-center text-xs font-semibold py-2 rounded-xl
                         bg-blue-600 hover:bg-blue-500 text-white transition-colors">
          Swap
        </Link>
        <Link href="/send"
              className="flex-1 text-center text-xs font-semibold py-2 rounded-xl
                         bg-white/10 hover:bg-white/15 text-white transition-colors">
          Send
        </Link>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-10">

      {/* BG glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px]
                        rounded-full bg-blue-600/10 blur-[150px]"/>
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px]
                        rounded-full bg-purple-600/8 blur-[120px]"/>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Hero ── */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30
                            bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>
              Arc is in public testnet
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Build on{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400
                               bg-clip-text text-transparent">Arc</span>
            </h1>
            <p className="text-zinc-400 text-base max-w-xl leading-relaxed">
              The stablecoin-native L1 blockchain for real-world finance onchain.
              Fast, predictable, and built for enterprise.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://docs.arc.io" target="_blank" rel="noopener noreferrer"
                 className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500
                            text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-900/40">
                Start building →
              </a>
              <a href="https://www.arc.io" target="_blank" rel="noopener noreferrer"
                 className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15
                            text-white font-semibold text-sm transition-colors">
                Learn more
              </a>
            </div>
          </div>

          {/* Wallet widget */}
          <div className="w-full md:w-80 shrink-0">
            <WalletWidget />
          </div>
        </div>

        {/* ── Network stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {NETWORK_STATS.map(s => (
            <div key={s.label}
                 className="rounded-2xl border border-white/10 bg-[#0f1117] p-5
                            hover:border-white/20 transition-colors">
              <p className="text-xs text-zinc-500 mb-2">{s.label}</p>
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── What is Arc ── */}
        <div className="rounded-3xl border border-white/10 bg-[#0f1117] p-8">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
            What is Arc?
          </h2>
          <p className="text-zinc-300 text-base leading-relaxed max-w-3xl">
            Arc is an open Layer-1 blockchain purpose-built to unite programmable money and
            onchain innovation with real-world economic activity. Engineered for mass adoption,
            Arc features{' '}
            <span className="text-emerald-400 font-medium">predictable dollar-based fees</span>{' '}
            using stablecoins as gas, opt-in configurable privacy that supports compliance
            obligations, and direct integration with{' '}
            <span className="text-blue-400 font-medium">Circle's full-stack platform</span>.
          </p>
        </div>

        {/* ── Why build on Arc ── */}
        <div>
          <h2 className="text-xl font-bold text-white mb-5">Why build on Arc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_BUILD.map(item => (
              <div key={item.title}
                   className={`rounded-2xl border ${item.border} ${item.bg} p-5
                               hover:scale-[1.01] transition-transform`}>
                <div className={`w-9 h-9 rounded-xl ${item.bg} border ${item.border}
                                 flex items-center justify-center mb-3 ${item.color}`}>
                  {item.icon}
                </div>
                <p className={`font-semibold text-sm ${item.color} mb-1`}>{item.title}</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── What Arc enables ── */}
        <div>
          <h2 className="text-xl font-bold text-white mb-5">What Arc enables</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ARC_ENABLES.map(item => (
              <div key={item.title}
                   className="rounded-2xl border border-white/10 bg-[#0f1117]
                              hover:border-white/20 hover:bg-white/5 p-4 text-center transition-all">
                <span className="text-3xl block mb-2">{item.icon}</span>
                <p className="text-white font-semibold text-xs mb-1">{item.title}</p>
                <p className="text-zinc-500 text-xs leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick links ── */}
        <div>
          <h2 className="text-xl font-bold text-white mb-5">Quick links</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_LINKS.map(link => (
              <a key={link.label}
                 href={link.href}
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`group rounded-2xl border border-white/10 bg-[#0f1117] p-5
                             ${link.color} transition-all hover:bg-white/5`}>
                <span className="text-2xl block mb-3">{link.icon}</span>
                <p className="text-white font-semibold text-sm mb-1">{link.label}</p>
                <p className="text-zinc-500 text-xs">{link.desc}</p>
                <p className="text-blue-400 text-xs mt-3 group-hover:underline">
                  Open →
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* ── Resources + Community (side by side) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Resources */}
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Learn &amp; resources</h2>
            <div className="flex flex-col gap-3">
              {RESOURCES.map(r => (
                <a key={r.label}
                   href={r.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-4 rounded-2xl border border-white/10
                              bg-[#0f1117] hover:border-white/20 hover:bg-white/5 px-5 py-4
                              transition-all group">
                  <span className="text-xl shrink-0">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{r.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{r.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Join the community</h2>
            <div className="flex flex-col gap-3">
              {COMMUNITY.map(c => (
                <a key={c.label}
                   href={c.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   className={`flex items-center gap-4 rounded-2xl border border-white/10
                               bg-[#0f1117] ${c.color} hover:bg-white/5 px-5 py-4
                               transition-all group`}>
                  <span className="text-xl shrink-0">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{c.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{c.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                  </svg>
                </a>
              ))}
            </div>

            {/* ARC DEX quick-swap */}
            <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <p className="text-blue-300 font-semibold text-sm mb-1">ARC DEX on Arc Testnet</p>
              <p className="text-zinc-400 text-xs mb-3">
                Swap, send, and manage USDC on Arc — the stablecoin-native L1.
              </p>
              <div className="flex gap-2">
                <Link href="/swap"
                      className="flex-1 text-center text-xs font-semibold py-2.5 rounded-xl
                                 bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                  Swap now
                </Link>
                <Link href="/ecosystem"
                      className="flex-1 text-center text-xs font-semibold py-2.5 rounded-xl
                                 bg-white/10 hover:bg-white/15 text-white transition-colors">
                  Ecosystem
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="rounded-2xl border border-white/10 bg-[#0f1117] px-6 py-4
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-400 text-sm">
            Arc is in public testnet.{' '}
            <a href="https://www.arc.io" target="_blank" rel="noopener noreferrer"
               className="text-blue-400 hover:underline">
              Learn more about Arc →
            </a>
          </p>
          <p className="text-zinc-600 text-xs">
            Built with ❤️ for Web3 builders · @riyadhisla58886
          </p>
        </div>

      </div>
    </div>
  )
}
