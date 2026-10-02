'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorldStore } from '@/store/worldStore'
import { cameraWaypoints, characterPath } from '@/data/world'
import { monitors } from '@/data/monitors'
import { interpolateCameraWaypoints, interpolatePathPoint, damp } from '@/lib/utils'
import { usePointer } from '@/hooks/usePointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Reusable scratch vectors to avoid frame allocations
const _charPos = new THREE.Vector3()
const _charNextPos = new THREE.Vector3()
const _charForward = new THREE.Vector3()
const _tppBasePos = new THREE.Vector3()
const _tppBaseTarget = new THREE.Vector3()
const _tppFinalPos = new THREE.Vector3()
const _tppFinalTarget = new THREE.Vector3()
const _fppBasePos = new THREE.Vector3()
const _fppLookDir = new THREE.Vector3()
const _fppFinalTarget = new THREE.Vector3()
const _interpolatedPos = new THREE.Vector3()
const _interpolatedTarget = new THREE.Vector3()
const _focusedPos = new THREE.Vector3()
const _focusedTarget = new THREE.Vector3()
const _subtlePointer = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)
const _right = new THREE.Vector3(1, 0, 0)

export function CameraRig() {
  const { camera, gl } = useThree()
  const pointerRef = usePointer()
  const reducedMotion = useReducedMotion()

  const currentPos = useRef(new THREE.Vector3(0, 1.85, 5.2))
  const currentTarget = useRef(new THREE.Vector3(0, 1.10, -1.6))
  const currentFov = useRef(48)

  // FPP factor: 0.0 = TPP, 1.0 = FPP
  const fppFactor = useRef(0.0)
  const prevProgress = useRef(0.0)
  const cameraBobPhase = useRef(0.0)
  const cameraBobWeight = useRef(0.0)

  // Keys active
  const keysDown = useRef<Record<string, boolean>>({})

  // Register Keyboard Listeners for accessibility / manual override
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      const key = e.key.toLowerCase()
      keysDown.current[key] = true

      if (key === 'q') {
        useWorldStore.getState().setCameraMode('FPP')
      } else if (key === 'e') {
        useWorldStore.getState().setCameraMode('TPP')
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysDown.current[key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    const worldState = useWorldStore.getState()
    const progress = worldState.progress
    const focusedProjectId = worldState.focusedProjectId

    // 1. Smooth FPP ↔ TPP transition:
    // As progress advances from 1%, 2%, 3%, smoothly transitions into FPP mode.
    // By 4.5% - 5.0%, it is fully in FPP mode so the TV close-ups and corridor entry are seen from first person.
    const targetFppFactor = THREE.MathUtils.smoothstep(progress, 0.01, 0.046)
    const fppTransitionLambda = reducedMotion ? 25 : 14.0
    fppFactor.current = damp(fppFactor.current, targetFppFactor, fppTransitionLambda, delta)

    // Hard ceiling / floor guarantee: 100% FPP at 4.8%-5%+, 0% TPP at 0.5%-
    if (progress >= 0.048) {
      fppFactor.current = 1.0
    } else if (progress <= 0.005) {
      fppFactor.current = 0.0
    }

    // Sync active mode in worldStore
    if (progress >= 0.045 && worldState.cameraMode !== 'FPP') {
      useWorldStore.getState().setCameraMode('FPP')
    } else if (progress < 0.025 && worldState.cameraMode !== 'TPP') {
      useWorldStore.getState().setCameraMode('TPP')
    }

    // 2. Compute Character Position & Heading Tangent (Dead Center along X = 0)
    const charPos = interpolatePathPoint(characterPath, progress)
    _charPos.copy(charPos)
    _charPos.x = 0 // Locked dead-center

    const nextProgress = Math.min(1.0, progress + 0.015)
    const charNextPos = interpolatePathPoint(characterPath, nextProgress)
    _charNextPos.copy(charNextPos)
    _charNextPos.x = 0

    _charForward.subVectors(_charNextPos, _charPos).normalize()
    if (_charForward.lengthSq() < 0.0001) {
      _charForward.set(0, 0, -1)
    }

    // 3. TPP Camera Math (Authored Central Waypoints)
    const { position: tppWayPos, target: tppWayTarget, fov: tppFov } = interpolateCameraWaypoints(
      cameraWaypoints,
      progress
    )
    _tppBasePos.copy(tppWayPos)
    _tppBasePos.x = 0 // Enforce central alignment
    _tppBaseTarget.copy(tppWayTarget)
    _tppBaseTarget.x = 0

    _tppFinalPos.copy(_tppBasePos)
    _tppFinalTarget.copy(_tppBaseTarget)

    // 4. FPP Camera Math: Straight Central View at Character Head/Eye level
    _fppBasePos.copy(_charPos)
    _fppBasePos.x = 0 // Enforce central alignment
    _fppBasePos.y += 1.68 // Natural standing human eye level
    _fppBasePos.addScaledVector(_charForward, 0.18)

    // Locomotion camera bob (only while moving; zero when stationary)
    const deltaProgress = Math.abs(progress - prevProgress.current)
    const isPlayerMoving = deltaProgress > 0.0001
    prevProgress.current = progress

    const targetBobWeight = isPlayerMoving ? 1.0 : 0.0
    cameraBobWeight.current = THREE.MathUtils.lerp(
      cameraBobWeight.current,
      targetBobWeight,
      1 - Math.exp(-14 * delta)
    )

    if (isPlayerMoving) {
      cameraBobPhase.current += delta * 8.0
    }

    if (cameraBobWeight.current > 0.002) {
      const bobY = Math.sin(cameraBobPhase.current * 2) * 0.012 * cameraBobWeight.current
      _fppBasePos.y += bobY
    }

    // Straight forward look ray down -Z (central alignment)
    _fppLookDir.set(0, 0, -1)
    _fppFinalTarget.copy(_fppBasePos).addScaledVector(_fppLookDir, 6.0)
    _fppFinalTarget.x = 0
    _fppFinalTarget.y = 1.76 // Aligned with the center of the TV display

    const fppFov = 48 // Optimal perspective framing for central TV visibility

    // 5. Blend TPP and FPP Perspectives smoothly
    const blend = fppFactor.current
    _interpolatedPos.lerpVectors(_tppFinalPos, _fppBasePos, blend)
    _interpolatedTarget.lerpVectors(_tppFinalTarget, _fppFinalTarget, blend)
    const targetFov = THREE.MathUtils.lerp(tppFov, fppFov, blend)

    // Lateral lock: camera stays locked at central runway
    _interpolatedPos.x = 0
    _interpolatedTarget.x = 0
    _interpolatedPos.y = Math.max(0.35, _interpolatedPos.y)

    // 6. Television Focus Framing Mode (when project case study is open)
    let finalPos = _interpolatedPos
    let finalTarget = _interpolatedTarget
    let finalTargetFov = targetFov

    if (focusedProjectId) {
      const targetMon = monitors.find(
        (m) => m.content.type === 'project' && m.content.projectId === focusedProjectId
      )
      if (targetMon) {
        const monPos = new THREE.Vector3(...targetMon.position)
        const rot = new THREE.Euler(...targetMon.rotation)
        const forwardOffset = new THREE.Vector3(0, 0, 2.3).applyEuler(rot)
        _focusedPos.copy(monPos).add(forwardOffset)
        _focusedTarget.copy(monPos)
        finalPos = _focusedPos
        finalTarget = _focusedTarget
        finalTargetFov = 38
      }
    }

    // 7. Smooth Temporal Damping for cinematic smoothness
    const posLambda = reducedMotion ? 30 : 6.0
    currentPos.current.lerp(finalPos, 1 - Math.exp(-posLambda * delta))
    currentTarget.current.lerp(finalTarget, 1 - Math.exp(-posLambda * delta))
    currentFov.current = damp(currentFov.current, finalTargetFov, posLambda, delta)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTarget.current)

    const perspCam = camera as THREE.PerspectiveCamera
    if (Math.abs(perspCam.fov - currentFov.current) > 0.01) {
      perspCam.fov = currentFov.current
      perspCam.updateProjectionMatrix()
    }
  })

  return null
}
