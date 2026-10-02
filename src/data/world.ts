import type { CameraWaypoint } from '@/types/world'
import type { PathWaypoint } from '@/lib/utils'

// Cinematic Camera Waypoints tracking the continuous 7-section 4D journey:
// Cinematic Camera Waypoints tracking the continuous 7-section 4D journey:
// Cinematic Camera Waypoints tracking the continuous 7-section 4D journey:
// 01 ABOUT/IDENTITY -> 02 ABOUT ME -> 03 PROJECTS SLIDER -> 04 ACADEMICS -> 05 EXPERIENCE -> 06 SKILLS -> 07 CONTACT
export const cameraWaypoints: CameraWaypoint[] = [
  // 0.00: Section 01 - Full Cinematic Landing establishing shot (full character framing, balanced floating monitors)
  { progress: 0.00, position: [0, 1.85, 5.2], target: [0, 1.30, -2.2], fov: 48 },
  { progress: 0.03, position: [0, 1.78, 3.8], target: [0, 1.35, -2.6], fov: 48 },
  { progress: 0.07, position: [0, 1.62, 1.6], target: [0, 1.48, -3.8], fov: 50 },
  { progress: 0.10, position: [0, 1.62, 0.2], target: [0, 1.62, -5.0], fov: 50 },

  // 0.16: Section 02 - About Me Television (Dead Center Alignment)
  { progress: 0.16, position: [0, 1.65, -4.2], target: [0, 1.68, -6.4], fov: 48 },

  // 0.32: Section 03 - One Large Active Projects CRT TV Slider
  { progress: 0.32, position: [0.0, 1.75, -9.6], target: [0.0, 1.80, -12.0], fov: 46 },

  // 0.50: Section 04 - Academic Journey (LDCE IT & DDCET Rank 113)
  { progress: 0.50, position: [0.0, 1.75, -15.2], target: [0.0, 1.65, -17.5], fov: 46 },

  // 0.66: Section 05 - Professional Experience (InfoLabz & Independent)
  { progress: 0.66, position: [0.0, 1.75, -20.6], target: [0.0, 1.65, -23.0], fov: 46 },

  // 0.82: Section 06 - Technical Skills (Categorized badges, no percentage bars)
  { progress: 0.82, position: [0.0, 1.90, -26.0], target: [0.0, 1.75, -28.5], fov: 48 },

  // 1.00: Section 07 - Final Contact TV
  { progress: 0.95, position: [0.0, 2.05, -31.5], target: [0.0, 2.20, -34.5], fov: 46 },
  { progress: 1.00, position: [0.0, 2.05, -31.8], target: [0.0, 2.20, -34.5], fov: 46 },
]

export type WorldEvent = {
  id: string
  triggerAt: number
  duration: number
  type:
    | 'monitor-activate'
    | 'light-change'
    | 'camera-reveal'
    | 'camera-focus'
    | 'text-reveal'
    | 'environment-morph'
    | 'project-focus'
  targetId?: string
}

export const worldEvents: WorldEvent[] = [
  { id: 'evt-hero-identity', triggerAt: 0.0, duration: 1.0, type: 'monitor-activate', targetId: 'hero-identity-main' },
  { id: 'evt-about', triggerAt: 0.14, duration: 1.2, type: 'monitor-activate', targetId: 'tv-about-main' },
  { id: 'evt-proj-slider', triggerAt: 0.30, duration: 1.2, type: 'monitor-activate', targetId: 'tv-project-slider' },
  { id: 'evt-academic', triggerAt: 0.48, duration: 1.2, type: 'monitor-activate', targetId: 'tv-academic-main' },
  { id: 'evt-exp', triggerAt: 0.64, duration: 1.2, type: 'monitor-activate', targetId: 'tv-experience-infolabz' },
  { id: 'evt-skills', triggerAt: 0.80, duration: 1.2, type: 'monitor-activate', targetId: 'tv-skills-mobile' },
  { id: 'evt-contact', triggerAt: 0.94, duration: 1.2, type: 'monitor-activate', targetId: 'tv-contact-final' },
]

// Character path: straight central walking path down corridor with synchronized positioning
export const characterPath: PathWaypoint[] = [
  { progress: 0.00, position: [0, 0, 0] },
  { progress: 0.07, position: [0, 0, -2.4] },
  { progress: 0.16, position: [0, 0, -4.5] },   // stands centered in front of About Me TV, facing display
  { progress: 0.32, position: [0, 0, -10.2] },  // directly centered in front of Project Slider TV
  { progress: 0.50, position: [0, 0, -16.0] },  // Academic Station (central)
  { progress: 0.66, position: [0, 0, -21.5] },  // Experience Station (central)
  { progress: 0.82, position: [0, 0, -27.0] },  // Skills Amphitheater (central)
  { progress: 0.94, position: [0, 0, -32.5] },  // approaches Final Contact TV
  { progress: 1.00, position: [0, 0, -33.5] },  // stands before Final Contact TV
]
