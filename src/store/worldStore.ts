import { create } from 'zustand'
import type { WorldState, PortfolioPartId, TransitionState, CharacterState } from '@/types/world'

type WorldStore = WorldState & {
  rawProgress: number
  progressPercent: number
  projectIndex: number
  projectSlideDir: 'next' | 'prev' | 'none'
  projectSlideTimestamp: number
  isCaseStudyOpen: boolean
  freeLookYaw: number
  freeLookPitch: number
  isAppLoaded: boolean
  canvasReady: boolean
  dreiProgress: number
  setProgress: (progress: number) => void
  setRawProgress: (progress: number) => void
  setSectionId: (sectionId: string) => void
  setPortfolioPart: (part: PortfolioPartId) => void
  setTransitionState: (state: TransitionState) => void
  setCharacterState: (state: CharacterState) => void
  setActiveMonitorId: (id: string | null) => void
  setFocusedProjectId: (id: string | null) => void
  setQuality: (quality: WorldState['quality']) => void
  setProjectIndex: (index: number) => void
  nextProject: () => void
  prevProject: () => void
  setCaseStudyOpen: (open: boolean) => void
  setCameraMode: (mode: WorldState['cameraMode']) => void
  toggleCameraMode: () => void
  setFreeLook: (yaw: number, pitch: number) => void
  resetFreeLook: () => void
  setIsAppLoaded: (loaded: boolean) => void
  setCanvasReady: (ready: boolean) => void
  setDreiProgress: (progress: number) => void
}

export const useWorldStore = create<WorldStore>((set) => ({
  progress: 0,
  rawProgress: 0,
  progressPercent: 0,
  sectionId: 'hero',
  portfolioPart: 'world',
  transitionState: 'idle',
  characterState: 'idle',
  activeMonitorId: null,
  focusedProjectId: null,
  quality: 'high',
  cameraMode: 'TPP',
  projectIndex: 0,
  projectSlideDir: 'none',
  projectSlideTimestamp: 0,
  isCaseStudyOpen: false,
  freeLookYaw: 0,
  freeLookPitch: 0,
  isAppLoaded: false,
  canvasReady: false,
  dreiProgress: 0,
  setProgress: (progress) =>
    set({
      progress,
      rawProgress: progress,
      progressPercent: Math.round(progress * 100),
    }),
  setRawProgress: (rawProgress) => set({ rawProgress }),
  setSectionId: (sectionId) => set({ sectionId }),
  setPortfolioPart: (portfolioPart) => set({ portfolioPart }),
  setTransitionState: (transitionState) => set({ transitionState }),
  setCharacterState: (characterState) => set({ characterState }),
  setActiveMonitorId: (activeMonitorId) => set({ activeMonitorId }),
  setFocusedProjectId: (focusedProjectId) => set({ focusedProjectId }),
  setQuality: (quality) => set({ quality }),
  setProjectIndex: (projectIndex) =>
    set({
      projectIndex,
      projectSlideDir: 'next',
      projectSlideTimestamp: Date.now(),
    }),
  nextProject: () =>
    set((state) => {
      if (Date.now() - state.projectSlideTimestamp < 320) return state
      return {
        projectIndex: (state.projectIndex + 1) % 4,
        projectSlideDir: 'next',
        projectSlideTimestamp: Date.now(),
      }
    }),
  prevProject: () =>
    set((state) => {
      if (Date.now() - state.projectSlideTimestamp < 320) return state
      return {
        projectIndex: (state.projectIndex - 1 + 4) % 4,
        projectSlideDir: 'prev',
        projectSlideTimestamp: Date.now(),
      }
    }),
  setCaseStudyOpen: (isCaseStudyOpen) => set({ isCaseStudyOpen }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  toggleCameraMode: () =>
    set((state) => ({ cameraMode: state.cameraMode === 'TPP' ? 'FPP' : 'TPP' })),
  setFreeLook: (freeLookYaw, freeLookPitch) => set({ freeLookYaw, freeLookPitch }),
  resetFreeLook: () => set({ freeLookYaw: 0, freeLookPitch: 0 }),
  setIsAppLoaded: (isAppLoaded) => set({ isAppLoaded }),
  setCanvasReady: (canvasReady) => set({ canvasReady }),
  setDreiProgress: (dreiProgress) => set({ dreiProgress }),
}))
