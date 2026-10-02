'use client'

import { useEffect, useState } from 'react'
import { detectQuality } from '@/lib/utils'
import type { WorldState } from '@/types/world'

export function useDeviceQuality(): WorldState['quality'] {
  const [quality, setQuality] = useState<WorldState['quality']>('high')

  useEffect(() => {
    setQuality(detectQuality())
  }, [])

  return quality
}
