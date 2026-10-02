export type CameraWaypoint = {
  progress: number
  position: [number, number, number]
  target: [number, number, number]
  fov?: number
}

export type SceneObject = {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  startProgress: number
  endProgress: number
  type: string
}

export type CameraMode = 'TPP' | 'FPP'

export type PortfolioPartId = 'world' | 'professional' | 'showcase' | 'connection'

export type TransitionState = 'idle' | 'entering' | 'active' | 'exiting' | 'complete'

export type CharacterState = 'idle' | 'walking' | 'stopping'

export type WorldState = {
  progress: number
  sectionId: string
  portfolioPart: PortfolioPartId
  transitionState: TransitionState
  characterState: CharacterState
  activeMonitorId: string | null
  focusedProjectId: string | null
  quality: 'low' | 'medium' | 'high' | 'ultra'
  cameraMode: CameraMode
}
