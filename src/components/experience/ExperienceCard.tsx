'use client'

import React, { useRef, useState, useCallback } from 'react'
import { ExperienceItem } from './experienceData'

interface ExperienceCardProps {
  experience: ExperienceItem
  cardIndex: number
  activeIndex: number
  totalCards: number
  onSelect: (index: number) => void
  onExplore: (experience: ExperienceItem) => void
  onViewProject?: (projectId: string) => void
  isReducedMotion?: boolean
}

export function ExperienceCard({
  experience,
  cardIndex,
  activeIndex,
  totalCards,
  onSelect,
  onExplore,
  onViewProject,
  isReducedMotion = false,
}: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 })

  const offset = cardIndex - activeIndex
  const isActive = offset === 0
  const isPrevious = offset < 0
  const isUpcoming = offset > 0

  // Calculate 3D stacking transform values
  let scale = 1
  let opacity = 1
  let translateZ = 0
  let translateY = 0
  let zIndex = 30 - Math.abs(offset)

  if (isReducedMotion) {
    // 2D simplified fallback for reduced motion
    scale = isActive ? 1 : 0.95
    opacity = isActive ? 1 : 0.4
    translateZ = 0
    translateY = offset * 25
  } else {
    if (isActive) {
      scale = 1
      opacity = 1
      translateZ = 0
      translateY = 0
      zIndex = 40
    } else if (isPrevious) {
      // Previous cards move upward and back in Z space
      const dist = Math.abs(offset)
      scale = 1 + dist * 0.02
      opacity = Math.max(0.12, 0.28 - dist * 0.08)
      translateY = -60 * dist
      translateZ = -30 * dist
      zIndex = 20 - dist
    } else {
      // Upcoming cards sit stacked behind the active card
      scale = Math.max(0.78, 1 - offset * 0.07)
      opacity = Math.max(0.15, 0.45 - (offset - 1) * 0.15)
      translateY = offset * 28
      translateZ = -60 * offset
      zIndex = 30 - offset
    }
  }

  // Mouse move handler for 3D tilt & spotlight on the active card
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isActive || isReducedMotion || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Maximum ±4deg rotation
      const rotateX = ((y - centerY) / centerY) * -4
      const rotateY = ((x - centerX) / centerX) * 4

      setTilt({ rotateX, rotateY })
      setSpotlight({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.18,
      })
    },
    [isActive, isReducedMotion]
  )

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setSpotlight((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  // Visual Area Rendering based on experience type
  const renderVisual = () => {
    switch (experience.visualType) {
      case 'mobile':
        return (
          <div className="relative w-full h-full min-h-[160px] md:min-h-[220px] rounded-2xl bg-gradient-to-br from-neutral-900/90 via-cyan-950/20 to-neutral-950 border border-cyan-500/20 p-4 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-cyan-500/40 transition-colors">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.12),transparent_70%)] pointer-events-none" />
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 border-b border-cyan-500/20 pb-2">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>FLUTTER // CLIENT_CORE</span>
              </span>
              <span className="text-neutral-500">60 FPS</span>
            </div>

            {/* Mobile Wireframe preview */}
            <div className="my-auto py-2 flex flex-col items-center justify-center space-y-2">
              <div className="w-28 h-40 rounded-xl border border-cyan-400/30 bg-neutral-950/80 p-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col space-y-1.5 relative overflow-hidden">
                <div className="h-2 w-12 rounded bg-cyan-500/40 mx-auto" />
                <div className="h-10 rounded bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-[8px] font-mono text-cyan-300">
                  NEWS STREAM
                </div>
                <div className="space-y-1 flex-1">
                  <div className="h-1.5 w-full rounded bg-neutral-800" />
                  <div className="h-1.5 w-4/5 rounded bg-neutral-800" />
                  <div className="h-1.5 w-3/5 rounded bg-cyan-500/30" />
                </div>
                <div className="h-3 rounded bg-cyan-500/20 border border-cyan-500/30 text-[7px] font-mono text-cyan-300 flex items-center justify-center">
                  FIREBASE AUTH: OK
                </div>
              </div>
            </div>

            <div className="text-[9px] font-mono text-neutral-500 flex justify-between">
              <span>LATENCY: -35%</span>
              <span className="text-cyan-400">STATE: BLoC / Provider</span>
            </div>
          </div>
        )

      case 'backend':
        return (
          <div className="relative w-full h-full min-h-[160px] md:min-h-[220px] rounded-2xl bg-gradient-to-br from-neutral-900/90 via-blue-950/20 to-neutral-950 border border-blue-500/20 p-4 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-blue-500/40 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.12),transparent_70%)] pointer-events-none" />
            <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 border-b border-blue-500/20 pb-2">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>REST // API_GATEWAY</span>
              </span>
              <span className="text-neutral-500">JWT / 256-BIT</span>
            </div>

            {/* Architecture Node Diagram */}
            <div className="my-auto py-2 flex items-center justify-center space-x-2 text-[9px] font-mono">
              <div className="px-2.5 py-2 rounded-lg bg-neutral-950/90 border border-blue-500/40 text-blue-300 text-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <div className="text-[8px] text-neutral-500">CLIENT</div>
                <div>REQ</div>
              </div>
              <span className="text-blue-400">→</span>
              <div className="px-2.5 py-2 rounded-lg bg-blue-950/40 border border-blue-400/50 text-white font-bold text-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <div className="text-[7px] text-blue-300">AUTH GUARD</div>
                <div>JWT</div>
              </div>
              <span className="text-blue-400">→</span>
              <div className="px-2.5 py-2 rounded-lg bg-neutral-950/90 border border-blue-500/40 text-blue-300 text-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <div className="text-[8px] text-neutral-500">DB</div>
                <div>SQL</div>
              </div>
            </div>

            <div className="text-[9px] font-mono text-neutral-500 flex justify-between">
              <span>AVG RES: &lt;50ms</span>
              <span className="text-blue-400">PIPELINE: SCIKIT-LEARN</span>
            </div>
          </div>
        )

      case 'hackathon':
        return (
          <div className="relative w-full h-full min-h-[160px] md:min-h-[220px] rounded-2xl bg-gradient-to-br from-neutral-900/90 via-emerald-950/20 to-neutral-950 border border-emerald-500/20 p-4 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-emerald-500/40 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 border-b border-emerald-500/20 pb-2">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>TECHSHASTRA 2K26</span>
              </span>
              <span className="text-neutral-500">24H COUNTDOWN</span>
            </div>

            {/* Radar / Sprint glyph */}
            <div className="my-auto py-2 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <div className="absolute inset-2 rounded-full border border-dashed border-emerald-400/40 animate-spin" style={{ animationDuration: '12s' }} />
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="mt-2 text-[10px] font-mono text-emerald-300 font-bold tracking-wider">
                RAPID PROTOTYPE // SHIPPED
              </div>
            </div>

            <div className="text-[9px] font-mono text-neutral-500 flex justify-between">
              <span>STATUS: DELIVERED</span>
              <span className="text-emerald-400">PANEL REVIEW: DEFENDED</span>
            </div>
          </div>
        )

      case 'milestone':
        return (
          <div className="relative w-full h-full min-h-[160px] md:min-h-[220px] rounded-2xl bg-gradient-to-br from-neutral-900/90 via-amber-950/20 to-neutral-950 border border-amber-500/20 p-4 flex flex-col justify-between overflow-hidden shadow-inner group-hover:border-amber-500/40 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none" />
            <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 border-b border-amber-500/20 pb-2">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>MERIT // STATEWIDE</span>
              </span>
              <span className="text-neutral-500">HONORS</span>
            </div>

            {/* Rank Insignia */}
            <div className="my-auto py-2 flex flex-col items-center justify-center">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 font-mono tracking-tighter">
                #113
              </div>
              <div className="text-[9px] font-mono uppercase text-neutral-400 tracking-wider mt-1">
                DDCET COMPETITIVE RANK
              </div>
              <div className="mt-2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[9px] font-mono text-amber-300 font-semibold">
                ALL ROUNDER RECOGNITION
              </div>
            </div>

            <div className="text-[9px] font-mono text-neutral-500 flex justify-between">
              <span>TOP PERCENTILE</span>
              <span className="text-amber-400">BALANCED EXCELLENCE</span>
            </div>
          </div>
        )
    }
  }

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-label={`${experience.role} at ${experience.company}`}
      onClick={() => {
        if (!isActive) onSelect(cardIndex)
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-x-0 mx-auto w-full max-w-4xl rounded-2xl md:rounded-3xl border transition-all duration-500 select-none ${
        isActive
          ? 'cursor-default bg-[#07090e]/95 border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
          : 'cursor-pointer bg-[#050609]/85 border-white/[0.06] hover:border-cyan-500/30'
      }`}
      style={{
        zIndex,
        opacity,
        transform: isReducedMotion
          ? `translateY(${translateY}px) scale(${scale})`
          : `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale}) rotateX(${
              isActive ? tilt.rotateX : 0
            }deg) rotateY(${isActive ? tilt.rotateY : 0}deg)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
    >
      {/* Interactive Cursor Spotlight (Active Card Only) */}
      {isActive && !isReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl md:rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${spotlight.x}% ${spotlight.y}%, rgba(6,182,212,${spotlight.opacity}), transparent 70%)`,
          }}
        />
      )}

      {/* Large Clipped Background Index Number (Editorial Aesthetic) */}
      <div className="pointer-events-none absolute -top-8 -right-3 sm:-right-4 text-7xl sm:text-8xl md:text-9xl font-black font-mono tracking-tighter text-white/[0.03] select-none">
        {experience.index}
      </div>

      <div className="relative p-5 sm:p-7 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
        {/* Visual Media Area (35-42% width on desktop) */}
        <div className="w-full md:w-[38%] flex-shrink-0 flex flex-col justify-center">
          {renderVisual()}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {/* Header Row: Classification & Period */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase">
                  {experience.classification}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-[10px] font-mono text-neutral-300">
                {experience.period}
              </span>
            </div>

            {/* Role & Company */}
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {experience.role}
            </h3>
            <div className="text-xs sm:text-sm font-mono text-neutral-400 mt-1 flex items-center space-x-1.5">
              <span>@</span>
              <span className="text-cyan-300 font-semibold">{experience.company}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {experience.shortDescription}
          </p>

          {/* Key Contributions Preview */}
          <div className="space-y-1.5 py-1">
            <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-semibold">
              CORE CONTRIBUTIONS
            </div>
            <ul className="space-y-1 text-xs text-neutral-300 font-sans">
              {experience.contributions.slice(0, 2).map((contrib, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-0.5 flex-shrink-0 text-xs">▹</span>
                  <span className="line-clamp-1">{contrib}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies Chips */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center flex-wrap gap-1.5">
              {experience.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-cyan-300/90 hover:border-cyan-400/40 hover:-translate-y-0.5 transition-transform cursor-default"
                >
                  {tech}
                </span>
              ))}
              {experience.technologies.length > 5 && (
                <span className="text-[10px] font-mono text-neutral-500">
                  +{experience.technologies.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onExplore(experience)
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200 transition-colors group/btn cursor-pointer py-1"
            >
              <span>EXPLORE EXPERIENCE</span>
              <span className="transition-transform group-hover/btn:translate-x-1">→</span>
            </button>

            {experience.relatedProjectId && onViewProject && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onViewProject(experience.relatedProjectId!)
                }}
                className="text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                VIEW PROJECTS ↗
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
