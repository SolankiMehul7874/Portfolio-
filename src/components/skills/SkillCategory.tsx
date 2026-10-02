'use client'

import type { SkillCategory } from './skillsData'
import { ECOSYSTEM_CATEGORIES } from './skillsData'

interface SkillCategoryProps {
  activeCategory: SkillCategory | 'All'
  onSelectCategory: (category: SkillCategory | 'All') => void
}

export function SkillCategorySwitcher({
  activeCategory,
  onSelectCategory,
}: SkillCategoryProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto select-none">
      <button
        onClick={() => onSelectCategory('All')}
        className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer border ${
          activeCategory === 'All'
            ? 'bg-cyan-500 text-neutral-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'bg-neutral-950/70 hover:bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
        }`}
      >
        ALL ECOSYSTEM
      </button>

      {ECOSYSTEM_CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer border ${
              isActive
                ? 'bg-cyan-500 text-neutral-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-neutral-950/70 hover:bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
