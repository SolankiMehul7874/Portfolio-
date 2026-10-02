'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorldStore } from '@/store/worldStore'
import type { MonitorData, ScreenContentType } from '@/data/monitors'
import { projects } from '@/data/projects'
import { siteConfig } from '@/data/site'
import { characterPath } from '@/data/world'
import { interpolatePathPoint } from '@/lib/utils'
import { crtVertexShader, crtFragmentShader, createCRTUniforms } from '@/shaders/crt'

// ── Module-level avatar image singleton ────────────────────────────────────
// Loaded once on the client; reused by every identity screen canvas repaint.
let avatarImgSingleton: HTMLImageElement | null = null
if (typeof window !== 'undefined') {
  const img = new window.Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => { avatarImgSingleton = img }
  img.onerror = () => { avatarImgSingleton = null }
  img.src = '/avatar.jpg'
}

// Dynamic CRT Canvas Painter supporting News Broadcast, TV Error, Broken Screen, Matrix Code, and Project Dossiers
function renderScreenFrame(
  ctx: CanvasRenderingContext2D,
  content: ScreenContentType,
  time: number,
  width = 768,
  height = 576
) {
  // Clear dark CRT background
  ctx.fillStyle = '#040608'
  ctx.fillRect(0, 0, width, height)

  // Outer safety phosphor border
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)'
  ctx.lineWidth = 2
  ctx.strokeRect(20, 20, width - 40, height - 40)

  // Corner guide reticles
  const markLen = 14
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(20, 20 + markLen); ctx.lineTo(20, 20); ctx.lineTo(20 + markLen, 20)
  ctx.moveTo(width - 20 - markLen, 20); ctx.lineTo(width - 20, 20); ctx.lineTo(width - 20, 20 + markLen)
  ctx.moveTo(20, height - 20 - markLen); ctx.lineTo(20, height - 20); ctx.lineTo(20 + markLen, height - 20)
  ctx.moveTo(width - 20 - markLen, height - 20); ctx.lineTo(width - 20, height - 20); ctx.lineTo(width - 20, height - 20 - markLen)
  ctx.stroke()

  const c = content

  // -------------------------------------------------------------
  // 1. LIVE TV NEWS BROADCAST (Requested by user)
  // -------------------------------------------------------------
  if (c.type === 'news') {
    // Top Bulletin header banner
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(20, 20, width - 40, 48)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(20, 20, width - 40, 48)

    // Cyan Status Badge
    ctx.fillStyle = '#0284c7'
    ctx.fillRect(20, 20, 110, 48)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('BULLETIN', 36, 49)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 18px "Impact", "Arial Black", sans-serif'
    ctx.fillText('ENGINEERING UPDATE // FEATURED RELEASE', 144, 51)

    // Rotating Radar / Orbit wireframe in top-right
    const radarX = width - 80
    const radarY = 120
    ctx.strokeStyle = '#00f0ff'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(radarX, radarY, 36, 0, Math.PI * 2)
    ctx.stroke()
    // Sweep line
    const sweepAngle = time * 3.0
    ctx.beginPath()
    ctx.moveTo(radarX, radarY)
    ctx.lineTo(radarX + Math.cos(sweepAngle) * 36, radarY + Math.sin(sweepAngle) * 36)
    ctx.stroke()

    // Main Story Headline
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('FEATURED ARCHITECTURE // RELEASE', 44, 108)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px "Courier New", monospace'
    const hl = c.headline || 'CROSS-PLATFORM & BACKEND ARCHITECTURE'
    if (ctx.measureText(hl).width > width - 180) {
      const words = hl.split(' ')
      const mid = Math.ceil(words.length / 2)
      ctx.fillText(words.slice(0, mid).join(' '), 44, 140)
      ctx.fillText(words.slice(mid).join(' '), 44, 172)
    } else {
      ctx.fillText(hl, 44, 140)
    }

    // Story summary box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
    ctx.fillRect(44, 210, width - 88, 190)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(44, 210, width - 88, 190)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('ENGINEER: MEHUL SOLANKI', 60, 245)
    ctx.fillStyle = '#e2e8f0'
    ctx.font = '13px "Courier New", monospace'
    ctx.fillText('• Mobile Systems : Flutter, Dart & Firebase real-time sync', 60, 280)
    ctx.fillText('• Backend Design : Node.js, Express, REST APIs & JWT Auth', 60, 310)
    ctx.fillText('• Machine Learning: Scikit-learn, Pandas & NumPy data pipelines', 60, 340)
    ctx.fillText('• State Honor   : DDCET Statewide Rank #113 Recognition', 60, 370)

    // Animated Ticker at bottom
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(20, height - 76, width - 40, 56)
    ctx.fillStyle = '#0369a1'
    ctx.fillRect(20, height - 76, 110, 56)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('SYSTEM INFO', 26, height - 42)

    // Crawling text
    const tickerText =
      c.ticker ||
      '• ENGINEERING UPDATE: MEHUL SOLANKI • FLUTTER & ANDROID ARCHITECTURES • SCALABLE REST APIS WITH JWT AUTH • MACHINE LEARNING PIPELINES • DDCET STATE RANK #113 • AVAILABLE FOR OPPORTUNITIES • '
    const tickerSpeed = 80 // pixels per second
    ctx.font = 'bold 14px "Courier New", monospace'
    const fullWidth = ctx.measureText(tickerText).width
    const offsetX = (time * tickerSpeed) % fullWidth

    ctx.save()
    ctx.beginPath()
    ctx.rect(135, height - 76, width - 155, 56)
    ctx.clip()
    ctx.fillStyle = '#e2e8f0'
    ctx.fillText(tickerText, 135 - offsetX, height - 42)
    ctx.fillText(tickerText, 135 - offsetX + fullWidth, height - 42)
    ctx.restore()

  // -------------------------------------------------------------
  // 1.A-1 TABLOID SENSATIONALIST NEWS BROADCAST ("PRIME 24 NEWS")
  // -------------------------------------------------------------
  } else if (c.type === 'tabloid-news') {
    // Red Top Header Banner with gradient
    const headGrad = ctx.createLinearGradient(20, 20, width - 40, 20)
    headGrad.addColorStop(0, '#991b1b')
    headGrad.addColorStop(0.5, '#dc2626')
    headGrad.addColorStop(1, '#991b1b')
    ctx.fillStyle = headGrad
    ctx.fillRect(20, 20, width - 40, 52)
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, width - 40, 52)

    // Pulsing Red "LIVE" Badge
    const isLiveOn = Math.sin(time * 6.5) > -0.2
    ctx.fillStyle = isLiveOn ? '#ef4444' : '#7f1d1d'
    ctx.fillRect(26, 24, 88, 44)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.strokeRect(26, 24, 88, 44)

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(42, 46, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.font = '900 16px "Impact", "Arial Black", sans-serif'
    ctx.fillText('LIVE', 54, 52)

    // Channel Brand: PRIME 24 NEWS
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 24px "Impact", "Arial Black", sans-serif'
    ctx.fillText('PRIME 24 NEWS', 126, 54)

    ctx.fillStyle = '#fef08a'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('// SPECIAL INVESTIGATIVE BROADCAST', 290, 52)

    // Rotating Radar / Satellite Reticle in top-right
    const radarX = width - 75
    const radarY = 115
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(radarX, radarY, 34, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(radarX, radarY, 18, 0, Math.PI * 2)
    ctx.stroke()
    const sweepAngle = time * 3.8
    ctx.beginPath()
    ctx.moveTo(radarX, radarY)
    ctx.lineTo(radarX + Math.cos(sweepAngle) * 34, radarY + Math.sin(sweepAngle) * 34)
    ctx.stroke()

    // Yellow Caution / Breaking Header Bar
    ctx.fillStyle = '#eab308'
    ctx.fillRect(36, 88, 220, 32)
    ctx.fillStyle = '#000000'
    ctx.font = '900 18px "Impact", "Arial Black", sans-serif'
    ctx.fillText('★ BREAKING REPORT ★', 46, 111)

    // Sensational Tabloid Headline
    const hl = c.headline || 'MEHUL SOLANKI SHATTERS BENCHMARKS: UNSTOPPABLE FULL-STACK CODE SPREE!'
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 23px "Impact", "Arial Black", sans-serif'
    const words = hl.split(' ')
    let line1 = ''
    let line2 = ''
    for (const w of words) {
      if ((line1 + ' ' + w).length < 34 && !line2) {
        line1 += (line1 ? ' ' : '') + w
      } else {
        line2 += (line2 ? ' ' : '') + w
      }
    }
    ctx.fillText(line1, 36, 150)
    if (line2) {
      ctx.fillStyle = '#facc15'
      ctx.fillText(line2, 36, 178)
    }

    // Story Incident Box
    ctx.fillStyle = 'rgba(24, 10, 10, 0.92)'
    ctx.fillRect(36, 204, width - 72, 200)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(36, 204, width - 72, 200)

    // Red warning strip on left edge of story box
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(36, 204, 6, 200)

    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('CORRESPONDENT DISPATCH // HIGH VELOCITY ALERT', 54, 232)

    ctx.fillStyle = '#ffffff'
    ctx.font = '13px "Courier New", monospace'
    ctx.fillText('» WITNESSES STUNNED: FLUTTER & DART DEPLOYMENTS AT 60FPS!', 54, 266)
    ctx.fillText('» ARCHITECTURE CONFIRMED: SCALABLE REST APIS WITH ZERO DOWNTIME', 54, 296)
    ctx.fillText('» ACADEMIC REVELATION: STATE DDCET RANK #113 TOP-TIER RECORD', 54, 326)
    ctx.fillText('» SCOOP: ML PREDICTIVE MODELS DEPLOYED WITH ADVANCED PRECISION', 54, 356)
    ctx.fillStyle = '#facc15'
    ctx.fillText('» ALERT: HIGH RECRUITER DEMAND REPORTED ACROSS ALL NETWORKS', 54, 386)

    // Bottom Animated Ticker with Red & Yellow
    ctx.fillStyle = '#1e0505'
    ctx.fillRect(20, height - 76, width - 40, 56)
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1.5
    ctx.strokeRect(20, height - 76, width - 40, 56)

    ctx.fillStyle = '#dc2626'
    ctx.fillRect(20, height - 76, 120, 56)
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 13px "Impact", "Arial Black", sans-serif'
    ctx.fillText('PRIME TICKER', 28, height - 42)

    // Crawling text
    const tickerText =
      c.ticker ||
      '*** BREAKING: MEHUL SOLANKI CRACKS STATE TOP #113 *** FLUTTER CROSS-PLATFORM SYSTEMS STABLE IN PRODUCTION *** NODE.JS REST APIS OPERATING AT 100% RELIABILITY *** CONTACT PORTAL READY FOR INQUIRIES *** '
    const tickerSpeed = 95
    ctx.font = 'bold 14px "Courier New", monospace'
    const fullWidth = ctx.measureText(tickerText).width
    const offsetX = (time * tickerSpeed) % fullWidth

    ctx.save()
    ctx.beginPath()
    ctx.rect(145, height - 76, width - 165, 56)
    ctx.clip()
    ctx.fillStyle = '#fef08a'
    ctx.fillText(tickerText, 145 - offsetX, height - 42)
    ctx.fillText(tickerText, 145 - offsetX + fullWidth, height - 42)
    ctx.restore()

  // -------------------------------------------------------------
  // 1.A-2 CRACKED SCREEN & RAINBOW TEST BARS
  // -------------------------------------------------------------
  } else if (c.type === 'cracked-bars') {
    // 1. SMPTE COLOR BARS
    // Top 64% section: 7 primary 75% saturation bars
    const smpteColors = [
      '#bfbfbf', // 75% White / Grey
      '#bfbf00', // Yellow
      '#00bfbf', // Cyan
      '#00bf00', // Green
      '#bf00bf', // Magenta
      '#bf0000', // Red
      '#0000bf', // Blue
    ]
    const topH = Math.floor(height * 0.64)
    const barW = width / smpteColors.length

    // Subtle horizontal scanline jitter on color bars
    const jitter = Math.sin(time * 18.0) * 1.5

    smpteColors.forEach((color, i) => {
      ctx.fillStyle = color
      ctx.fillRect(Math.floor(i * barW + (i === 3 ? jitter : 0)), 0, Math.ceil(barW) + 1, topH)
    })

    // Middle 8% section: Castellation bars (Blue, Black, Magenta, Black, Cyan, Black, White)
    const midY = topH
    const midH = Math.floor(height * 0.08)
    const midColors = ['#0000bf', '#111111', '#bf00bf', '#111111', '#00bfbf', '#111111', '#bfbfbf']
    midColors.forEach((color, i) => {
      ctx.fillStyle = color
      ctx.fillRect(Math.floor(i * barW), midY, Math.ceil(barW) + 1, midH)
    })

    // Bottom 28% section: Reference black, PLUGE pulses, I and Q signals
    const botY = midY + midH
    const botH = height - botY

    const bot5W = width / 5
    // -I signal (dark cyan/blue)
    ctx.fillStyle = '#00263a'
    ctx.fillRect(0, botY, bot5W, botH)
    // 100% White
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(bot5W, botY, bot5W, botH)
    // +Q signal (dark purple)
    ctx.fillStyle = '#2d0046'
    ctx.fillRect(bot5W * 2, botY, bot5W, botH)
    // Black + PLUGE area
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(bot5W * 3, botY, bot5W * 2, botH)

    // PLUGE pulses inside the black area
    const plugeStartX = bot5W * 3 + bot5W * 0.35
    ctx.fillStyle = '#020202' // -2% super-black
    ctx.fillRect(plugeStartX, botY, 18, botH)
    ctx.fillStyle = '#121212' // 0% black
    ctx.fillRect(plugeStartX + 22, botY, 18, botH)
    ctx.fillStyle = '#262626' // +4% grey
    ctx.fillRect(plugeStartX + 44, botY, 18, botH)

    // Calibration & Frequency test legend
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
    ctx.fillRect(16, 16, 380, 48)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.strokeRect(16, 16, 380, 48)

    ctx.fillStyle = '#facc15'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('SMPTE-170M COLOR CALIBRATION // 75% SAT', 26, 36)
    ctx.fillStyle = '#ffffff'
    ctx.fillText('REF CLK: 3.579545 MHz  |  NTSC FIELD 1/2', 26, 54)

    // Timecode in top-right
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
    ctx.fillRect(width - 240, 16, 224, 48)
    ctx.strokeRect(width - 240, 16, 224, 48)
    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('REC [●] 00:24:19:08', width - 228, 36)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('V-SYNC: LOCKED // CH-03', width - 228, 54)

    // 2. CRACKED SCREEN / GLASS FRACTURE OVERLAY
    // Impact center coordinates:
    const icx = 310
    const icy = 260

    // Localized dead phosphor bleed / LCD blackout around impact point
    const leakGrad = ctx.createRadialGradient(icx, icy, 10, icx, icy, 120)
    leakGrad.addColorStop(0, 'rgba(5, 5, 8, 0.95)')
    leakGrad.addColorStop(0.35, 'rgba(10, 12, 18, 0.75)')
    leakGrad.addColorStop(0.7, 'rgba(0, 200, 255, 0.15)')
    leakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = leakGrad
    ctx.beginPath()
    ctx.arc(icx, icy, 120, 0, Math.PI * 2)
    ctx.fill()

    // Blown phosphor vertical leak lines radiating from impact
    ctx.strokeStyle = 'rgba(0, 255, 180, 0.45)'
    ctx.lineWidth = 1.5
    for (let lx = icx - 40; lx <= icx + 40; lx += 8) {
      ctx.beginPath()
      ctx.moveTo(lx, icy - 80)
      ctx.lineTo(lx, icy + 160)
      ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(255, 0, 100, 0.45)'
    for (let lx = icx - 30; lx <= icx + 30; lx += 12) {
      ctx.beginPath()
      ctx.moveTo(lx, icy - 120)
      ctx.lineTo(lx, icy + 100)
      ctx.stroke()
    }

    // Concentric stress fracture rings (elliptical spiderweb rings)
    const rings = [28, 56, 95, 145, 210]
    rings.forEach((r, idx) => {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 - idx * 0.1})`
      ctx.lineWidth = idx === 0 ? 2.5 : 1.5
      ctx.beginPath()
      const segs = 20
      for (let s = 0; s <= segs; s++) {
        const ang = (s / segs) * Math.PI * 2
        const rJitter = r + Math.sin(s * 3.7 + idx * 2.1) * (5 + idx * 3)
        const rx = icx + Math.cos(ang) * rJitter * 1.15
        const ry = icy + Math.sin(ang) * rJitter * 0.9
        if (s === 0) ctx.moveTo(rx, ry)
        else ctx.lineTo(rx, ry)
      }
      ctx.stroke()
    })

    // Primary radial spiderweb glass fissures radiating from impact to edges
    const crackRays = [
      { ang: 0.15, len: 480, branches: [-0.18, 0.15] },
      { ang: 0.65, len: 420, branches: [0.12, -0.2] },
      { ang: 1.18, len: 350, branches: [-0.14] },
      { ang: 1.75, len: 360, branches: [0.18, -0.15] },
      { ang: 2.35, len: 400, branches: [-0.12] },
      { ang: 2.95, len: 380, branches: [0.15, -0.18] },
      { ang: 3.52, len: 440, branches: [-0.15] },
      { ang: 4.10, len: 390, branches: [0.2, -0.12] },
      { ang: 4.68, len: 360, branches: [-0.18] },
      { ang: 5.25, len: 420, branches: [0.16, -0.14] },
      { ang: 5.85, len: 450, branches: [-0.12, 0.18] },
    ]

    crackRays.forEach((ray, i) => {
      // 1. Draw chromatic aberration refractive shadow (cyan/magenta glass prism offset)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      let cx = icx + 1.5
      let cy = icy + 1.0
      ctx.moveTo(cx, cy)
      const numSteps = 7
      const stepLen = ray.len / numSteps
      for (let s = 1; s <= numSteps; s++) {
        const stepAng = ray.ang + Math.sin(s * 1.9 + i * 2.5) * 0.18
        cx += Math.cos(stepAng) * stepLen
        cy += Math.sin(stepAng) * stepLen
        ctx.lineTo(cx, cy)
      }
      ctx.stroke()

      // 2. Draw intense white fracture core
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = i % 2 === 0 ? 2.2 : 1.5
      ctx.beginPath()
      cx = icx
      cy = icy
      ctx.moveTo(cx, cy)
      for (let s = 1; s <= numSteps; s++) {
        const stepAng = ray.ang + Math.sin(s * 1.9 + i * 2.5) * 0.18
        cx += Math.cos(stepAng) * stepLen
        cy += Math.sin(stepAng) * stepLen
        ctx.lineTo(cx, cy)

        // Branching hairline fissures shooting off
        if (s === 3 || s === 5) {
          ray.branches.forEach((bAng) => {
            ctx.save()
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'
            ctx.lineWidth = 1.0
            ctx.beginPath()
            ctx.moveTo(cx, cy)
            let bx = cx
            let by = cy
            const bLen = stepLen * 1.4
            bx += Math.cos(stepAng + bAng) * bLen
            by += Math.sin(stepAng + bAng) * bLen
            ctx.lineTo(bx, by)
            ctx.stroke()
            ctx.restore()
          })
        }
      }
      ctx.stroke()
    })

    // Central puncture crush core: bright white/cyan fractured starburst
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(icx, icy, 12, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#00f0ff'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let p = 0; p < 12; p++) {
      const pa = (p / 12) * Math.PI * 2
      const pr = p % 2 === 0 ? 28 : 14
      const px = icx + Math.cos(pa) * pr
      const py = icy + Math.sin(pa) * pr
      if (p === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()

    // Warning alert at bottom right
    ctx.fillStyle = 'rgba(239, 68, 68, 0.85)'
    ctx.fillRect(width - 320, height - 52, 300, 36)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.strokeRect(width - 320, height - 52, 300, 36)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('⚠ HARDWARE ALERT: CRT VACUUM BREACH', width - 308, height - 30)

  // -------------------------------------------------------------
  // 1.B ABOUT ME DOSSIER MONITOR (Requested by user)
  // -------------------------------------------------------------
  } else if (c.type === 'about') {
    // Base gradient background with deep cosmic cyan/slate tone
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, '#020617')
    bgGrad.addColorStop(0.5, '#040d21')
    bgGrad.addColorStop(1, '#020617')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // Matrix coordinate grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)'
    ctx.lineWidth = 1
    for (let gx = 24; gx < width; gx += 48) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, height)
      ctx.stroke()
    }
    for (let gy = 24; gy < height; gy += 48) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(width, gy)
      ctx.stroke()
    }

    // Header Bar with live telemetry & status indicator
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'
    ctx.fillRect(24, 20, width - 48, 46)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(24, 20, width - 48, 46)

    // Left badge: // DOSSIER: BIOGRAPHY
    ctx.fillStyle = '#00f0ff'
    ctx.fillRect(24, 20, 195, 46)
    ctx.fillStyle = '#020617'
    ctx.font = '900 15px "Impact", "Arial Black", sans-serif'
    ctx.fillText('// ABOUT ME DOSSIER', 36, 49)

    // Pulsing live status indicator
    const pulseGlow = 0.5 + Math.sin(time * 3.5) * 0.5
    ctx.fillStyle = `rgba(16, 185, 129, ${pulseGlow})`
    ctx.beginPath()
    ctx.arc(238, 43, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('VERIFIED · AVAILABLE', 252, 47)

    // Right timestamp / telemetry node
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.textAlign = 'right'
    ctx.fillText('SYS.NODE // MS-7874', width - 38, 47)
    ctx.textAlign = 'left'

    // Hero Name Title
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 38px "Impact", "Arial Black", sans-serif'
    ctx.fillText((c.name || 'MEHUL SOLANKI').toUpperCase(), 34, 110)

    // Subtitle / Architectural Role
    ctx.fillStyle = '#00f0ff'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText(`// ${(c.role || 'SOFTWARE ENGINEER · BACKEND & FLUTTER').toUpperCase()}`, 36, 134)

    // Glowing divider with animated laser sweep runner
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(34, 148)
    ctx.lineTo(width - 34, 148)
    ctx.stroke()

    const laserX = 34 + ((time * 280) % (width - 120))
    const laserGrad = ctx.createLinearGradient(laserX, 148, laserX + 70, 148)
    laserGrad.addColorStop(0, 'rgba(0, 240, 255, 0)')
    laserGrad.addColorStop(0.5, '#00f0ff')
    laserGrad.addColorStop(1, 'rgba(0, 240, 255, 0)')
    ctx.strokeStyle = laserGrad
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(laserX, 148)
    ctx.lineTo(laserX + 70, 148)
    ctx.stroke()

    // 3 Stat / Metric Cards
    const statsList = c.stats || [
      { label: 'DDCET RANK', val: '#113', sub: 'TOP 0.5%' },
      { label: 'EDUCATION', val: 'B.E. IT', sub: 'LDCE AHMEDABAD' },
      { label: 'SPECIALIZATION', val: 'FULL STACK', sub: 'FLUTTER / NODE' },
    ]
    const cardW = (width - 68 - 24) / 3
    let cardX = 34
    statsList.forEach((st) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.fillRect(cardX, 162, cardW, 62)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)'
      ctx.lineWidth = 1.2
      ctx.strokeRect(cardX, 162, cardW, 62)

      // Stat value
      ctx.fillStyle = '#00f0ff'
      ctx.font = '900 22px "Courier New", monospace'
      ctx.fillText(st.val, cardX + 14, 191)

      // Stat label
      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 10px "Courier New", monospace'
      ctx.fillText(st.label, cardX + 14, 211)

      if (st.sub) {
        ctx.fillStyle = '#38bdf8'
        ctx.font = 'bold 9px "Courier New", monospace'
        ctx.textAlign = 'right'
        ctx.fillText(st.sub, cardX + cardW - 12, 211)
        ctx.textAlign = 'left'
      }

      cardX += cardW + 12
    })

    // Executive Biography Box
    ctx.fillStyle = 'rgba(10, 18, 36, 0.92)'
    ctx.fillRect(34, 238, width - 68, 120)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(34, 238, width - 68, 120)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('EXECUTIVE BIOGRAPHY //', 48, 262)

    ctx.fillStyle = '#e2e8f0'
    ctx.font = '13px "Courier New", monospace'
    const bioText =
      c.bio ||
      'Aspiring Software Engineer driven by curiosity and engineering excellence. Builds scalable cross-platform applications, high-throughput microservices, and applied ML pipelines balancing performance, reliability, and modern UX.'
    const words = bioText.split(' ')
    let bioLine = ''
    let textY = 285
    for (const w of words) {
      const test = bioLine + w + ' '
      if (ctx.measureText(test).width > width - 110) {
        ctx.fillText(bioLine, 48, textY)
        bioLine = w + ' '
        textY += 20
      } else {
        bioLine = test
      }
    }
    ctx.fillText(bioLine, 48, textY)

    // Core Pillars Section
    ctx.fillStyle = '#00f0ff'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('CORE PILLARS & ARCHITECTURAL EXPERTISE:', 34, 378)

    const pillars = c.pillars || [
      'High-Throughput Backend & RESTful Microservices',
      'Production Flutter Apps with Clean Architecture',
      'Predictive Machine Learning & Android Architecture',
    ]
    let pilY = 400
    pillars.slice(0, 3).forEach((p) => {
      ctx.fillStyle = '#10b981'
      ctx.fillRect(36, pilY - 9, 6, 6)

      ctx.fillStyle = '#cbd5e1'
      ctx.font = 'bold 12px "Courier New", monospace'
      ctx.fillText(p, 50, pilY - 3)

      pilY += 22
    })

    // Technology Stack Chips
    const tags = c.techStack || ['Flutter', 'Node.js', 'Python', 'Dart', 'Android', 'PostgreSQL', 'Firebase']
    let tx = 34
    const chipY = 472
    ctx.font = 'bold 11px "Courier New", monospace'
    tags.forEach((tag) => {
      const tw = ctx.measureText(tag).width + 16
      if (tx + tw < width - 34) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.12)'
        ctx.fillRect(tx, chipY, tw, 24)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)'
        ctx.lineWidth = 1
        ctx.strokeRect(tx, chipY, tw, 24)
        ctx.fillStyle = '#00f0ff'
        ctx.fillText(tag, tx + 8, chipY + 16)
        tx += tw + 8
      }
    })

    // Bottom Action Prompt Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'
    ctx.fillRect(24, height - 44, width - 48, 32)
    ctx.strokeStyle = '#00f0ff'
    ctx.lineWidth = 1
    ctx.strokeRect(24, height - 44, width - 48, 32)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('[ CLICK SCREEN TO EXPAND COMPLETE BIOGRAPHY DOSSIER ↗ ]', 38, height - 23)

    ctx.fillStyle = '#10b981'
    ctx.textAlign = 'right'
    ctx.fillText('STATUS: OPEN TO WORK', width - 38, height - 23)
    ctx.textAlign = 'left'

  // -------------------------------------------------------------
  // 1.C GITHUB PHYSICAL MONITOR
  // -------------------------------------------------------------
  } else if (c.type === 'github') {
    // Header Bar
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(20, 20, width - 40, 48)
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(20, 20, 140, 48)
    ctx.fillStyle = '#020617'
    ctx.font = '900 16px "Impact", "Arial Black", sans-serif'
    ctx.fillText('GIT TERMINAL', 34, 51)

    // Online status
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(width - 50, 44, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('ONLINE', width - 115, 48)

    // User Profile handle & stats
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 36px "Impact", "Arial Black", sans-serif'
    ctx.fillText(`@${c.username || 'SolankiMehul7874'}`, 44, 114)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 16px "Courier New", monospace'
    ctx.fillText('GITHUB ENGINEER PROFILE // PUBLIC ARCHIVE', 44, 144)

    // 3 Stat Boxes: REPOSITORIES, ACTIVE BRANCHES, CONTRIBUTIONS
    const stats = [
      { label: 'REPOSITORIES', val: `${c.reposCount || 12}+` },
      { label: 'CONTRIBUTIONS', val: 'ACTIVE' },
      { label: 'TOP LANGUAGE', val: 'DART / TS' },
    ]
    let statX = 44
    const statW = (width - 88 - 32) / 3
    stats.forEach((st) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.fillRect(statX, 165, statW, 58)
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(statX, 165, statW, 58)

      ctx.fillStyle = '#22c55e'
      ctx.font = '900 20px "Courier New", monospace'
      ctx.fillText(st.val, statX + 16, 195)

      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 10px "Courier New", monospace'
      ctx.fillText(st.label, statX + 16, 212)

      statX += statW + 16
    })

    // Green Phosphor GitHub Contribution Heatmap Grid
    ctx.fillStyle = '#e2e8f0'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('CONTRIBUTION COMMIT FREQUENCY (LAST 16 WEEKS):', 44, 252)

    const cols = 22
    const rows = 5
    const cellSize = 18
    const cellGap = 5
    const gridStartX = 44
    const gridStartY = 268

    const phosphorGreens = ['#052e16', '#14532d', '#16a34a', '#22c55e', '#4ade80']

    for (let cIdx = 0; cIdx < cols; cIdx++) {
      for (let rIdx = 0; rIdx < rows; rIdx++) {
        const x = gridStartX + cIdx * (cellSize + cellGap)
        const y = gridStartY + rIdx * (cellSize + cellGap)
        // Pseudo-random deterministic activity heat pattern with gentle time pulse
        const hash = Math.sin(cIdx * 12.9898 + rIdx * 78.233 + Math.floor(time * 0.5) * 0.05) * 43758.5453
        const frac = Math.abs(hash - Math.floor(hash))
        const level = Math.floor(frac * 5)
        ctx.fillStyle = phosphorGreens[level]
        ctx.fillRect(x, y, cellSize, cellSize)
      }
    }

    // Featured Project Repo Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    ctx.fillRect(44, 396, width - 88, 100)
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 1.5
    ctx.strokeRect(44, 396, width - 88, 100)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('FEATURED REPOSITORY ↗', 60, 422)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 18px "Impact", "Arial Black", sans-serif'
    ctx.fillText(c.topRepo || 'Prime-News-Flutter', 60, 448)

    ctx.fillStyle = '#cbd5e1'
    ctx.font = '13px "Courier New", monospace'
    ctx.fillText(c.repoDesc || 'High performance mobile news engine with Firebase cloud auth & cache.', 60, 474)

    // Bottom languages row
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('LANGUAGES: Dart · JavaScript · Python · PHP · Java · Kotlin · TypeScript', 44, height - 36)

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 2. SYSTEM TELEMETRY & SERVICE HEALTH MONITOR
  // -------------------------------------------------------------
  } else if (c.type === 'tv-error') {
    // Header Telemetry Box
    ctx.fillStyle = '#064e3b'
    ctx.fillRect(44, 44, width - 88, 64)
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 1.5
    ctx.strokeRect(44, 44, width - 88, 64)

    ctx.fillStyle = '#10b981'
    ctx.fillRect(44, 44, 130, 64)
    ctx.fillStyle = '#022c22'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText('ONLINE', 80, 82)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 22px "Impact", "Arial Black", sans-serif'
    ctx.fillText('SYSTEM HEALTH // RUNTIME TELEMETRY', 190, 83)

    // Telemetry Status Metrics
    ctx.fillStyle = '#34d399'
    ctx.font = 'bold 15px "Courier New", monospace'
    ctx.fillText(`STATUS_FLAG : ${c.errorCode || 'STATUS_HEALTHY_0x00'}`, 60, 155)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText(`MESSAGE     : ${c.message || 'ALL CLOUD SERVICES ONLINE & OPERATIONAL'}`, 60, 185)
    ctx.fillText(`RUNTIME     : NEXT.JS 16 (TURBOPACK) // REACT 19`, 60, 215)
    ctx.fillText(`GRAPHICS    : WEBGL / THREE.JS // SHADERS ACTIVE`, 60, 245)
    ctx.fillText(`API LATENCY : < 45ms AVERAGE // ZERO PACKET LOSS`, 60, 275)

    // Smooth Health Waveform
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 60; x < width - 60; x += 4) {
      const y = 350 + Math.sin(x * 0.05 + time * 4) * 22
      if (x === 60) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Status Banner Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    ctx.fillRect(60, 420, width - 120, 60)
    ctx.strokeStyle = '#10b981'
    ctx.strokeRect(60, 420, width - 120, 60)

    ctx.fillStyle = '#34d399'
    ctx.font = 'bold 15px "Courier New", monospace'
    ctx.fillText('>> PRODUCTION BENCHMARKS : 100% OPERATIONAL <<', 85, 456)

  // -------------------------------------------------------------
  // 3. ARCHITECTURE PIPELINE & COMPONENT LAYERS
  // -------------------------------------------------------------
  } else if (c.type === 'broken-screen') {
    // Header Bar
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(20, 20, width - 40, 48)
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 1.5
    ctx.strokeRect(20, 20, width - 40, 48)

    ctx.fillStyle = '#0284c7'
    ctx.fillRect(20, 20, 140, 48)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('ARCHITECTURE', 32, 50)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 18px "Impact", "Arial Black", sans-serif'
    ctx.fillText('SYSTEM DESIGN // PIPELINE LAYERS', 175, 51)

    // Architectural Layer Cards
    const layers = [
      { num: '01', name: 'PRESENTATION & CLIENT UI', tech: 'FLUTTER / NEXT.JS / REACT', col: '#38bdf8' },
      { num: '02', name: 'APPLICATION CONTROLLERS', tech: 'REST APIS / JWT AUTH GUARDS', col: '#00f0ff' },
      { num: '03', name: 'DOMAIN & PREDICTIVE MODELS', tech: 'CLEAN ARCH / SCIKIT-LEARN', col: '#10b981' },
      { num: '04', name: 'PERSISTENCE & STORAGE', tech: 'POSTGRESQL / MYSQL / FIREBASE', col: '#f59e0b' },
    ]

    let lyY = 96
    layers.forEach((layer) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.fillRect(40, lyY, width - 80, 64)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'
      ctx.lineWidth = 1
      ctx.strokeRect(40, lyY, width - 80, 64)

      // Accent strip
      ctx.fillStyle = layer.col
      ctx.fillRect(40, lyY, 6, 64)

      ctx.fillStyle = layer.col
      ctx.font = 'bold 12px "Courier New", monospace'
      ctx.fillText(`LAYER ${layer.num}`, 58, lyY + 26)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px "Courier New", monospace'
      ctx.fillText(layer.name, 140, lyY + 26)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px "Courier New", monospace'
      ctx.fillText(`STACK: ${layer.tech}`, 58, lyY + 50)

      lyY += 76
    })

    // Status Banner Box at bottom
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    ctx.fillRect(40, height - 68, width - 80, 44)
    ctx.strokeStyle = '#00f0ff'
    ctx.lineWidth = 1
    ctx.strokeRect(40, height - 68, width - 80, 44)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('STATUS: MODULAR CLEAN ARCHITECTURE CONTRACT VERIFIED', 60, height - 41)

  // -------------------------------------------------------------
  // 4. COMPLETE PROJECT DOSSIER SHOWN DIRECTLY ON MONITOR SCREEN
  // -------------------------------------------------------------
  } else if (c.type === 'project') {
    const project = projects.find((p) => p.id === c.projectId) || projects[0]

    // Top status strip
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText(`// SYSTEM ARTIFACT : ${project.year} // ${project.tagline || 'CASE STUDY'}`, 44, 52)

    // Live active indicator
    const isLive = Math.floor(time * 2) % 2 === 0
    ctx.fillStyle = isLive ? '#10b981' : '#047857'
    ctx.beginPath()
    ctx.arc(width - 56, 48, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 11px "Courier New", monospace'
    ctx.fillText('ONLINE', width - 116, 52)

    // Giant High-Impact Project Title
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 40px "Impact", "Arial Black", sans-serif'
    ctx.fillText(project.title.toUpperCase(), 44, 108)

    // Category badge
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)'
    ctx.fillRect(44, 126, ctx.measureText(project.category).width + 24, 28)
    ctx.strokeStyle = '#38bdf8'
    ctx.strokeRect(44, 126, ctx.measureText(project.category).width + 24, 28)
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText(project.category.toUpperCase(), 56, 145)

    // Problem & Solution Breakdown directly inside monitor
    ctx.fillStyle = '#fef08a'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('[ PROBLEM & CHALLENGE ]', 44, 188)
    ctx.fillStyle = '#cbd5e1'
    ctx.font = '14px "Courier New", monospace'
    // Word wrap problem
    const pWords = project.problem.split(' ')
    let pLine = ''
    let py = 210
    for (const w of pWords) {
      const t = pLine + w + ' '
      if (ctx.measureText(t).width > width - 90) {
        ctx.fillText(pLine, 44, py)
        pLine = w + ' '
        py += 20
      } else {
        pLine = t
      }
    }
    ctx.fillText(pLine, 44, py)

    // Solution Section
    py += 30
    ctx.fillStyle = '#34d399'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('[ ARCHITECTED SOLUTION ]', 44, py)
    py += 22
    ctx.fillStyle = '#cbd5e1'
    ctx.font = '14px "Courier New", monospace'
    const sWords = project.solution.split(' ')
    let sLine = ''
    for (const w of sWords) {
      const t = sLine + w + ' '
      if (ctx.measureText(t).width > width - 90) {
        ctx.fillText(sLine, 44, py)
        sLine = w + ' '
        py += 20
      } else {
        sLine = t
      }
    }
    ctx.fillText(sLine, 44, py)

    // Architecture Pipeline Block
    if (project.architecture) {
      py += 26
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 12px "Courier New", monospace'
      ctx.fillText('[ PIPELINE DATA FLOW ]', 44, py)
      py += 18
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
      ctx.fillRect(44, py, width - 88, 38)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)'
      ctx.strokeRect(44, py, width - 88, 38)

      ctx.fillStyle = '#00f0ff'
      ctx.font = 'bold 12px "Courier New", monospace'
      ctx.fillText(project.architecture.join(' ➔ '), 56, py + 24)
      py += 38
    }

    // Technologies Pills inside screen
    py += 24
    let techX = 44
    ctx.font = 'bold 11px "Courier New", monospace'
    for (const tech of project.technologies.slice(0, 5)) {
      const tw = ctx.measureText(tech).width + 18
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
      ctx.fillRect(techX, py, tw, 24)
      ctx.strokeStyle = '#10b981'
      ctx.strokeRect(techX, py, tw, 24)
      ctx.fillStyle = '#10b981'
      ctx.fillText(tech, techX + 9, py + 16)
      techX += tw + 8
    }

    // Bottom Navigation Prompts right inside screen
    ctx.fillStyle = '#64748b'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('STATUS: SHIPPED IN PRODUCTION  |  CLICK MONITOR TO EXPAND DOSSIER', 44, height - 34)

  // -------------------------------------------------------------
  // 5. IDENTITY SCREEN — Premium Cinematic CRT Profile
  // -------------------------------------------------------------
  } else if (c.type === 'identity') {
    // Live clock
    const date = new Date()
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`

    // Top status bar
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)'
    ctx.fillRect(20, 20, width - 40, 40)
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText('SYS.STATUS: OPTIMAL', 44, 46)
    ctx.fillStyle = '#00f0ff'
    ctx.textAlign = 'right'
    ctx.fillText(`${timeStr} IST`, width - 44, 46)
    ctx.textAlign = 'left'

    // Left: Avatar ring with initials
    const avatarCX = 130
    const avatarCY = 200
    const avatarR = 88

    // Outer animated halo
    const haloAlpha = 0.35 + Math.sin(time * 2.4) * 0.15
    ctx.strokeStyle = `rgba(0, 240, 255, ${haloAlpha})`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(avatarCX, avatarCY, avatarR + 12, 0, Math.PI * 2)
    ctx.stroke()

    // Dashed orbital ring
    ctx.save()
    ctx.setLineDash([8, 6])
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(avatarCX, avatarCY, avatarR + 22, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // Avatar fill
    const avatarGrad = ctx.createRadialGradient(avatarCX - 20, avatarCY - 20, 10, avatarCX, avatarCY, avatarR)
    avatarGrad.addColorStop(0, '#0f2744')
    avatarGrad.addColorStop(1, '#040a14')
    ctx.fillStyle = avatarGrad
    ctx.beginPath()
    ctx.arc(avatarCX, avatarCY, avatarR, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#00f0ff'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(avatarCX, avatarCY, avatarR, 0, Math.PI * 2)
    ctx.stroke()

    // Initials
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 56px "Impact", "Arial Black", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('MS', avatarCX, avatarCY + 20)
    ctx.textAlign = 'left'

    // Rotating orbital dot
    const dotAngle = time * 1.8
    ctx.fillStyle = '#00f0ff'
    ctx.beginPath()
    ctx.arc(avatarCX + Math.cos(dotAngle) * (avatarR + 22), avatarCY + Math.sin(dotAngle) * (avatarR + 22), 5, 0, Math.PI * 2)
    ctx.fill()

    // Draw personal photo if loaded, else fall back to 'MS' initials
    if (avatarImgSingleton) {
      // Clip to circle and draw photo
      ctx.save()
      ctx.beginPath()
      ctx.arc(avatarCX, avatarCY, avatarR - 2, 0, Math.PI * 2)
      ctx.clip()
      // Cover-fit the image inside the circle
      const imgW = avatarImgSingleton.naturalWidth || avatarImgSingleton.width
      const imgH = avatarImgSingleton.naturalHeight || avatarImgSingleton.height
      const diam = (avatarR - 2) * 2
      const scale = Math.max(diam / imgW, diam / imgH)
      const drawW = imgW * scale
      const drawH = imgH * scale
      const drawX = avatarCX - drawW / 2
      const drawY = avatarCY - drawH / 2
      ctx.drawImage(avatarImgSingleton, drawX, drawY, drawW, drawH)
      // Cyan color overlay for CRT tint
      ctx.fillStyle = 'rgba(0, 20, 40, 0.28)'
      ctx.fillRect(drawX, drawY, drawW, drawH)
      ctx.restore()
    } else {
      // Fallback: 'MS' initials
      ctx.fillStyle = '#ffffff'
      ctx.font = '900 56px "Impact", "Arial Black", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('MS', avatarCX, avatarCY + 20)
      ctx.textAlign = 'left'
    }

    // Right text block
    const textX = 248
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 44px "Impact", "Arial Black", sans-serif'
    ctx.fillText('MEHUL', textX, 120)
    ctx.fillStyle = '#00f0ff'
    ctx.fillText('SOLANKI', textX, 168)
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)'
    ctx.fillRect(textX, 178, 420, 2)
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 18px "Courier New", monospace'
    ctx.fillText('SOFTWARE ENGINEER', textX, 212)
    ctx.fillStyle = '#64748b'
    ctx.font = '13px "Courier New", monospace'
    ctx.fillText('L.D. COLLEGE OF ENGINEERING // IT', textX, 238)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('AHMEDABAD, GUJARAT, INDIA', textX, 258)

    // Tagline box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'
    ctx.fillRect(textX, 272, width - textX - 24, 96)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'
    ctx.lineWidth = 1
    ctx.strokeRect(textX, 272, width - textX - 24, 96)
    ctx.fillStyle = '#cbd5e1'
    ctx.font = '13px "Courier New", monospace'
    const taglineWords = siteConfig.tagline.split(' ')
    let tLine = ''
    let tY = 296
    const maxW = width - textX - 48
    for (const w of taglineWords) {
      const test = tLine + w + ' '
      if (ctx.measureText(test).width > maxW) {
        ctx.fillText(tLine, textX + 12, tY)
        tLine = w + ' '
        tY += 22
      } else {
        tLine = test
      }
    }
    ctx.fillText(tLine, textX + 12, tY)

    // Competency pills below avatar
    const pills = ['BACKEND', 'FLUTTER', 'ANDROID', 'ML']
    let px = 24
    ctx.font = 'bold 11px "Courier New", monospace'
    for (const pill of pills) {
      const pw = ctx.measureText(pill).width + 18
      if (px + pw > 235) break
      ctx.fillStyle = 'rgba(0, 240, 255, 0.12)'
      ctx.fillRect(px, 316, pw, 24)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)'
      ctx.lineWidth = 1
      ctx.strokeRect(px, 316, pw, 24)
      ctx.fillStyle = '#00f0ff'
      ctx.fillText(pill, px + 9, 332)
      px += pw + 6
    }

    // Core Competency Cards (replaces percentage bars with clean credentials)
    const compCards = [
      { tag: 'MOBILE', label: 'FLUTTER & DART (BLoC/PROVIDER)', status: 'PRODUCTION' },
      { tag: 'BACKEND', label: 'NODE.JS, PHP & REST APIS', status: 'VERIFIED' },
      { tag: 'CLIENT', label: 'ANDROID / KOTLIN / SQLITE', status: 'PRODUCTION' },
      { tag: 'INTELLIGENCE', label: 'PYTHON & SCIKIT-LEARN ML', status: 'PIPELINE' },
    ]
    let bY = 398
    const barX = textX
    const barW = width - textX - 24
    for (const b of compCards) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.fillRect(barX, bY, barW, 26)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'
      ctx.lineWidth = 1
      ctx.strokeRect(barX, bY, barW, 26)

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 10px "Courier New", monospace'
      ctx.fillText(`[ ${b.tag} ]`, barX + 8, bY + 17)

      ctx.fillStyle = '#f1f5f9'
      ctx.font = 'bold 11px "Courier New", monospace'
      ctx.fillText(b.label, barX + 92, bY + 17)

      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 9px "Courier New", monospace'
      ctx.textAlign = 'right'
      ctx.fillText(b.status, barX + barW - 8, bY + 17)
      ctx.textAlign = 'left'

      bY += 32
    }

    // Footer
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText(`DDCET RANK: #113  ·  AVAILABLE FOR INTERNSHIPS  ·  ${date.getFullYear()}`, 24, height - 34)

    // Scanlines CRT effect
    for (let sl = 80; sl < height; sl += 4) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, sl, width, 2)
    }


  // -------------------------------------------------------------
  // 6. TERMINAL CODE STREAM
  // -------------------------------------------------------------
  } else if (c.type === 'terminal') {
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 16px "Courier New", monospace'
    ctx.fillText('// BASH TTY1 [MEHUL@DEV-NODE]', 44, 52)

    let ty = 96
    for (const line of c.lines) {
      if (line.startsWith('$')) {
        ctx.fillStyle = '#00f0ff'
      } else if (line.includes('ERROR') || line.includes('FAILED')) {
        ctx.fillStyle = '#f43f5e'
      } else if (line.includes('STATUS') || line.includes('ONLINE') || line.includes('feat:')) {
        ctx.fillStyle = '#10b981'
      } else {
        ctx.fillStyle = '#94a3b8'
      }
      ctx.font = '14px "Courier New", monospace'
      ctx.fillText(line, 44, ty)
      ty += 34
    }

    // Blinking cursor
    if (Math.floor(time * 3) % 2 === 0) {
      ctx.fillStyle = '#10b981'
      ctx.fillRect(44, ty, 10, 18)
    }

  // -------------------------------------------------------------
  // 7. CODE EDITOR (IDE syntax highlighting)
  // -------------------------------------------------------------
  } else if (c.type === 'code') {
    // IDE Title tab
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(20, 20, width - 40, 38)
    ctx.fillStyle = '#38bdf8'
    ctx.fillRect(20, 20, 180, 38)
    ctx.fillStyle = '#090d16'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText(`📄 ${c.title || 'index.dart'}`, 34, 44)

    ctx.fillStyle = '#64748b'
    ctx.font = '12px "Courier New", monospace'
    ctx.fillText(`LANGUAGE: ${(c.language || 'DART').toUpperCase()}`, width - 180, 44)

    // Code lines with line numbers and syntax colors
    let cy = 88
    c.lines.forEach((line, i) => {
      // Line number gutter
      ctx.fillStyle = '#475569'
      ctx.font = '13px "Courier New", monospace'
      ctx.fillText((i + 1).toString().padStart(2, '0'), 36, cy)

      // Syntax color rules
      if (line.includes('void') || line.includes('async') || line.includes('const') || line.includes('class') || line.includes('import') || line.includes('def ') || line.includes('return')) {
        ctx.fillStyle = '#c084fc' // keyword purple
      } else if (line.includes('runApp') || line.includes('initialize') || line.includes('get') || line.includes('fetch') || line.includes('print')) {
        ctx.fillStyle = '#38bdf8' // function cyan
      } else if (line.includes('"') || line.includes("'")) {
        ctx.fillStyle = '#4ade80' // string green
      } else if (line.includes('//')) {
        ctx.fillStyle = '#64748b' // comment slate
      } else {
        ctx.fillStyle = '#f1f5f9' // plain text
      }
      ctx.fillText(line, 74, cy)
      cy += 28
    })

    // Active cursor
    if (Math.floor(time * 3) % 2 === 0) {
      ctx.fillStyle = '#38bdf8'
      ctx.fillRect(74, cy - 8, 8, 16)
    }

  // -------------------------------------------------------------
  // 8. ARCHITECTURE & DATA FLOW
  // -------------------------------------------------------------
  } else if (c.type === 'architecture') {
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText('// DISTRIBUTED ARCHITECTURE PIPELINE // SPEC 4D', 44, 52)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 28px "Impact", "Arial Black", sans-serif'
    ctx.fillText('DATA FLOW & SUBSYSTEMS', 44, 95)

    const blocks = [
      { label: 'CLIENT UI', desc: 'Flutter / Android / Web', col: '#38bdf8' },
      { label: 'REST GATEWAY', desc: 'Node.js / Express / JWT', col: '#10b981' },
      { label: 'BUSINESS LOGIC', desc: 'Service & Middleware', col: '#f59e0b' },
      { label: 'CLOUD DATA', desc: 'PostgreSQL / Firebase', col: '#c084fc' },
    ]

    let by = 135
    blocks.forEach((b, i) => {
      // Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
      ctx.fillRect(44, by, width - 88, 54)
      ctx.strokeStyle = b.col
      ctx.lineWidth = 1.5
      ctx.strokeRect(44, by, width - 88, 54)

      // Accent pill
      ctx.fillStyle = b.col
      ctx.fillRect(44, by, 6, 54)

      ctx.fillStyle = b.col
      ctx.font = '900 16px "Courier New", monospace'
      ctx.fillText(`0${i + 1} // ${b.label}`, 64, by + 26)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '13px "Courier New", monospace'
      ctx.fillText(b.desc, 64, by + 44)

      // Arrow to next block
      if (i < blocks.length - 1) {
        ctx.fillStyle = '#38bdf8'
        ctx.font = 'bold 16px "Courier New", monospace'
        ctx.fillText('↓ [SECURE PROTOCOL STREAM]', width / 2 - 110, by + 74)
      }

      by += 82
    })

  // -------------------------------------------------------------
  // 9. SKILLS & TECHNICAL ARSENAL
  // -------------------------------------------------------------
  } else if (c.type === 'skills') {
    ctx.fillStyle = '#00f0ff'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText('// CORE ENGINEERING ARSENAL', 44, 52)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 36px "Impact", "Arial Black", sans-serif'
    ctx.fillText((c.category || 'TECHNICAL SKILLS').toUpperCase(), 44, 102)

    const items = c.items || [
      'Flutter & Dart',
      'Android / Java / Kotlin',
      'Node.js & Express.js',
      'PHP & Laravel',
      'Python & ML (Scikit-learn)',
      'MySQL, Firebase & SQLite',
    ]

    let sy = 145
    items.forEach((item, idx) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.fillRect(44, sy, width - 88, 48)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)'
      ctx.lineWidth = 1
      ctx.strokeRect(44, sy, width - 88, 48)

      // Green active dot
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(66, sy + 24, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px "Courier New", monospace'
      ctx.fillText(item, 88, sy + 30)

      // Categorized Verification Badge (replaces percentage bars)
      const badgeLabels = ['PRODUCTION', 'VERIFIED', 'ARCHITECTURE', 'DEPLOYED']
      const badge = badgeLabels[idx % badgeLabels.length]
      const badgeW = ctx.measureText(`[ ${badge} ]`).width + 20
      const badgeX = width - 44 - badgeW - 12
      ctx.fillStyle = 'rgba(0, 240, 255, 0.12)'
      ctx.fillRect(badgeX, sy + 12, badgeW, 24)
      ctx.strokeStyle = '#00f0ff'
      ctx.strokeRect(badgeX, sy + 12, badgeW, 24)
      ctx.fillStyle = '#00f0ff'
      ctx.font = 'bold 11px "Courier New", monospace'
      ctx.fillText(`[ ${badge} ]`, badgeX + 10, sy + 28)

      sy += 64
    })

    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('STATUS: SHIPPED IN PRODUCTION & REPOSITORIES', 44, height - 36)

  // -------------------------------------------------------------
  // 10. EDUCATION & ACADEMIC RECOGNITION
  // -------------------------------------------------------------
  } else if (c.type === 'education') {
    ctx.fillStyle = '#f59e0b'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText('// ACADEMIC & MERIT DOSSIER', 44, 52)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 32px "Impact", "Arial Black", sans-serif'
    ctx.fillText((c.degree || 'B.E. INFORMATION TECHNOLOGY').toUpperCase(), 44, 102)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 18px "Courier New", monospace'
    ctx.fillText(c.institution || 'L.D. College of Engineering', 44, 138)

    // Highlight badge
    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)'
    ctx.fillRect(44, 165, width - 88, 90)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    ctx.strokeRect(44, 165, width - 88, 90)

    ctx.fillStyle = '#fef08a'
    ctx.font = '900 24px "Impact", "Arial Black", sans-serif'
    ctx.fillText('🏆 DDCET STATE RANK 113', 64, 205)

    ctx.fillStyle = '#cbd5e1'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText('Awarded "All Rounder" Technical Recognition for academic excellence & hands-on projects.', 64, 235)

    // Coursework & Focus
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 16px "Courier New", monospace'
    ctx.fillText('CORE COURSEWORK & SPECIALIZATION:', 44, 290)

    const courses = [
      '• Software Engineering & Clean Architecture',
      '• Database Management Systems (DBMS) & SQL',
      '• Mobile Computing & Cross-Platform Systems',
      '• Object-Oriented Programming (Java / Kotlin / Dart)',
      '• Operating Systems & Computer Networks',
    ]

    let cy = 320
    courses.forEach((crs) => {
      ctx.fillStyle = '#94a3b8'
      ctx.font = '14px "Courier New", monospace'
      ctx.fillText(crs, 44, cy)
      cy += 28
    })

  // -------------------------------------------------------------
  // 11. EXPERIENCE & INDUSTRY INTERNSHIP
  // -------------------------------------------------------------
  } else if (c.type === 'experience') {
    ctx.fillStyle = '#00f0ff'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText(`// PROFESSIONAL RECORD // ${c.period || '2024'}`, 44, 52)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 36px "Impact", "Arial Black", sans-serif'
    ctx.fillText((c.role || 'FLUTTER DEVELOPER INTERN').toUpperCase(), 44, 102)

    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 20px "Courier New", monospace'
    ctx.fillText(`@ ${c.company || 'InfoLabz'}`, 44, 138)

    // Points box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
    ctx.fillRect(44, 165, width - 88, 260)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
    ctx.strokeRect(44, 165, width - 88, 260)

    let ey = 205
    c.points?.forEach((pt) => {
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 16px "Courier New", monospace'
      ctx.fillText('➔', 64, ey)

      ctx.fillStyle = '#e2e8f0'
      ctx.font = '15px "Courier New", monospace'
      // Word wrap
      const words = pt.split(' ')
      let line = ''
      for (const w of words) {
        const test = line + w + ' '
        if (ctx.measureText(test).width > width - 160) {
          ctx.fillText(line, 94, ey)
          line = w + ' '
          ey += 24
        } else {
          line = test
        }
      }
      ctx.fillText(line, 94, ey)
      ey += 38
    })

    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 12px "Courier New", monospace'
    ctx.fillText('VERIFIED CYCLE: SHIPPED ON TIME TO USER SPECIFICATION', 44, height - 36)

  // -------------------------------------------------------------
  // 12. DIRECT CONTACT TRANSMISSION SCREEN
  // -------------------------------------------------------------
  } else if (c.type === 'contact') {
    ctx.fillStyle = '#00f0ff'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText('// DIGITAL COMM CHANNEL // OPEN', 44, 52)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 42px "Impact", "Arial Black", sans-serif'
    ctx.fillText('TRANSMIT SIGNAL', 44, 108)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 18px "Courier New", monospace'
    ctx.fillText('MEHUL SOLANKI · SOFTWARE ENGINEER', 44, 142)

    // Contact cards
    const channels = [
      { label: 'EMAIL', value: siteConfig.email, tag: 'DIRECT' },
      { label: 'GITHUB', value: 'github.com/SolankiMehul7874', tag: 'CODE' },
      { label: 'LINKEDIN', value: 'linkedin.com/in/mehul-solanki-31ldce', tag: 'NETWORK' },
      { label: 'LOCATION', value: 'Ahmedabad, Gujarat, India', tag: 'HQ' },
    ]

    let cy = 175
    channels.forEach((ch) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
      ctx.fillRect(44, cy, width - 88, 56)
      ctx.strokeStyle = '#00f0ff'
      ctx.lineWidth = 1
      ctx.strokeRect(44, cy, width - 88, 56)

      ctx.fillStyle = '#38bdf8'
      ctx.font = '900 13px "Courier New", monospace'
      ctx.fillText(`[ ${ch.label} ]`, 64, cy + 34)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px "Courier New", monospace'
      ctx.fillText(ch.value, 190, cy + 34)

      cy += 68
    })

    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillText('STATUS: AVAILABLE FOR INTERNSHIPS & FREELANCE PROJECTS', 44, height - 34)

  // -------------------------------------------------------------
  // 13. EDITORIAL TEXT BLOCK
  // -------------------------------------------------------------
  } else if (c.type === 'text') {
    ctx.fillStyle = '#00f0ff'
    ctx.font = 'bold 13px "Courier New", monospace'
    ctx.fillText(`// SYSTEM PROFILE : ${(c.subtitle || 'DISPATCH').toUpperCase()}`, 44, 52)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 36px "Impact", "Arial Black", sans-serif'
    ctx.fillText((c.title || 'ARCHIVE').toUpperCase(), 44, 106)

    if (c.body) {
      ctx.fillStyle = '#cbd5e1'
      ctx.font = '16px "Courier New", monospace'
      const words = c.body.split(' ')
      let line = ''
      let y = 155
      for (const w of words) {
        const test = line + w + ' '
        if (ctx.measureText(test).width > width - 90) {
          ctx.fillText(line, 44, y)
          line = w + ' '
          y += 26
        } else {
          line = test
        }
      }
      ctx.fillText(line, 44, y)
    }

    if (c.tags) {
      let tx = 44
      ctx.font = 'bold 12px "Courier New", monospace'
      c.tags.forEach((tag) => {
        const tw = ctx.measureText(tag).width + 20
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)'
        ctx.fillRect(tx, height - 70, tw, 28)
        ctx.strokeStyle = '#00f0ff'
        ctx.strokeRect(tx, height - 70, tw, 28)
        ctx.fillStyle = '#00f0ff'
        ctx.fillText(tag, tx + 10, height - 52)
        tx += tw + 10
      })
    }

  // -------------------------------------------------------------
  // 14. VISUAL ART (Radar / Sunset / Waves)
  // -------------------------------------------------------------
  } else if (c.type === 'visual-art') {
    const cx = width / 2
    const cy = height / 2

    // Circular scanning radar
    ctx.strokeStyle = '#00f0ff'
    ctx.lineWidth = 2
    for (let r = 40; r <= 180; r += 40) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    // Crosshairs
    ctx.beginPath()
    ctx.moveTo(cx - 200, cy); ctx.lineTo(cx + 200, cy)
    ctx.moveTo(cx, cy - 200); ctx.lineTo(cx, cy + 200)
    ctx.stroke()

    // Rotating sweep
    const sweep = time * 2.5
    ctx.fillStyle = 'rgba(0, 240, 255, 0.25)'
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, 180, sweep, sweep + 0.4)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px "Courier New", monospace'
    ctx.fillText('SATELLITE TELEMETRY // 4D COORDINATE LOCK', 44, height - 36)

  // -------------------------------------------------------------
  // 15. DEFAULT TEST BARS / STATIC
  // -------------------------------------------------------------
  } else if (c.type === 'test-bars') {
    const colors = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0']
    const barW = (width - 40) / colors.length
    colors.forEach((col, i) => {
      ctx.fillStyle = col
      ctx.fillRect(20 + i * barW, 20, barW, height * 0.65)
    })
    ctx.fillStyle = '#080808'
    ctx.fillRect(20, 20 + height * 0.65, width - 40, height * 0.35 - 20)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px "Courier New", monospace'
    ctx.fillText('SIGNAL SYNCHRONIZED // SMPTE PATTERN 04', 44, height - 44)

  } else if (c.type === 'static-noise') {
    for (let y = 20; y < height - 20; y += 6) {
      for (let x = 20; x < width - 20; x += 6) {
        const v = Math.floor(Math.random() * 255)
        ctx.fillStyle = `rgb(${v},${v},${v})`
        ctx.fillRect(x, y, 6, 6)
      }
    }
  } else {
    ctx.fillStyle = '#00f0ff'
    ctx.font = 'bold 20px "Courier New", monospace'
    ctx.fillText('// 4D MULTIVERSE CHANNEL // ACTIVE', 44, 80)
  }

  // Scanline overlay for analog grain
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 1.5)
  }
}

