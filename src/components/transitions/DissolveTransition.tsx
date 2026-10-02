'use client'

import { useMemo } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { usePointer } from '@/hooks/usePointer'

export function DissolveTransition() {
  // Gate mounting: only subscribe and evaluate when in the dissolve transition zone (0.85 - 0.96)
  const isDissolveRange = useWorldStore((s) => s.progress >= 0.85 && s.progress <= 0.96)
  const progress = useWorldStore((s) => (isDissolveRange ? s.progress : 0))
  const pointer = usePointer()

  const transitionPhase = useMemo(() => {
    if (!isDissolveRange) return 0
    if (progress < 0.91) {
      return Math.max(0, (progress - 0.86) / 0.05) // 0 -> 1
    } else {
      return Math.max(0, 1 - (progress - 0.91) / 0.04) // 1 -> 0
    }
  }, [progress, isDissolveRange])

  if (!isDissolveRange || transitionPhase <= 0.001) return null

  const dissolveProgress = Math.max(0, Math.min(1, (progress - 0.87) / 0.06))

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-25 overflow-hidden transition-opacity duration-200"
      style={{ opacity: Math.min(1, transitionPhase * 1.4) }}
    >
      {/* 1. Atmospheric Ambient Expansion & Calm Light Spread */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.16)_0%,_rgba(15,23,42,0.78)_50%,_rgba(4,6,9,0.96)_85%)]"
      />

      {/* 2. Gentle Light Beams */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-cyan-400/[0.05] via-transparent to-transparent"
        style={{
          transform: `scale(${1 + dissolveProgress * 0.2})`,
        }}
      />

      {/* 3. Soft Floating Particle Embers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = (dissolveProgress * 60 + i * 8) % 100
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const size = (i % 3) * 2 + 3

          return (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                transform: `translate(${x}vw, ${y}vh)`,
                opacity: (1 - radius / 100) * transitionPhase * 0.8,
                willChange: 'transform, opacity',
              }}
            />
          )
        })}
      </div>

      {/* 4. Telemetry Announcer */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>APPROACHING PART 04 // GITHUB & DIRECT TRANSMISSION</span>
        </div>
      </div>
    </div>
  )
}
