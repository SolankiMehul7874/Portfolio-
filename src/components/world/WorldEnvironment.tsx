'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WorldEnvironmentProps {
  quality: 'low' | 'medium' | 'high' | 'ultra'
}

export function WorldEnvironment({ quality }: WorldEnvironmentProps) {
  const dustRef = useRef<THREE.Points>(null)
  const particleCount = quality === 'low' ? 120 : quality === 'medium' ? 240 : 450

  const [particlePositions, particleSpeeds, particlePhases] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const speeds = new Float32Array(particleCount)
    const phases = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = 0.2 + Math.random() * 5.5
      positions[i * 3 + 2] = 4 - Math.random() * 46
      speeds[i] = 0.05 + Math.random() * 0.15
      phases[i] = Math.random() * Math.PI * 2
    }
    return [positions, speeds, phases]
  }, [particleCount])

  useFrame((_, delta) => {
    if (!dustRef.current) return
    const pos = dustRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      particlePhases[i] += delta * particleSpeeds[i]
      // Organic gentle floating drift
      pos[i * 3] += Math.cos(particlePhases[i] * 0.5) * 0.003
      pos[i * 3 + 1] += Math.sin(particlePhases[i]) * 0.003
      // Reset if too low or high
      if (pos[i * 3 + 1] > 6.0) pos[i * 3 + 1] = 0.3
      if (pos[i * 3 + 1] < 0.2) pos[i * 3 + 1] = 5.8
    }
    dustRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group name="worldEnvironment">
      {/* 1. Cinematic atmospheric exponential fog */}
      <fog attach="fog" args={['#040609', 3.5, 42]} />

      {/* 2. Distant Clean Cyberpunk Horizon (placed at z = -46.0 beyond all TV stations so it never intersects the corridor) */}
      <group position={[0, 3.8, -46.0]}>
        <mesh position={[0, 1.5, 0]}>
          <planeGeometry args={[50, 14]} />
          <meshBasicMaterial
            color="#090d16"
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
        {/* Soft celestial horizon halo */}
        <mesh position={[0, -0.2, 0.05]}>
          <circleGeometry args={[5.5, 36]} />
          <meshBasicMaterial
            color="#0369a1"
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, -0.2, 0.08]}>
          <ringGeometry args={[5.2, 5.32, 48]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 3. Dark Industrial Reflective Floor with Subtle Sheen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -20]} receiveShadow>
        <planeGeometry args={[36, 85]} />
        <meshStandardMaterial
          color="#05070a"
          roughness={0.55}
          metalness={0.45}
          dithering
        />
      </mesh>

      {/* 3b. Luminous Walking Path Guide Strips */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.4, 0.003, -19]}>
        <planeGeometry args={[0.04, 78]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.4, 0.003, -19]}>
        <planeGeometry args={[0.04, 78]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} />
      </mesh>

      {/* 4. Subtle runway perspective coordinate grid lines */}
      <gridHelper
        args={[85, 85, 0x1e293b, 0x090d13]}
        position={[0, 0.002, -20]}
        rotation={[0, 0, 0]}
      />

      {/* 5. Atmospheric illuminated floating dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#7dd3fc"
          transparent
          opacity={0.45}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* 6. Structural architectural portal frames along Z-axis */}
      {[-4, -12, -20, -28, -36].map((z, idx) => (
        <group key={z} position={[0, 0, z]}>
          {/* Left vertical pillar */}
          <mesh position={[-4.2, 3, 0]} castShadow>
            <boxGeometry args={[0.22, 6, 0.22]} />
            <meshStandardMaterial color="#090b0e" roughness={0.9} />
          </mesh>
          {/* Right vertical pillar */}
          <mesh position={[4.2, 3, 0]} castShadow>
            <boxGeometry args={[0.22, 6, 0.22]} />
            <meshStandardMaterial color="#090b0e" roughness={0.9} />
          </mesh>
          {/* Overhead industrial cross truss */}
          <mesh position={[0, 6.0, 0]}>
            <boxGeometry args={[8.6, 0.16, 0.22]} />
            <meshStandardMaterial color="#0b0e14" roughness={0.85} />
          </mesh>
          {/* Neon track runner light underneath overhead beam */}
          <mesh position={[0, 5.9, 0]}>
            <boxGeometry args={[7.2, 0.02, 0.04]} />
            <meshBasicMaterial
              color={idx % 2 === 0 ? '#00f0ff' : '#f97316'}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
