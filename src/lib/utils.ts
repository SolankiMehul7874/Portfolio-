import * as THREE from 'three'

/**
 * Linearly interpolate between two camera waypoints
 */
export function interpolateCameraWaypoints<T extends { progress: number; position: [number, number, number]; target: [number, number, number]; fov?: number }>(
  waypoints: T[],
  progress: number
): { position: THREE.Vector3; target: THREE.Vector3; fov: number } {
  const sorted = [...waypoints].sort((a, b) => a.progress - b.progress)

  if (progress <= sorted[0].progress) {
    return {
      position: new THREE.Vector3(...sorted[0].position),
      target: new THREE.Vector3(...sorted[0].target),
      fov: sorted[0].fov ?? 44,
    }
  }

  if (progress >= sorted[sorted.length - 1].progress) {
    const last = sorted[sorted.length - 1]
    return {
      position: new THREE.Vector3(...last.position),
      target: new THREE.Vector3(...last.target),
      fov: last.fov ?? 44,
    }
  }

  let fromIdx = 0
  for (let i = 0; i < sorted.length - 1; i++) {
    if (progress >= sorted[i].progress && progress <= sorted[i + 1].progress) {
      fromIdx = i
      break
    }
  }

  const from = sorted[fromIdx]
  const to = sorted[fromIdx + 1]
  const t = (progress - from.progress) / (to.progress - from.progress)

  return {
    position: new THREE.Vector3(...from.position).lerp(new THREE.Vector3(...to.position), t),
    target: new THREE.Vector3(...from.target).lerp(new THREE.Vector3(...to.target), t),
    fov: (from.fov ?? 44) + ((to.fov ?? 44) - (from.fov ?? 44)) * t,
  }
}

export type PathWaypoint = { progress: number; position: [number, number, number] }

/**
 * Interpolate along a path based on progress (0-1), supporting both fixed-progress waypoints and uniform segment arrays
 */
export function interpolatePathPoint(
  path: ([number, number, number] | PathWaypoint)[],
  progress: number
): THREE.Vector3 {
  if (!path || path.length === 0) return new THREE.Vector3(0, 0, 0)
  if (path.length === 1) {
    const p = path[0]
    return 'position' in p ? new THREE.Vector3(...p.position) : new THREE.Vector3(...p)
  }

  // If waypoints have explicit progress:
  if ('progress' in path[0]) {
    const sorted = [...(path as PathWaypoint[])].sort((a, b) => a.progress - b.progress)
    if (progress <= sorted[0].progress) return new THREE.Vector3(...sorted[0].position)
    if (progress >= sorted[sorted.length - 1].progress) return new THREE.Vector3(...sorted[sorted.length - 1].position)

    let fromIdx = 0
    for (let i = 0; i < sorted.length - 1; i++) {
      if (progress >= sorted[i].progress && progress <= sorted[i + 1].progress) {
        fromIdx = i
        break
      }
    }
    const from = sorted[fromIdx]
    const to = sorted[fromIdx + 1]
    const denom = Math.max(0.0001, to.progress - from.progress)
    const t = Math.max(0, Math.min(1, (progress - from.progress) / denom))
    return new THREE.Vector3(...from.position).lerp(new THREE.Vector3(...to.position), t)
  }

  // Fallback to uniform segment index array
  const totalSegments = path.length - 1
  const scaledProgress = Math.max(0, Math.min(1, progress)) * totalSegments
  const segIdx = Math.min(Math.floor(scaledProgress), totalSegments - 1)
  const t = scaledProgress - segIdx

  const from = new THREE.Vector3(...(path[segIdx] as [number, number, number]))
  const to = new THREE.Vector3(...(path[segIdx + 1] as [number, number, number]))
  return from.lerp(to, t)
}

/**
 * Damp a value towards a target (per frame)
 */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * delta))
}

/**
 * Detect quality based on device
 */
export function detectQuality(): 'low' | 'medium' | 'high' | 'ultra' {
  if (typeof window === 'undefined') return 'high'
  const gpu = (navigator as { gpu?: unknown }).gpu
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
  if (isMobile) return 'low'
  if (!gpu && !window.WebGL2RenderingContext) return 'medium'
  return 'high'
}
