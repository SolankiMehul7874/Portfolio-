'use client'

import { useState, useEffect, useRef } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { siteConfig } from '@/data/site'

const TELEMETRY_STEPS = [
  { threshold: 0, text: 'INITIALIZING APPLICATION...' },
  { threshold: 22, text: 'LOADING 3D ASSETS & GEOMETRY...' },
  { threshold: 48, text: 'CONFIGURING GRAPHICS & LIGHTING RIG...' },
  { threshold: 72, text: 'SYNCHRONIZING INTERACTIVE VIEWPORT...' },
  { threshold: 92, text: 'FINALIZING DISPLAY BUFFERS...' },
  { threshold: 100, text: 'SYSTEM READY // WELCOME TO THE PORTFOLIO' },
]

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false)
  const canvasReady = useWorldStore((s) => s.canvasReady)
  const dreiProgress = useWorldStore((s) => s.dreiProgress)
  const setIsAppLoadedStore = useWorldStore((s) => s.setIsAppLoaded)

  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    setMounted(true)
  }, [])

  // Interpolate smooth display progress towards target
  useEffect(() => {
    let animationFrameId: number

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTimeRef.current
      const minDuration = 1400 // 1.4s minimum for smooth cinematic feel

      // Calculate target progress from canvas/drei or time elapsed
      let realTarget = 30 // Base JS/DOM loaded progress
      if (dreiProgress > 0) realTarget = Math.max(realTarget, dreiProgress)
      if (canvasReady) realTarget = Math.max(realTarget, 90)

      // Time-based floor ensures progress moves smoothly even before assets signal completion
      const timeFloor = Math.min(95, (elapsedTime / minDuration) * 95)
      let currentTarget = Math.max(realTarget, timeFloor)

      // Ready condition: min duration passed AND canvas ready
      const isReady = elapsedTime >= minDuration && (canvasReady || dreiProgress >= 100 || elapsedTime > 4000)
      if (isReady) {
        currentTarget = 100
      }

      setProgress((prev) => {
        if (prev >= 100) return 100
        const diff = currentTarget - prev
        if (diff <= 0.2) {
          const next = prev + (isReady ? 2 : 0.4)
          return Math.min(100, next)
        }
        return Math.min(100, prev + diff * 0.12)
      })

      if (!isDone) {
        animationFrameId = requestAnimationFrame(updateProgress)
      }
    }

    animationFrameId = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [canvasReady, dreiProgress, isDone])

  // Handle completion and fade out
  useEffect(() => {
    if (progress >= 100 && !isDone) {
      setIsDone(true)
      setIsAppLoadedStore(true)
      const timeout = setTimeout(() => {
        setIsHidden(true)
      }, 700) // Match duration of CSS fade out
      return () => clearTimeout(timeout)
    }
  }, [progress, isDone, setIsAppLoadedStore])

  if (!mounted || isHidden) return null

  const displayPercent = Math.min(100, Math.floor(progress))

  // Find active step log message
  let activeStepText = TELEMETRY_STEPS[0].text
  for (let i = TELEMETRY_STEPS.length - 1; i >= 0; i--) {
    if (displayPercent >= TELEMETRY_STEPS[i].threshold) {
      activeStepText = TELEMETRY_STEPS[i].text
      break
    }
  }

  return (
    <div
      role="progressbar"
      aria-label="System Initializing"
      aria-valuenow={displayPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-8 md:p-12 bg-[#050608] text-white select-none transition-all duration-700 ease-out ${
        isDone ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Radial Glow & Scanline Texture */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-[#050608] to-black" />
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Frame Corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-sm" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-sm" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-sm" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60 rounded-br-sm" />

      {/* Top Telemetry Header */}
      <header className="relative z-10 flex items-center justify-between font-mono text-xs text-neutral-400">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <span className="font-bold text-white tracking-widest uppercase">{siteConfig.name}</span>
          <span className="hidden sm:inline text-neutral-600">//</span>
          <span className="hidden sm:inline text-neutral-400">SOFTWARE ENGINEER</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-[10px] text-cyan-300 font-semibold tracking-wider uppercase">
            STATUS: {displayPercent < 100 ? 'INITIALIZING...' : 'READY'}
          </div>
        </div>
      </header>

      {/* Center Reticle & Percentage Gauge */}
      <main className="relative z-10 my-auto flex flex-col items-center justify-center space-y-8 text-center">
        {/* Animated Cyber Ring Loader */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
          {/* Outer Rotating Segmented SVG Ring */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeDasharray="60 140"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            />
          </svg>

          {/* Inner Counter-Rotating Ring */}
          <svg className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] animate-[spin_6s_linear_infinite_reverse]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#0e7490"
              strokeWidth="1.5"
              strokeDasharray="40 180"
            />
          </svg>

          {/* Glowing Central Numerical Percentage Display */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
              {displayPercent}
              <span className="text-2xl sm:text-3xl text-cyan-400 font-bold ml-0.5">%</span>
            </div>
            <div className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
              LOADED
            </div>
          </div>
        </div>

        {/* Telemetry Log Message */}
        <div className="space-y-2 max-w-md w-full px-4">
          <div className="text-xs sm:text-sm font-mono text-cyan-300 font-semibold tracking-wide flex items-center justify-center space-x-2">
            <span className="text-cyan-400 animate-pulse">&gt;</span>
            <span>{activeStepText}</span>
          </div>

          {/* Diagnostic Log History Preview */}
          <div className="hidden sm:block text-[11px] font-mono text-neutral-500 space-y-0.5 text-center">
            {TELEMETRY_STEPS.filter((step) => displayPercent >= step.threshold)
              .slice(-2)
              .map((step, idx) => (
                <div key={idx} className="opacity-70">
                  [ OK ] {step.text}
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Bottom Progress Bar & Telemetry Status */}
      <footer className="relative z-10 max-w-xl mx-auto w-full space-y-4">
        {/* Multi-Segmented Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span className="tracking-widest uppercase">LOADING 3D PORTFOLIO ENVIRONMENT</span>
            <span className="text-cyan-400 font-bold">{displayPercent} / 100</span>
          </div>

          <div className="relative h-2 w-full bg-neutral-900/90 rounded-full border border-neutral-800 p-0.5 overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(0,240,255,0.9)] relative"
              style={{ width: `${displayPercent}%` }}
            >
              {/* Scanline Glint Beam inside Progress Bar */}
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* System Engine Status Indicators */}
        <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-neutral-500">
          <div className="flex items-center space-x-1.5">
            <span className="text-neutral-500">ENGINE:</span>
            <span className="text-cyan-400 font-semibold">WEBGL / THREE.JS</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-500">ENVIRONMENT:</span>
            <span className="text-emerald-400 font-semibold">{displayPercent < 100 ? 'INITIALIZING' : 'OPERATIONAL'}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
