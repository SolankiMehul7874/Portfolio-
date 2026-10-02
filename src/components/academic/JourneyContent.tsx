'use client'

import { useEffect, useState } from 'react'
import type { AcademicMilestone } from './academicData'

interface JourneyContentProps {
  milestone: AcademicMilestone
  currentIndex: number
  totalCount: number
  onTransitionToSkills: () => void
}

export function JourneyContent({
  milestone,
  currentIndex,
  totalCount,
  onTransitionToSkills,
}: JourneyContentProps) {
  const [animating, setAnimating] = useState(false)
  const [displayedMilestone, setDisplayedMilestone] = useState(milestone)
  const [displayedIndex, setDisplayedIndex] = useState(currentIndex)

  // Kinetic transition when milestone changes
  useEffect(() => {
    if (milestone.id !== displayedMilestone.id) {
      setAnimating(true)
      const timeout = setTimeout(() => {
        setDisplayedMilestone(milestone)
        setDisplayedIndex(currentIndex)
        setAnimating(false)
      }, 160)
      return () => clearTimeout(timeout)
    }
  }, [milestone, currentIndex, displayedMilestone.id])

  const formattedNum = String(displayedIndex + 1).padStart(2, '0')
  const formattedTotal = String(totalCount).padStart(2, '0')
  const isFinalMilestone = displayedIndex === totalCount - 1 // 2026 Current

  return (
    <div className="relative w-full max-w-[420px] pointer-events-auto select-none">
      {/* Semi-transparent sleek card with subtle border letting 3D world shine through */}
      <div
        className="p-5 sm:p-6 rounded-2xl backdrop-blur-xl bg-neutral-950/85 border transition-all duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.6)] space-y-3.5"
        style={{
          borderColor: `${displayedMilestone.accentColor}33`,
          boxShadow: `0 0 35px ${displayedMilestone.accentColor}12, 0 16px 45px rgba(0, 0, 0, 0.7)`,
          opacity: animating ? 0.2 : 1,
          transform: animating ? 'translateY(8px) scale(0.99)' : 'translateY(0) scale(1)',
        }}
      >
        {/* Top Header: Milestone Number & Stage Badge */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
          <div className="flex items-center space-x-2">
            <span
              className="font-mono text-xs font-black"
              style={{ color: displayedMilestone.accentColor }}
            >
              {formattedNum} / {formattedTotal}
            </span>
            <div className="h-3 w-[1px] bg-neutral-800" />
            <span className="text-[10px] font-mono text-neutral-400">
              {displayedMilestone.period}
            </span>
          </div>

          <div
            className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border"
            style={{
              backgroundColor: `${displayedMilestone.accentColor}12`,
              borderColor: `${displayedMilestone.accentColor}35`,
              color: displayedMilestone.accentColor,
            }}
          >
            {displayedMilestone.stageName.split('//')[1]?.trim() || displayedMilestone.stageName}
          </div>
        </div>

        {/* Milestone Title & Institution */}
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span
              className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
              style={{ color: displayedMilestone.accentColor }}
            >
              {displayedMilestone.year}
            </span>
            <span className="text-[11px] font-mono text-neutral-400 truncate max-w-[220px]">
              // {displayedMilestone.location}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-white font-sans tracking-tight leading-snug">
            {displayedMilestone.title}
          </h2>

          <div className="text-xs font-mono text-neutral-400 font-medium">
            {displayedMilestone.institution}
          </div>
        </div>

        {/* Description Narrative */}
        <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
          {displayedMilestone.description}
        </p>

        {/* Verified Key Achievements */}
        {displayedMilestone.achievements && (
          <div className="space-y-1 pt-0.5">
            {displayedMilestone.achievements.slice(0, 2).map((ach, i) => (
              <div
                key={i}
                className="flex items-start space-x-2 text-[11px] text-neutral-300 leading-tight"
              >
                <span
                  className="text-[10px] mt-0.5"
                  style={{ color: displayedMilestone.accentColor }}
                >
                  ✦
                </span>
                <span>{ach}</span>
              </div>
            ))}
          </div>
        )}

        {/* Milestone Discipline Skills Chips */}
        <div className="flex flex-wrap gap-1 pt-1">
          {displayedMilestone.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[9px] font-mono text-neutral-300"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* 2026 Special Branching Transition into Skills */}
        {isFinalMilestone && (
          <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
            <button
              onClick={onTransitionToSkills}
              className="w-full group px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-neutral-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer"
            >
              <span>VIEW TECHNICAL SKILLS</span>
              <span className="group-hover:translate-x-1 transition-transform font-sans">
                →
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
