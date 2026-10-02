'use client'

import { useState, useMemo } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { siteConfig } from '@/data/site'

const REPOSITORIES = [
  {
    name: 'Prime-News-Flutter',
    desc: 'High-performance Flutter client over News API with Firebase authentication, offline caching, and responsive UI.',
    language: 'Dart',
    languageColor: '#00B4AB',
    url: 'https://github.com/SolankiMehul7874',
  },
  {
    name: 'scalable-backend-rest-engine',
    desc: 'Modular REST API architecture featuring stateless JWT auth, MVC pattern, rate limiting, and SQL persistence.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    url: 'https://github.com/SolankiMehul7874',
  },
  {
    name: 'ml-predictive-pipeline',
    desc: 'Automated data cleaning, categorical scaling, and model training with Scikit-learn, NumPy, and Pandas.',
    language: 'Python',
    languageColor: '#3572A5',
    url: 'https://github.com/SolankiMehul7874',
  },
  {
    name: 'native-android-architecture',
    desc: 'Offline-first Android application built with Java, Kotlin, SQLite database indexing, and Jetpack components.',
    language: 'Kotlin',
    languageColor: '#A97BFF',
    url: 'https://github.com/SolankiMehul7874',
  },
]

export function ConnectionSection() {
  // Gate mounting: only subscribe and evaluate when in Part 4 range (>= 0.88)
  const isMounted = useWorldStore((s) => s.progress >= 0.88)
  const progress = useWorldStore((s) => (isMounted ? Math.round(s.progress * 100) / 100 : 0))
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageStatus, setMessageStatus] = useState<string | null>(null)

  const sectionOpacity = useMemo(() => {
    if (!isMounted) return 0
    if (progress < 0.93) {
      return (progress - 0.88) / 0.05 // 0 -> 1
    }
    return 1
  }, [progress, isMounted])

  if (!isMounted || sectionOpacity <= 0.001) return null

  const handleCopyEmail = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(siteConfig.email)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = siteConfig.email
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2400)
    } catch {
      setCopiedEmail(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return
    const subject = encodeURIComponent('Developer Inquiry // Mehul Solanki Portfolio')
    const body = encodeURIComponent(messageText)
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
    setMessageStatus('EMAIL CLIENT OPENED // READY TO SEND')
    setTimeout(() => {
      setMessageStatus(null)
    }, 4000)
  }

  const scrollToTop = () => {
    // @ts-expect-error global lenis
    if (typeof window !== 'undefined' && window.__lenis) {
      // @ts-expect-error global lenis
      window.__lenis.scrollTo(0, {
        duration: 0.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section
      aria-label="GitHub and Contact Destination"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden flex flex-col justify-between pt-16 pb-16 px-4 sm:px-8 md:px-12 bg-[#040608]/96 text-neutral-100 transition-opacity duration-300 select-none will-change-opacity"
      style={{ opacity: sectionOpacity }}
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full justify-between">
        {/* Header telemetry badge */}
        <div className="pointer-events-auto space-y-1.5 border-b border-white/[0.08] pb-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>PART 04 // CONTACT & COLLABORATION</span>
            </div>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>@SolankiMehul7874</span>
              <span>↗</span>
            </a>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white font-sans">
            GET IN TOUCH
          </h1>
        </div>

        {/* Main interactive split grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center my-3">
          {/* Left Column: GitHub Repositories Grid */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              VERIFIED REPOSITORIES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {REPOSITORIES.map((repo, idx) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto card-3d p-3.5 rounded-xl bg-neutral-950/70 border border-white/[0.08] hover:border-cyan-400/60 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,240,255,0.12)] shadow-md flex flex-col justify-between space-y-2 transition-all duration-300 animate-pop-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono truncate">
                        {repo.name}
                      </span>
                      <span className="text-cyan-400 text-xs">↗</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-snug">
                      {repo.desc}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-1 border-t border-neutral-900 text-[10px] font-mono">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: repo.languageColor }}
                    />
                    <span className="text-neutral-300">{repo.language}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Links */}
            <div className="flex items-center space-x-2 pt-1 font-mono text-xs">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-cyan-400 hover:text-white text-neutral-300 hover:scale-105 transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <span>LINKEDIN</span>
                <span>↗</span>
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-cyan-400 hover:text-white text-neutral-300 hover:scale-105 transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <span>GITHUB</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct Dispatch Terminal */}
          <div className="lg:col-span-6 pointer-events-auto p-5 sm:p-6 rounded-2xl bg-neutral-950/85 border border-white/[0.08] shadow-2xl space-y-3.5 animate-pop-up">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                DIRECT MESSAGE // INQUIRY
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Email copy row */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-2 font-mono text-xs">
              <span className="text-cyan-300 truncate font-semibold">{siteConfig.email}</span>
              <button
                onClick={handleCopyEmail}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all active:scale-95 shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                  copiedEmail
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 hover:border-cyan-400/40'
                }`}
              >
                <span>{copiedEmail ? '✓' : '⧉'}</span>
                <span>{copiedEmail ? 'COPIED TO CLIPBOARD' : 'COPY EMAIL'}</span>
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Enter inquiry, message, or project proposal..."
                className="w-full p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 focus:border-cyan-400 text-xs text-neutral-100 placeholder-neutral-500 font-sans outline-none transition-all resize-none"
                required
              />

              {messageStatus && (
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
                  {messageStatus}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                <span>SEND MESSAGE VIA EMAIL</span>
                <span>➔</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom footer & return jumper */}
        <div className="pointer-events-auto flex items-center justify-between pt-2 border-t border-white/[0.06] font-mono text-[11px] text-neutral-500">
          <span>MEHUL SOLANKI © {new Date().getFullYear()}</span>
          <button
            onClick={scrollToTop}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
          >
            <span>RETURN TO TOP</span>
            <span>▲</span>
          </button>
        </div>
      </div>
    </section>
  )
}
