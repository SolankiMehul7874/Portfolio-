'use client'

import { useRef, useCallback } from 'react'
import type { Certificate } from './certificateData'
import { CertificateCard } from './CertificateCard'

interface CertificateDeckProps {
  certificates: Certificate[]
  activeIndex: number
  fanFactor: number
  onSelect: (index: number) => void
  onExpand: (index: number) => void
}

export function CertificateDeck({
  certificates,
  activeIndex,
  fanFactor,
  onSelect,
  onExpand,
}: CertificateDeckProps) {
  const touchStartX = useRef<number | null>(null)

  // Touch swipe support for mobile/tablet
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const diffX = e.changedTouches[0].clientX - touchStartX.current
      touchStartX.current = null

      // Swiped right -> prev, swiped left -> next
      if (diffX > 45) {
        onSelect((activeIndex - 1 + certificates.length) % certificates.length)
      } else if (diffX < -45) {
        onSelect((activeIndex + 1) % certificates.length)
      }
    },
    [activeIndex, certificates.length, onSelect]
  )

  return (
    <div
      className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] flex items-center justify-center perspective-[1200px]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Cards Deck Container */}
      <div
        className="relative w-[290px] sm:w-[350px] md:w-[390px] aspect-[1.42/1] flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {certificates.map((cert, idx) => (
          <CertificateCard
            key={cert.id}
            certificate={cert}
            index={idx}
            activeIndex={activeIndex}
            fanFactor={fanFactor}
            onClick={() => onSelect(idx)}
            onExpand={() => onExpand(idx)}
          />
        ))}
      </div>
    </div>
  )
}
