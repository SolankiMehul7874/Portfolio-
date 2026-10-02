'use client'

import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useWorldStore } from '@/store/worldStore'
import { academicMilestones } from './academicData'
import { JourneyPath, timelineSpline } from './JourneyPath'
import { JourneyMilestone } from './JourneyMilestone'

interface JourneySceneProps {
  journeyProgress: number // 0.0 to 1.0
  activeIndex: number
  onSelectMilestone: (index: number) => void
  isActive?: boolean
}

/**
 * Camera Controller that travels smoothly along the 3D spline timeline
 * with dynamic look-ahead target and buttery lerp interpolation
 */
function SplineCameraController({ journeyProgress }: { journeyProgress: number }) {
  const { camera } = useThree()
  const currentPos = useRef(new THREE.Vector3())
  const currentTarget = useRef(new THREE.Vector3())
  const isInitialized = useRef(false)

  useFrame((_, delta) => {
    // Read directly from store rawProgress for continuous 60/120 FPS travel without React render latency
    const storeProgress = useWorldStore.getState().rawProgress || useWorldStore.getState().progress
    const continuousJP = Math.max(0, Math.min(1, (storeProgress - 0.26) / 0.12))
    const t = Math.max(0.02, Math.min(0.96, continuousJP))

    // Sample path position along spline
    const pathPoint = timelineSpline.getPointAt(t)

    // Camera offset: placed to the left and back, framing the 3D timeline on the right side of the screen
    const cameraOffset = new THREE.Vector3(-1.4, 0.7, 3.8)
    const targetPos = pathPoint.clone().add(cameraOffset)

    // Dynamic look-ahead target along curve, angled slightly right
    const lookAheadT = Math.min(0.99, t + 0.14)
    const targetLookAt = timelineSpline.getPointAt(lookAheadT).clone().add(new THREE.Vector3(0.3, 0.1, 0))

    if (!isInitialized.current) {
      currentPos.current.copy(targetPos)
      currentTarget.current.copy(targetLookAt)
      camera.position.copy(targetPos)
      camera.lookAt(targetLookAt)
      isInitialized.current = true
      return
    }

    // Smooth lerp camera movement (approx 60 FPS interpolation)
    const lerpFactor = Math.min(1.0, delta * 4.5)
    currentPos.current.lerp(targetPos, lerpFactor)
    currentTarget.current.lerp(targetLookAt, lerpFactor)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTarget.current)
  })

  return null
}

/**
 * Evolving Cosmic Particles that shift in density and brightness
 * representing educational growth from 2023 (sparse) to 2026 (developed)
 */
function EvolvingCosmos({ journeyProgress }: { journeyProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const particleCount = 280
  const { positions, baseOpacities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const opacities = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2
      opacities[i] = 0.2 + Math.random() * 0.6
    }
    return { positions: pos, baseOpacities: opacities }
  }, [particleCount])

  useFrame((state) => {
    if (pointsRef.current) {
      // Very slow cosmic drift
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02
      // Glow and intensity grow as timeline progresses towards 2026
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.opacity = 0.35 + journeyProgress * 0.45
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#38bdf8"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function JourneyScene({
  journeyProgress,
  activeIndex,
  onSelectMilestone,
  isActive = true,
}: JourneySceneProps) {
  return (
    <div className="absolute inset-0 pointer-events-auto">
      <Canvas
        frameloop={isActive ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.5, 6], fov: 48, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 8, 5]} intensity={1.2} color="#cffafe" />
        <directionalLight position={[-4, -4, -2]} intensity={0.4} color="#38bdf8" />

        {/* 3D Spline Path */}
        <JourneyPath journeyProgress={journeyProgress} />

        {/* 3D Milestone Nodes */}
        {academicMilestones.map((milestone, idx) => (
          <JourneyMilestone
            key={milestone.id}
            milestone={milestone}
            index={idx}
            activeIndex={activeIndex}
            onSelect={onSelectMilestone}
          />
        ))}

        {/* Evolving Background Particle Cosmos */}
        <EvolvingCosmos journeyProgress={journeyProgress} />

        {/* Camera Spline Travel Rig */}
        <SplineCameraController journeyProgress={journeyProgress} />
      </Canvas>
    </div>
  )
}
