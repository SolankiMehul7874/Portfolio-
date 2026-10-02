'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useWorldStore } from '@/store/worldStore'
import {
  ecosystemSkills,
  ECOSYSTEM_CATEGORIES,
  type EcosystemSkill,
  type SkillCategory,
} from './skillsData'
import { SkillDetails } from './SkillDetails'
import { SkillCategorySwitcher } from './SkillCategory'
import { SkillsScene } from './SkillsScene'

interface SkillsSectionProps {
  onTransitionToNext?: () => void
  isActive?: boolean
}

export function SkillsSection({ onTransitionToNext, isActive = true }: SkillsSectionProps) {
  // Quantize progress so SkillsSection only re-evaluates at distinct steps, avoiding Canvas thrashing
  const isMounted = useWorldStore((s) => s.progress >= 0.21 && s.progress <= 0.59)
  const progress = useWorldStore((s) => (isMounted ? Math.round(s.progress * 100) / 100 : 0))
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'All'>('All')
  const [selectedSkill, setSelectedSkill] = useState<EcosystemSkill | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<EcosystemSkill | null>(null)
  const [manualCategory, setManualCategory] = useState<boolean>(false)
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

  // Auto-map scroll progress (0.36 to 0.45) to category focus unless manually overridden
  useEffect(() => {
    if (manualCategory) return
    if (progress < 0.38) {
      setActiveCategory('All')
    } else if (progress < 0.395) {
      setActiveCategory('Frontend & Web')
    } else if (progress < 0.41) {
      setActiveCategory('Backend & APIs')
    } else if (progress < 0.42) {
      setActiveCategory('Mobile & Apps')
    } else if (progress < 0.43) {
      setActiveCategory('Data Science & ML')
    } else if (progress < 0.44) {
      setActiveCategory('Databases & Cloud')
    } else {
      setActiveCategory('Tools & Systems')
    }
  }, [progress, manualCategory])

  // Reset manual category lock after 3 seconds of idle scroll
  useEffect(() => {
    if (manualCategory) {
      const timer = setTimeout(() => {
        setManualCategory(false)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [manualCategory, progress])

  const handleSelectCategory = useCallback((cat: SkillCategory | 'All') => {
    setActiveCategory(cat)
    setManualCategory(true)
  }, [])

  const handleSelectSkill = useCallback((skill: EcosystemSkill) => {
    setSelectedSkill((prev) => (prev?.id === skill.id ? null : skill))
  }, [])

  // Convergence state when approaching stage transition (progress > 0.435)
  const isConverging = progress > 0.438

  // Hero title opacity & scale: prominent on entrance (0.36 - 0.375), then recedes into subtle background
  const heroStyle = useMemo(() => {
    if (progress < 0.375) {
      const t = Math.max(0, (progress - 0.36) / 0.015)
      return {
        opacity: Math.min(1, 0.3 + t * 0.7),
        transform: `translateY(${Math.max(0, (1 - t) * 20)}px) scale(${1 + (1 - t) * 0.1})`,
      }
    }
    // Subdued ambient background watermark
    return {
      opacity: 0.18,
      transform: 'translateY(0) scale(1)',
    }
  }, [progress])

  // Active skill for detail card (either explicitly selected or hovered)
  const activeDetailSkill = selectedSkill || hoveredSkill

  // Reduced motion accessible static layout
  if (reducedMotion) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
        <div className="space-y-1 border-b border-white/[0.08] pb-3">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 02 // TECHNICAL ECOSYSTEM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
            Technical Arsenal
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ECOSYSTEM_CATEGORIES.map((cat) => {
            const catSkills = ecosystemSkills.filter((s) => s.category === cat)
            return (
              <div
                key={cat}
                className="p-4 rounded-2xl bg-neutral-950/80 border border-white/[0.08] space-y-2"
              >
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase">{cat}</h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {catSkills.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none">
      {/* ==================================================== */}
      {/* 1. LARGE HERO EDITORIAL BACKGROUND WATERMARK        */}
      {/* ==================================================== */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center transition-all duration-700 ease-out z-0"
        style={heroStyle}
      >
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white/90 font-sans select-none">
          SKILLS
        </h1>
        <p className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400/80 uppercase mt-1">
          TECHNICAL SKILLS & CORE COMPETENCIES
        </p>
      </div>

      {/* ==================================================== */}
      {/* 2. 3D TECHNICAL NETWORK & DEVELOPER CORE SCENE       */}
      {/* ==================================================== */}
      <SkillsScene
        activeCategory={activeCategory}
        selectedSkill={selectedSkill}
        hoveredSkill={hoveredSkill}
        isConverging={isConverging}
        onSelectSkill={handleSelectSkill}
        onHoverSkill={setHoveredSkill}
        isActive={isActive}
      />

      {/* ==================================================== */}
      {/* 3. FOREGROUND HUD OVERLAYS & INTERACTIVE CONTROLS   */}
      {/* ==================================================== */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none p-2 sm:p-4">
        {/* Top: Category Cluster Switcher */}
        <div className="w-full flex items-center justify-between pointer-events-auto">
          <SkillCategorySwitcher
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />

          <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
            CLICK NODE TO INSPECT • HOVER TO TRACE
          </span>
        </div>

        {/* Center/Bottom-Left: Floating Skill Detail Card */}
        <div className="my-auto py-2 flex items-center justify-start pointer-events-none">
          {activeDetailSkill && (
            <SkillDetails
              skill={activeDetailSkill}
              onSelectSkill={handleSelectSkill}
              onClose={() => {
                setSelectedSkill(null)
                setHoveredSkill(null)
              }}
            />
          )}
        </div>

        {/* Bottom Bar: Action & Guidance */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] font-mono text-neutral-500 pointer-events-auto">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400">ECOSYSTEM:</span>
            <span>{ecosystemSkills.length} CORE TECHNOLOGIES & TOOLS</span>
          </div>

          {onTransitionToNext && (
            <button
              onClick={onTransitionToNext}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1 cursor-pointer font-bold"
            >
              <span>VIEW WORK EXPERIENCE</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
