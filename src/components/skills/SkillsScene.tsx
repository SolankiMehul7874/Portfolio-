'use client'

import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import {
  ecosystemSkills,
  DEVELOPER_CORE,
  CATEGORY_CAMERA_TARGETS,
  type EcosystemSkill,
  type SkillCategory,
} from './skillsData'
import { SkillNode } from './SkillNode'
import { SkillConnections } from './SkillConnections'

interface SkillsSceneProps {
  activeCategory: SkillCategory | 'All'
  selectedSkill: EcosystemSkill | null
  hoveredSkill: EcosystemSkill | null
  isConverging: boolean
  onSelectSkill: (skill: EcosystemSkill) => void
  onHoverSkill: (skill: EcosystemSkill | null) => void
  isActive?: boolean
}

/**
 * Central Developer Core (MEHUL / DEVELOPER CORE)
 */
function DeveloperCoreNode({ isConverging }: { isConverging: boolean }) {
  const outerRingRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.5
      outerRingRef.current.rotation.x += delta * 0.25
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.8
      innerRingRef.current.rotation.y += delta * 0.4
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.08
      const scale = isConverging ? pulse * 1.5 : pulse
      coreRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group position={DEVELOPER_CORE.position}>
      {/* Glowing Core Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={isConverging ? 3.5 : 2.0}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Concentric Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[0.42, 0.015, 12, 36]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Orbiting Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[0.58, 0.012, 12, 40]} />
        <meshBasicMaterial
          color="#a5f3fc"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central Core Ambient Light */}
      <pointLight color="#00f0ff" intensity={isConverging ? 4.0 : 2.5} distance={4.5} decay={2} />

      {/* Developer Core Badge */}
      <Html position={[0, -0.42, 0]} center distanceFactor={11} style={{ pointerEvents: 'none' }}>
        <div className="select-none text-center whitespace-nowrap">
          <div className="text-[10px] font-mono font-black tracking-widest text-cyan-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
            ◎ {DEVELOPER_CORE.name}
          </div>
          <div className="text-[8px] font-mono text-neutral-400 tracking-wider">
            {DEVELOPER_CORE.tagline}
          </div>
        </div>
      </Html>
    </group>
  )
}

/**
 * Smooth Camera Rig that navigates between clusters with mouse parallax
 */
function EcosystemCameraController({
  activeCategory,
}: {
  activeCategory: SkillCategory | 'All'
}) {
  const { camera, pointer } = useThree()
  const targetCamPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const currentCamPos = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())
  const isInit = useRef(false)

  useFrame((_, delta) => {
    const config = CATEGORY_CAMERA_TARGETS[activeCategory] || CATEGORY_CAMERA_TARGETS.All

    // Subtle pointer parallax displacement
    const parallaxX = pointer.x * 0.25
    const parallaxY = pointer.y * 0.2

    targetCamPos.current.set(
      config.position[0] + parallaxX,
      config.position[1] + parallaxY,
      config.position[2]
    )
    targetLookAt.current.set(...config.lookAt)

    if (!isInit.current) {
      currentCamPos.current.copy(targetCamPos.current)
      currentLookAt.current.copy(targetLookAt.current)
      camera.position.copy(targetCamPos.current)
      camera.lookAt(targetLookAt.current)
      isInit.current = true
      return
    }

    // Smooth silky lerp interpolation
    const lerpRate = Math.min(1.0, delta * 3.5)
    currentCamPos.current.lerp(targetCamPos.current, lerpRate)
    currentLookAt.current.lerp(targetLookAt.current, lerpRate)

    camera.position.copy(currentCamPos.current)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

/**
 * Ambient background cosmic particles
 */
function AmbientCosmicParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions } = useMemo(() => {
    const count = 180
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1
    }
    return { positions: pos }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#38bdf8"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function SkillsScene({
  activeCategory,
  selectedSkill,
  hoveredSkill,
  isConverging,
  onSelectSkill,
  onHoverSkill,
  isActive = true,
}: SkillsSceneProps) {
  return (
    <div className="absolute inset-0 pointer-events-auto">
      <Canvas
        frameloop={isActive ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.6, 6.2], fov: 48, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={1.0} color="#e0f2fe" />
        <directionalLight position={[-4, -5, -2]} intensity={0.4} color="#0284c7" />

        {/* 1. Developer Core */}
        <DeveloperCoreNode isConverging={isConverging} />

        {/* 2. Relationship Line Network & Data Particles */}
        <SkillConnections
          activeCategory={activeCategory}
          selectedSkillId={selectedSkill?.id || null}
          hoveredSkillId={hoveredSkill?.id || null}
        />

        {/* 3. Skill Technology Nodes */}
        {ecosystemSkills.map((skill) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            activeCategory={activeCategory}
            selectedSkillId={selectedSkill?.id || null}
            hoveredSkillId={hoveredSkill?.id || null}
            onHover={onHoverSkill}
            onSelect={onSelectSkill}
          />
        ))}

        {/* 4. Background Star Dust */}
        <AmbientCosmicParticles />

        {/* 5. Smooth Camera Navigation Rig */}
        <EcosystemCameraController activeCategory={activeCategory} />
      </Canvas>
    </div>
  )
}
