'use client'

import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { EcosystemSkill, SkillCategory } from './skillsData'

interface SkillNodeProps {
  skill: EcosystemSkill
  activeCategory: SkillCategory | 'All'
  selectedSkillId: string | null
  hoveredSkillId: string | null
  onHover: (skill: EcosystemSkill | null) => void
  onSelect: (skill: EcosystemSkill) => void
}

export function SkillNode({
  skill,
  activeCategory,
  selectedSkillId,
  hoveredSkillId,
  onHover,
  onSelect,
}: SkillNodeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [localHover, setLocalHover] = useState(false)

  const isSelected = selectedSkillId === skill.id
  const isHovered = hoveredSkillId === skill.id || localHover
  const isCategoryMatch = activeCategory === 'All' || skill.category === activeCategory

  // Check if this skill is related to the hovered or selected skill
  const isRelated = useMemo(() => {
    if (!selectedSkillId && !hoveredSkillId) return false
    const targetId = hoveredSkillId || selectedSkillId
    return skill.relatedSkillIds.includes(targetId!)
  }, [skill.relatedSkillIds, selectedSkillId, hoveredSkillId])

  // Orbital ring rotation
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isSelected || isHovered ? 1.8 : 0.4)
      ringRef.current.rotation.x += delta * 0.3
    }
  })

  // Dynamic scale and opacity calculations
  const baseScale = isSelected ? 1.45 : isHovered ? 1.3 : isRelated ? 1.15 : isCategoryMatch ? 1.0 : 0.7
  const opacity = isCategoryMatch || isSelected || isRelated ? 1.0 : 0.35
  const baseRadius = skill.status === 'core' ? 0.16 : 0.13

  return (
    <group
      ref={groupRef}
      position={skill.position}
      scale={[baseScale, baseScale, baseScale]}
    >
      {/* 1. Core Sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect(skill)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setLocalHover(true)
          onHover(skill)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setLocalHover(false)
          onHover(null)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[baseRadius, 24, 24]} />
        <meshStandardMaterial
          color={skill.accentColor}
          emissive={skill.accentColor}
          emissiveIntensity={isSelected ? 2.2 : isHovered ? 1.8 : isCategoryMatch ? 0.9 : 0.3}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* 2. Concentric Orbit Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[baseRadius * 1.8, 0.012, 12, 32]} />
        <meshBasicMaterial
          color={skill.accentColor}
          transparent
          opacity={isSelected ? 0.9 : isHovered ? 0.75 : isRelated ? 0.6 : isCategoryMatch ? 0.35 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Soft Local Light when active/selected */}
      {(isSelected || isHovered) && (
        <pointLight
          color={skill.accentColor}
          intensity={2.0}
          distance={2.5}
          decay={2}
        />
      )}

      {/* 4. Billboarded Minimal Label */}
      <Html
        position={[0, baseRadius + 0.18, 0]}
        center
        distanceFactor={11}
        style={{ pointerEvents: 'none' }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation()
            onSelect(skill)
          }}
          className={`pointer-events-auto cursor-pointer transition-all duration-300 select-none px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border whitespace-nowrap flex items-center space-x-1 ${
            isSelected
              ? 'bg-neutral-950 text-white shadow-[0_0_14px_rgba(0,240,255,0.4)] scale-110'
              : isHovered
              ? 'bg-neutral-950 text-white scale-105'
              : isRelated
              ? 'bg-neutral-950/95 text-cyan-300'
              : isCategoryMatch
              ? 'bg-neutral-950/90 text-neutral-300'
              : 'bg-neutral-950/60 text-neutral-500 border-white/[0.06]'
          }`}
          style={{
            borderColor: isSelected || isHovered ? skill.accentColor : 'rgba(255, 255, 255, 0.08)',
            color: isSelected ? '#ffffff' : isHovered || isRelated ? skill.accentColor : undefined,
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: skill.accentColor }}
          />
          <span>{skill.name}</span>
        </div>
      </Html>
    </group>
  )
}
