'use client'

// Arc Network — Swap Settings Panel (slippage + deadline)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React, { useState } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'

const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0]

export default function SwapSettings({ onClose }: { onClose: () => void }) {
  const { slippageTolerance, deadline, setSlippageTolerance, setDeadline } = useSettingsStore()
  const [customSlippage, setCustomSlippage] = useState('')

  function handleSlippagePreset(v: number) {
    setCustomSlippage('')
    setSlippageTolerance(v)
  }

  function handleCustomSlippage(v: string) {
    setCustomSlippage(v)
    const n = parseFloat(v)
    if (!isNaN(n) && n > 0 && n <= 50) setSlippageTolerance(n)
  }

  const isHighSlippage = slippageTolerance > 5

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1117] shadow-2xl p-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Transaction Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Slippage */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-sm text-zinc-300 font-medium">Slippage Tolerance</p>
            <div className="group relative">
              <svg className="w-3.5 h-3.5 text-zinc-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd" />
              </svg>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg
                              bg-zinc-800 text-xs text-zinc-300 hidden group-hover:block z-10 shadow-xl">
                Your transaction reverts if the price moves more than this % unfavorably.
                Arc has instant finality so lower slippage is safe.
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {SLIPPAGE_PRESETS.map(v => (
              <button
                key={v}
                onClick={() => handleSlippagePreset(v)}
                className={`flex-1 rounded-xl py-2 text-sm font-medium transition-colors
                  ${slippageTolerance === v && !customSlippage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                  }`}
              >
                {v}%
              </button>
            ))}
            <div className="relative flex-1">
              <input
                type="number"
                min="0.01"
                max="50"
                step="0.1"
                placeholder="Custom"
                value={customSlippage}
                onChange={e => handleCustomSlippage(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm
                           text-white placeholder-zinc-500 outline-none focus:border-blue-500/50
                           transition-colors text-center"
              />
              {customSlippage && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">%</span>
              )}
            </div>
          </div>

          {isHighSlippage && (
            <p className="mt-2 text-xs text-amber-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd" />
              </svg>
              High slippage — your transaction may be frontrun
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <p className="text-sm text-zinc-300 font-medium mb-2">Transaction Deadline</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="60"
              value={deadline}
              onChange={e => setDeadline(parseInt(e.target.value) || 20)}
              className="w-24 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm
                         text-white outline-none focus:border-blue-500/50 transition-colors text-center"
            />
            <span className="text-sm text-zinc-400">minutes</span>
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">
            Arc has instant finality — transactions that exceed this deadline revert automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
