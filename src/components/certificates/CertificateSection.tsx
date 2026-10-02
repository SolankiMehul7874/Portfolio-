'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { certificates } from './certificateData'
import { CertificateDeck } from './CertificateDeck'
import { CertificateDetails } from './CertificateDetails'
import { CertificateProgress } from './CertificateProgress'
import { CertificateViewer } from './CertificateViewer'

export function CertificateSection() {
  // Gate mounting: only subscribe and evaluate when in Part 3 Certifications range (0.73 - 0.91)
  const isMounted = useWorldStore((s) => s.progress >= 0.73 && s.progress <= 0.91)
  const progress = useWorldStore((s) => (isMounted ? Math.round(s.progress * 100) / 100 : 0))
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [viewerOpen, setViewerOpen] = useState<boolean>(false)

  // Fade in during 0.74 - 0.78, fully opaque 0.78 - 0.86, fade out 0.86 - 0.90
  const sectionOpacity = useMemo(() => {
    if (!isMounted) return 0
    if (progress < 0.78) {
      return (progress - 0.74) / 0.04 // 0 -> 1
    } else if (progress > 0.86) {
      return Math.max(0, 1 - (progress - 0.86) / 0.04) // 1 -> 0
    }
    return 1
  }, [progress, isMounted])

  // Scroll-Scrubbed Fan Factor (0.0 = compressed stack, 1.0 = fully fanned out)
  // Progress 0.75 - 0.82 fans the cards out; progress > 0.86 compresses them back into depth
  const fanFactor = useMemo(() => {
    if (!isMounted || progress < 0.76) return 0.15
    if (progress <= 0.81) {
      return (progress - 0.76) / 0.05 // 0 -> 1
    }
    if (progress <= 0.86) return 1.0
    // Compress back as user scrolls towards Part 4
    return Math.max(0.15, 1 - (progress - 0.86) / 0.04)
  }, [progress, isMounted])

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + certificates.length) % certificates.length)
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % certificates.length)
  }, [])

  // Keyboard navigation for certificate deck
  useEffect(() => {
    if (!isMounted || viewerOpen) return
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
  }, [isMounted, viewerOpen, handlePrev, handleNext])

  const activeCert = certificates[activeIndex]

  // Clean early return AFTER all hooks have executed
  if (!isMounted || sectionOpacity <= 0.001) return null

  return (
    <section
      aria-label="3D Certificate Deck & Achievements Section"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden flex flex-col justify-between pt-16 pb-16 px-4 sm:px-8 md:px-12 bg-[#03060a]/96 text-neutral-100 transition-opacity duration-300 select-none will-change-opacity"
      style={{ opacity: sectionOpacity }}
    >
      {/* ==================================================== */}
      {/* 4D AMBIENT BACKGROUND PARTICLES & ORBITAL LINES     */}
      {/* ==================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {/* Soft radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: activeCert.accentColor }}
        />
        {/* Subtle grid mesh */}
        <div className="w-full h-full bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col h-full justify-between relative z-10">
        {/* ==================================================== */}
        {/* SECTION HEADER                                       */}
        {/* ==================================================== */}
        <div className="pointer-events-auto space-y-1.5 border-b border-white/[0.08] pb-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>PART 03 // CERTIFICATIONS & HONORS</span>
            </div>

            <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
              VERIFIED CREDENTIALS // {certificates.length} AWARDS & CERTIFICATES
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
              ACHIEVEMENTS & HONORS
            </h1>
            <p className="text-xs sm:text-sm font-mono text-cyan-300/80">
              A curated collection of verified professional certifications and academic honors.
            </p>
          </div>
        </div>

        {/* ==================================================== */}
        {/* MAIN 3D STAGE: METADATA (LEFT) & DECK (CENTER/RIGHT) */}
        {/* ==================================================== */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto py-2">
          {/* Left Column: Certificate Details & Progress Stepper */}
          <div className="lg:col-span-5 pointer-events-auto flex flex-col justify-center space-y-4">
            <CertificateDetails
              certificate={activeCert}
              currentIndex={activeIndex}
              totalCount={certificates.length}
              onExpand={() => setViewerOpen(true)}
            />

            <CertificateProgress
              currentIndex={activeIndex}
              totalCount={certificates.length}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>

          {/* Right Column: 3D Certificate Deck */}
          <div className="lg:col-span-7 pointer-events-auto flex items-center justify-center">
            <CertificateDeck
              certificates={certificates}
              activeIndex={activeIndex}
              fanFactor={fanFactor}
              onSelect={handleSelect}
              onExpand={() => setViewerOpen(true)}
            />
          </div>
        </div>

        {/* ==================================================== */}
        {/* BOTTOM TELEMETRY & SCROLL GUIDANCE                   */}
        {/* ==================================================== */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] font-mono text-[11px] text-neutral-500">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400">INTERACTION:</span>
            <span>CLICK CARD OR SWIPE TO CYCLE • CLICK TO INSPECT FULLSCREEN</span>
          </div>

          <span className="text-cyan-400 animate-pulse hidden sm:inline">
            SCROLL FORWARD TO ADVANCE TO GITHUB DESTINATION ↓
          </span>
        </div>
      </div>

      {/* Fullscreen Certificate Inspector Lightbox */}
      {viewerOpen && (
        <CertificateViewer
          certificate={activeCert}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </section>
  )
}