interface MonitorProps {
  data: MonitorData
}

export function Monitor({ data }: MonitorProps) {
  const groupRef = useRef<THREE.Group>(null)
  const screenRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const activationState = useRef<'hidden' | 'activating' | 'active'>('hidden')
  const activationTimer = useRef(0)
  const lastProgress = useRef(0)
  const lastCanvasUpdate = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)

  const projectIndex = useWorldStore((s) => s.projectIndex)

  // Resolve dynamic project if this is the primary case study monitor
  const activeContent = useMemo(() => {
    if (data.id === 'tv-project-slider') {
      const selected = projects[projectIndex % projects.length]
      return { type: 'project', projectId: selected.id } as ScreenContentType
    }
    if (data.id === 'tv-project-arch') {
      const selected = projects[projectIndex % projects.length]
      return { type: 'architecture', projectId: selected.id } as ScreenContentType
    }
    return data.content
  }, [data.id, data.content, projectIndex])

  // Canvas & CanvasTexture created synchronously on client render
  const { canvas, ctx, texture } = useMemo(() => {
    if (typeof document === 'undefined') {
      return { canvas: null, ctx: null, texture: null }
    }
    const c = document.createElement('canvas')
    c.width = 768
    c.height = 576
    const cx = c.getContext('2d')
    if (cx) {
      renderScreenFrame(cx, activeContent, 0, 768, 576)
    }
    const t = new THREE.CanvasTexture(c)
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    t.generateMipmaps = false
    t.needsUpdate = true
    return { canvas: c, ctx: cx, texture: t }
  }, [activeContent])

  // Assign screen emissive color
  const screenSpillColor = useMemo(() => {
    return new THREE.Color(data.screenColor || (data.type === 'crt' ? '#00f0ff' : '#38bdf8'))
  }, [data.screenColor, data.type])

  // Only animate content that contains live tickers, waveforms, or dynamic radars
  const isAnimatedContent = useMemo(() => {
    return (
      activeContent.type === 'news' ||
      activeContent.type === 'tabloid-news' ||
      activeContent.type === 'tv-error' ||
      activeContent.type === 'visual-art'
    )
  }, [activeContent.type])

  // CRT Material Uniforms with texture bound immediately on creation
  const uniforms = useMemo(() => {
    const u = createCRTUniforms(texture)
    u.uScreenColor.value = screenSpillColor
    return u
  }, [texture, screenSpillColor])

  useEffect(() => {
    if (texture) {
      uniforms.uTexture.value = texture
      uniforms.uScreenColor.value = screenSpillColor
      if (screenRef.current?.material) {
        (screenRef.current.material as THREE.ShaderMaterial).needsUpdate = true
      }
    }
    return () => {
      texture?.dispose()
    }
  }, [texture, uniforms, screenSpillColor])

  // Trigger quick channel change CRT flash on project index switch
  useEffect(() => {
    if (data.id === 'tv-project-slider' || data.id === 'tv-project-arch') {
      uniforms.uNoiseAmount.value = 0.85
      uniforms.uPower.value = 0.25
      setTimeout(() => {
        uniforms.uNoiseAmount.value = 0.05
        uniforms.uPower.value = 1.0
      }, 190)
    }
  }, [projectIndex, data.id, uniforms])

  // Real-time animation loop: updates news ticker, TV error, and CRT waveforms
  type TVState = 'hidden' | 'revealing' | 'active' | 'retreating'
  const tvState = useRef<TVState>(data.activationAt <= 0.05 ? 'active' : 'hidden')
  const animT = useRef(data.activationAt <= 0.05 ? 1.0 : 0.0)

  // Real-time animation loop: updates news ticker, TV error, and CRT waveforms
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const progress = useWorldStore.getState().progress
    const charPos = interpolatePathPoint(characterPath, progress)
    const isHero = data.activationAt <= 0.05
    const now = state.clock.getElapsedTime()

    // 1. HERO MONITORS: Active at landing, graceful atmospheric departure on corridor entry
    if (isHero) {
      uniforms.uTime.value += delta

      // At 0% - 5.2%: Hero TV is 100% stable, fully active, and beautifully framed in TPP & FPP close-up
      // At > 5.2% (as player begins walking forward to pass the TVs):
      // The TVs dynamically pull up and pop out of the user's way!
      const exitStart = 0.052
      const exitDuration = 0.032 // Completed by ~0.084, well before camera reaches z = -3.3

      if (progress > exitStart) {
        const rawExit = Math.min(1.0, (progress - exitStart) / exitDuration)
        // High-responsiveness ease-out curve: immediate upward/lateral pop as soon as movement starts
        const pop = 1.0 - Math.pow(1.0 - rawExit, 2.6)
        animT.current = 1.0 - rawExit

        const isCenter = Math.abs(data.position[0]) < 0.2
        const isLeft = data.position[0] < -0.2
        const isRight = data.position[0] > 0.2

        // Pull up: Center monitor retracts swiftly high into overhead ceiling rafters
        const lift = isCenter ? pop * 5.4 : pop * 2.8

        // Pop out: Side monitors slide dynamically outward to clear the runway
        const outwardX = isCenter
          ? 0
          : (isLeft ? -1 : 1) * pop * 4.2

        groupRef.current.position.set(
          data.position[0] + outwardX,
          data.position[1] + lift,
          data.position[2] - (isCenter ? pop * 0.8 : 0) // slight backward tuck into ceiling
        )

        // Dynamic rotation: Center tilts back as it pulls up; sides swing outward like opening airlock doors
        const rotX = data.rotation[0] + (isCenter ? -pop * 0.5 : -pop * 0.2)
        const rotY = data.rotation[1] + (isLeft ? pop * 0.35 : isRight ? -pop * 0.35 : 0)
        const rotZ = data.rotation[2]
        groupRef.current.rotation.set(rotX, rotY, rotZ)

        // Scale & CRT power fade out
        const scaleMul = Math.max(0.001, 1.0 - pop * 0.95)
        groupRef.current.scale.setScalar(data.scale * scaleMul)
        groupRef.current.visible = rawExit < 0.99 // completely hidden once pulled up

        uniforms.uPower.value = Math.max(0, 1.0 - pop * 1.5)
        if (lightRef.current) {
          lightRef.current.intensity = (data.importance === 'primary' ? 2.0 : 0.8) * Math.max(0, 1 - pop * 1.6)
        }
      } else {
        // Active in landing establishing shot and 100% solid & readable in 4.5% - 5.2% FPP mode
        animT.current = 1.0
        groupRef.current.visible = true
        groupRef.current.position.set(data.position[0], data.position[1], data.position[2])
        groupRef.current.scale.setScalar(data.scale)
        groupRef.current.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2])
        uniforms.uPower.value = 1.0
        uniforms.uNoiseAmount.value = 0.06
        if (lightRef.current) {
          lightRef.current.intensity = (data.importance === 'primary' ? 2.0 : 0.8) + Math.sin(now * 3.0) * 0.12
        }
      }

      // Repaint canvas during landing for animated screens only
      if (isAnimatedContent && progress < 0.08 && now - lastCanvasUpdate.current > 0.066) {
        lastCanvasUpdate.current = now
        if (ctx && canvas && texture) {
          renderScreenFrame(ctx, activeContent, now, 768, 576)
          texture.needsUpdate = true
        }
      }
      return
    }

    // 2. JOURNEY TVS: Spatial position-based state machine with hysteresis
    // deltaZ: positive when character approaches TV from front; negative after passing
    const deltaZ = charPos.z - data.position[2]

    // Gated by progress threshold so upcoming section monitors do not intrude into the landing establishing shot
    const progressThreshold = Math.max(0.065, data.activationAt - 0.05)
    const isInProgressWindow = progress >= progressThreshold
    const isInZWindow = deltaZ <= 5.4 && deltaZ >= -2.4

    // Determine target state based on spatial character proximity and progress gate
    if (isInProgressWindow && isInZWindow) {
      if (tvState.current === 'hidden' || tvState.current === 'retreating') {
        tvState.current = 'revealing'
      } else if (animT.current >= 0.98) {
        tvState.current = 'active'
      }
    } else if (!isInProgressWindow || deltaZ < -2.6 || deltaZ > 6.0) {
      if (tvState.current === 'active' || tvState.current === 'revealing') {
        tvState.current = 'retreating'
      } else if (animT.current <= 0.02) {
        tvState.current = 'hidden'
      }
    }

    // Smooth animation progress interpolation using Section 2 motion language
    if (tvState.current === 'revealing' || tvState.current === 'active') {
      animT.current = Math.min(1.0, animT.current + delta * 3.2)
    } else if (tvState.current === 'retreating' || tvState.current === 'hidden') {
      animT.current = Math.max(0.0, animT.current - delta * 3.2)
    }

    const t = animT.current

    // Fully hidden state
    if (t <= 0.005) {
      groupRef.current.position.set(data.position[0], data.position[1] - 3.5, data.position[2])
      groupRef.current.scale.setScalar(0.001)
      uniforms.uPower.value = 0.0
      if (lightRef.current) lightRef.current.intensity = 0.0
      return
    }

    // Direction-aware physical TV slide animation for the Project Showcase TV
    let slideOffsetX = 0
    let slideRotY = 0
    let slideScaleMul = 1.0
    if (data.id === 'tv-project-slider') {
      const { projectSlideDir, projectSlideTimestamp } = useWorldStore.getState()
      if (projectSlideTimestamp > 0) {
        const elapsed = (Date.now() - projectSlideTimestamp) / 1000
        const duration = 0.52
        if (elapsed < duration) {
          const p = elapsed / duration
          const sign = projectSlideDir === 'next' ? 1 : -1
          if (p < 0.22) {
            // Phase 1: Current TV slides out and recedes in direction of movement
            const outP = p / 0.22
            slideOffsetX = -sign * outP * 2.2
            slideRotY = -sign * outP * 0.28
            slideScaleMul = 1.0 - outP * 0.18
            uniforms.uPower.value = 1.0 - outP * 0.6
            uniforms.uNoiseAmount.value = 0.1 + outP * 0.7
          } else {
            // Phase 2: Next TV enters from opposite side with easeOutBack
            const inP = (p - 0.22) / 0.78
            const c1 = 1.6
            const c3 = c1 + 1
            const easeBack = 1 + c3 * Math.pow(inP - 1, 3) + c1 * Math.pow(inP - 1, 2)
            slideOffsetX = sign * (1 - easeBack) * 2.5
            slideRotY = sign * (1 - easeBack) * 0.32
            slideScaleMul = 0.82 + 0.18 * Math.min(1.0, easeBack)
            uniforms.uPower.value = 0.4 + 0.6 * inP
            uniforms.uNoiseAmount.value = Math.max(0.05, 0.6 * (1 - inP))
          }
        }
      }
    }

    // Emerging / active / retreating transform using easeOutCubic curve
    const easeOutCubic = 1 - Math.pow(1 - t, 3)
    const sideMultiplier = data.position[0] === 0 ? 1 : Math.sign(data.position[0])

    if (t >= 0.98) {
      // Settled in full active focus
      groupRef.current.position.set(data.position[0] + slideOffsetX, data.position[1], data.position[2])
      groupRef.current.scale.setScalar(data.scale * slideScaleMul)
      groupRef.current.rotation.set(data.rotation[0], data.rotation[1] + slideRotY, data.rotation[2])
      uniforms.uTime.value += delta
      if (slideOffsetX === 0) {
        uniforms.uPower.value = 1.0
        uniforms.uNoiseAmount.value = 0.05
      }
      if (lightRef.current) {
        lightRef.current.intensity = (data.importance === 'primary' ? 2.2 : 0.9) + Math.sin(now * 3.5) * 0.15
      }
    } else {
      // Section 2 style spatial emergence / departure
      const offsetY = (1 - easeOutCubic) * 1.5
      const offsetZ = (1 - easeOutCubic) * 0.9
      const offsetX = sideMultiplier * (1 - easeOutCubic) * 0.4
      groupRef.current.position.set(
        data.position[0] + offsetX + slideOffsetX,
        data.position[1] - offsetY,
        data.position[2] + offsetZ
      )
      groupRef.current.scale.setScalar(data.scale * Math.max(0.01, easeOutCubic) * slideScaleMul)
      groupRef.current.rotation.set(
        data.rotation[0],
        data.rotation[1] * (0.8 + 0.2 * easeOutCubic) + slideRotY,
        data.rotation[2]
      )

      // CRT beam ignite and horizontal expand
      if (t < 0.35) {
        uniforms.uPower.value = 0.05 + 0.25 * (t / 0.35)
        uniforms.uNoiseAmount.value = 0.65 - 0.3 * (t / 0.35)
        if (lightRef.current) lightRef.current.intensity = 0.2 * (t / 0.35)
      } else {
        const st = (t - 0.35) / 0.65
        uniforms.uPower.value = 0.3 + 0.7 * st
        uniforms.uNoiseAmount.value = 0.35 - 0.3 * st
        if (lightRef.current) {
          lightRef.current.intensity = (data.importance === 'primary' ? 2.0 : 0.8) * (0.2 + 0.8 * st)
        }
      }
    }

    // Repaint canvas only for animated content when active and visible
    if (isAnimatedContent && t > 0.5 && now - lastCanvasUpdate.current > 0.066) {
      lastCanvasUpdate.current = now
      if (ctx && canvas && texture) {
        renderScreenFrame(ctx, activeContent, now, 768, 576)
        texture.needsUpdate = true
      }
    }
  })

  // Colors & Materials for authentic vintage CRT television
  const plasticBodyColor = new THREE.Color(0x0a0c10)
  const bezelColor = new THREE.Color(0x06070a)
  const metalTrimColor = new THREE.Color(0x1a202c)

  return (
    <group
      ref={groupRef}
      position={[data.position[0], data.position[1], data.position[2]]}
      rotation={[data.rotation[0], data.rotation[1], data.rotation[2]]}
      scale={data.activationAt <= 0.05 ? data.scale : 0.01}
    >
      {/* ==================================================== */}
      {/* REAL PHYSICAL CRT CHASSIS (Deep Molded Shell)        */}
      {/* ==================================================== */}

      {/* ==================================================== */}
      {/* VINTAGE CRT TELEVISION HOUSING (Exact match to video) */}
      {/* ==================================================== */}

      {/* Main retro television cabinet with rounded corners */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.86, 1.44, 0.62]} />
        <meshStandardMaterial
          color={plasticBodyColor}
          roughness={0.88}
          metalness={0.15}
        />
      </mesh>

      {/* Rear Cathode-Ray Tube (CRT) deep funnel bulge */}
      <mesh position={[0, 0, -0.52]} castShadow>
        <boxGeometry args={[1.36, 1.08, 0.58]} />
        <meshStandardMaterial
          color={new THREE.Color(0x06070a)}
          roughness={0.94}
          metalness={0.1}
        />
      </mesh>

      {/* Rear television vents */}
      {[-0.3, -0.1, 0.1, 0.3].map((vy) => (
        <mesh key={vy} position={[0, vy, -0.81]}>
          <boxGeometry args={[1.1, 0.035, 0.02]} />
          <meshStandardMaterial color={new THREE.Color(0x020203)} roughness={1.0} />
        </mesh>
      ))}

      {/* Front Bezel frame molding */}
      <mesh position={[-0.12, 0.03, 0.31]}>
        <boxGeometry args={[1.48, 1.26, 0.08]} />
        <meshStandardMaterial color={bezelColor} roughness={0.96} />
      </mesh>

      {/* ==================================================== */}
      {/* 4:3 BULGING CURVED CRT PICTURE TUBE                  */}
      {/* ==================================================== */}
      <mesh
        ref={screenRef}
        position={[-0.12, 0.03, 0.355]}
        onClick={(e) => {
          e.stopPropagation()
          if (data.content.type === 'project') {
            const pId = data.content.projectId
            const pIdx = projects.findIndex((p) => p.id === pId)
            if (pIdx !== -1) {
              useWorldStore.getState().setProjectIndex(pIdx)
            }
            useWorldStore.getState().setFocusedProjectId(pId)
            useWorldStore.getState().setCaseStudyOpen(true)
          } else if (data.content.type === 'about' || data.content.type === 'github') {
            useWorldStore.getState().setFocusedProjectId('about')
            useWorldStore.getState().setCaseStudyOpen(true)
          } else if (data.content.type === 'education') {
            useWorldStore.getState().setFocusedProjectId('education')
            useWorldStore.getState().setCaseStudyOpen(true)
          } else if (data.content.type === 'experience') {
            useWorldStore.getState().setFocusedProjectId('experience')
            useWorldStore.getState().setCaseStudyOpen(true)
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <planeGeometry args={[1.38, 1.12, 16, 16]} />
        <shaderMaterial
          vertexShader={crtVertexShader}
          fragmentShader={crtFragmentShader}
          uniforms={uniforms}
        />
      </mesh>



      {/* ==================================================== */}
      {/* RIGHT SIDE TELEVISION CONTROL PANEL (Classic CRT TV) */}
      {/* ==================================================== */}
      <group position={[0.7, 0.03, 0.32]}>
        {/* Control panel inset fascia */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.34, 1.26, 0.04]} />
          <meshStandardMaterial color={metalTrimColor} roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Vintage TV Brand Badge */}
        <mesh position={[0, 0.52, 0.025]}>
          <boxGeometry args={[0.26, 0.04, 0.01]} />
          <meshStandardMaterial color={new THREE.Color(0x28303f)} roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Big VHF Rotary Channel Selector Clicker Dial */}
        <group position={[0, 0.32, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.075, 0.075, 0.035, 18]} />
            <meshStandardMaterial color={new THREE.Color(0x181c24)} roughness={0.5} metalness={0.7} />
          </mesh>
          {/* Dial pointer ridge */}
          <mesh position={[0, 0.02, 0.04]}>
            <boxGeometry args={[0.015, 0.015, 0.06]} />
            <meshStandardMaterial color="#00f0ff" />
          </mesh>
        </group>

        {/* UHF Tuning Dial */}
        <group position={[0, 0.12, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, 0.03, 16]} />
            <meshStandardMaterial color={new THREE.Color(0x181c24)} roughness={0.5} metalness={0.7} />
          </mesh>
        </group>

        {/* Volume & Contrast Knobs */}
        <mesh position={[-0.06, -0.06, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.025, 12]} />
          <meshStandardMaterial color={new THREE.Color(0x28303f)} roughness={0.6} metalness={0.6} />
        </mesh>
        <mesh position={[0.06, -0.06, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.025, 12]} />
          <meshStandardMaterial color={new THREE.Color(0x28303f)} roughness={0.6} metalness={0.6} />
        </mesh>

        {/* Horizontal TV Speaker Grille Slats */}
        {[-0.2, -0.26, -0.32, -0.38, -0.44].map((sy) => (
          <mesh key={sy} position={[0, sy, 0.025]}>
            <boxGeometry args={[0.26, 0.02, 0.01]} />
            <meshStandardMaterial color={new THREE.Color(0x060709)} roughness={0.95} />
          </mesh>
        ))}

        {/* Power Push Button & Status LED */}
        <mesh position={[-0.06, -0.53, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 10]} />
          <meshStandardMaterial color={new THREE.Color(0x384252)} roughness={0.6} />
        </mesh>
        <mesh position={[0.06, -0.53, 0.03]}>
          <sphereGeometry args={[0.015, 10, 10]} />
          <meshBasicMaterial color={data.importance === 'primary' ? 0x00f0ff : 0x10b981} />
        </mesh>
      </group>

      {/* ==================================================== */}
      {/* TOP TELESCOPIC RABBIT-EAR V-ANTENNA                  */}
      {/* ==================================================== */}
      <group position={[0, 0.72, -0.08]}>
        {/* Antenna turret base */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.04, 12]} />
          <meshStandardMaterial color={new THREE.Color(0x1a202c)} roughness={0.6} metalness={0.5} />
        </mesh>
        {/* Left chrome antenna rod angled left & back */}
        <mesh position={[-0.32, 0.42, -0.1]} rotation={[0.2, 0, 0.55]}>
          <cylinderGeometry args={[0.007, 0.01, 0.95, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Right chrome antenna rod angled right & back */}
        <mesh position={[0.32, 0.42, -0.1]} rotation={[0.2, 0, -0.55]}>
          <cylinderGeometry args={[0.007, 0.01, 0.95, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Top carrying handle */}
        <mesh position={[0, 0.05, 0.12]}>
          <boxGeometry args={[0.36, 0.03, 0.05]} />
          <meshStandardMaterial color={new THREE.Color(0x111620)} roughness={0.8} />
        </mesh>
      </group>

      {/* ==================================================== */}
      {/* TELEVISION FEET (4 Corner Rubber / Pegged TV Feet)  */}
      {/* ==================================================== */}
      {[-0.72, 0.72].map((fx) => (
        <group key={fx}>
          {/* Front foot */}
          <mesh position={[fx, -0.74, 0.2]}>
            <cylinderGeometry args={[0.04, 0.05, 0.04, 10]} />
            <meshStandardMaterial color={new THREE.Color(0x060709)} roughness={0.95} />
          </mesh>
          {/* Rear foot */}
          <mesh position={[fx, -0.74, -0.2]}>
            <cylinderGeometry args={[0.04, 0.05, 0.04, 10]} />
            <meshStandardMaterial color={new THREE.Color(0x060709)} roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Heavy rubber power/antenna cable hanging out of back */}
      <mesh position={[0.25, -0.5, -0.7]} rotation={[0.35, 0.15, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 1.4, 8]} />
        <meshStandardMaterial color={new THREE.Color(0x040507)} roughness={0.95} />
      </mesh>

      {/* ==================================================== */}
      {/* TELEVISION SCREEN LIGHT SPILL                        */}
      {/* ==================================================== */}
      <pointLight
        ref={lightRef}
        position={[-0.12, 0.04, 0.8]}
        intensity={data.activationAt <= 0.05 ? (data.importance === 'primary' ? 2.2 : 0.9) : 0}
        distance={6.0}
        decay={2}
        color={screenSpillColor}
      />
    </group>
  )
}
