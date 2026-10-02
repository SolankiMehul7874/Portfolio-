'use client'

import React, { useEffect } from 'react'
import { ExperienceItem } from './experienceData'

interface ExperienceDetailsProps {
  experience: ExperienceItem | null
  onClose: () => void
  onViewProject?: (projectId: string) => void
}

export function ExperienceDetails({
  experience,
  onClose,
  onViewProject,
}: ExperienceDetailsProps) {
  // Close modal on Escape key press
  useEffect(() => {
    if (!experience) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [experience, onClose])

  if (!experience) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-experience-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#090b10] border border-white/[0.12] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6 text-neutral-100 animate-pop-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-neutral-400 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="border-b border-white/[0.08] pb-5 pr-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
              {experience.classification}
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-black text-white/20">
              {experience.index}
            </span>
          </div>

          <h2 id="modal-experience-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {experience.role}
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm font-mono text-neutral-400">
            <span className="text-cyan-300 font-semibold">{experience.company}</span>
            <span>•</span>
            <span>{experience.period}</span>
          </div>
        </div>

        {/* Detailed Narrative */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
            NARRATIVE & ARCHITECTURAL SCOPE
          </div>
          <p className="text-sm text-neutral-200 leading-relaxed font-sans">
            {experience.fullDescription}
          </p>
        </div>

        {/* Key Contributions Breakdown */}
        <div className="space-y-2.5">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
            PRODUCTION CONTRIBUTIONS
          </div>
          <ul className="space-y-2">
            {experience.contributions.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-neutral-300">
                <span className="text-cyan-400 mt-1 flex-shrink-0 text-xs">▹</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Breakdown */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
            ENGINEERING STACK
          </div>
          <div className="flex flex-wrap gap-1.5">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-cyan-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
          >
            ← RETURN TO DECK
          </button>

          {experience.relatedProjectId && onViewProject && (
            <button
              onClick={() => {
                onClose()
                onViewProject(experience.relatedProjectId!)
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs font-mono hover:bg-cyan-400 transition-colors cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-1.5"
            >
              <span>VIEW RELATED PROJECT</span>
              <span>↗</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
