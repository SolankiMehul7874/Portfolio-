'use client'

import { useMemo } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { usePointer } from '@/hooks/usePointer'

export function LiquidTransition() {
  // Gate mounting: only subscribe and evaluate when in the liquid transition zone (0.51 - 0.66)
  const isLiquidRange = useWorldStore((s) => s.progress >= 0.51 && s.progress <= 0.66)
  const progress = useWorldStore((s) => (isLiquidRange ? s.progress : 0))
  const pointer = usePointer()

  const transitionPhase = useMemo(() => {
    if (!isLiquidRange) return 0
    if (progress < 0.58) {
      return Math.max(0, (progress - 0.52) / 0.06) // 0 -> 1
    } else {
      return Math.max(0, 1 - (progress - 0.58) / 0.07) // 1 -> 0
    }
  }, [progress, isLiquidRange])

  if (!isLiquidRange || transitionPhase <= 0.001) return null

  const fluidProgress = Math.max(0, Math.min(1, (progress - 0.53) / 0.10))

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-25 overflow-hidden transition-opacity duration-200"
      style={{ opacity: Math.min(1, transitionPhase * 1.5) }}
    >
      {/* 1. Dark Atmospheric Energy & Deep Space Radial Warp */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.22)_0%,_rgba(10,15,26,0.88)_50%,_rgba(2,3,6,0.98)_90%)]"
      />

      {/* 2. Fluid Wave Distortion Gradients */}
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4), transparent 60%), radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.3), transparent 50%)',
          transform: `scale(${1 + fluidProgress * 0.4}) rotate(${fluidProgress * 25}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      />

      {/* 3. Liquid Wave Rings (Displacement concentric ripples) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((ring) => {
          const ringScale = (fluidProgress * 2.5 + ring * 0.4) % 3
          const ringOpacity = Math.max(0, 1 - ringScale / 3) * transitionPhase
          return (
            <div
              key={ring}
              className="absolute rounded-full border border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              style={{
                width: `${ringScale * 45}vw`,
                height: `${ringScale * 45}vw`,
                opacity: ringOpacity,
                transform: `scale(${1 + ring * 0.1})`,
                willChange: 'transform, opacity',
              }}
            />
          )
        })}
      </div>

      {/* 4. Telemetry Announcer */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>UI DISSOLVING // ENTERING EXPERIMENTAL 3D SHOWCASE</span>
        </div>
      </div>
    </div>
  )
}
