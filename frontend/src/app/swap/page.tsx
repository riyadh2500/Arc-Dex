'use client'

// Arc Network — Swap Page
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import React from 'react'
import SwapCard from '@/components/swap/SwapCard'

export default function SwapPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] rounded-full
                        bg-blue-600/10 blur-[120px]" />
      </div>

      <SwapCard />
    </div>
  )
}
