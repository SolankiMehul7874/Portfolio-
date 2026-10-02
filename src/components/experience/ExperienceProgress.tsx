'use client'

import React from 'react'

interface ExperienceProgressProps {
  currentIndex: number
  totalCount: number
  onPrevious: () => void
  onNext: () => void
  onSelectIndex: (index: number) => void
}

export function ExperienceProgress({
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  onSelectIndex,
}: ExperienceProgressProps) {
  const currentNumStr = String(currentIndex + 1).padStart(2, '0')
  const totalNumStr = String(totalCount).padStart(2, '0')

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-4xl mx-auto pt-4 px-2 select-none">
      {/* Index Stepper Pill Buttons */}
      <div className="flex items-center space-x-1.5">
        {Array.from({ length: totalCount }).map((_, idx) => {
          const isActive = idx === currentIndex
          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              aria-label={`Jump to experience ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          )
        })}
      </div>

      {/* Numerical Counter & Stepper Navigation */}
      <div className="flex items-center space-x-4">
        <div className="font-mono text-xs text-neutral-400 flex items-center space-x-1.5">
          <span className="text-white font-bold">{currentNumStr}</span>
          <span className="text-neutral-600">/</span>
          <span>{totalNumStr}</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            aria-label="Previous experience card"
            className="p-1.5 rounded-lg border border-white/10 bg-neutral-900/60 text-neutral-300 hover:text-white hover:border-cyan-500/40 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer text-xs font-mono"
          >
            ← PREV
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === totalCount - 1}
            aria-label="Next experience card"
            className="p-1.5 rounded-lg border border-white/10 bg-neutral-900/60 text-neutral-300 hover:text-white hover:border-cyan-500/40 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer text-xs font-mono"
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  )
}
