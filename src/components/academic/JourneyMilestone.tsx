'use client'

import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { AcademicMilestone } from './academicData'

interface JourneyMilestoneProps {
  milestone: AcademicMilestone
  index: number
  activeIndex: number
  onSelect: (index: number) => void
}

export function JourneyMilestone({
  milestone,
  index,
  activeIndex,
  onSelect,
}: JourneyMilestoneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  const isActive = index === activeIndex
  const isCompleted = index < activeIndex
  const isUpcoming = index > activeIndex

  // Animate orbital ring rotation & subtle floating
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isActive ? 1.4 : 0.4)
      ringRef.current.rotation.x += delta * 0.2
    }
  })

  // Size and scale transitions based on state
  const targetScale = isActive ? 1.35 : isHovered ? 1.2 : isCompleted ? 0.95 : 0.8
  const baseColor = milestone.accentColor

  return (
    <group
      ref={groupRef}
      position={milestone.position}
      scale={[targetScale, targetScale, targetScale]}
    >
      {/* 1. Milestone Glowing Core Sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect(index)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setIsHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setIsHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[isActive ? 0.22 : 0.16, 24, 24]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={isActive ? 1.8 : isCompleted ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Outer Rotating Orbital Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[isActive ? 0.42 : 0.28, 0.015, 12, 36]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={isActive ? 0.85 : isCompleted ? 0.4 : 0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Soft Local Point Light for Active Node */}
      {isActive && (
        <pointLight
          color={baseColor}
          intensity={2.5}
          distance={3.5}
          decay={2}
        />
      )}

      {/* 4. Sleek Minimal Year Badge in 3D Space */}
      <Html
        position={[0, isActive ? 0.38 : 0.3, 0]}
        center
        distanceFactor={12}
        style={{ pointerEvents: 'none' }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation()
            onSelect(index)
          }}
          className={`pointer-events-auto cursor-pointer transition-all duration-300 select-none px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border backdrop-blur-md whitespace-nowrap flex items-center space-x-1 ${
            isActive
              ? 'bg-neutral-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'bg-neutral-950/70 border-white/10 text-neutral-400 hover:border-white/30'
          }`}
          style={{
            borderColor: isActive ? milestone.accentColor : undefined,
            color: isActive ? milestone.accentColor : undefined,
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: milestone.accentColor }}
          />
          <span>{milestone.year}</span>
        </div>
      </Html>
    </group>
  )
}
