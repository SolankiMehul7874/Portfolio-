'use client'

import { useState, useMemo } from 'react'
import { useWorldStore } from '@/store/worldStore'

type DetailedCertification = {
  id: string
  name: string
  issuer: string
  category: 'Mobile' | 'Systems & Blockchain' | 'Core Engineering' | 'Competitive'
  date: string
  credentialId: string
  description: string
  skills: string[]
  verified: boolean
}

const DETAILED_CERTS: DetailedCertification[] = [
  {
    id: 'cert-1',
    name: 'Android App Development',
    issuer: 'Professional Certification Authority',
    category: 'Mobile',
    date: '2023 - 2024',
    credentialId: 'CERT-ANDR-8821',
    description:
      'Mastery of native Android architecture, activity lifecycles, SQLite persistence, and responsive mobile interfaces in Java & Kotlin.',
    skills: ['Android Studio', 'Java', 'Kotlin', 'SQLite', 'Jetpack Architecture'],
    verified: true,
  },
  {
    id: 'cert-2',
    name: 'Stylus Core Concepts',
    issuer: 'Arbitrum / Offchain Labs',
    category: 'Systems & Blockchain',
    date: '2024',
    credentialId: 'ARB-STYLUS-CORE-90',
    description:
      'WASM-powered smart contract development on Arbitrum Stylus utilizing Rust, C++, and high-throughput memory layout optimization.',
    skills: ['Stylus SDK', 'Rust', 'C++', 'WASM Smart Contracts', 'Arbitrum'],
    verified: true,
  },
  {
    id: 'cert-3',
    name: 'Stylus Foundation',
    issuer: 'Arbitrum / Offchain Labs',
    category: 'Systems & Blockchain',
    date: '2024',
    credentialId: 'ARB-STYLUS-FND-44',
    description:
      'Core primitives of multi-VM execution environments, EVM equivalence, and Web3 decentralized application architecture.',
    skills: ['Web3', 'Arbitrum Nitro', 'Multi-VM Execution', 'Decentralized Networks'],
    verified: true,
  },
  {
    id: 'cert-4',
    name: 'TechShastra 2K26 — 24-Hour Hackathon',
    issuer: 'TechShastra National Hackathon',
    category: 'Competitive',
    date: '2026',
    credentialId: 'HACK-TS26-PART',
    description:
      '24-hour intensive competitive hackathon building and deploying collaborative full-stack architectures under compressed timeline constraints.',
    skills: ['Rapid Prototyping', 'Team Engineering', 'Live Pitching', 'Full-Stack Delivery'],
    verified: true,
  },
  {
    id: 'cert-5',
    name: 'Web3 Basics & Distributed Architecture',
    issuer: 'Decentralized Systems Institute',
    category: 'Systems & Blockchain',
    date: '2023',
    credentialId: 'WEB3-BC-552',
    description:
      'Cryptographic verification, consensus algorithms, peer-to-peer network routing, and distributed state machines.',
    skills: ['Cryptography', 'Consensus Mechanisms', 'State Trees', 'P2P Networks'],
    verified: true,
  },
  {
    id: 'cert-6',
    name: 'Fundamentals of Digital Marketing',
    issuer: 'Google Digital Garage',
    category: 'Core Engineering',
    date: '2023',
    credentialId: 'GOOGLE-DIG-MKT-77',
    description:
      'Data-driven user analytics, digital discoverability, SEO optimization, and audience retention metrics.',
    skills: ['Web Analytics', 'SEO Optimization', 'User Funnels', 'Product Growth'],
    verified: true,
  },
]

