'use client'

interface CertificateProgressProps {
  currentIndex: number
  totalCount: number
  onPrev: () => void
  onNext: () => void
}

export function CertificateProgress({
  currentIndex,
  totalCount,
  onPrev,
  onNext,
}: CertificateProgressProps) {
  const currentFormatted = String(currentIndex + 1).padStart(2, '0')
  const totalFormatted = String(totalCount).padStart(2, '0')
  const progressPercent = ((currentIndex + 1) / totalCount) * 100

  return (
    <div className="flex items-center justify-between w-full max-w-md pt-3">
      {/* Number & Progress Track */}
      <div className="flex items-center space-x-3">
        <span className="font-mono text-xs text-cyan-400 font-bold">
          {currentFormatted}
        </span>

        <div className="w-24 sm:w-36 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-400 ease-out shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="font-mono text-xs text-neutral-500">
          {totalFormatted}
        </span>
      </div>

      {/* Stepper Buttons */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={onPrev}
          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 border border-neutral-800 font-mono text-xs font-bold transition-all active:scale-95"
          aria-label="Previous Certificate"
        >
          ‹ PREV
        </button>

        <button
          onClick={onNext}
          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 border border-neutral-800 font-mono text-xs font-bold transition-all active:scale-95"
          aria-label="Next Certificate"
        >
          NEXT ›
        </button>
      </div>
    </div>
  )
}
