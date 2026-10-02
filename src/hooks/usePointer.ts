'use client'

import { useEffect, useRef } from 'react'

export type PointerState = {
  x: number // -1 to 1 normalized
  y: number // -1 to 1 normalized
}

export function usePointer(): React.RefObject<PointerState> {
  const pointerRef = useRef<PointerState>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      }
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return pointerRef
}
