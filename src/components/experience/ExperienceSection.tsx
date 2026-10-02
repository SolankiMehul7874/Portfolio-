'use client'

import React, { useState, useEffect } from 'react'
import { experiencesData, ExperienceItem } from './experienceData'
import { ExperienceStack } from './ExperienceStack'
import { ExperienceProgress } from './ExperienceProgress'
import { ExperienceDetails } from './ExperienceDetails'

interface ExperienceSectionProps {
  progress?: number // Global scroll progress (0.45 - 0.54)
  onTransitionToProjects?: () => void
}

export function ExperienceSection({
  progress = 0.47,
  onTransitionToProjects,
}: ExperienceSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)
  const [is2DMode, setIs2DMode] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)

  // Detect system prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Sync active card with scroll progress in the 0.45 - 0.53 range
  useEffect(() => {
    if (progress >= 0.45 && progress <= 0.54) {
      // Map 0.45 -> 0.53 to indices 0..3
      const normalized = Math.max(0, Math.min(1, (progress - 0.45) / 0.08))
      const targetIndex = Math.min(
        experiencesData.length - 1,
        Math.floor(normalized * experiencesData.length)
      )
      setActiveIndex((prev) => (prev !== targetIndex ? targetIndex : prev))
    }
  }, [progress])

  // Keyboard controls for experience cards
  useEffect(() => {
    if (selectedExperience) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(experiencesData.length - 1, prev + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedExperience])

  // Handle transition to Part 3 Projects
  const handleAdvanceToProjects = () => {
    setIsCompressing(true)
    setTimeout(() => {
      if (onTransitionToProjects) {
        onTransitionToProjects()
      }
    }, 450)
  }

  return (
    <div className="w-full h-full flex flex-col justify-between py-1 max-w-5xl mx-auto select-none relative">
      {/* ---------------------------------------------------- */}
      {/* SECTION HEADER & EDITORIAL TYPOGRAPHY                */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/[0.08] pb-3 mb-2">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>STAGE 03 // PROFESSIONAL EXPERIENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
            EXPERIENCE & ACHIEVEMENTS
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono mt-1">
            Industry internship, software engineering projects, and academic honors.
          </p>
        </div>

        {/* View Mode Toggle & Direct Transition Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIs2DMode(!is2DMode)}
            className="px-2.5 py-1 rounded-lg border border-white/10 bg-neutral-900/80 text-[10px] font-mono text-neutral-400 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            {is2DMode ? '3D STACK VIEW' : '2D GRID VIEW'}
          </button>

          <button
            onClick={handleAdvanceToProjects}
            className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-[11px] font-mono font-bold text-cyan-300 hover:bg-cyan-500 hover:text-neutral-950 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)] flex items-center space-x-1"
          >
            <span>FEATURED PROJECTS</span>
            <span>›</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MAIN CARDS CONTAINER: 3D STACK OR 2D GRID FALLBACK   */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col justify-center my-auto min-h-[360px] sm:min-h-[400px]">
        {is2DMode ? (
          // 2D Accessible Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-1">
            {experiencesData.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>{exp.index}</span>
                  <span className="text-neutral-400">{exp.period}</span>
                </div>
                <h3 className="text-base font-bold text-white">{exp.role}</h3>
                <div className="text-xs text-cyan-300 font-mono">@{exp.company}</div>
                <p className="text-xs text-neutral-300 line-clamp-2">{exp.shortDescription}</p>
                <button
                  onClick={() => setSelectedExperience(exp)}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  EXPLORE EXPERIENCE →
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Physical 3D Stack View
          <div
            className={`transition-transform duration-500 ${
              isCompressing ? 'scale-90 translate-y-6 opacity-60' : 'scale-100'
            }`}
          >
            <ExperienceStack
              experiences={experiencesData}
              activeIndex={activeIndex}
              onSelectIndex={setActiveIndex}
              onExplore={setSelectedExperience}
              onViewProject={() => {
                if (onTransitionToProjects) onTransitionToProjects()
              }}
              isReducedMotion={isReducedMotion}
            />
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* PROGRESS STEPPER & FOOTER CONTROLS                   */}
      {/* ---------------------------------------------------- */}
      {!is2DMode && (
        <ExperienceProgress
          currentIndex={activeIndex}
          totalCount={experiencesData.length}
          onPrevious={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          onNext={() => setActiveIndex(Math.min(experiencesData.length - 1, activeIndex + 1))}
          onSelectIndex={setActiveIndex}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* EXPANDED DOSSIER MODAL                               */}
      {/* ---------------------------------------------------- */}
      <ExperienceDetails
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
        onViewProject={() => {
          setSelectedExperience(null)
          if (onTransitionToProjects) onTransitionToProjects()
        }}
      />
    </div>
  )
}
