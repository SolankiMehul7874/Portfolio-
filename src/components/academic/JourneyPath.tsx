'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { academicMilestones } from './academicData'

// Control points along 3D space (start anchor, milestones 0..3, and branching exit anchor)
export const TIMELINE_CONTROL_POINTS = [
  new THREE.Vector3(0.4, -1.8, 4.2), // Start approach anchor
  new THREE.Vector3(...academicMilestones[0].position), // 2023: [1.2, -1.0, 2.5]
  new THREE.Vector3(...academicMilestones[1].position), // 2024: [2.2, 0.4, 0.0]
  new THREE.Vector3(...academicMilestones[2].position), // 2025: [1.4, -0.2, -2.8]
  new THREE.Vector3(...academicMilestones[3].position), // 2026: [2.6, 0.9, -5.5]
  new THREE.Vector3(3.5, 1.6, -7.4), // Exit towards skills anchor
]

// Construct the Catmull-Rom spline curve
export const timelineSpline = new THREE.CatmullRomCurve3(
  TIMELINE_CONTROL_POINTS,
  false,
  'catmullrom',
  0.4
)

interface JourneyPathProps {
  journeyProgress: number // 0.0 to 1.0 through the 4 milestones
}

export function JourneyPath({ journeyProgress }: JourneyPathProps) {
  const pulsesRef = useRef<THREE.Points>(null)
  const branchLinesRef = useRef<THREE.LineSegments>(null)

  // 1. Generate smooth tube geometry along the spline and core line
  const { tubeGeometry, coreLine } = useMemo(() => {
    const tube = new THREE.TubeGeometry(timelineSpline, 160, 0.04, 8, false)
    const points = timelineSpline.getPoints(200)
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
    const lineMat = new THREE.LineBasicMaterial({
      color: '#a5f3fc',
      transparent: true,
      opacity: 0.7,
      linewidth: 1.5,
    })
    const lineObj = new THREE.Line(lineGeo, lineMat)
    return { tubeGeometry: tube, coreLine: lineObj }
  }, [])

  // 2. Generate moving photon pulses flowing along the path
  const pulseCount = 36
  const { pulsePositions, pulsePhases } = useMemo(() => {
    const pos = new Float32Array(pulseCount * 3)
    const phases = new Float32Array(pulseCount)
    for (let i = 0; i < pulseCount; i++) {
      phases[i] = i / pulseCount
      const pt = timelineSpline.getPointAt(phases[i])
      pos[i * 3] = pt.x
      pos[i * 3 + 1] = pt.y
      pos[i * 3 + 2] = pt.z
    }
    return { pulsePositions: pos, pulsePhases: phases }
  }, [pulseCount])

  // 3. Generate 2026 branching constellation energy lines towards Skills
  const branchingGeometry = useMemo(() => {
    const m2026 = academicMilestones[3].position
    const startPoint = new THREE.Vector3(...m2026)
    const linePoints: THREE.Vector3[] = []

    // 6 branching directions towards skills nodes
    const branchOffsets = [
      new THREE.Vector3(1.2, 0.8, -1.2),  // React / Next.js
      new THREE.Vector3(0.3, 1.4, -1.0),  // Flutter & Dart
      new THREE.Vector3(-0.8, 1.1, -1.4), // Node.js & APIs
      new THREE.Vector3(1.4, -0.4, -1.5), // Rust & Stylus
      new THREE.Vector3(0.6, -1.2, -1.2), // Python ML
      new THREE.Vector3(-0.9, -0.6, -1.6),// Database Systems
    ]

    branchOffsets.forEach((offset) => {
      linePoints.push(startPoint)
      linePoints.push(startPoint.clone().add(offset))
    })

    return new THREE.BufferGeometry().setFromPoints(linePoints)
  }, [])

  // Animate moving energy pulses along the timeline
  useFrame((state) => {
    if (pulsesRef.current) {
      const positions = pulsesRef.current.geometry.attributes.position.array as Float32Array
      const time = state.clock.getElapsedTime() * 0.15

      for (let i = 0; i < pulseCount; i++) {
        const u = (pulsePhases[i] + time) % 1.0
        const pt = timelineSpline.getPointAt(u)
        positions[i * 3] = pt.x
        positions[i * 3 + 1] = pt.y
        positions[i * 3 + 2] = pt.z
      }
      pulsesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (branchLinesRef.current) {
      // Branching lines brighten as user approaches 2026 (journeyProgress > 0.75)
      const branchIntensity = Math.max(0, (journeyProgress - 0.72) / 0.28)
      const mat = branchLinesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = branchIntensity * 0.85
    }
  })

  return (
    <group>
      {/* Outer Glowing Energy Sheath */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          wireframe={false}
        />
      </mesh>

      {/* Inner High-Intensity Core Line */}
      <primitive object={coreLine} />

      {/* Travelling Energy Pulse Particles */}
      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#ffffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2026 Branching Constellation Lines (Transition to Skills) */}
      <lineSegments ref={branchLinesRef} geometry={branchingGeometry}>
        <lineBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          linewidth={2}
        />
      </lineSegments>
    </group>
  )
}
