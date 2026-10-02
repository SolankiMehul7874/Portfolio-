'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorldStore } from '@/store/worldStore'

export function LightingRig() {
  const characterRimWarmRef = useRef<THREE.PointLight>(null)
  const characterRimCoolRef = useRef<THREE.PointLight>(null)
  const characterFillRef = useRef<THREE.PointLight>(null)
  const atmosphericHazeLightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    const progress = useWorldStore.getState().progress

    // Primary Z-position of character along the 4D timeline (-37 total depth)
    const charZ = -progress * 37

    // Dynamic Multiverse zone chroma shifting
    // Zone 1 (0.00 - 0.22): Midnight Horizon (Sunset Orange & Cyan)
    // Zone 2 (0.22 - 0.52): Case Studies Archive (Amber Gold & Deep Slate)
    // Zone 3 (0.52 - 0.75): Technical Arsenal (Emerald Green & Electric Blue)
    // Zone 4 (0.75 - 0.92): Timeline & Academics (Violet Fuchsia & Coral)
    // Zone 5 (0.92 - 1.00): Departure Portal (Electric Cyan & Ultraviolet)
    let warmColor = '#f97316'
    let coolColor = '#00f0ff'
    let hazeColor = '#0ea5e9'

    if (progress > 0.90) {
      warmColor = '#8b5cf6'
      coolColor = '#00f0ff'
      hazeColor = '#6366f1'
    } else if (progress > 0.74) {
      warmColor = '#ec4899'
      coolColor = '#3b82f6'
      hazeColor = '#a855f7'
    } else if (progress > 0.50) {
      warmColor = '#10b981'
      coolColor = '#06b6d4'
      hazeColor = '#059669'
    } else if (progress > 0.20) {
      warmColor = '#f59e0b'
      coolColor = '#38bdf8'
      hazeColor = '#d97706'
    }

    // Warm rim light follows slightly behind and above character to carve silhouette
    if (characterRimWarmRef.current) {
      characterRimWarmRef.current.position.set(-1.8, 2.6, charZ + 1.2)
      characterRimWarmRef.current.intensity = 1.8 + Math.sin(progress * Math.PI * 6) * 0.4
      characterRimWarmRef.current.color.set(warmColor)
    }

    // Cool rim light on the opposing side for cinematic dual-chroma contrast
    if (characterRimCoolRef.current) {
      characterRimCoolRef.current.position.set(2.0, 2.2, charZ - 1.0)
      characterRimCoolRef.current.intensity = 1.5
      characterRimCoolRef.current.color.set(coolColor)
    }

    // Dedicated camera-side fill light for character back contours in TPP
    if (characterFillRef.current) {
      characterFillRef.current.position.set(0.3, 2.0, charZ + 2.4)
      characterFillRef.current.intensity = 1.3
    }

    // Atmospheric ground bounce & haze
    if (atmosphericHazeLightRef.current) {
      atmosphericHazeLightRef.current.position.set(0, 0.4, charZ - 3.5)
      atmosphericHazeLightRef.current.intensity = 1.0
      atmosphericHazeLightRef.current.color.set(hazeColor)
    }
  })

  return (
    <group name="lightingRig">
      {/* 1. Low baseline cinematic ambient light (deep midnight navy) */}
      <ambientLight intensity={0.32} color="#050a12" />

      {/* 2. Soft directional key light from above with gentle shadow falloff */}
      <directionalLight
        position={[3, 10, 6]}
        intensity={1.1}
        color="#e2e8f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
      />

      {/* 3. Warm rim light (sunset orange #f97316) carving character silhouette */}
      <pointLight
        ref={characterRimWarmRef}
        position={[-1.8, 2.6, 1.2]}
        intensity={1.8}
        distance={8.0}
        decay={2}
        color="#f97316"
      />

      {/* 4. Cool cyber rim light (cyan #00f0ff) providing cinematic complimentary rim */}
      <pointLight
        ref={characterRimCoolRef}
        position={[2.0, 2.2, -1.0]}
        intensity={1.4}
        distance={7.5}
        decay={2}
        color="#00f0ff"
      />

      {/* 5. Camera-side fill light for crisp character definition in TPP */}
      <pointLight
        ref={characterFillRef}
        position={[0.3, 2.0, 2.4]}
        intensity={1.3}
        distance={6.5}
        decay={2}
        color="#c8d6e5"
      />

      {/* 6. Subtle atmospheric ground haze bounce */}
      <pointLight
        ref={atmosphericHazeLightRef}
        position={[0, 0.4, -3.5]}
        intensity={0.9}
        distance={9.0}
        decay={2}
        color="#0ea5e9"
      />
    </group>
  )
}
