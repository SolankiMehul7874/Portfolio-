'use client'

import { useEffect } from 'react'
import { useWorldStore } from '@/store/worldStore'
import type { PortfolioPartId, TransitionState } from '@/types/world'
import type Lenis from 'lenis'

/**
 * Tracks world progress from Lenis scroll position.
 * Synchronizes four distinct portfolio parts and their cinematic transitions:
 * Part 1: 4D Cinematic World / Landing (0.00 - 0.18)
 * Trans A: Entering Mist (0.18 - 0.26)
 * Part 2: Professional Portfolio (0.26 - 0.54) [0.26-0.35 Skills -> 0.35-0.45 Experience -> 0.45-0.54 Academics]
 * Trans B: Liquid / Displacement (0.54 - 0.60)
 * Part 3: Experimental Showcase (0.60 - 0.88) [0.60-0.75 Projects 3D -> 0.75-0.88 Certifications]
 * Trans C: Dissolve into Connection (0.88 - 0.92)
 * Part 4: GitHub + Contact (0.92 - 1.00)
 */
export function useWorldProgress() {
  const setProgress = useWorldStore((s) => s.setProgress)
  const setSectionId = useWorldStore((s) => s.setSectionId)
  const setPortfolioPart = useWorldStore((s) => s.setPortfolioPart)
  const setTransitionState = useWorldStore((s) => s.setTransitionState)

  useEffect(() => {
    let lenisInstance: Lenis | null = null
    let rafId: number | null = null

    async function init() {
      const { default: LenisClass } = await import('lenis')

      // High-performance lerp smoothing model: immediate tactile response without sluggish trailing
      const lenis = new LenisClass({
        lerp: 0.1,
        wheelMultiplier: 1.05,
        touchMultiplier: 1.25,
        smoothWheel: true,
        syncTouch: false, // Let mobile touch scroll naturally with native momentum physics
        infinite: false,
      })

      // @ts-expect-error Global window instance for cross-component navigation
      window.__lenis = lenis
      lenisInstance = lenis

      let lastProgress = -1
      let lastPart: PortfolioPartId = 'world'
      let lastSection = 'hero'
      let lastTransState: TransitionState = 'idle'
      let lastRenderTime = 0

      lenis.on('scroll', (e) => {
        const rawProgress = e.progress

        // 1. High-frequency update directly on store for 60/120 FPS useFrame consumers without React re-render overhead
        const store = useWorldStore.getState()
        store.rawProgress = rawProgress

        // 2. Throttle React state dispatch to significant change (>= 0.003) or ~30 FPS cadence
        const now = performance.now()
        if (Math.abs(rawProgress - lastProgress) >= 0.003 || now - lastRenderTime > 32) {
          lastProgress = rawProgress
          lastRenderTime = now
          setProgress(rawProgress)
        }

        // 3. Determine discrete parts and section transitions
        let part: PortfolioPartId = 'world'
        let transState: TransitionState = 'idle'
        let section = 'hero'

        if (rawProgress < 0.18) {
          part = 'world'
          transState = 'idle'
          section = 'hero'
        } else if (rawProgress < 0.26) {
          part = 'world'
          transState = 'exiting' // Entering mist transition to Part 2
          section = 'mist-transition'
        } else if (rawProgress < 0.54) {
          part = 'professional'
          transState = 'active'
          if (rawProgress < 0.36) section = 'academics'
          else if (rawProgress < 0.45) section = 'skills'
          else section = 'experience'
        } else if (rawProgress < 0.60) {
          part = 'professional'
          transState = 'exiting' // Liquid transition to Part 3
          section = 'liquid-transition'
        } else if (rawProgress < 0.88) {
          part = 'showcase'
          transState = 'active'
          if (rawProgress < 0.75) {
            section = 'projects'
            const projProgress = (rawProgress - 0.60) / 0.15
            const autoIdx = Math.max(0, Math.min(3, Math.floor(projProgress * 4)))
            if (now - store.projectSlideTimestamp > 800 && store.projectIndex !== autoIdx) {
              store.setProjectIndex(autoIdx)
            }
          } else {
            section = 'certifications'
          }
        } else if (rawProgress < 0.92) {
          part = 'showcase'
          transState = 'exiting' // Dissolve transition to Part 4
          section = 'dissolve-transition'
        } else {
          part = 'connection'
          transState = 'active'
          if (rawProgress < 0.96) section = 'github'
          else section = 'contact'
        }

        // 4. Strictly gate discrete updates to eliminate re-render storms across React subscribers
        if (part !== lastPart) {
          lastPart = part
          setPortfolioPart(part)
        }
        if (transState !== lastTransState) {
          lastTransState = transState
          setTransitionState(transState)
        }
        if (section !== lastSection) {
          lastSection = section
          setSectionId(section)
        }
      })

      function raf(time: number) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      rafId = requestAnimationFrame(raf)
    }

    init()

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      lenisInstance?.destroy()
      // @ts-expect-error cleanup global lenis
      delete window.__lenis
    }
  }, [setProgress, setSectionId, setPortfolioPart, setTransitionState])
}
