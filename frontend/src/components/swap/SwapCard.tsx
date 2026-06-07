'use client'

// Arc Network — Swap Card (main swap UI)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// Arc specifics:
//  • Native gas = USDC (not ETH) — displayed as "USDC" everywhere
//  • Instant finality — single confirmation is enough
//  • Faucet: https://faucet.circle.com

import React, { useState, useCallback } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { toast } from 'sonner'
import { useSwapStore }    from '@/stores/useSwapStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { ARC_CHAIN_ID }    from '@/config/tokens'
import { Token }           from '@/types/token'
import TokenSelectModal    from './TokenSelectModal'
import SwapSettings        from './SwapSettings'
import ConnectWallet       from '@/components/shared/ConnectWallet'

// ── Token Input Box ───────────────────────────────────────────────────────────

function TokenInputBox({
  label,
  token,
  amount,
  onAmountChange,
  onTokenClick,
  readonly = false,
  isLoading = false,
}: {
  label:           string
  token:           Token | null
  amount:          string
  onAmountChange?: (v: string) => void
  onTokenClick:    () => void
  readonly?:       boolean
  isLoading?:      boolean
}) {
  const { address } = useAccount()
  const { data: bal } = useBalance({
    address,
    token:   token?.isNative ? undefined : (token?.address as `0x${string}` | undefined),
    chainId: ARC_CHAIN_ID,
    query:   { enabled: !!address && !!token },
  })

  const balDisplay = bal && token
    ? parseFloat(formatUnits(bal.value, token.decimals)).toFixed(4)
    : null

  function handleMax() {
    if (!bal || !token || !onAmountChange) return
    const val = formatUnits(bal.value, token.decimals)
    onAmountChange(val)
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500">{label}</span>
        {balDisplay && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500">Balance: {balDisplay}</span>
            {!readonly && (
              <button
                onClick={handleMax}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Amount input */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="h-9 flex items-center">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.0"
              readOnly={readonly}
              value={amount}
              onChange={e => onAmountChange?.(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold text-white
                         placeholder-zinc-600 outline-none [appearance:textfield]
                         [&::-webkit-outer-spin-button]:appearance-none
                         [&::-webkit-inner-spin-button]:appearance-none"
            />
          )}
          {/* USD value — on Arc USDC = $1, so amount ≈ USD value */}
          {amount && !isLoading && (
            <p className="text-xs text-zinc-500 mt-0.5">
              ≈ ${parseFloat(amount || '0').toFixed(2)}
            </p>
          )}
        </div>

        {/* Token selector button */}
        <button
          onClick={onTokenClick}
          className={`flex items-center gap-2 shrink-0 rounded-xl px-3 py-2 transition-colors font-semibold text-sm
            ${token
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
        >
          {token ? (
            <>
              <div className="w-5 h-5 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                {token.logoURI
                  ? <img src={token.logoURI} alt={token.symbol} className="w-full h-full object-cover" />
                  : <span className="text-xs">{token.symbol.slice(0, 1)}</span>
                }
              </div>
              <span>{token.symbol}</span>
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </>
          ) : (
            <>
              <span>Select</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Price Info Row ─────────────────────────────────────────────────────────────

function PriceInfo({ tokenIn, tokenOut, amountIn, amountOut, priceImpact, minimumReceived, slippage }: {
  tokenIn:  Token | null
  tokenOut: Token | null
  amountIn:  string
  amountOut: string
  priceImpact:      number | null
  minimumReceived:  string
  slippage:         number
}) {
  const [expanded, setExpanded] = useState(false)
  if (!tokenIn || !tokenOut || !amountIn || !amountOut) return null

  const rate = parseFloat(amountOut) / parseFloat(amountIn)
  const impactColor = !priceImpact ? 'text-zinc-400'
    : priceImpact < 1  ? 'text-green-400'
    : priceImpact < 3  ? 'text-yellow-400'
    : 'text-red-400'

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm"
      >
        <span className="text-zinc-400">
          1 {tokenIn.symbol} ≈{' '}
          <span className="text-white font-medium">
            {isNaN(rate) ? '–' : rate.toFixed(6)} {tokenOut.symbol}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {priceImpact !== null && (
            <span className={`text-xs ${impactColor}`}>{priceImpact.toFixed(2)}% impact</span>
          )}
          <svg
            className={`w-4 h-4 text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/10 px-4 py-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Slippage tolerance</span>
            <span className="text-white">{slippage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Minimum received</span>
            <span className="text-white">{minimumReceived || '–'} {tokenOut.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Price impact</span>
            <span className={impactColor}>{priceImpact !== null ? `${priceImpact.toFixed(2)}%` : '–'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Network fee</span>
            <span className="text-white text-xs">Paid in USDC (Arc)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Finality</span>
            <span className="text-green-400 text-xs">Instant (&lt;1s) on Arc</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Swap Card ────────────────────────────────────────────────────────────

export default function SwapCard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const {
    tokenIn, tokenOut,
    amountIn, amountOut,
    priceImpact, minimumReceived,
    isLoading, error,
    setTokenIn, setTokenOut,
    setAmountIn, setAmountOut,
    switchTokens,
  } = useSwapStore()

  const { slippageTolerance, deadline } = useSettingsStore()

  const [selectingFor,  setSelectingFor]  = useState<'in' | 'out' | null>(null)
  const [showSettings,  setShowSettings]  = useState(false)

  // Simulate quote (replace with real contract call once deployed)
  const handleAmountInChange = useCallback((val: string) => {
    setAmountIn(val)
    if (!val || isNaN(parseFloat(val))) { setAmountOut(''); return }
    // Placeholder: 1:1 rate with 0.3% fee
    const out = (parseFloat(val) * 0.997).toFixed(6)
    setAmountOut(out)
    const impact = 0.1 // placeholder
    useSwapStore.getState().setPriceImpact(impact)
    const minReceived = (parseFloat(out) * (1 - slippageTolerance / 100)).toFixed(6)
    useSwapStore.getState().setMinimumReceived(minReceived)
  }, [setAmountIn, setAmountOut, slippageTolerance])

  const isWrongChain = isConnected && chainId !== ARC_CHAIN_ID

  // Contracts not deployed yet — router address empty until `npm run deploy:arc`
  const routerAddress = process.env.NEXT_PUBLIC_ROUTER_ARC_TESTNET || ''
  const contractsDeployed = routerAddress.length > 10

  const canSwap = isConnected && !isWrongChain && tokenIn && tokenOut &&
                  amountIn && parseFloat(amountIn) > 0 && !isLoading

  const swapBtnLabel = !isConnected
    ? 'Connect Wallet'
    : isWrongChain
    ? 'Switch to Arc Testnet'
    : !tokenIn || !tokenOut
    ? 'Select Tokens'
    : !amountIn || parseFloat(amountIn) <= 0
    ? 'Enter Amount'
    : !contractsDeployed
    ? 'Coming Soon — Deploy Contracts'
    : isLoading
    ? 'Swapping…'
    : 'Swap'

  function handleSwap() {
    if (!contractsDeployed) {
      toast.info(
        'Swap contracts not deployed yet. Run: cd contracts && npm run deploy:arc',
        { duration: 6000, id: 'swap-info' }
      )
      return
    }
    // TODO: wire to DEXRouter once deployed
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0f1117] shadow-2xl p-4">

          {/* Card header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-white">Swap</h1>
            <div className="flex items-center gap-2">
              {/* Route indicator */}
              <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-lg">
                Arc DEX
              </span>
              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                aria-label="Swap settings"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213
                       1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257
                       1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125
                       0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0
                       010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26
                       1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57
                       6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213
                       1.28c-.09.543-.56.941-1.11.941h-2.594c-.55
                       0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52
                       6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125
                       1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0
                       01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0
                       010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0
                       01-.26-1.43l1.297-2.247a1.125 1.125 0
                       011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Token In */}
          <TokenInputBox
            label="You Pay"
            token={tokenIn}
            amount={amountIn}
            onAmountChange={handleAmountInChange}
            onTokenClick={() => setSelectingFor('in')}
          />

          {/* Switch button */}
          <div className="flex justify-center my-1 -my-0.5 relative z-10">
            <button
              onClick={switchTokens}
              className="p-2 rounded-xl bg-[#0f1117] border border-white/10
                         hover:bg-white/10 hover:border-white/20
                         text-zinc-400 hover:text-white transition-all"
              aria-label="Switch tokens"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
            </button>
          </div>

          {/* Token Out */}
          <TokenInputBox
            label="You Receive"
            token={tokenOut}
            amount={amountOut}
            onTokenClick={() => setSelectingFor('out')}
            readonly
            isLoading={isLoading}
          />

          {/* Price info */}
          {amountIn && amountOut && (
            <div className="mt-3">
              <PriceInfo
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                amountIn={amountIn}
                amountOut={amountOut}
                priceImpact={priceImpact}
                minimumReceived={minimumReceived}
                slippage={slippageTolerance}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Action button */}
          <div className="mt-3">
            {!isConnected ? (
              <div className="flex justify-center">
                <ConnectWallet />
              </div>
            ) : (
              <button
                onClick={handleSwap}
                disabled={!canSwap || isLoading}
                className={`w-full rounded-2xl py-4 text-base font-semibold transition-all
                  ${canSwap && !isLoading && contractsDeployed
                    ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-900/30'
                    : canSwap && !contractsDeployed
                    ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300 cursor-pointer'
                    : 'bg-white/10 text-zinc-500 cursor-not-allowed'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Swapping…
                  </span>
                ) : swapBtnLabel}
              </button>
            )}
          </div>
        </div>

        {/* Arc info pill */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500">
          <img src="/tokens/usdc.svg" alt="USDC" className="w-3.5 h-3.5" />
          <span>Gas paid in USDC · Instant finality on Arc</span>
          <a
            href="https://docs.arc.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Learn more
          </a>
        </div>
      </div>

      {/* Modals */}
      {selectingFor && (
        <TokenSelectModal
          exclude={selectingFor === 'in' ? tokenOut?.address : tokenIn?.address}
          onSelect={token => selectingFor === 'in' ? setTokenIn(token) : setTokenOut(token)}
          onClose={() => setSelectingFor(null)}
        />
      )}
      {showSettings && <SwapSettings onClose={() => setShowSettings(false)} />}
    </>
  )
}