export function CertificationsShowcase() {
  const isMounted = useWorldStore((s) => s.progress >= 0.74 && s.progress <= 0.90)
  const progress = useWorldStore((s) => (isMounted ? Math.round(s.progress * 100) / 100 : 0))
  const [selectedFilter, setSelectedFilter] = useState<string>('All')
  const [activeCert, setActiveCert] = useState<DetailedCertification | null>(null)

  const sectionOpacity = useMemo(() => {
    if (!isMounted) return 0
    if (progress < 0.78) {
      return (progress - 0.74) / 0.04 // 0 -> 1
    } else if (progress > 0.86) {
      return Math.max(0, 1 - (progress - 0.86) / 0.04) // 1 -> 0
    }
    return 1
  }, [progress, isMounted])

  const filteredCerts = useMemo(() => {
    if (selectedFilter === 'All') return DETAILED_CERTS
    return DETAILED_CERTS.filter((c) => c.category === selectedFilter)
  }, [selectedFilter])

  if (!isMounted && sectionOpacity <= 0.001) return null

  return (
    <section
      aria-label="Verified Certifications & Credentials Showcase"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden flex flex-col justify-between pt-16 pb-16 px-4 sm:px-8 md:px-12 bg-[#03060a]/96 text-neutral-100 transition-opacity duration-300 select-none will-change-opacity"
      style={{ opacity: sectionOpacity }}
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full justify-between">
        {/* Header telemetry badge */}
        <div className="pointer-events-auto space-y-2 border-b border-white/[0.08] pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>PART 03 // CREDENTIALS ARCHIVE</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-sans tracking-tight mt-1">
                VERIFIED CREDENTIALS & HONORS
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center flex-wrap gap-1.5 font-mono text-xs">
              {['All', 'Mobile', 'Systems & Blockchain', 'Competitive', 'Core Engineering'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-all ${
                    selectedFilter === cat
                      ? 'bg-cyan-500 text-neutral-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Holographic Credential Plaques Grid */}
        <div className="flex-1 flex items-center justify-center my-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
            {filteredCerts.map((cert, idx) => (
              <div
                key={cert.id}
                onClick={() => setActiveCert(cert)}
                className="pointer-events-auto card-3d group relative p-4 sm:p-5 rounded-2xl bg-neutral-950/75 border border-white/[0.08] hover:border-cyan-400/60 shadow-lg cursor-pointer flex flex-col justify-between space-y-2.5 animate-pop-up"
                style={{ animationDelay: `${idx * 55}ms` }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                      {cert.category}
                    </span>
                    <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[9px] font-mono text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>VERIFIED</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    {cert.name}
                  </h3>

                  <div className="text-xs font-mono text-neutral-400">
                    <span>{cert.issuer}</span>
                    <span className="text-neutral-600 mx-1.5">•</span>
                    <span>{cert.date}</span>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>ID: {cert.credentialId}</span>
                  <span className="text-cyan-400 group-hover:underline">VIEW RECORD ➔</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="text-center pt-2 border-t border-white/[0.06]">
          <span className="text-[11px] font-mono text-cyan-400 animate-pulse">
            SCROLL FORWARD TO REACH GITHUB & DIRECT TRANSMISSION TERMINAL ↓
          </span>
        </div>
      </div>

      {/* Detail Credential Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl pointer-events-auto">
          <div className="relative w-full max-w-lg bg-[#070b12] border border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.3)] space-y-5 animate-pop-up">
            <button
              onClick={() => setActiveCert(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center font-mono"
            >
              ✕
            </button>

            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                CREDENTIAL RECORD // {activeCert.category}
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">{activeCert.name}</h3>
              <div className="text-sm font-mono text-neutral-300 mt-0.5">
                Issued by {activeCert.issuer} ({activeCert.date})
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {activeCert.description}
            </p>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1 font-mono text-xs">
              <div className="text-neutral-500">VERIFIED REGISTRATION ID:</div>
              <div className="text-cyan-300 font-bold tracking-wider">{activeCert.credentialId}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-neutral-400 uppercase">VALIDATED SKILLS:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeCert.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-cyan-300"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveCert(null)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono text-xs font-bold transition-all"
            >
              CLOSE RECORD
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
