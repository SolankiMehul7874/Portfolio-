'use client'

import { useEffect, useState } from 'react'
import type { Certificate } from './certificateData'

interface CertificateDetailsProps {
  certificate: Certificate
  currentIndex: number
  totalCount: number
  onExpand: () => void
}

export function CertificateDetails({
  certificate,
  currentIndex,
  totalCount,
  onExpand,
}: CertificateDetailsProps) {
  // Animate metadata change with fade and slide
  const [animating, setAnimating] = useState(false)
  const [displayedCert, setDisplayedCert] = useState(certificate)
  const [displayedIndex, setDisplayedIndex] = useState(currentIndex)

  useEffect(() => {
    if (certificate.id !== displayedCert.id) {
      setAnimating(true)
      const timeout = setTimeout(() => {
        setDisplayedCert(certificate)
        setDisplayedIndex(currentIndex)
        setAnimating(false)
      }, 160)
      return () => clearTimeout(timeout)
    }
  }, [certificate, currentIndex, displayedCert.id])

  const formattedNum = String(displayedIndex + 1).padStart(2, '0')
  const formattedTotal = String(totalCount).padStart(2, '0')

  return (
    <div className="space-y-4 max-w-md w-full">
      {/* 1. Counter & Badge */}
      <div className="flex items-center space-x-3">
        <span className="font-mono text-sm font-black text-cyan-400">
          {formattedNum} / {formattedTotal}
        </span>
        <div className="h-3 w-[1px] bg-neutral-800" />
        <span
          className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800"
          style={{ color: displayedCert.accentColor }}
        >
          {displayedCert.category}
        </span>
      </div>

      {/* 2. Title & Issuer (Animated on change) */}
      <div
        className="space-y-1.5 transition-all duration-300"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(10px)' : 'translateY(0)',
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight leading-snug">
          {displayedCert.title}
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs font-mono text-neutral-400">
          <div>
            <span className="text-neutral-500">ISSUED BY: </span>
            <span className="text-neutral-200 font-semibold">{displayedCert.issuer}</span>
          </div>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <div>
            <span className="text-neutral-500">YEAR: </span>
            <span className="text-neutral-200">{displayedCert.date}</span>
          </div>
        </div>

        {/* Short description */}
        {displayedCert.description && (
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-1">
            {displayedCert.description}
          </p>
        )}

        {/* Skills Chips */}
        {displayedCert.skills && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {displayedCert.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Action Buttons */}
      <div className="flex items-center space-x-3 pt-2">
        {displayedCert.credentialUrl && (
          <a
            href={displayedCert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center space-x-1.5 active:scale-95"
          >
            <span>VIEW CREDENTIAL</span>
            <span className="group-hover:translate-x-1 transition-transform">↗</span>
          </a>
        )}

        <button
          onClick={onExpand}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 font-mono text-xs font-semibold transition-all flex items-center space-x-1.5 active:scale-95"
        >
          <span>VIEW DETAILS ⛶</span>
        </button>
      </div>
    </div>
  )
}
