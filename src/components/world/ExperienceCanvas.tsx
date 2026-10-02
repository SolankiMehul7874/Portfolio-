'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useEffect, useRef } from 'react'
import { useProgress } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { Character } from '../character/Character'
import { MonitorField } from '../monitors/MonitorField'
import { WorldEnvironment } from './WorldEnvironment'
import { LightingRig } from './LightingRig'
import * as THREE from 'three'
import { useWorldStore } from '@/store/worldStore'

interface ExperienceCanvasProps {
  onWebGLError?: () => void
}

function CanvasLoadingTracker() {
  const { progress } = useProgress()
  const setCanvasReady = useWorldStore((s) => s.setCanvasReady)
  const setDreiProgress = useWorldStore((s) => s.setDreiProgress)
  const frameCount = useRef(0)

  useEffect(() => {
    setDreiProgress(progress)
  }, [progress, setDreiProgress])

  useFrame(() => {
    frameCount.current += 1
    if (frameCount.current >= 2) {
      setCanvasReady(true)
    }
  })

  return null
}

export function ExperienceCanvas({ onWebGLError }: ExperienceCanvasProps) {
  const quality = useWorldStore((s) => s.quality)
  // Only re-render when Part 1 active boundary changes, not on every continuous sub-pixel
  const isPart1Active = useWorldStore((s) => s.progress < 0.36)
  const isPart1Fading = useWorldStore((s) => s.progress >= 0.22 && s.progress < 0.36)

  const dpr = useMemo(() => {
    return quality === 'low' ? [1, 1] : quality === 'medium' ? [1, 1.25] : [1, 1.5]
  }, [quality])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
      style={{
        visibility: isPart1Active ? 'visible' : 'hidden',
        opacity: !isPart1Active ? 0 : isPart1Fading ? 0.25 : 1,
      }}
    >
      <Canvas
        className="pointer-events-auto"
        shadows={quality !== 'low' ? 'pcf' : false}
        dpr={dpr as [number, number]}
        frameloop={isPart1Active ? 'always' : 'never'}
        camera={{ position: [0, 1.85, 5.2], fov: 48, near: 0.05, far: 100 }}
        gl={{
          antialias: quality !== 'low',
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050608', 1)
          if (gl.shadowMap) {
            gl.shadowMap.type = THREE.PCFShadowMap
          }
        }}
        onError={() => {
          if (onWebGLError) onWebGLError()
        }}
      >
        <Suspense fallback={null}>
          <CanvasLoadingTracker />
          <CameraRig />
          <LightingRig />
          <WorldEnvironment quality={quality} />
          <Character />
          <MonitorField />
        </Suspense>
      </Canvas>
    </div>
  )
}
