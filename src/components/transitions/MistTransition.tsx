'use client'

import { useMemo } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { usePointer } from '@/hooks/usePointer'

interface FloatingWord {
  text: string
  x: number // -50 to 50 percent
  y: number // -40 to 40 percent
  zInitial: number // Depth multiplier
  delay: number
}

const WORDS: FloatingWord[] = [
  { text: 'BUILD.', x: -28, y: -22, zInitial: 1.4, delay: 0.0 },
  { text: 'CREATE.', x: 32, y: -16, zInitial: 1.8, delay: 0.08 },
  { text: 'ENGINEER.', x: -18, y: 12, zInitial: 1.1, delay: 0.14 },
  { text: 'EXPERIMENT.', x: 26, y: 24, zInitial: 1.6, delay: 0.20 },
  { text: 'DESIGN.', x: -36, y: 28, zInitial: 2.0, delay: 0.26 },
  { text: 'DEVELOP.', x: 12, y: -28, zInitial: 1.3, delay: 0.18 },
]

export function MistTransition() {
  // Gate mounting: only subscribe and evaluate when in the mist transition zone (0.15 - 0.33)
  const isMistRange = useWorldStore((s) => s.progress >= 0.15 && s.progress <= 0.33)
  const progress = useWorldStore((s) => (isMistRange ? s.progress : 0))
  const pointer = usePointer()

  // Normalized phase: 0 at 0.16, 1 at 0.24, 0 at 0.32
  const transitionPhase = useMemo(() => {
    if (!isMistRange) return 0
    if (progress < 0.24) {
      return Math.max(0, (progress - 0.16) / 0.08)
    } else {
      return Math.max(0, 1 - (progress - 0.24) / 0.08)
    }
  }, [progress, isMistRange])

  if (!isMistRange || transitionPhase <= 0.001) return null

  // Depth forward movement along transition progress
  const travelProgress = Math.max(0, Math.min(1, (progress - 0.17) / 0.12))

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-25 overflow-hidden transition-opacity duration-200"
      style={{ opacity: Math.min(1, transitionPhase * 1.35) }}
    >
      {/* 1. Volumetric Atmosphere Mist & Bloom Gradient */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.18)_0%,_rgba(15,23,42,0.72)_45%,_rgba(5,6,8,0.96)_85%)] mix-blend-screen"
      />

      {/* 2. Soft Light Fog Sheets */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.06] via-transparent to-cyan-500/[0.04]"
        style={{
          transform: `translateY(${Math.sin(travelProgress * 3.14) * 12}px)`,
        }}
      />

      {/* 3. Floating 3D Dimensional Typography passing through Mist */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        {WORDS.map((w) => {
          // Dynamic scale and forward depth as user travels through mist
          const wordZ = Math.max(0, travelProgress - w.delay)
          const scale = 0.8 + wordZ * w.zInitial * 0.9
          const wordOpacity = Math.max(
            0,
            Math.sin(Math.min(1, Math.max(0, (travelProgress - w.delay) / 0.7)) * Math.PI)
          )

          // Parallax offset responsive to cursor
          const parallaxX = pointer.current.x * (w.x > 0 ? 15 : -15)
          const parallaxY = pointer.current.y * 10

          return (
            <div
              key={w.text}
              className="absolute font-black tracking-widest text-cyan-200/90 font-mono drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              style={{
                left: `calc(50% + ${w.x}% + ${parallaxX}px)`,
                top: `calc(50% + ${w.y}% + ${parallaxY}px)`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: wordOpacity * transitionPhase,
                willChange: 'transform, opacity',
              }}
            >
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl">{w.text}</span>
            </div>
          )
        })}
      </div>

      {/* 4. Peripheral vignette and tunnel lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(5,6,8,0.85)_100%)] pointer-events-none" />

      {/* 5. Minimal telemetry readout */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>APPROACHING PART 02 // REAL-WORLD ARCHITECTURE</span>
        </div>
      </div>
    </div>
  )
}
