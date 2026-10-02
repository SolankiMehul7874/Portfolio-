'use client'

import { academicMilestones } from './academicData'

interface JourneyProgressProps {
  activeIndex: number
  totalCount: number
  journeyProgress: number
  onSelectMilestone: (index: number) => void
  onPrev: () => void
  onNext: () => void
}

export function JourneyProgress({
  activeIndex,
  totalCount,
  onSelectMilestone,
  onPrev,
  onNext,
}: JourneyProgressProps) {
  return (
    <div className="w-full max-w-[420px] flex items-center justify-between pointer-events-auto bg-neutral-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-lg">
      {/* 1. Milestone Year Jump Buttons */}
      <div className="flex items-center space-x-1">
        {academicMilestones.map((m, idx) => {
          const isActive = idx === activeIndex
          return (
            <button
              key={m.id}
              onClick={() => onSelectMilestone(idx)}
              className={`px-2 py-0.5 rounded-lg font-mono text-[10px] transition-all flex items-center space-x-1 cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 border text-white font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
              style={{
                borderColor: isActive ? m.accentColor : 'transparent',
                color: isActive ? m.accentColor : undefined,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isActive ? m.accentColor : '#525252' }}
              />
              <span>{m.year}</span>
            </button>
          )
        })}
      </div>

      {/* 2. Stepper Prev / Next */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onPrev}
          disabled={activeIndex === 0}
          className="px-2 py-0.5 rounded-md bg-neutral-900 hover:bg-neutral-800 disabled:opacity-25 disabled:cursor-not-allowed text-neutral-300 hover:text-cyan-300 font-mono text-[10px] font-bold transition-all border border-neutral-800 active:scale-95 cursor-pointer"
          aria-label="Previous Milestone"
        >
          ‹ PREV
        </button>
        <button
          onClick={onNext}
          disabled={activeIndex === totalCount - 1}
          className="px-2 py-0.5 rounded-md bg-neutral-900 hover:bg-neutral-800 disabled:opacity-25 disabled:cursor-not-allowed text-neutral-300 hover:text-cyan-300 font-mono text-[10px] font-bold transition-all border border-neutral-800 active:scale-95 cursor-pointer"
          aria-label="Next Milestone"
        >
          NEXT ›
        </button>
      </div>
    </div>
  )
}
