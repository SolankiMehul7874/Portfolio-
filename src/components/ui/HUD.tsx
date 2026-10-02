'use client'

import { useState, useEffect } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { siteConfig } from '@/data/site'
import type { PortfolioPartId } from '@/types/world'

const FOUR_PARTS: { id: PortfolioPartId; label: string; progress: number }[] = [
  { id: 'world', label: '01 // OVERVIEW', progress: 0.00 },
  { id: 'professional', label: '02 // PROFESSIONAL', progress: 0.30 },
  { id: 'showcase', label: '03 // PROJECTS & CERTS', progress: 0.65 },
  { id: 'connection', label: '04 // CONTACT', progress: 0.95 },
]

export function HUD() {
  // Use progressPercent (0-100 integer) so HUD only re-renders on whole percent ticks instead of 100+ times/sec
  const progressPercent = useWorldStore((s) => s.progressPercent)
  const isHeroVisible = useWorldStore((s) => s.progress < 0.035)
  const portfolioPart = useWorldStore((s) => s.portfolioPart)
  const cameraMode = useWorldStore((s) => s.cameraMode)
  const setCameraMode = useWorldStore((s) => s.setCameraMode)

  const [timecode, setTimecode] = useState('00:04:08')
  const [fps, setFps] = useState(118)
  const [menuOpen, setMenuOpen] = useState(false)

  // Live timecode simulation matching reference HUD with efficient interval
  useEffect(() => {
    let frame = 0
    const interval = setInterval(() => {
      frame += 5
      const totalSec = Math.floor(frame / 10)
      const sec = (totalSec % 60).toString().padStart(2, '0')
      const min = Math.floor(totalSec / 60).toString().padStart(2, '0')
      const ms = ((frame * 10) % 100).toString().padStart(2, '0')
      setTimecode(`${min}:${sec}:${ms}`)
      setFps(Math.floor(116 + Math.random() * 4))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const scrollToProgress = (targetProgress: number) => {
    // @ts-expect-error global lenis
    if (typeof window !== 'undefined' && window.__lenis) {
      // @ts-expect-error global lenis
      const maxScroll = window.__lenis.limit || (document.documentElement.scrollHeight - window.innerHeight)
      // @ts-expect-error global lenis
      window.__lenis.scrollTo(targetProgress * maxScroll, {
        duration: 0.45,
        easing: (t: number) => 1 - Math.pow(1 - t, 4), // Crisp, responsive cubic-quart easing
      })
    } else {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: targetProgress * maxScroll, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  // Prev / Next Chapter Steppers
  const handlePrevPart = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    let currentIdx = 0
    for (let i = 0; i < FOUR_PARTS.length; i++) {
      if (progressPercent >= FOUR_PARTS[i].progress * 100 - 4) currentIdx = i
    }
    const prevIdx = Math.max(0, currentIdx - 1)
    scrollToProgress(FOUR_PARTS[prevIdx].progress)
  }

  const handleNextPart = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    let currentIdx = 0
    for (let i = 0; i < FOUR_PARTS.length; i++) {
      if (progressPercent >= FOUR_PARTS[i].progress * 100 - 4) currentIdx = i
    }
    const nextIdx = Math.min(FOUR_PARTS.length - 1, currentIdx + 1)
    scrollToProgress(FOUR_PARTS[nextIdx].progress)
  }

  return (
    <aside
      aria-label="Cinematic Viewport HUD"
      className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none font-sans"
    >
      {/* ==================================================== */}
      {/* 1. CINEMATIC RETICLE FRAME & CORNERS                */}
      {/* ==================================================== */}
      <div className="absolute inset-2 sm:inset-4 md:inset-5 rounded-2xl border border-white/[0.06] pointer-events-none">
        {/* Sleek corner markers */}
        <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-cyan-400/50 rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-cyan-400/50 rounded-br-sm" />
      </div>

      {/* ==================================================== */}
      {/* 2. TOP HEADER BAR                                    */}
      {/* ==================================================== */}
      <header className="flex items-center justify-between pointer-events-auto relative z-40">
        {/* FPS Counter & Identity */}
        <div className="hidden sm:flex items-center space-x-2 font-mono text-xs text-neutral-400">
          <span className="text-neutral-200 font-bold tracking-wider">{siteConfig.name}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400 font-semibold">{fps} fps</span>
        </div>

        {/* Center Pill Nav Bar: < > Chapter Navigation Steppers */}
        <nav
          aria-label="Chapter Nav"
          className="flex items-center space-x-1 md:space-x-1.5 backdrop-blur-xl bg-neutral-950/85 border border-neutral-800/80 p-1 sm:p-1.5 rounded-full shadow-2xl scale-90 sm:scale-100 origin-center"
        >
          {/* < > Chapter Stepper Controls */}
          <div className="flex items-center px-2 py-0.5 text-xs font-mono text-neutral-300 space-x-1">
            <button
              onClick={handlePrevPart}
              className="hover:text-cyan-400 transition-colors px-1"
              aria-label="Previous Chapter"
              title="Previous Chapter"
            >
              &lt;
            </button>
            <span className="text-neutral-600">/</span>
            <button
              onClick={handleNextPart}
              className="hover:text-cyan-400 transition-colors px-1"
              aria-label="Next Chapter"
              title="Next Chapter"
            >
              &gt;
            </button>
          </div>

          {/* Direct Chapter Buttons */}
          <div className="hidden md:flex items-center space-x-1">
            {FOUR_PARTS.map((p) => {
              const isActive = portfolioPart === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => scrollToProgress(p.progress)}
                  className={`px-3 py-1 rounded-full font-mono text-[11px] font-semibold tracking-wider transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-neutral-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-bold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Perspective Toggle in Part 1 */}
          {portfolioPart === 'world' && (
            <div className="flex items-center bg-neutral-900/80 p-0.5 rounded-full border border-neutral-800">
              <button
                onClick={() => setCameraMode('TPP')}
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all ${
                  cameraMode === 'TPP'
                    ? 'bg-cyan-400 text-neutral-950 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Third Person Perspective (Hotkey: E)"
              >
                TPP
              </button>
              <button
                onClick={() => setCameraMode('FPP')}
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all ${
                  cameraMode === 'FPP'
                    ? 'bg-cyan-400 text-neutral-950 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="First Person Perspective (Hotkey: Q)"
              >
                FPP
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden px-3 py-1 rounded-full font-mono text-xs font-semibold transition-all ${
              menuOpen
                ? 'bg-cyan-400 text-neutral-950'
                : 'bg-neutral-900 text-cyan-300'
            }`}
          >
            Menu =
          </button>
        </nav>

        {/* Top Right: REC Status & Chapter Indicator */}
        <div className="flex items-center space-x-2 sm:space-x-3 font-mono text-xs">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-950/70 border border-neutral-800 text-[10px] text-neutral-400">
            <span className="text-cyan-400 font-bold uppercase">{portfolioPart}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">{progressPercent}%</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-950/70 border border-neutral-800 text-[10px] text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-bold tracking-wider font-mono">AVAILABLE FOR WORK</span>
          </div>
        </div>
      </header>

      {/* Dropdown Menu Modal for Mobile & Quick Jump */}
      {menuOpen && (
        <div className="pointer-events-auto absolute top-16 left-1/2 -translate-x-1/2 backdrop-blur-2xl bg-neutral-950/95 border border-neutral-800 rounded-2xl p-5 shadow-2xl z-50 w-72 space-y-2">
          <div className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase border-b border-neutral-800 pb-2 mb-2">
            EXPERIENCE CHAPTERS
          </div>
          {FOUR_PARTS.map((p) => (
            <button
              key={p.id}
              onClick={() => scrollToProgress(p.progress)}
              className={`w-full text-left font-mono text-xs py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                portfolioPart === p.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
              }`}
            >
              <span>{p.label}</span>
              <span className="text-[10px] text-neutral-600">
                {Math.round(p.progress * 100)}%
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. PART 1 HERO TITLE & IDENTITY OVERLAY              */}
      {/* ==================================================== */}
      {isHeroVisible && (
        <div
          style={{ opacity: Math.max(0, 1 - (progressPercent / 3.0)) }}
          className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none transition-opacity duration-200 space-y-2 max-w-2xl px-4 w-full"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 tracking-widest uppercase backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SOFTWARE ENGINEER // PORTFOLIO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase font-sans drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            MEHUL SOLANKI
          </h1>

          <p className="text-xs sm:text-sm font-mono text-cyan-300 font-medium tracking-wide">
            BACKEND · FLUTTER · ANDROID · MACHINE LEARNING
          </p>

          <div className="pt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-black/60 border border-neutral-800 text-[10px] font-mono text-neutral-400 animate-bounce">
              ↓ SCROLL TO EXPLORE PORTFOLIO
            </span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. BOTTOM TELEMETRY FOOTER & SCRUBBER                */}
      {/* ==================================================== */}
      <div className="flex flex-col space-y-2.5 pointer-events-auto">
        {/* Contextual Navigation & Guidance across all stages */}
        <div className="hidden sm:flex items-center justify-center space-x-2.5 text-[10px] text-neutral-500 font-mono tracking-wider">
          {portfolioPart === 'world' ? (
            <>
              <span className="px-1.5 py-0.5 rounded bg-neutral-900/90 border border-neutral-800 text-cyan-400">
                {progressPercent >= 5 ? 'FPP MODE ACTIVE' : 'ESTABLISHING VIEW'}
              </span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-400">SCROLL TO EXPLORE SCENE</span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-400">CLICK SCREEN TO VIEW DETAILS</span>
            </>
          ) : portfolioPart === 'professional' ? (
            <>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
                PART 02 // PROFESSIONAL BACKGROUND
              </span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-400">SCROLL OR USE ARROWS [← / →] TO NAVIGATE</span>
            </>
          ) : portfolioPart === 'showcase' ? (
            <>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
                PART 03 // PROJECTS & CERTIFICATES
              </span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-400">[← / →] CYCLE CARDS</span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-400">[ENTER / CLICK] VIEW DETAILS</span>
            </>
          ) : (
            <>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
                PART 04 // CONTACT
              </span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-400">SEND A MESSAGE OR CONNECT</span>
            </>
          )}
        </div>

        <footer className="flex items-end justify-between font-mono text-[11px] text-neutral-400 relative z-40">
          {/* Active Chapter indicator */}
          <div className="tracking-widest text-neutral-400 font-semibold text-[10px] sm:text-[11px]">
            [ {portfolioPart.toUpperCase()} ]
          </div>

          {/* Center Progress Scrubber Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handlePrevPart}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-neutral-800 bg-neutral-950/80 text-[10px] font-mono text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors backdrop-blur-md shadow-md active:scale-95"
              title="Previous Chapter"
              aria-label="Previous Chapter"
            >
              ‹ PREV
            </button>

            <div className="flex flex-col items-center space-y-1">
              <div className="text-[9px] text-neutral-400 tracking-widest uppercase font-mono">
                TIMELINE // {progressPercent}%
              </div>
              <div className="w-24 sm:w-40 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-100 ease-out shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleNextPart}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-neutral-800 bg-neutral-950/80 text-[10px] font-mono text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors backdrop-blur-md shadow-md active:scale-95"
              title="Next Chapter"
              aria-label="Next Chapter"
            >
              NEXT ›
            </button>
          </div>

          {/* Timecode */}
          <div className="tracking-widest text-neutral-300 font-semibold text-[10px] sm:text-[11px]">
            [ {timecode} ]
          </div>
        </footer>
      </div>
    </aside>
  )
}
