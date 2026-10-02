'use client'

import type { EcosystemSkill } from './skillsData'
import { ecosystemSkills } from './skillsData'

interface SkillDetailsProps {
  skill: EcosystemSkill | null
  onSelectSkill: (skill: EcosystemSkill) => void
  onClose?: () => void
}

export function SkillDetails({ skill, onSelectSkill, onClose }: SkillDetailsProps) {
  if (!skill) return null

  const skillMap = new Map(ecosystemSkills.map((s) => [s.id, s]))
  const relatedSkills = skill.relatedSkillIds
    .map((id) => skillMap.get(id))
    .filter(Boolean) as EcosystemSkill[]

  return (
    <div className="pointer-events-auto select-none max-w-sm w-full animate-pop-up">
      <div
        className="p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-neutral-950/90 border transition-all duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.7)] space-y-3"
        style={{
          borderColor: `${skill.accentColor}55`,
          boxShadow: `0 0 30px ${skill.accentColor}18, 0 12px 35px rgba(0, 0, 0, 0.7)`,
        }}
      >
        {/* Top: Category & Status */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ color: skill.accentColor }}
          >
            {skill.category}
          </span>

          <div className="flex items-center space-x-1.5">
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${skill.accentColor}12`,
                borderColor: `${skill.accentColor}33`,
                color: skill.accentColor,
              }}
            >
              {skill.status.toUpperCase()}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-white text-xs px-1"
                aria-label="Close skill details"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Title & Projects Evidence */}
        <div className="space-y-0.5">
          <h3 className="text-lg sm:text-xl font-black text-white font-sans tracking-tight">
            {skill.name}
          </h3>
          <div className="text-[11px] font-mono text-cyan-300/90 font-medium">
            Verified across {skill.projectCount} Production Project{skill.projectCount > 1 ? 's' : ''}
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-neutral-300 leading-relaxed">
          {skill.description}
        </p>

        {/* Connected Technical Nodes */}
        {relatedSkills.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
              CONNECTED NODES IN ECOSYSTEM:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {relatedSkills.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectSkill(rel)}
                  className="px-2 py-0.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-[10px] font-mono text-neutral-300 hover:text-white border border-neutral-800 hover:border-cyan-400/40 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: rel.accentColor }}
                  />
                  <span>{rel.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
