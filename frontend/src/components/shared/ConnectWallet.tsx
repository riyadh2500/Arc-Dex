'use client'

// ARC DEX — Connect Wallet
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useState, useRef, useEffect } from 'react'
import {
  useAccount, useConnect, useDisconnect,
  useBalance, useSwitchChain, useChainId,
} from 'wagmi'
import { formatUnits } from 'viem'
import { ARC_CHAIN_ID } from '@/config/tokens'
import { arcTestnet } from '@/config/networks'

// ── Real wallet logos (correct brand colors) ─────────────────────────────────

function WalletLogo({ name }: { name: string }) {
  const n = name.toLowerCase()

  // MetaMask — official fox SVG
  if (n.includes('metamask')) return (
    <svg viewBox="0 0 318 318" className="w-7 h-7">
      <polygon fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" points="274.1,35.5 174.6,109.4 193,65.8"/>
      <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="44.4,35.5 143.1,110.1 125.6,65.8"/>
      <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7"/>
      <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8"/>
      <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1"/>
      <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="214.9,138.2 175.9,103.4 174.6,164.6 230.9,162.1"/>
      <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 140.6,230.9 111.4,208.1"/>
      <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="177.9,230.9 211.8,247.4 207.1,208.1"/>
      <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="211.8,247.4 177.9,230.9 180.6,253 180.3,262.3"/>
      <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 138.3,262.3 138.3,253 140.6,230.9"/>
      <polygon fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" points="138.8,193.5 110.6,185.2 130.5,176.1"/>
      <polygon fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" points="179.8,193.5 188,176.1 207.6,185.2"/>
      <polygon fill="#CC6228" stroke="#CC6228" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 111.6,206.8 80.3,207.7"/>
      <polygon fill="#CC6228" stroke="#CC6228" strokeLinecap="round" strokeLinejoin="round" points="206.9,206.8 211.8,247.4 238.3,207.7"/>
      <polygon fill="#CC6228" stroke="#CC6228" strokeLinecap="round" strokeLinejoin="round" points="230.9,162.1 174.6,164.6 179.8,193.5 188,176.1 207.6,185.2"/>
      <polygon fill="#CC6228" stroke="#CC6228" strokeLinecap="round" strokeLinejoin="round" points="110.6,185.2 130.5,176.1 138.8,193.5 144.1,164.6 87.8,162.1"/>
      <polygon fill="#E27525" stroke="#E27525" strokeLinecap="round" strokeLinejoin="round" points="87.8,162.1 138.8,193.5 111.4,208.1"/>
      <polygon fill="#E27525" stroke="#E27525" strokeLinecap="round" strokeLinejoin="round" points="207.6,185.2 188,176.1 179.8,193.5 207.1,208.1"/>
      <polygon fill="#E27525" stroke="#E27525" strokeLinecap="round" strokeLinejoin="round" points="144.1,164.6 138.8,193.5 146.3,232.1 148,182.8"/>
      <polygon fill="#E27525" stroke="#E27525" strokeLinecap="round" strokeLinejoin="round" points="174.6,164.6 170.5,182.5 172.3,232.1 179.8,193.5"/>
      <polygon fill="#F5841F" stroke="#F5841F" strokeLinecap="round" strokeLinejoin="round" points="179.8,193.5 172.3,232.1 177.9,230.9 207.1,208.1"/>
      <polygon fill="#F5841F" stroke="#F5841F" strokeLinecap="round" strokeLinejoin="round" points="111.4,208.1 140.6,230.9 146.3,232.1 138.8,193.5"/>
      <polygon fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" points="180.3,262.3 180.6,253 178.1,250.8 140.4,250.8 138.3,253 138.3,262.3 106.8,247.4 117.8,256.4 140.1,271.9 178.4,271.9 200.9,256.4 211.8,247.4"/>
      <polygon fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" points="177.9,230.9 172.3,232.1 146.3,232.1 140.6,230.9 138.3,253 140.4,250.8 178.1,250.8 180.6,253"/>
      <polygon fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round" points="278.3,114.2 286.8,73.4 274.1,35.5 177.9,106.9 214.9,138.2 267.2,153.5 278.9,140 273.8,136.4 281.8,129.1 275.6,124.3 283.6,118.2"/>
      <polygon fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round" points="31.8,73.4 40.3,114.2 34.9,118.2 42.9,124.3 36.9,129.1 44.9,136.4 39.8,140 51.3,153.5 103.6,138.2 140.6,106.9 44.4,35.5"/>
      <polygon fill="#F5841F" stroke="#F5841F" strokeLinecap="round" strokeLinejoin="round" points="267.2,153.5 214.9,138.2 230.9,162.1 207.1,208.1 238.3,207.7 284.8,207.7"/>
      <polygon fill="#F5841F" stroke="#F5841F" strokeLinecap="round" strokeLinejoin="round" points="103.6,138.2 51.3,153.5 33.9,207.7 80.3,207.7 111.4,208.1 87.8,162.1"/>
      <polygon fill="#F5841F" stroke="#F5841F" strokeLinecap="round" strokeLinejoin="round" points="174.6,164.6 177.9,106.9 193.3,65.8 125.6,65.8 140.6,106.9 144.1,164.6 146,183.1 146.3,232.1 172.3,232.1 172.6,183.1"/>
    </svg>
  )

  // Phantom — official purple ghost
  if (n.includes('phantom')) return (
    <svg viewBox="0 0 128 128" className="w-7 h-7">
      <rect width="128" height="128" rx="26" fill="#AB9FF2"/>
      <path d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8716 41.3057 14.4175 64.0583C13.9507 87.5908 32.583 107 56.0553 107H60.4694C81.0086 107 108.058 91.4605 113.078 73.0257C114.164 69.0549 111.498 64.9142 110.584 64.9142ZM42.7781 67C42.7781 69.7614 40.5395 72 37.7781 72C35.0167 72 32.7781 69.7614 32.7781 67V57C32.7781 54.2386 35.0167 52 37.7781 52C40.5395 52 42.7781 54.2386 42.7781 57V67ZM61.7781 67C61.7781 69.7614 59.5395 72 56.7781 72C54.0167 72 51.7781 69.7614 51.7781 67V57C51.7781 54.2386 54.0167 52 56.7781 52C59.5395 52 61.7781 54.2386 61.7781 57V67Z" fill="white"/>
    </svg>
  )

  // WalletConnect — official blue
  if (n.includes('walletconnect')) return (
    <svg viewBox="0 0 300 185" className="w-8 h-5">
      <path d="M61.44 36.56c48.77-47.75 127.88-47.75 176.65 0l5.87 5.75a6.04 6.04 0 010 8.67l-20.08 19.67a3.18 3.18 0 01-4.43 0l-8.08-7.91c-34.04-33.33-89.26-33.33-123.3 0l-8.65 8.47a3.18 3.18 0 01-4.43 0L55.01 51.05a6.04 6.04 0 010-8.67l6.43-5.82zm218.15 40.67l17.88 17.52a6.04 6.04 0 010 8.67l-80.67 79.01a6.36 6.36 0 01-8.87 0l-57.23-56.06a1.59 1.59 0 00-2.22 0L91.23 182.43a6.36 6.36 0 01-8.86 0L1.71 103.42a6.04 6.04 0 010-8.67l17.88-17.52a6.36 6.36 0 018.86 0l57.23 56.06c.61.6 1.6.6 2.21 0l57.22-56.06a6.36 6.36 0 018.87 0l57.23 56.06c.61.6 1.6.6 2.21 0l57.23-56.06a6.36 6.36 0 018.86 0z" fill="#3B99FC"/>
    </svg>
  )

  // Coinbase — official blue square
  if (n.includes('coinbase')) return (
    <svg viewBox="0 0 1024 1024" className="w-7 h-7">
      <rect width="1024" height="1024" rx="200" fill="#0052FF"/>
      <path d="M512 692c-99.4 0-180-80.6-180-180s80.6-180 180-180 180 80.6 180 180-80.6 180-180 180zm0-430C300.1 262 130 432.1 130 644s170.1 382 382 382 382-170.1 382-382S723.9 262 512 262z" fill="white"/>
    </svg>
  )

  // Rainbow
  if (n.includes('rainbow')) return (
    <svg viewBox="0 0 120 120" className="w-7 h-7">
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4D4D"/>
          <stop offset="50%" stopColor="#FF9900"/>
          <stop offset="100%" stopColor="#2196F3"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#rg)"/>
      <path d="M18 82Q18 38 60 38Q102 38 102 82" stroke="white" strokeWidth="11" fill="none" strokeLinecap="round"/>
      <path d="M30 82Q30 52 60 52Q90 52 90 82" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/>
    </svg>
  )

  // Brave / injected
  if (n.includes('brave')) return (
    <svg viewBox="0 0 56 64" className="w-6 h-7">
      <path d="M53.4 21.8l1.5-4.5-3-2.8 1-4.7-4.3-1.5-.8-4.8-4.8.3L40 0l-4.3 2-3.5-3.3L28 1.2 23.8-1.3 20.3 2 16 0l-2.9 4-4.8-.3-.8 4.8-4.3 1.5 1 4.7-3 2.8 1.5 4.5L0 25.5l2.7 4-1.7 4.4 3.5 3.1-.3 4.8 4.5 1.8 1.3 4.6 4.8-.3 2.5 4 4.4-1.3 3.3 3.4 3.3-3.4 4.4 1.3 2.5-4 4.8.3 1.3-4.6 4.5-1.8-.3-4.8 3.5-3.1-1.7-4.4 2.7-4-3.4-3.7z" fill="#FB542B"/>
      <path d="M28 14l-7 3.5-2 8 3 5.5H34l3-5.5-2-8z" fill="white"/>
    </svg>
  )

  // Generic fallback
  return (
    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600
                    flex items-center justify-center text-white text-xs font-bold">
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

// ── Wallet Picker Modal — TRULY CENTERED ─────────────────────────────────────

function WalletPickerModal({ onClose }: { onClose: () => void }) {
  const { connectors, connect, isPending, variables } = useConnect()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    // Portal-style full-screen fixed overlay
    // Using transform: translate(-50%, -50%) from top:50% left:50% for TRUE centering
    // regardless of scroll position or page height
    <div
      style={{
        position:   'fixed',
        inset:      0,
        zIndex:     9999,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      {/* The modal itself — positioned at exact center of viewport */}
      <div
        style={{
          position:  'fixed',
          top:       '50%',
          left:      '50%',
          transform: 'translate(-50%, -50%)',
          width:     'min(400px, calc(100vw - 32px))',
          maxHeight: 'min(600px, calc(100vh - 64px))',
          background: '#0f1117',
          border:    '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          display:   'flex',
          flexDirection: 'column',
          overflow:  'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{ padding: '24px 24px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: 0 }}>
                Connect Wallet
              </h2>
              <p style={{ color: '#71717a', fontSize: '12px', marginTop: '4px' }}>
                Arc Testnet ·{' '}
                <span style={{ color: '#60a5fa' }}>gas paid in USDC</span>
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#71717a', padding: '6px', borderRadius: '10px',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable wallet list ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 16px 8px' }}>
          {connectors.map(connector => {
            const loading = isPending && variables?.connector === connector
            return (
              <button
                key={connector.uid}
                onClick={() => { connect({ connector, chainId: ARC_CHAIN_ID }); onClose() }}
                disabled={isPending}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '14px',
                  width:          '100%',
                  padding:        '14px 16px',
                  marginBottom:   '8px',
                  background:     'rgba(255,255,255,0.04)',
                  border:         '1px solid rgba(255,255,255,0.08)',
                  borderRadius:   '16px',
                  cursor:         isPending ? 'not-allowed' : 'pointer',
                  opacity:        isPending && !loading ? 0.5 : 1,
                  transition:     'all 0.15s',
                  textAlign:      'left',
                }}
                onMouseEnter={e => {
                  if (!isPending) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              >
                {/* Logo container */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, overflow: 'hidden',
                }}>
                  <WalletLogo name={connector.name} />
                </div>

                <span style={{ flex: 1, color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                  {connector.name}
                </span>

                {loading ? (
                  <svg style={{ animation: 'spin 1s linear infinite', color: '#60a5fa' }}
                       width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" opacity="0.75"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#52525b" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                  </svg>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
        }}>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#52525b', margin: 0 }}>
            Need testnet USDC?{' '}
            <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer"
               style={{ color: '#60a5fa', textDecoration: 'none' }}>
              Get from faucet →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main ConnectWallet ────────────────────────────────────────────────────────

export default function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const chainId = useChainId()
  const [modalOpen,    setModalOpen]    = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copied,       setCopied]       = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: balance } = useBalance({
    address,
    query: { enabled: isConnected && chainId === ARC_CHAIN_ID },
  })

  const isWrongNetwork = isConnected && chainId !== ARC_CHAIN_ID
  const balanceDisplay = balance
    ? `${parseFloat(formatUnits(balance.value, 18)).toFixed(4)} USDC`
    : null

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function copyAddress() {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isConnected) return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500
                   text-white font-semibold text-sm px-4 py-2.5 transition-colors
                   shadow-lg shadow-blue-900/30"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25
               2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25
               2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18 0H3"/>
        </svg>
        Connect Wallet
      </button>
      {modalOpen && <WalletPickerModal onClose={() => setModalOpen(false)} />}
    </>
  )

  if (isWrongNetwork) return (
    <button
      onClick={() => switchChain({ chainId: ARC_CHAIN_ID })}
      disabled={isSwitching}
      className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400
                 text-black font-semibold text-sm px-4 py-2.5 transition-colors"
    >
      {isSwitching
        ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
      }
      Switch to Arc Testnet
    </button>
  )

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setDropdownOpen(v => !v)}
        className="flex items-center gap-2.5 rounded-xl border border-white/10
                   bg-white/5 hover:bg-white/10 text-white text-sm px-3 py-2 transition-colors"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"/>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"/>
        </span>
        {balanceDisplay && <span className="text-zinc-300 font-mono text-xs hidden sm:block">{balanceDisplay}</span>}
        <span className="font-medium">{shortAddress(address!)}</span>
        <svg className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0f1117] shadow-2xl p-2 z-40">
          <div className="px-3 py-2 mb-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <img src="/tokens/usdc.svg" alt="USDC" className="w-3.5 h-3.5"/>
              <span>{arcTestnet.name}</span>
              <span className="ml-auto font-mono text-zinc-500">#{ARC_CHAIN_ID}</span>
            </div>
            {balanceDisplay && <p className="text-white font-semibold mt-1">{balanceDisplay}</p>}
          </div>
          <div className="border-t border-white/10 my-1"/>
          <button onClick={copyAddress} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 hover:bg-white/10 text-sm text-zinc-200 transition-colors">
            {copied
              ? <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              : <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            }
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
          <a href={`https://testnet.arcscan.app/address/${address}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 hover:bg-white/10 text-sm text-zinc-200 transition-colors">
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
            View on ArcScan
          </a>
          <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 hover:bg-white/10 text-sm text-zinc-200 transition-colors">
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
            Get Testnet USDC
          </a>
          <div className="border-t border-white/10 my-1"/>
          <button onClick={() => { disconnect(); setDropdownOpen(false) }} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 hover:bg-red-500/10 text-sm text-red-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
