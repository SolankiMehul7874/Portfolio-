'use client'

import { useEffect } from 'react'
import type { Certificate } from './certificateData'

interface CertificateViewerProps {
  certificate: Certificate | null
  onClose: () => void
}

export function CertificateViewer({ certificate, onClose }: CertificateViewerProps) {
  // ESC key listener to close viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!certificate) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate: ${certificate.title}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in pointer-events-auto select-text"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#080d16] border border-cyan-500/50 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,240,255,0.25)] space-y-6 animate-pop-up overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center font-mono text-sm transition-colors z-20"
          aria-label="Close certificate inspector"
        >
          ✕
        </button>

        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: certificate.accentColor }}
        />

        {/* Certificate Credential Canvas in Lightbox */}
        <div
          className="relative rounded-2xl p-6 sm:p-8 border space-y-6 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0b111c 0%, #05070d 100%)',
            borderColor: `${certificate.accentColor}66`,
            boxShadow: `inset 0 0 30px ${certificate.accentColor}12`,
          }}
        >
          {/* Guilloche Watermark Pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, ${certificate.accentColor} 1.5px, transparent 1.5px), radial-gradient(circle at 0% 0%, white 1px, transparent 1px)`,
              backgroundSize: '24px 24px, 40px 40px',
            }}
          />

          {/* Top Header Row */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="space-y-1">
              <span
                className="text-[10px] font-mono font-bold tracking-widest uppercase"
                style={{ color: certificate.accentColor }}
              >
                OFFICIAL CERTIFICATE RECORD
              </span>
              <div className="text-xs font-mono text-neutral-400">
                REGISTRATION ID: <span className="text-white font-bold">{certificate.credentialId}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CRYPTOGRAPHICALLY VERIFIED</span>
            </div>
          </div>

          {/* Center Award Body */}
          <div className="text-center py-4 space-y-2">
            <div className="text-xs font-mono text-neutral-400 tracking-wider">
              THIS RECOGNITION IS OFFICIALLY PRESENTED TO
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-sans tracking-tight">
              {certificate.recipientName}
            </h2>
            <div className="text-sm font-mono text-cyan-300 font-semibold pt-1">
              FOR DEMONSTRATED COMPETENCY IN
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-neutral-100 max-w-lg mx-auto">
              {certificate.title}
            </h3>
          </div>

          {/* Issuer & Description Details */}
          <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/[0.06] space-y-2 text-xs">
            <div className="flex justify-between font-mono text-neutral-400">
              <span>ISSUED BY: <strong className="text-neutral-200">{certificate.issuer}</strong></span>
              <span>CONFERRED: <strong className="text-neutral-200">{certificate.date}</strong></span>
            </div>
            <p className="text-neutral-300 leading-relaxed pt-1">
              {certificate.description}
            </p>
          </div>

          {/* Validated Skills */}
          {certificate.skills && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">
                VALIDATED CURRICULAR ARTIFACTS:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {certificate.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-cyan-300"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Signature & External Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
            <div className="text-[10px] font-mono text-neutral-500">
              BLOCKCHAIN VERIFICATION RECORD • SIGNATURE VALID
            </div>

            <div className="flex items-center space-x-2">
              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <span>OFFICIAL RECORD</span>
                  <span>↗</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs font-bold transition-all"
              >
                CLOSE [ESC]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
