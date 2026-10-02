'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ecosystemSkills, DEVELOPER_CORE, type SkillCategory } from './skillsData'

interface SkillConnectionsProps {
  activeCategory: SkillCategory | 'All'
  selectedSkillId: string | null
  hoveredSkillId: string | null
}

export function SkillConnections({
  activeCategory,
  selectedSkillId,
  hoveredSkillId,
}: SkillConnectionsProps) {
  const pointsRef = useRef<THREE.Points>(null)

  // 1. Compute unique connection pairs and lines geometry
  const { lineGeometry, connectionPaths } = useMemo(() => {
    const skillMap = new Map(ecosystemSkills.map((s) => [s.id, s]))
    const addedPairs = new Set<string>()
    const lines: THREE.Vector3[] = []
    const paths: { start: THREE.Vector3; end: THREE.Vector3; category: SkillCategory }[] = []

    const corePos = new THREE.Vector3(...DEVELOPER_CORE.position)

    // Core spokes to primary category leaders
    const coreLeaders = ['typescript', 'nodejs', 'flutter', 'python-ml', 'mysql-postgres', 'git-github']
    coreLeaders.forEach((id) => {
      const target = skillMap.get(id)
      if (target) {
        const targetPos = new THREE.Vector3(...target.position)
        lines.push(corePos, targetPos)
        paths.push({ start: corePos, end: targetPos, category: target.category })
      }
    })

    // Technical relationships between skills
    ecosystemSkills.forEach((skill) => {
      const startPos = new THREE.Vector3(...skill.position)
      skill.relatedSkillIds.forEach((relId) => {
        const related = skillMap.get(relId)
        if (!related) return
        const pairKey = [skill.id, relId].sort().join('_')
        if (addedPairs.has(pairKey)) return
        addedPairs.add(pairKey)

        const endPos = new THREE.Vector3(...related.position)
        lines.push(startPos, endPos)
        paths.push({ start: startPos, end: endPos, category: skill.category })
      })
    })

    const geo = new THREE.BufferGeometry().setFromPoints(lines)
    return { lineGeometry: geo, connectionPaths: paths }
  }, [])

  // 2. Data pulse particles that travel along connection lines
  const pulseCount = 28
  const { pulsePositions, pulseData } = useMemo(() => {
    const pos = new Float32Array(pulseCount * 3)
    const data: { pathIndex: number; progress: number; speed: number }[] = []

    for (let i = 0; i < pulseCount; i++) {
      const pathIdx = i % connectionPaths.length
      const p = connectionPaths[pathIdx]
      const t = Math.random()
      const pt = new THREE.Vector3().lerpVectors(p.start, p.end, t)
      pos[i * 3] = pt.x
      pos[i * 3 + 1] = pt.y
      pos[i * 3 + 2] = pt.z
      data.push({
        pathIndex: pathIdx,
        progress: t,
        speed: 0.15 + Math.random() * 0.25,
      })
    }

    return { pulsePositions: pos, pulseData: data }
  }, [pulseCount, connectionPaths])

  // Animate travelling data pulses
  useFrame((_, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < pulseCount; i++) {
        const d = pulseData[i]
        d.progress = (d.progress + delta * d.speed) % 1.0
        const p = connectionPaths[d.pathIndex]
        if (p) {
          const pt = new THREE.Vector3().lerpVectors(p.start, p.end, d.progress)
          positions[i * 3] = pt.x
          positions[i * 3 + 1] = pt.y
          positions[i * 3 + 2] = pt.z
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Network Connection Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={activeCategory === 'All' ? 0.25 : 0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Travelling Data Photon Packets */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#00f0ff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
