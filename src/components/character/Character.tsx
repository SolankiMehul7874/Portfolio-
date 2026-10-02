'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorldStore } from '@/store/worldStore'
import { characterPath } from '@/data/world'
import { interpolatePathPoint } from '@/lib/utils'

// High-Fidelity Anatomical Human Character with Cinematic Techwear & Natural Walking Kinematics
function ProceduralCharacter({ isMovingRef, velocityRef: velRef }: { isMovingRef: { current: boolean }; velocityRef: { current: number } }) {
  const groupRef = useRef<THREE.Group>(null)
  const walkPhase = useRef(0)

  // Sub-articulations for realistic human kinematics
  const pelvisRef = useRef<THREE.Group>(null)
  const spineRef = useRef<THREE.Group>(null)
  const chestRef = useRef<THREE.Group>(null)
  const neckRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)

  // Legs & Feet
  const leftThighRef = useRef<THREE.Group>(null)
  const rightThighRef = useRef<THREE.Group>(null)
  const leftShinRef = useRef<THREE.Group>(null)
  const rightShinRef = useRef<THREE.Group>(null)
  const leftFootRef = useRef<THREE.Group>(null)
  const rightFootRef = useRef<THREE.Group>(null)

  // Arms & Hands
  const leftClavicleRef = useRef<THREE.Group>(null)
  const rightClavicleRef = useRef<THREE.Group>(null)
  const leftUpperArmRef = useRef<THREE.Group>(null)
  const rightUpperArmRef = useRef<THREE.Group>(null)
  const leftForearmRef = useRef<THREE.Group>(null)
  const rightForearmRef = useRef<THREE.Group>(null)

  // Materials: Rich techwear matte fabrics with metallic accents and responsive skin
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x9e6949),
        roughness: 0.55,
        metalness: 0.05,
      }),
    []
  )

  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x111622),
        roughness: 0.78,
        metalness: 0.15,
      }),
    []
  )

  const jacketMainMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x182030),
        roughness: 0.62,
        metalness: 0.28,
      }),
    []
  )

  const jacketAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x273449),
        roughness: 0.52,
        metalness: 0.42,
      }),
    []
  )

  const pantsMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x141b26),
        roughness: 0.72,
        metalness: 0.18,
      }),
    []
  )

  const bootUpperMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x1e2738),
        roughness: 0.48,
        metalness: 0.38,
      }),
    []
  )

  const bootSoleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x080b10),
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  )

  const cyberGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x00f0ff),
      }),
    []
  )

  const fppBlend = useRef(0)
  const walkBlend = useRef(0)
  const idlePhase = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const isMoving = isMovingRef.current
    const velocity = velRef.current

    // Modulate body visibility based on FPP transition to prevent near-plane clipping
    const cameraMode = useWorldStore.getState().cameraMode
    const targetFpp = cameraMode === 'FPP' ? 1.0 : 0.0
    fppBlend.current = THREE.MathUtils.lerp(fppBlend.current, targetFpp, 1 - Math.exp(-8 * delta))
    const inFPP = fppBlend.current > 0.65

    if (headRef.current) headRef.current.visible = !inFPP
    if (neckRef.current) neckRef.current.visible = !inFPP
    if (chestRef.current) chestRef.current.visible = !inFPP
    if (spineRef.current) spineRef.current.visible = !inFPP
    if (leftClavicleRef.current) leftClavicleRef.current.visible = !inFPP
    if (rightClavicleRef.current) rightClavicleRef.current.visible = !inFPP
    if (leftUpperArmRef.current) leftUpperArmRef.current.visible = !inFPP
    if (rightUpperArmRef.current) rightUpperArmRef.current.visible = !inFPP

    // Continuous idle breathing (independent from walk locomotion)
    idlePhase.current += delta * 1.6
    const breath = Math.sin(idlePhase.current)

    // Stride frequency - ONLY advance walkPhase when actually moving!
    if (isMoving) {
      const stepSpeed = Math.max(3.8, velocity * 45)
      walkPhase.current += delta * stepSpeed
    }
    const p = walkPhase.current

    // Blend factor: smoothly transition between walk and idle (0 = idle, 1 = walk)
    const walkBlendTarget = isMoving ? 1.0 : 0.0
    // Fast blend in (0.22), fast and crisp return to resting idle pose (0.28)
    const blendSpeed = walkBlendTarget > walkBlend.current ? 0.22 : 0.28
    walkBlend.current = THREE.MathUtils.lerp(
      walkBlend.current,
      walkBlendTarget,
      1 - Math.exp(-blendSpeed * 60 * delta)
    )
    // Snapping deadzone below 0.006 to completely eliminate floating-point residual oscillations
    if (!isMoving && walkBlend.current < 0.008) {
      walkBlend.current = 0
    }
    const wb = walkBlend.current

    // Natural humanoid stride kinematics
    const strideAngle = Math.min(0.58, 0.3 + velocity * 14)
    const armSwing = Math.min(0.48, 0.24 + velocity * 11)

    // 1. Thigh movement - lerp between idle and walk target
    const leftThighSin = Math.sin(p)
    const rightThighSin = Math.sin(p + Math.PI)

    if (leftThighRef.current) {
      const walkX = leftThighSin * strideAngle
      const walkZ = 0.03 + Math.sin(p * 2) * 0.015
      leftThighRef.current.rotation.x = THREE.MathUtils.lerp(0, walkX, wb)
      leftThighRef.current.rotation.z = THREE.MathUtils.lerp(0.03, walkZ, wb)
    }
    if (rightThighRef.current) {
      const walkX = rightThighSin * strideAngle
      const walkZ = -0.03 - Math.sin(p * 2) * 0.015
      rightThighRef.current.rotation.x = THREE.MathUtils.lerp(0, walkX, wb)
      rightThighRef.current.rotation.z = THREE.MathUtils.lerp(-0.03, walkZ, wb)
    }

    // 2. Knee flexion
    if (leftShinRef.current) {
      const kneeBend = leftThighSin < 0 ? -leftThighSin * 0.85 : 0.06
      leftShinRef.current.rotation.x = THREE.MathUtils.lerp(0.04, kneeBend, wb)
    }
    if (rightShinRef.current) {
      const kneeBend = rightThighSin < 0 ? -rightThighSin * 0.85 : 0.06
      rightShinRef.current.rotation.x = THREE.MathUtils.lerp(0.04, kneeBend, wb)
    }

    // 3. Foot roll & ankle articulation
    if (leftFootRef.current) {
      leftFootRef.current.rotation.x = THREE.MathUtils.lerp(0, -leftThighSin * 0.35 + 0.05, wb)
    }
    if (rightFootRef.current) {
      rightFootRef.current.rotation.x = THREE.MathUtils.lerp(0, -rightThighSin * 0.35 + 0.05, wb)
    }

    // 4. Pelvic list & bounce
    if (pelvisRef.current) {
      const walkBounce = 0.96 + Math.abs(Math.sin(p)) * 0.045
      const idleBounce = 0.96 + breath * 0.006
      pelvisRef.current.position.y = THREE.MathUtils.lerp(idleBounce, walkBounce, wb)
      pelvisRef.current.rotation.z = THREE.MathUtils.lerp(0, Math.sin(p) * 0.03, wb)
      pelvisRef.current.rotation.y = THREE.MathUtils.lerp(0, -Math.sin(p) * 0.06, wb)
    }

    // 5. Torso / Spine
    if (spineRef.current) {
      spineRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.sin(p) * 0.07, wb)
      spineRef.current.rotation.z = THREE.MathUtils.lerp(0, -Math.sin(p) * 0.025, wb)
      spineRef.current.rotation.x = THREE.MathUtils.lerp(0.02 + breath * 0.012, 0.04, wb)
    }

    // 6. Arm swing
    if (leftUpperArmRef.current) {
      leftUpperArmRef.current.rotation.x = THREE.MathUtils.lerp(0.06, Math.sin(p + Math.PI) * armSwing, wb)
      leftUpperArmRef.current.rotation.z = THREE.MathUtils.lerp(-0.08, -0.09 + Math.cos(p) * 0.03, wb)
    }
    if (rightUpperArmRef.current) {
      rightUpperArmRef.current.rotation.x = THREE.MathUtils.lerp(0.06, Math.sin(p) * armSwing, wb)
      rightUpperArmRef.current.rotation.z = THREE.MathUtils.lerp(0.08, 0.09 - Math.cos(p) * 0.03, wb)
    }

    // Forearm elbow bend
    if (leftForearmRef.current) {
      const fwd = Math.sin(p + Math.PI)
      const walkRx = fwd > 0 ? 0.35 + fwd * 0.45 : 0.2
      leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(0.25, walkRx, wb)
    }
    if (rightForearmRef.current) {
      const fwd = Math.sin(p)
      const walkRx = fwd > 0 ? 0.35 + fwd * 0.45 : 0.2
      rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(0.25, walkRx, wb)
    }

    // 7. Head
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(0, -Math.sin(p) * 0.02, wb)
      headRef.current.rotation.z = 0
      headRef.current.rotation.x = THREE.MathUtils.lerp(-0.02, 0, wb)
    }
  })

  return (
    <group ref={groupRef} name="proceduralCharacter" castShadow>
      {/* ========================================================= */}
      {/* 1. PELVIS & LOWER TRUNK ROOT                             */}
      {/* ========================================================= */}
      <group ref={pelvisRef} position={[0, 0.96, 0]}>
        {/* Anatomical Hip Core */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.15, 0.16, 16]} />
          <primitive object={pantsMaterial} attach="material" />
        </mesh>

        {/* Techwear Utility Belt & Holster Straps */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.045, 16]} />
          <primitive object={jacketAccentMaterial} attach="material" />
        </mesh>
        {/* Belt Buckle Hardware */}
        <mesh position={[0, 0.06, 0.182]}>
          <boxGeometry args={[0.06, 0.035, 0.015]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* ========================================================= */}
        {/* 2. SPINE, TORSO & CHEST                                   */}
        {/* ========================================================= */}
        <group ref={spineRef} position={[0, 0.08, 0]}>
          {/* Abdominal Waist */}
          <mesh castShadow position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.165, 0.155, 0.16, 16]} />
            <primitive object={jacketMainMaterial} attach="material" />
          </mesh>

          {/* Chest & Ribcage (tapered athletic V-taper) */}
          <group ref={chestRef} position={[0, 0.26, 0]}>
            {/* Upper Chest / Tactical Parka Body */}
            <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.22, 0.175, 0.26, 18]} />
              <primitive object={jacketMainMaterial} attach="material" />
            </mesh>

            {/* Front Chest Armor Plates / Pockets */}
            <mesh position={[-0.09, 0.08, 0.18]}>
              <boxGeometry args={[0.11, 0.14, 0.03]} />
              <primitive object={jacketAccentMaterial} attach="material" />
            </mesh>
            <mesh position={[0.09, 0.08, 0.18]}>
              <boxGeometry args={[0.11, 0.14, 0.03]} />
              <primitive object={jacketAccentMaterial} attach="material" />
            </mesh>

            {/* Center Front Waterproof Zipper Seam */}
            <mesh position={[0, 0.08, 0.19]}>
              <boxGeometry args={[0.012, 0.28, 0.008]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>

            {/* Back Tech Backpack / Atmospheric Battery Pack */}
            <mesh position={[0, 0.08, -0.19]} castShadow>
              <boxGeometry args={[0.22, 0.28, 0.09]} />
              <primitive object={jacketAccentMaterial} attach="material" />
            </mesh>
            {/* Battery status indicator bar on backpack */}
            <mesh position={[0, 0.16, -0.24]}>
              <boxGeometry args={[0.14, 0.02, 0.01]} />
              <primitive object={cyberGlowMaterial} attach="material" />
            </mesh>

            {/* ========================================================= */}
            {/* 3. NECK & HEAD                                            */}
            {/* ========================================================= */}
            <group ref={neckRef} position={[0, 0.23, 0]}>
              {/* High Techwear Storm Collar */}
              <mesh castShadow position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.105, 0.12, 0.09, 16]} />
                <primitive object={jacketAccentMaterial} attach="material" />
              </mesh>

              {/* Anatomical Neck */}
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.075, 0.08, 0.1, 14]} />
                <primitive object={skinMaterial} attach="material" />
              </mesh>

              {/* Head & Face */}
              <group ref={headRef} position={[0, 0.18, 0]}>
                {/* Cranium / Face Core */}
                <mesh castShadow position={[0, 0, 0.01]}>
                  <sphereGeometry args={[0.115, 20, 20]} />
                  <primitive object={skinMaterial} attach="material" />
                </mesh>

                {/* Jaw & Chin contour */}
                <mesh castShadow position={[0, -0.06, 0.05]} rotation={[0.2, 0, 0]}>
                  <cylinderGeometry args={[0.07, 0.045, 0.09, 12]} />
                  <primitive object={skinMaterial} attach="material" />
                </mesh>

                {/* Stylized Modern Textured Hair */}
                <mesh castShadow position={[0, 0.06, -0.01]}>
                  <sphereGeometry args={[0.125, 18, 18]} />
                  <primitive object={hairMaterial} attach="material" />
                </mesh>
                {/* Hair sweep front volume */}
                <mesh castShadow position={[0, 0.09, 0.05]} rotation={[-0.3, 0, 0]}>
                  <boxGeometry args={[0.14, 0.05, 0.1]} />
                  <primitive object={hairMaterial} attach="material" />
                </mesh>

                {/* Sleek Neural Cyber Visor / Headset Band */}
                <mesh position={[0, 0.01, 0.095]}>
                  <cylinderGeometry args={[0.12, 0.12, 0.025, 16, 1, true, -Math.PI / 2.8, Math.PI / 1.4]} />
                  <primitive object={cyberGlowMaterial} attach="material" />
                </mesh>
                {/* Lateral Audio Comm Node on Left Temple */}
                <mesh position={[-0.122, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.022, 0.022, 0.015, 12]} />
                  <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
                </mesh>
              </group>
            </group>

            {/* ========================================================= */}
            {/* 4. ARMS & HANDS                                           */}
            {/* ========================================================= */}
            {/* Left Shoulder & Arm */}
            <group ref={leftClavicleRef} position={[-0.23, 0.18, 0]}>
              {/* Rounded Deltoid Cap */}
              <mesh castShadow position={[0, 0, 0]}>
                <sphereGeometry args={[0.085, 14, 14]} />
                <primitive object={jacketAccentMaterial} attach="material" />
              </mesh>

              {/* Upper Arm / Bicep */}
              <group ref={leftUpperArmRef} position={[0, -0.04, 0]}>
                <mesh castShadow position={[0, -0.13, 0]}>
                  <cylinderGeometry args={[0.065, 0.055, 0.24, 14]} />
                  <primitive object={jacketMainMaterial} attach="material" />
                </mesh>

                {/* Articulated Elbow Joint */}
                <group ref={leftForearmRef} position={[0, -0.25, 0]}>
                  <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.055, 12, 12]} />
                    <primitive object={jacketAccentMaterial} attach="material" />
                  </mesh>

                  {/* Forearm Sleeve */}
                  <mesh castShadow position={[0, -0.12, 0]}>
                    <cylinderGeometry args={[0.052, 0.042, 0.22, 14]} />
                    <primitive object={jacketMainMaterial} attach="material" />
                  </mesh>

                  {/* Wrist Band & Tactical Glove */}
                  <mesh position={[0, -0.24, 0]}>
                    <cylinderGeometry args={[0.044, 0.038, 0.04, 12]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.3} />
                  </mesh>
                  {/* Detailed Hand */}
                  <mesh position={[0, -0.28, 0.01]} castShadow>
                    <boxGeometry args={[0.045, 0.08, 0.055]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.75} metalness={0.2} />
                  </mesh>
                </group>
              </group>
            </group>

            {/* Right Shoulder & Arm */}
            <group ref={rightClavicleRef} position={[0.23, 0.18, 0]}>
              {/* Rounded Deltoid Cap */}
              <mesh castShadow position={[0, 0, 0]}>
                <sphereGeometry args={[0.085, 14, 14]} />
                <primitive object={jacketAccentMaterial} attach="material" />
              </mesh>

              {/* Upper Arm / Bicep */}
              <group ref={rightUpperArmRef} position={[0, -0.04, 0]}>
                <mesh castShadow position={[0, -0.13, 0]}>
                  <cylinderGeometry args={[0.065, 0.055, 0.24, 14]} />
                  <primitive object={jacketMainMaterial} attach="material" />
                </mesh>

                {/* Articulated Elbow Joint */}
                <group ref={rightForearmRef} position={[0, -0.25, 0]}>
                  <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.055, 12, 12]} />
                    <primitive object={jacketAccentMaterial} attach="material" />
                  </mesh>

                  {/* Forearm Sleeve */}
                  <mesh castShadow position={[0, -0.12, 0]}>
                    <cylinderGeometry args={[0.052, 0.042, 0.22, 14]} />
                    <primitive object={jacketMainMaterial} attach="material" />
                  </mesh>

                  {/* Wrist Band & Tactical Glove */}
                  <mesh position={[0, -0.24, 0]}>
                    <cylinderGeometry args={[0.044, 0.038, 0.04, 12]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.3} />
                  </mesh>
                  {/* Detailed Hand */}
                  <mesh position={[0, -0.28, 0.01]} castShadow>
                    <boxGeometry args={[0.045, 0.08, 0.055]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.75} metalness={0.2} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* ========================================================= */}
        {/* 5. LEGS & ARTICULATED FEET                                */}
        {/* ========================================================= */}
        {/* Left Leg */}
        <group ref={leftThighRef} position={[-0.105, -0.04, 0]}>
          {/* Upper Hip Joint */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.085, 14, 14]} />
            <primitive object={pantsMaterial} attach="material" />
          </mesh>

          {/* Muscular Thigh / Cargo Trouser */}
          <mesh castShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.092, 0.075, 0.38, 16]} />
            <primitive object={pantsMaterial} attach="material" />
          </mesh>

          {/* Side Cargo Pocket */}
          <mesh position={[-0.08, -0.18, 0.02]}>
            <boxGeometry args={[0.035, 0.12, 0.09]} />
            <primitive object={jacketAccentMaterial} attach="material" />
          </mesh>

          {/* Knee Joint & Armor Plate */}
          <group ref={leftShinRef} position={[0, -0.39, 0]}>
            <mesh position={[0, 0, 0.015]}>
              <sphereGeometry args={[0.07, 14, 14]} />
              <primitive object={pantsMaterial} attach="material" />
            </mesh>
            {/* Tactical Knee Protector */}
            <mesh position={[0, 0, 0.065]}>
              <boxGeometry args={[0.095, 0.1, 0.03]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
            </mesh>

            {/* Calf & Shin */}
            <mesh castShadow position={[0, -0.21, 0]}>
              <cylinderGeometry args={[0.076, 0.056, 0.4, 16]} />
              <primitive object={pantsMaterial} attach="material" />
            </mesh>

            {/* Ankle & Cyber Sneaker */}
            <group ref={leftFootRef} position={[0, -0.42, 0.03]}>
              {/* Sneaker Upper Body */}
              <mesh castShadow position={[0, 0.03, 0.03]}>
                <boxGeometry args={[0.105, 0.08, 0.22]} />
                <primitive object={bootUpperMaterial} attach="material" />
              </mesh>
              {/* Tapered Toe Cap */}
              <mesh castShadow position={[0, 0.015, 0.12]}>
                <boxGeometry args={[0.095, 0.05, 0.08]} />
                <primitive object={bootUpperMaterial} attach="material" />
              </mesh>
              {/* Sneaker Chunky Sole with Traction */}
              <mesh position={[0, -0.025, 0.04]} receiveShadow>
                <boxGeometry args={[0.115, 0.035, 0.26]} />
                <primitive object={bootSoleMaterial} attach="material" />
              </mesh>
              {/* Cyan Sole Accent Stripe */}
              <mesh position={[0, -0.02, 0.04]}>
                <boxGeometry args={[0.118, 0.008, 0.24]} />
                <primitive object={cyberGlowMaterial} attach="material" />
              </mesh>
            </group>
          </group>
        </group>

        {/* Right Leg */}
        <group ref={rightThighRef} position={[0.105, -0.04, 0]}>
          {/* Upper Hip Joint */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.085, 14, 14]} />
            <primitive object={pantsMaterial} attach="material" />
          </mesh>

          {/* Muscular Thigh / Cargo Trouser */}
          <mesh castShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.092, 0.075, 0.38, 16]} />
            <primitive object={pantsMaterial} attach="material" />
          </mesh>

          {/* Side Cargo Pocket */}
          <mesh position={[0.08, -0.18, 0.02]}>
            <boxGeometry args={[0.035, 0.12, 0.09]} />
            <primitive object={jacketAccentMaterial} attach="material" />
          </mesh>

          {/* Knee Joint & Armor Plate */}
          <group ref={rightShinRef} position={[0, -0.39, 0]}>
            <mesh position={[0, 0, 0.015]}>
              <sphereGeometry args={[0.07, 14, 14]} />
              <primitive object={pantsMaterial} attach="material" />
            </mesh>
            {/* Tactical Knee Protector */}
            <mesh position={[0, 0, 0.065]}>
              <boxGeometry args={[0.095, 0.1, 0.03]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
            </mesh>

            {/* Calf & Shin */}
            <mesh castShadow position={[0, -0.21, 0]}>
              <cylinderGeometry args={[0.076, 0.056, 0.4, 16]} />
              <primitive object={pantsMaterial} attach="material" />
            </mesh>

            {/* Ankle & Cyber Sneaker */}
            <group ref={rightFootRef} position={[0, -0.42, 0.03]}>
              {/* Sneaker Upper Body */}
              <mesh castShadow position={[0, 0.03, 0.03]}>
                <boxGeometry args={[0.105, 0.08, 0.22]} />
                <primitive object={bootUpperMaterial} attach="material" />
              </mesh>
              {/* Tapered Toe Cap */}
              <mesh castShadow position={[0, 0.015, 0.12]}>
                <boxGeometry args={[0.095, 0.05, 0.08]} />
                <primitive object={bootUpperMaterial} attach="material" />
              </mesh>
              {/* Sneaker Chunky Sole with Traction */}
              <mesh position={[0, -0.025, 0.04]} receiveShadow>
                <boxGeometry args={[0.115, 0.035, 0.26]} />
                <primitive object={bootSoleMaterial} attach="material" />
              </mesh>
              {/* Cyan Sole Accent Stripe */}
              <mesh position={[0, -0.02, 0.04]}>
                <boxGeometry args={[0.118, 0.008, 0.24]} />
                <primitive object={cyberGlowMaterial} attach="material" />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ========================================================= */}
      {/* 6. DYNAMIC GROUND CONTACT SHADOW                          */}
      {/* ========================================================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[0.62, 28]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.62}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

interface CharacterProps {
  progress?: number
}

export function Character({ progress }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const prevProgress = useRef(progress ?? 0)
  // Initialize facing forward along corridor (-Z direction = Math.PI)
  const facingAngle = useRef(Math.PI)
  const velocityRef = useRef(0)
  const isMovingRef = useRef(false)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const currentProgress = useWorldStore.getState().progress
    const pathPoint = interpolatePathPoint(characterPath, currentProgress)

    // Compute instantaneous travel velocity with strict deadzone
    const deltaProgress = Math.abs(currentProgress - prevProgress.current)
    const rawVelocity = deltaProgress / Math.max(delta, 0.001)

    if (rawVelocity < 0.003) {
      // Promptly damp residual momentum to zero
      velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 0, 1 - Math.exp(-22 * delta))
      if (velocityRef.current < 0.004) velocityRef.current = 0
    } else {
      const lerpSpeed = rawVelocity > velocityRef.current ? 0.30 : 0.12
      velocityRef.current = THREE.MathUtils.lerp(
        velocityRef.current,
        rawVelocity,
        1 - Math.exp(-lerpSpeed * 60 * delta)
      )
    }

    // isMoving: active only when velocity exceeds verified deadzone
    isMovingRef.current = velocityRef.current > 0.005

    // Determine forward heading tangent from spline path
    const lookAheadPoint = interpolatePathPoint(characterPath, Math.min(1.0, currentProgress + 0.015))
    const headingDir = new THREE.Vector3().subVectors(lookAheadPoint, pathPoint).normalize()

    if (headingDir.lengthSq() > 0.001) {
      let targetAngle = Math.atan2(headingDir.x, headingDir.z)

      // In TPP, let character body subtly turn toward camera yaw with lag (organic feel)
      const worldState = useWorldStore.getState()
      if (worldState.cameraMode === 'TPP' && Math.abs(worldState.freeLookYaw) > 0.05) {
        targetAngle += worldState.freeLookYaw * 0.22
      }

      const diff = targetAngle - facingAngle.current
      const wrapped = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI
      facingAngle.current += wrapped * (1 - Math.exp(-6 * delta))
    }

    // Smooth position interpolation along 4D corridor
    groupRef.current.position.lerp(pathPoint, 1 - Math.exp(-9 * delta))
    groupRef.current.rotation.y = facingAngle.current

    // In FPP mode (by 4.5% - 5% progress), smoothly hide character mesh for clean unobstructed central first-person view
    if (currentProgress >= 0.040) {
      groupRef.current.visible = false
    } else {
      groupRef.current.visible = true
      if (currentProgress > 0.024) {
        // Taper scale as camera glides into head to prevent near-plane clipping
        const t = (currentProgress - 0.024) / (0.040 - 0.024)
        const scale = 1.0 - t * 0.6
        groupRef.current.scale.set(scale, scale, scale)
      } else {
        groupRef.current.scale.set(1, 1, 1)
      }
    }

    prevProgress.current = currentProgress
  })

  return (
    // Note: rotation is controlled entirely by facingAngle.current via useFrame, no JSX rotation needed
    <group ref={groupRef}>
      <ProceduralCharacter
        isMovingRef={isMovingRef}
        velocityRef={velocityRef}
      />
    </group>
  )
}
