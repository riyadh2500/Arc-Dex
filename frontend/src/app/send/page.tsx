'use client'

// ARC DEX — Send / Receive / Balance
// Inspired by Arc App Kits: https://www.arc.io/app-kits
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useState } from 'react'
import { useAccount, useBalance, useChainId, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { formatUnits, parseEther, isAddress } from 'viem'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { ARC_CHAIN_ID } from '@/config/tokens'
import ConnectWallet from '@/components/shared/ConnectWallet'

type Tab = 'balance' | 'send' | 'receive'

function shortAddr(a: string) { return `${a.slice(0,8)}...${a.slice(-6)}` }

// ── Balance Tab ───────────────────────────────────────────────────────────────
function BalanceTab() {
  const { address } = useAccount()
  const { data: bal } = useBalance({
    address, chainId: ARC_CHAIN_ID,
    query: { enabled: !!address, refetchInterval: 5000 },
  })
  const usdc = bal ? parseFloat(formatUnits(bal.value, 18)) : 0

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 p-8 text-center"
           style={{ background: 'linear-gradient(135deg, #0c1a3d 0%, #0f1117 100%)' }}>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Total Balance</p>
        <p className="text-5xl font-extrabold text-white mb-1">
          {usdc.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
        </p>
        <p className="text-lg text-blue-300 font-semibold">USDC</p>
        <p className="text-zinc-500 text-sm mt-1">
          ≈ ${usdc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
          <span className="text-xs text-zinc-400">Arc Testnet · USDC native gas</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0f1117] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Assets</p>
        </div>
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <img src="/tokens/usdc.svg" alt="USDC" className="w-6 h-6"/>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">USD Coin</p>
            <p className="text-zinc-500 text-xs">USDC · Native gas on Arc</p>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">{usdc.toLocaleString('en-US', { minimumFractionDigits: 4 })}</p>
            <p className="text-zinc-500 text-xs">${usdc.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
        <p className="text-blue-300 font-semibold text-sm mb-1">Powered by Arc App Kits · balance()</p>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Arc App Kits provides <code className="text-blue-300">balance()</code>,{' '}
          <code className="text-blue-300">send()</code>, <code className="text-blue-300">bridge()</code> and{' '}
          <code className="text-blue-300">swap()</code> as standardised USDC fund-flow primitives.
        </p>
        <a href="https://www.arc.io/app-kits" target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-1 text-blue-400 hover:underline text-xs mt-2">
          Learn about App Kits →
        </a>
      </div>
    </div>
  )
}

// ── Send Tab ──────────────────────────────────────────────────────────────────
function SendTab() {
  const { address } = useAccount()
  const { data: bal } = useBalance({ address, chainId: ARC_CHAIN_ID, query: { enabled: !!address } })
  const [to,     setTo]     = useState('')
  const [amount, setAmount] = useState('')

  const { sendTransaction, data: txHash, isPending, error: sendError } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const usdc    = bal ? parseFloat(formatUnits(bal.value, 18)) : 0
  const toValid = isAddress(to)
  const amtNum  = parseFloat(amount)
  const amtValid = !isNaN(amtNum) && amtNum > 0 && amtNum <= usdc
  const canSend  = toValid && amtValid && !isPending && !isConfirming

  function handleMax() { setAmount(usdc.toFixed(6)) }

  function handleSend() {
    if (!canSend) return
    // Don't show toast here — wallet prompt hasn't appeared yet.
    // Only show toast once we have a txHash (user confirmed) or an error.
    sendTransaction(
      {
        to:      to as `0x${string}`,
        value:   parseEther(amount),
        chainId: ARC_CHAIN_ID,
      },
      {
        onError: (err) => {
          // User rejected or wallet errored — dismiss any loading toast
          toast.dismiss('send-tx')
          const msg = err.message?.includes('User rejected')
            ? 'Transaction rejected in wallet'
            : err.message?.slice(0, 80) ?? 'Transaction failed'
          toast.error(msg, { id: 'send-tx-err', duration: 4000 })
        },
      }
    )
  }

  // Only show "confirming" toast once hash is received (user approved in wallet)
  React.useEffect(() => {
    if (txHash) {
      toast.loading('Confirming on Arc…', { id: 'send-tx' })
    }
  }, [txHash])

  // Success
  React.useEffect(() => {
    if (isSuccess) {
      toast.success('Sent! Transaction confirmed on Arc', {
        id: 'send-tx',
        description: txHash ? `Tx: ${txHash.slice(0, 12)}…` : undefined,
        action: txHash ? {
          label: 'View on ArcScan',
          onClick: () => window.open(`https://testnet.arcscan.app/tx/${txHash}`, '_blank'),
        } : undefined,
        duration: 8000,
      })
      setTo('')
      setAmount('')
    }
  }, [isSuccess, txHash])

  // Also dismiss if sendError fires (covers edge cases)
  React.useEffect(() => {
    if (sendError) {
      toast.dismiss('send-tx')
    }
  }, [sendError])

  const btnLabel = isPending      ? 'Waiting in Wallet…'
                 : isConfirming   ? 'Confirming on Arc…'
                 : !toValid && to ? 'Invalid Address'
                 : !amtValid && amount ? 'Insufficient Balance'
                 : 'Send USDC'

  return (
    <div className="space-y-4">
      {/* To */}
      <div>
        <label className="text-xs text-zinc-400 font-medium block mb-1.5">Recipient Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={to}
          onChange={e => setTo(e.target.value)}
          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white
                      placeholder-zinc-600 outline-none transition-colors font-mono
                      ${to && !toValid ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50'}`}
        />
        {to && !toValid && <p className="text-xs text-red-400 mt-1">Invalid Ethereum address</p>}
      </div>

      {/* Amount */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs text-zinc-400 font-medium">Amount (USDC)</label>
          <button onClick={handleMax} className="text-xs text-blue-400 hover:underline">
            Max: {usdc.toFixed(4)} USDC
          </button>
        </div>
        <div className="relative">
          <input
            type="number" placeholder="0.00" min="0" step="any"
            value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50
                       rounded-xl px-4 py-3 pr-24 text-sm text-white placeholder-zinc-600
                       outline-none transition-colors [appearance:textfield]
                       [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <img src="/tokens/usdc.svg" alt="USDC" className="w-4 h-4"/>
            <span className="text-zinc-300 text-sm font-medium">USDC</span>
          </div>
        </div>
        {amount && !isNaN(amtNum) && (
          <p className="text-xs text-zinc-500 mt-1">
            ≈ ${amtNum.toFixed(2)} USD · gas paid in USDC on Arc
          </p>
        )}
      </div>

      {/* Tx details preview */}
      {canSend && (
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">To</span>
            <span className="text-white font-mono text-xs">{shortAddr(to)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Amount</span>
            <span className="text-white">{amtNum.toFixed(4)} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Network fee</span>
            <span className="text-zinc-300 text-xs">Paid in USDC (Arc)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Finality</span>
            <span className="text-green-400 text-xs">Instant &lt;1s on Arc</span>
          </div>
        </div>
      )}

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={`w-full rounded-2xl py-4 font-semibold text-sm transition-all flex items-center justify-center gap-2
          ${canSend
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
            : 'bg-white/10 text-zinc-500 cursor-not-allowed'
          }`}
      >
        {(isPending || isConfirming) && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        )}
        {btnLabel}
      </button>

      {/* ArcScan link after send */}
      {txHash && (
        <a
          href={`https://testnet.arcscan.app/tx/${txHash}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs text-cyan-400 hover:underline"
        >
          View transaction on ArcScan →
        </a>
      )}

      <p className="text-center text-xs text-zinc-600">
        Powered by{' '}
        <a href="https://www.arc.io/app-kits" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Arc App Kits · send()
        </a>
      </p>
    </div>
  )
}

// ── Receive Tab ───────────────────────────────────────────────────────────────
function ReceiveTab() {
  const { address } = useAccount()
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success('Address copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* QR Code — real QR using qrcode.react */}
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-2xl bg-white shadow-lg">
          {address ? (
            <QRCodeSVG
              value={address}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={false}
            />
          ) : (
            <div className="w-[180px] h-[180px] bg-zinc-100 rounded-lg flex items-center justify-center">
              <p className="text-zinc-400 text-xs text-center">Connect wallet<br/>to show QR</p>
            </div>
          )}
        </div>
        <p className="text-xs text-zinc-500">Scan to receive USDC on Arc Testnet</p>
      </div>

      {/* Address */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-zinc-500 mb-2">Your Arc Testnet Address</p>
        <p className="text-white font-mono text-sm break-all leading-relaxed">
          {address ?? '—'}
        </p>
        <button
          onClick={copy}
          className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors
            ${copied
              ? 'bg-green-600/20 border border-green-500/30 text-green-300'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
            }`}
        >
          {copied ? '✓ Copied!' : 'Copy Address'}
        </button>
      </div>

      {/* ArcScan + Faucet links */}
      {address && (
        <a href={`https://testnet.arcscan.app/address/${address}`} target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-between w-full rounded-xl border border-white/10
                      bg-white/5 hover:bg-white/10 px-4 py-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">View on ArcScan</p>
              <p className="text-xs text-zinc-500">testnet.arcscan.app</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
        </a>
      )}

      <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer"
         className="flex items-center justify-between w-full rounded-xl border border-amber-500/20
                    bg-amber-500/5 hover:bg-amber-500/10 px-4 py-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-200">Get Free Testnet USDC</p>
            <p className="text-xs text-zinc-500">faucet.circle.com</p>
          </div>
        </div>
        <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
        </svg>
      </a>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SendPage() {
  const [tab, setTab]       = useState<Tab>('balance')
  const { isConnected }     = useAccount()
  const chainId             = useChainId()
  const isWrongChain        = isConnected && chainId !== ARC_CHAIN_ID

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'balance', label: 'Balance',  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 15v-3"/></svg> },
    { id: 'send',    label: 'Send',     icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"/></svg> },
    { id: 'receive', label: 'Receive',  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"/></svg> },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[500px] h-[500px] rounded-full bg-green-600/8 blur-[120px]"/>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30
                          bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>
            Arc App Kits
          </div>
          <h1 className="text-2xl font-extrabold text-white">Send · Receive · Balance</h1>
          <p className="text-zinc-500 text-sm mt-1">USDC fund flows on Arc Network</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0f1117] shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors
                  ${tab === t.id
                    ? 'text-white border-b-2 border-blue-400 bg-blue-500/5'
                    : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'
                  }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {!isConnected ? (
              <div className="text-center py-10 space-y-4">
                <p className="text-zinc-400 text-sm">Connect your wallet to continue</p>
                <div className="flex justify-center"><ConnectWallet /></div>
              </div>
            ) : isWrongChain ? (
              <div className="text-center py-10">
                <p className="text-amber-400 text-sm mb-4">Switch to Arc Testnet to continue</p>
                <ConnectWallet />
              </div>
            ) : (
              <>
                {tab === 'balance' && <BalanceTab />}
                {tab === 'send'    && <SendTab />}
                {tab === 'receive' && <ReceiveTab />}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500">
          <img src="/tokens/usdc.svg" alt="USDC" className="w-3.5 h-3.5"/>
          <span>Gas paid in USDC · Instant finality on Arc</span>
          <a href="https://www.arc.io/app-kits" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            App Kits →
          </a>
        </div>
      </div>
    </div>
  )
}
