'use client'

import { useMemo } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { AcademicJourney } from '@/components/academic/AcademicJourney'
import { SkillsSection } from '@/components/skills/SkillsSection'
import { ExperienceSection } from '@/components/experience/ExperienceSection'

export function ProfessionalSection() {
  // Gate mounting: only subscribe and evaluate when in Part 2 range (0.21 - 0.59)
  const isMounted = useWorldStore((s) => s.progress >= 0.21 && s.progress <= 0.59)
  const progress = useWorldStore((s) => (isMounted ? Math.round(s.progress * 100) / 100 : 0))

  // Discrete stage selection: only changes twice in the entire Part 2
  const stage = useWorldStore((s) =>
    s.progress < 0.36 ? 'academics' : s.progress < 0.45 ? 'skills' : 'experience'
  )

  const isAcademicsStage = stage === 'academics'
  const isSkillsStage = stage === 'skills'
  const isExperienceStage = stage === 'experience'

  // Fade in 0.22 - 0.26, active 0.26 - 0.54, fade out 0.54 - 0.58
  const sectionOpacity = useMemo(() => {
    if (!isMounted) return 0
    if (progress < 0.26) {
      return Math.max(0, (progress - 0.22) / 0.04) // 0 -> 1
    } else if (progress > 0.54) {
      return Math.max(0, 1 - (progress - 0.54) / 0.04) // 1 -> 0
    }
    return 1
  }, [progress, isMounted])

  if (!isMounted || sectionOpacity <= 0.001) return null

  const scrollToPartSection = (targetProgress: number) => {
    // @ts-expect-error global lenis
    if (typeof window !== 'undefined' && window.__lenis) {
      // @ts-expect-error global lenis
      const maxScroll = window.__lenis.limit || (document.documentElement.scrollHeight - window.innerHeight)
      // @ts-expect-error global lenis
      window.__lenis.scrollTo(targetProgress * maxScroll, {
        duration: 0.45,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      })
    }
  }

  return (
    <section
      aria-label="Professional Portfolio Layer"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden flex flex-col justify-between pt-14 pb-12 px-4 sm:px-8 md:px-10 bg-[#050608]/96 text-neutral-100 transition-opacity duration-200 select-none will-change-[opacity,transform]"
      style={{
        opacity: sectionOpacity,
        transform:
          progress > 0.54
            ? `scale(${1 - (progress - 0.54) * 0.4}) translateY(-${(progress - 0.54) * 60}px)`
            : 'scale(1) translateY(0)',
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full justify-between">
        {/* ==================================================== */}
        {/* HEADER & SECTION STEPPER NAV                         */}
        {/* ==================================================== */}
        <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>PART 02 // PROFESSIONAL BACKGROUND</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 font-semibold hidden md:inline">
              {isAcademicsStage ? 'ACADEMIC JOURNEY & MILESTONES' : isSkillsStage ? 'TECHNICAL SKILLS & COMPETENCIES' : 'WORK EXPERIENCE & ACHIEVEMENTS'}
            </span>
          </div>

          {/* In-page jump pills */}
          <div className="flex items-center space-x-1.5 font-mono text-xs">
            <button
              onClick={() => scrollToPartSection(0.28)}
              className={`px-3 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                isAcademicsStage
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              01 // ACADEMICS
            </button>
            <button
              onClick={() => scrollToPartSection(0.38)}
              className={`px-3 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                isSkillsStage
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              02 // SKILLS
            </button>
            <button
              onClick={() => scrollToPartSection(0.48)}
              className={`px-3 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                isExperienceStage
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              03 // EXPERIENCE
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* DYNAMIC SCROLL-DRIVEN STAGE CONTENT                  */}
        {/* ==================================================== */}
        <div className="flex-1 flex items-center justify-center my-1 relative overflow-hidden h-full">
          {/* -------------------------------------------------- */}
          {/* 01. ACADEMIC JOURNEY STAGE (3D SPLINE TIMELINE)    */}
          {/* -------------------------------------------------- */}
          <div
            style={{ visibility: isAcademicsStage ? 'visible' : 'hidden' }}
            className={`w-full h-full flex-1 transition-all duration-300 ease-out ${
              isAcademicsStage
                ? 'opacity-100 scale-100 pointer-events-auto relative z-10'
                : 'opacity-0 scale-95 pointer-events-none absolute inset-0 z-0'
            }`}
          >
            <AcademicJourney
              onTransitionToSkills={() => scrollToPartSection(0.38)}
              isEmbeddedInStage
              isActive={isAcademicsStage}
            />
          </div>

          {/* -------------------------------------------------- */}
          {/* 02. SKILLS STAGE (3D TECHNICAL ECOSYSTEM)          */}
          {/* -------------------------------------------------- */}
          <div
            style={{ visibility: isSkillsStage ? 'visible' : 'hidden' }}
            className={`w-full h-full flex-1 transition-all duration-300 ease-out ${
              isSkillsStage
                ? 'opacity-100 scale-100 pointer-events-auto relative z-10'
                : 'opacity-0 scale-95 pointer-events-none absolute inset-0 z-0'
            }`}
          >
            <SkillsSection
              onTransitionToNext={() => scrollToPartSection(0.48)}
              isActive={isSkillsStage}
            />
          </div>

          {/* -------------------------------------------------- */}
          {/* 03. EXPERIENCE STAGE (3D STACKED CARDS)            */}
          {/* -------------------------------------------------- */}
          <div
            style={{ visibility: isExperienceStage ? 'visible' : 'hidden' }}
            className={`w-full h-full flex-1 pointer-events-auto flex items-center justify-center transition-all duration-300 ease-out ${
              isExperienceStage
                ? 'opacity-100 scale-100 pointer-events-auto relative z-10'
                : 'opacity-0 scale-95 pointer-events-none absolute inset-0 z-0'
            }`}
          >
            <ExperienceSection
              progress={progress}
              onTransitionToProjects={() => scrollToPartSection(0.55)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
