'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { academicMilestones } from './academicData'
import dynamic from 'next/dynamic'
import { JourneyContent } from './JourneyContent'
import { JourneyProgress } from './JourneyProgress'
import { JourneyScene } from './JourneyScene'

interface AcademicJourneyProps {
  onTransitionToSkills?: () => void
  isEmbeddedInStage?: boolean
  isActive?: boolean
}

export function AcademicJourney({
  onTransitionToSkills,
  isEmbeddedInStage = false,
  isActive = true,
}: AcademicJourneyProps) {
  // Quantize progress to avoid sub-pixel re-renders
  const isMounted = useWorldStore((s) => s.progress >= 0.21 && s.progress <= 0.59)
  const progress = useWorldStore((s) => (isMounted ? Math.round(s.progress * 100) / 100 : 0))
  const [manualIndex, setManualIndex] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState<boolean>(false)

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  // Map progress (typically 0.26 to 0.38 in Part 2) to journeyProgress (0.0 to 1.0)
  const journeyProgress = useMemo(() => {
    // If progress is outside 0.26 - 0.38, clamp gracefully
    const startP = 0.26
    const endP = 0.38
    if (progress <= startP) return 0.0
    if (progress >= endP) return 1.0
    return (progress - startP) / (endP - startP)
  }, [progress])

  // Active milestone index: mapped from scroll progress, or manually selected
  const activeIndex = useMemo(() => {
    if (manualIndex !== null) return manualIndex
    const total = academicMilestones.length
    const calculated = Math.min(total - 1, Math.floor(journeyProgress * total))
    return calculated
  }, [journeyProgress, manualIndex])

  // Reset manual override when user resumes significant scrolling
  useEffect(() => {
    if (manualIndex !== null) {
      const timer = setTimeout(() => {
        setManualIndex(null)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [journeyProgress, manualIndex])

  const handleSelectMilestone = useCallback((index: number) => {
    setManualIndex(index)
  }, [])

  const handlePrev = useCallback(() => {
    setManualIndex((prev) => {
      const curr = prev !== null ? prev : activeIndex
      return Math.max(0, curr - 1)
    })
  }, [activeIndex])

  const handleNext = useCallback(() => {
    setManualIndex((prev) => {
      const curr = prev !== null ? prev : activeIndex
      return Math.min(academicMilestones.length - 1, curr + 1)
    })
  }, [activeIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext])

  const handleSkillsJump = useCallback(() => {
    if (onTransitionToSkills) {
      onTransitionToSkills()
    } else {
      // @ts-expect-error Global lenis
      if (typeof window !== 'undefined' && window.__lenis) {
        // @ts-expect-error Global lenis
        const maxScroll = window.__lenis.limit || (document.documentElement.scrollHeight - window.innerHeight)
        // Scroll to Skills stage (~0.39 progress)
        // @ts-expect-error Global lenis
        window.__lenis.scrollTo(0.39 * maxScroll, { duration: 1.2 })
      }
    }
  }, [onTransitionToSkills])

  const activeMilestone = academicMilestones[activeIndex]

  // If reduced motion is requested, render a clean, high-clarity static layout
  if (reducedMotion) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 01 // ACADEMIC JOURNEY
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
            Journey Through Time
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {academicMilestones.map((m, idx) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-neutral-950/80 border border-white/[0.08] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold" style={{ color: m.accentColor }}>
                  {m.year} • {m.stageName}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">{m.period}</span>
              </div>
              <h3 className="text-lg font-black text-white">{m.title}</h3>
              <div className="text-xs font-mono text-neutral-300">{m.institution}</div>
              <p className="text-xs text-neutral-400">{m.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {m.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] font-mono text-neutral-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
      {/* ==================================================== */}
      {/* 1. 3D WEBGL SPLINE SCENE & CAMERA RIG                */}
      {/* ==================================================== */}
      <JourneyScene
        journeyProgress={manualIndex !== null ? manualIndex / (academicMilestones.length - 1) : journeyProgress}
        activeIndex={activeIndex}
        onSelectMilestone={handleSelectMilestone}
        isActive={isActive}
      />

      {/* ==================================================== */}
      {/* 2. FOREGROUND OVERLAY: DOSSIER CARD & STEPPER        */}
      {/* ==================================================== */}
      <div className="relative z-10 w-full h-full flex items-center justify-start pointer-events-none px-2 sm:px-6 md:px-8">
        {/* Left Column: Compact Milestone Dossier & Control Stepper */}
        <div className="flex flex-col space-y-2.5 pointer-events-auto max-w-[420px] w-full my-auto">
          <JourneyContent
            milestone={activeMilestone}
            currentIndex={activeIndex}
            totalCount={academicMilestones.length}
            onTransitionToSkills={handleSkillsJump}
          />

          <JourneyProgress
            activeIndex={activeIndex}
            totalCount={academicMilestones.length}
            journeyProgress={journeyProgress}
            onSelectMilestone={handleSelectMilestone}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  )
}
