'use client'

import { useState, useRef, useCallback } from 'react'
import type { Certificate } from './certificateData'

interface CertificateCardProps {
  certificate: Certificate
  index: number
  activeIndex: number
  fanFactor: number // 0 = fully stacked, 1 = fully fanned out
  onClick: () => void
  onExpand: () => void
}

export function CertificateCard({
  certificate,
  index,
  activeIndex,
  fanFactor,
  onClick,
  onExpand,
}: CertificateCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const isActive = index === activeIndex
  const totalOffset = index - activeIndex

  // Handle subtle 3D mouse tilt when active card is hovered
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isActive) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5 // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5 // -0.5 to 0.5
      // Max ±5 degrees tilt
      setTilt({
        rotateY: Math.max(-5, Math.min(5, x * 10)),
        rotateX: Math.max(-5, Math.min(5, -y * 10)),
      })
    },
    [isActive]
  )

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ rotateX: 0, rotateY: 0 })
  }, [])

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  // =========================================================================
  // 3D SPATIAL TRANSFORM MATH
  // Fan mode vs Stack mode based on fanFactor & index
  // =========================================================================
  // When stacked (fanFactor = 0): cards are compressed vertically with small stepped offsets
  const stackedX = index * 10
  const stackedY = index * 12
  const stackedZ = -index * 25
  const stackedRotZ = (index % 2 === 0 ? 1 : -1) * (index * 1.2)

  // When fanned out (fanFactor = 1):
  // Active card is centered, front and proud; other cards fan along an arc in depth
  const fannedX = totalOffset * 48
  const fannedY = Math.abs(totalOffset) * 14 - (isActive ? 10 : 0)
  const fannedZ = isActive ? 50 : -Math.abs(totalOffset) * 35
  const fannedRotZ = totalOffset * 3.5

  // Interpolated position based on scroll fanFactor (0 to 1)
  const posX = stackedX + (fannedX - stackedX) * fanFactor
  const posY = stackedY + (fannedY - stackedY) * fanFactor
  const basePosZ = stackedZ + (fannedZ - stackedZ) * fanFactor
  const posZ = basePosZ + (isActive && isHovered ? 18 : 0)
  const rotZ = stackedRotZ + (fannedRotZ - stackedRotZ) * fanFactor

  // Dynamic scale and opacity
  const baseScale = isActive ? 1.03 : Math.max(0.86, 0.96 - Math.abs(totalOffset) * 0.04)
  const scale = baseScale * (isActive && isHovered ? 1.025 : 1.0)
  const opacity = isActive ? 1.0 : Math.max(0.4, 0.85 - Math.abs(totalOffset) * 0.12)

  // Combined 3D transform string
  const transform = `
    translate3d(${posX}px, ${posY}px, ${posZ}px)
    rotateX(${isActive ? tilt.rotateX : 0}deg)
    rotateY(${isActive ? tilt.rotateY : 0}deg)
    rotateZ(${rotZ}deg)
    scale(${scale})
  `

  return (
    <div
      ref={cardRef}
      onClick={() => {
        if (!isActive) onClick()
        else onExpand()
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`absolute w-[290px] sm:w-[350px] md:w-[390px] aspect-[1.42/1] rounded-2xl cursor-pointer will-change-transform select-none transition-[box-shadow,border-color] duration-300 ${
        isActive ? 'z-30' : 'z-10'
      }`}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        opacity,
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.3s ease-out, opacity 0.3s ease-out'
          : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease-out, opacity 0.4s ease-out',
      }}
      role="button"
      tabIndex={0}
      aria-label={`Certificate: ${certificate.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!isActive) onClick()
          else onExpand()
        }
      }}
    >
      {/* ==================================================== */}
      {/* PHYSICAL 3D BEVELED DEPTH EDGE                      */}
      {/* Realistic multi-layered card rim                      */}
      {/* ==================================================== */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          transform: 'translateZ(-6px)',
          background: '#090d16',
          boxShadow: isActive
            ? `0 24px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px ${certificate.accentColor}33`
            : '0 16px 35px -8px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          transform: 'translateZ(-3px)',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      />

      {/* ==================================================== */}
      {/* MAIN CARD SURFACE / HIGH-FIDELITY CREDENTIAL         */}
      {/* ==================================================== */}
      <div
        className="relative w-full h-full rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col justify-between"
        style={{
          background: 'linear-gradient(145deg, #0d121d 0%, #060910 100%)',
          border: `1px solid ${isActive ? certificate.accentColor + '88' : 'rgba(255, 255, 255, 0.12)'}`,
          boxShadow: isActive
            ? `inset 0 0 20px ${certificate.accentColor}18, 0 10px 30px rgba(0, 0, 0, 0.6)`
            : 'inset 0 0 12px rgba(255, 255, 255, 0.02)',
        }}
      >
        {/* Subtle Guilloche Watermark Pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${certificate.accentColor} 1px, transparent 1px), radial-gradient(circle at 0% 0%, white 1px, transparent 1px)`,
            backgroundSize: '20px 20px, 36px 36px',
          }}
        />

        {/* Ambient Top Light Glare */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: certificate.accentColor }}
        />

        {/* Double Framing Micro-Border */}
        <div
          aria-hidden="true"
          className="absolute inset-2 sm:inset-2.5 rounded-xl border border-white/[0.08] pointer-events-none"
        />

        {/* 1. Header: Specialization Badge & Security Emblem */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: certificate.accentColor }}
            />
            <span
              className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase"
              style={{ color: certificate.accentColor }}
            >
              {certificate.badgeText}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-[9px] font-mono text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
            <span>VERIFIED</span>
            <span className="text-emerald-400">✓</span>
          </div>
        </div>

        {/* 2. Center: Certificate Title & Recipient */}
        <div className="relative z-10 my-auto py-1">
          <div className="text-[10px] sm:text-[11px] font-mono text-neutral-400 tracking-wider">
            CERTIFICATE OF RECOGNITION
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-black text-white font-sans tracking-tight mt-0.5 leading-snug line-clamp-2">
            {certificate.title}
          </h3>
          <div className="text-[10px] font-mono text-neutral-300 mt-1 flex items-center space-x-1.5">
            <span className="text-neutral-500">AWARDED TO:</span>
            <span className="text-white font-semibold">{certificate.recipientName}</span>
          </div>
        </div>

        {/* 3. Footer: Issuer, Year, Holographic Seal & Inspect Hint */}
        <div className="relative z-10 pt-2 border-t border-white/[0.08] flex items-end justify-between">
          <div className="space-y-0.5">
            <div className="text-[9px] font-mono text-neutral-400 truncate max-w-[170px] sm:max-w-[210px]">
              {certificate.issuer}
            </div>
            <div className="text-[9px] font-mono text-neutral-500">
              ID: {certificate.credentialId} • {certificate.date}
            </div>
          </div>

          {/* Metallic Holographic Seal Badge */}
          <div
            className="flex items-center space-x-1 px-2 py-1 rounded-lg border text-[9px] font-mono transition-transform"
            style={{
              borderColor: `${certificate.accentColor}55`,
              backgroundColor: `${certificate.accentColor}12`,
              color: certificate.accentColor,
            }}
          >
            <span>SEAL</span>
            <span className="text-[10px]">✦</span>
          </div>
        </div>

        {/* Hover Inspect Overlay Hint */}
        {isActive && (
          <div className="absolute bottom-1.5 right-1/2 translate-x-1/2 text-[9px] font-mono text-neutral-500 tracking-widest opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            CLICK TO EXPAND
          </div>
        )}
      </div>
    </div>
  )
}
