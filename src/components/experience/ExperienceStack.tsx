'use client'

import React, { useRef, useEffect } from 'react'
import { ExperienceItem } from './experienceData'
import { ExperienceCard } from './ExperienceCard'

interface ExperienceStackProps {
  experiences: ExperienceItem[]
  activeIndex: number
  onSelectIndex: (index: number) => void
  onExplore: (experience: ExperienceItem) => void
  onViewProject?: (projectId: string) => void
  isReducedMotion?: boolean
}

export function ExperienceStack({
  experiences,
  activeIndex,
  onSelectIndex,
  onExplore,
  onViewProject,
  isReducedMotion = false,
}: ExperienceStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number | null>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (activeIndex < experiences.length - 1) {
          onSelectIndex(activeIndex + 1)
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (activeIndex > 0) {
          onSelectIndex(activeIndex - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, experiences.length, onSelectIndex])

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    // Swipe up -> Next card
    if (diff > 45 && activeIndex < experiences.length - 1) {
      onSelectIndex(activeIndex + 1)
    }
    // Swipe down -> Previous card
    else if (diff < -45 && activeIndex > 0) {
      onSelectIndex(activeIndex - 1)
    }

    touchStartY.current = null
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-4xl mx-auto h-[480px] sm:h-[440px] md:h-[400px] flex items-center justify-center"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
      aria-label="Stacked 3D Experience Cards"
    >
      {experiences.map((exp, idx) => (
        <ExperienceCard
          key={exp.id}
          experience={exp}
          cardIndex={idx}
          activeIndex={activeIndex}
          totalCards={experiences.length}
          onSelect={onSelectIndex}
          onExplore={onExplore}
          onViewProject={onViewProject}
          isReducedMotion={isReducedMotion}
        />
      ))}
    </div>
  )
}
