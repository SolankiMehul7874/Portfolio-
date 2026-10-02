'use client'

import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function useLenis(onScroll?: (progress: number) => void) {
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    let activeLenis: Lenis | null = null

    async function init() {
      const { default: LenisClass } = await import('lenis')

      const lenis = new LenisClass({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenisInstance = lenis
      activeLenis = lenis

      if (onScroll) {
        lenis.on('scroll', (e) => {
          onScroll(e.progress)
        })
      }

      function raf(time: number) {
        lenis.raf(time)
        rafRef.current = requestAnimationFrame(raf)
      }

      rafRef.current = requestAnimationFrame(raf)
    }

    init()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      activeLenis?.destroy()
      lenisInstance = null
    }
  }, [onScroll])

  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}
