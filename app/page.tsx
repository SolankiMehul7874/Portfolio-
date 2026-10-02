'use client'

import NextDynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { HUD } from '@/components/ui/HUD'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { AccessibleContent } from '@/components/ui/AccessibleContent'
import { useWorldProgress } from '@/hooks/useWorldProgress'
import { MistTransition } from '@/components/transitions/MistTransition'
import { ProfessionalSection } from '@/components/professional/ProfessionalSection'
import { LiquidTransition } from '@/components/transitions/LiquidTransition'
import { CertificateSection } from '@/components/certificates/CertificateSection'
import { DissolveTransition } from '@/components/transitions/DissolveTransition'
import { ConnectionSection } from '@/components/connection/ConnectionSection'

// Dynamically import 3D WebGL components with ssr: false
const ExperienceCanvas = NextDynamic(
  () =>
    import('@/components/world/ExperienceCanvas').then(
      (mod) => mod.ExperienceCanvas
    ),
  { ssr: false }
)

const ProjectsShowcase = NextDynamic(
  () =>
    import('@/components/showcase/ProjectsShowcase').then(
      (mod) => mod.ProjectsShowcase
    ),
  { ssr: false }
)

export default function Home() {
  const [webGLError, setWebGLError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Initialize Lenis smooth scroll and map progress to four-part state store
  useWorldProgress()

  useEffect(() => {
    setIsMounted(true)
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebGLError(true)
    } catch {
      setWebGLError(true)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050608] text-neutral-100 selection:bg-cyan-500 selection:text-black">
      {/* ==================================================== */}
      {/* INITIAL BOOTUP LOADING SCREEN OVERLAY                */}
      {/* ==================================================== */}
      <LoadingScreen />

      {/* ==================================================== */}
      {/* PART 1 — 4D CINEMATIC WORLD / LANDING                */}
      {/* ==================================================== */}
      {isMounted && !webGLError ? (
        <ExperienceCanvas onWebGLError={() => setWebGLError(true)} />
      ) : (
        /* Atmospheric CSS Fallback if WebGL fails or during SSR */
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#050608] to-black opacity-80" />
      )}

      {isMounted && (
        <>
          {/* ==================================================== */}
          {/* TRANSITION A — PART 1 → PART 2 (ENTERING MIST)       */}
          {/* ==================================================== */}
          <MistTransition />

          {/* ==================================================== */}
          {/* PART 2 — PROFESSIONAL PORTFOLIO                      */}
          {/* Skills + Experience + Academic Journey               */}
          {/* ==================================================== */}
          <ProfessionalSection />

          {/* ==================================================== */}
          {/* TRANSITION B — PART 2 → PART 3 (UI BECOMES LIQUID)   */}
          {/* ==================================================== */}
          <LiquidTransition />

          {/* ==================================================== */}
          {/* PART 3 — EXPERIMENTAL SHOWCASE                       */}
          {/* 3A: WebGL Projects Centerpiece & 3D Spatial Carousel */}
          {/* 3B: 3D Certificate Deck & Verified Achievements     */}
          {/* ==================================================== */}
          <ProjectsShowcase />
          <CertificateSection />

          {/* ==================================================== */}
          {/* TRANSITION C — PART 3 → PART 4 (DISSOLVES)           */}
          {/* ==================================================== */}
          <DissolveTransition />

          {/* ==================================================== */}
          {/* PART 4 — GITHUB + CONTACT DESTINATION                */}
          {/* ==================================================== */}
          <ConnectionSection />

          {/* ==================================================== */}
          {/* GLOBAL CINEMATIC HUD & TELEMETRY                    */}
          {/* ==================================================== */}
          <HUD />

          {/* ==================================================== */}
          {/* ACCESSIBLE DOM NARRATIVE & SCROLL TIMELINE TRACK    */}
          {/* ==================================================== */}
          <AccessibleContent />
        </>
      )}
    </div>
  )
}
