'use client'

import { useEffect } from 'react'
import { useWorldStore } from '@/store/worldStore'
import { projects } from '@/data/projects'
import { skills, skillCategories } from '@/data/skills'
import { experiences } from '@/data/experience'
import { education, certifications } from '@/data/education'
import { siteConfig } from '@/data/site'

export function AccessibleContent() {
  const isCaseStudyOpen = useWorldStore((s) => s.isCaseStudyOpen)
  const setCaseStudyOpen = useWorldStore((s) => s.setCaseStudyOpen)
  const projectIndex = useWorldStore((s) => s.projectIndex)

  const selectedProject = projects[projectIndex % projects.length]

  const handleClose = () => {
    setCaseStudyOpen(false)
    useWorldStore.getState().setFocusedProjectId(null)
  }

  // Global Escape key dismiss listener
  useEffect(() => {
    if (!isCaseStudyOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCaseStudyOpen])

  return (
    <>
      {/* ==================================================== */}
      {/* 1. CONTINUOUS SCROLL TIMELINE TRACK                 */}
      {/* Provides the vertical scroll space for Lenis       */}
      {/* without rendering any blocking cards in the 3D view  */}
      {/* ==================================================== */}
      <div
        aria-hidden="true"
        className="h-[600vh] w-full pointer-events-none opacity-0 select-none"
      />

      {/* ==================================================== */}
      {/* 2. SEMANTIC ACCESSIBILITY & SEO NARRATIVE DOM        */}
      {/* Screen-reader accessible; no visual cards           */}
      {/* ==================================================== */}
      <main className="sr-only">
        <header>
          <h1>{siteConfig.name} — {siteConfig.role}</h1>
          <p>{siteConfig.tagline}</p>
          <p>{siteConfig.heroDescription}</p>
          <p>Location: {siteConfig.location} | Education: {siteConfig.institution} | DDCET Rank: #{siteConfig.stats.ddcetRank}</p>
        </header>

        {/* About Narrative */}
        <section aria-label="About Mehul Solanki">
          <h2>About Mehul Solanki</h2>
          <p>{siteConfig.about}</p>
        </section>

        {/* Projects / Our Cases */}
        <section aria-label="Selected Projects">
          <h2>Selected Work & System Architecture</h2>
          {projects.map((proj) => (
            <article key={proj.id}>
              <h3>{proj.title} ({proj.year})</h3>
              <p>Category: {proj.category}</p>
              <p>Overview: {proj.shortDescription}</p>
              <p>Problem: {proj.problem}</p>
              <p>Solution: {proj.solution}</p>
              <p>Contribution: {proj.contribution}</p>
              <p>Technologies: {proj.technologies.join(', ')}</p>
              {proj.architecture && <p>Architecture: {proj.architecture.join(' -> ')}</p>}
              {proj.repository && <a href={proj.repository}>GitHub Repository</a>}
            </article>
          ))}
        </section>

        {/* Skills & Capabilities */}
        <section aria-label="Technical Skills">
          <h2>Technical Arsenal</h2>
          {skillCategories.map((cat) => (
            <div key={cat}>
              <h3>{cat}</h3>
              <ul>
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <li key={skill.id}>
                      <strong>{skill.name}</strong>: {skill.description}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Experience & Milestones */}
        <section aria-label="Experience and Milestones">
          <h2>Timeline & Archive</h2>
          {experiences.map((exp) => (
            <article key={exp.id}>
              <h3>{exp.title} at {exp.organization} ({exp.year})</h3>
              <p>{exp.description}</p>
            </article>
          ))}
          <h3>Education</h3>
          {education.map((edu) => (
            <div key={edu.id}>
              <h4>{edu.degree} — {edu.institution} ({edu.year})</h4>
              <p>{edu.description}</p>
            </div>
          ))}
          <h3>Certifications</h3>
          <ul>
            {certifications.map((c) => (
              <li key={c.id}>
                {c.name}{c.issuer ? ` — ${c.issuer}` : ''}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact Coordinates */}
        <section aria-label="Contact Information">
          <h2>Lets Collaborate</h2>
          <p>Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
          <p>GitHub: <a href={siteConfig.github}>{siteConfig.github}</a></p>
          <p>LinkedIn: <a href={siteConfig.linkedin}>{siteConfig.linkedin}</a></p>
        </section>
      </main>

      {/* ==================================================== */}
      {/* 3. TECHNICAL DOSSIER DEEP-DIVE MODAL                 */}
      {/* Opens when visitor clicks any interactive monitor  */}
      {/* ==================================================== */}
      {isCaseStudyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={handleClose}
        >
          <div
            className="bg-neutral-950 border border-neutral-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-2xl space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-left pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. ABOUT ME DOSSIER */}
            {useWorldStore.getState().focusedProjectId === 'about' || useWorldStore.getState().focusedProjectId === 'github' ? (
              <>
                <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-semibold tracking-wider uppercase">
                      PROFILE & BIOGRAPHY // PROFESSIONAL BACKGROUND
                    </span>
                    <h3 id="case-study-title" className="text-2xl md:text-3xl font-black text-white mt-1">
                      {siteConfig.name}
                    </h3>
                    <p className="text-xs font-mono text-emerald-400 mt-0.5 uppercase">
                      Software Engineer · Backend, Flutter, Android & Machine Learning
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="font-mono text-xs px-3.5 py-1.5 border border-neutral-700 hover:border-cyan-400 hover:text-cyan-400 rounded-lg text-neutral-300 transition-colors"
                  >
                    ✕ CLOSE [ESC]
                  </button>
                </div>

                <div className="space-y-5 text-sm leading-relaxed text-neutral-300">
                  {/* Quick Stat Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-neutral-900/90 border border-cyan-500/30 rounded-xl">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">STATE RANKING</span>
                      <span className="text-lg font-black font-mono text-cyan-400">{siteConfig.stats.ddcetRank}</span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">DDCET State Percentile Top 0.5%</span>
                    </div>
                    <div className="p-3 bg-neutral-900/90 border border-emerald-500/30 rounded-xl">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">ACADEMIC FOUNDATION</span>
                      <span className="text-lg font-black font-mono text-emerald-400">B.E. IT</span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">{siteConfig.institution}</span>
                    </div>
                    <div className="p-3 bg-neutral-900/90 border border-blue-500/30 rounded-xl">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">CURRENT STATUS</span>
                      <span className="text-lg font-black font-mono text-blue-400">ACTIVE</span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">{siteConfig.availability}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 uppercase font-semibold">EXECUTIVE BIOGRAPHY & PHILOSOPHY</h4>
                    <p className="mt-1.5 text-neutral-200">
                      {siteConfig.about}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 uppercase mb-2 font-semibold">CORE ARCHITECTURAL PILLARS</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white font-mono text-xs">01. High-Throughput Distributed Backends</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Node / Express / PHP / SQL</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">Clean MVC & hexagonal REST architecture, stateless JWT auth, connection pooling, and optimized indexing.</p>
                      </div>
                      <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white font-mono text-xs">02. Cross-Platform Mobile Engineering</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">Flutter / Dart / Firebase</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">Reactive state management (Bloc/Provider), offline-first local caching, and seamless 60/120 FPS micro-animations.</p>
                      </div>
                      <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white font-mono text-xs">03. Machine Learning & Native Android Systems</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">Python / Scikit-learn / Kotlin</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">End-to-end data preprocessing pipelines, tabular model evaluation, and native Android lifecycle architecture.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 uppercase mb-2 font-semibold">TECHNICAL ECOSYSTEM</h4>
                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      {['Flutter', 'Dart', 'Node.js', 'Express', 'PHP', 'Python', 'Scikit-learn', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Java', 'Kotlin', 'TypeScript', 'Docker', 'Git'].map((l) => (
                        <span key={l} className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex flex-wrap justify-between items-center gap-3 font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="px-4 py-2 border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/60 hover:text-cyan-300 rounded-lg text-white transition-colors"
                    >
                      SEND INQUIRY ✉
                    </a>
                    <a
                      href={siteConfig.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-neutral-700 bg-neutral-900 hover:border-cyan-400 hover:text-cyan-300 rounded-lg text-neutral-300 transition-colors"
                    >
                      LINKEDIN ↗
                    </a>
                  </div>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 transition-colors"
                  >
                    RETURN TO PORTFOLIO
                  </button>
                </div>
              </>
            ) : useWorldStore.getState().focusedProjectId === 'education' ? (
              /* 2. EDUCATION DOSSIER */
              <>
                <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                  <div>
                    <span className="font-mono text-xs text-amber-400 font-semibold tracking-wider uppercase">
                      ACADEMIC RECORD // HONORS
                    </span>
                    <h3 id="case-study-title" className="text-2xl md:text-3xl font-black text-white mt-1">
                      L.D. College of Engineering
                    </h3>
                    <p className="text-xs font-mono text-cyan-400 mt-0.5 uppercase">
                      B.E. — Information Technology (Ongoing)
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="font-mono text-xs px-3.5 py-1.5 border border-neutral-700 hover:border-cyan-400 hover:text-cyan-400 rounded-lg text-neutral-300 transition-colors"
                  >
                    ✕ CLOSE [ESC]
                  </button>
                </div>

                <div className="space-y-5 text-sm leading-relaxed text-neutral-300">
                  <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-sm">
                      <span>🏆</span>
                      <span>DDCET STATE ENTRANCE RANK #113</span>
                    </div>
                    <p className="text-xs text-neutral-300">
                      Ranked 113 in the diploma-to-degree entrance exam across Gujarat state; recognised as an &quot;All Rounder&quot; for balancing academic rigor with practical software projects.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 uppercase font-semibold">CORE CURRICULUM</h4>
                    <p className="mt-1 text-xs text-neutral-300">
                      Software Engineering, Database Management Systems (DBMS), Operating Systems, Computer Networks, Data Structures & Algorithms, Object-Oriented Programming, Clean Architecture.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 uppercase mb-2 font-semibold">HACKATHONS & SPRINT RECOGNITIONS</h4>
                    <p className="text-xs text-neutral-300">
                      • <strong>TechShastra 2K26</strong>: 24-Hour Hackathon sprint, engineering rapid cross-platform prototypes under real time constraints.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end space-x-3 font-mono text-xs">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 transition-colors"
                  >
                    RETURN TO PORTFOLIO
                  </button>
                </div>
              </>
            ) : useWorldStore.getState().focusedProjectId === 'experience' ? (
              /* 3. EXPERIENCE DOSSIER */
              <>
                <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-semibold tracking-wider uppercase">
                      PROFESSIONAL TIMELINE
                    </span>
                    <h3 id="case-study-title" className="text-2xl md:text-3xl font-black text-white mt-1">
                      Engineering Experience
                    </h3>
                    <p className="text-xs font-mono text-emerald-400 mt-0.5 uppercase">
                      InfoLabz & Independent Engineering
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="font-mono text-xs px-3.5 py-1.5 border border-neutral-700 hover:border-cyan-400 hover:text-cyan-400 rounded-lg text-neutral-300 transition-colors"
                  >
                    ✕ CLOSE [ESC]
                  </button>
                </div>

                <div className="space-y-5 text-sm leading-relaxed text-neutral-300">
                  <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white font-mono text-sm">Flutter Developer Intern @ InfoLabz</span>
                      <span className="font-mono text-xs text-cyan-400">2024</span>
                    </div>
                    <ul className="text-xs text-neutral-300 space-y-1.5 list-disc pl-4 mt-2">
                      <li>Built and maintained cross-platform mobile features in Flutter with responsive UI components.</li>
                      <li>Integrated Firebase Authentication and cloud database syncing for user profiles and data.</li>
                      <li>Collaborated directly with product and design leads to ship stable screens on active release cycles.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white font-mono text-sm">Independent Developer (Self-directed)</span>
                      <span className="font-mono text-xs text-emerald-400">2023 - Present</span>
                    </div>
                    <ul className="text-xs text-neutral-300 space-y-1.5 list-disc pl-4 mt-2">
                      <li>Designing and shipping full-stack REST API backends with JWT authentication and MySQL/PostgreSQL schema modeling.</li>
                      <li>Architecting native Android applications with Java, Kotlin, and SQLite local caching.</li>
                      <li>Developing data science and machine learning evaluation pipelines published on GitHub.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end space-x-3 font-mono text-xs">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 transition-colors"
                  >
                    RETURN TO PORTFOLIO
                  </button>
                </div>
              </>
            ) : selectedProject ? (
              /* 4. DEFAULT PROJECT DOSSIER */
              <>
                <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-semibold tracking-wider uppercase">
                      {selectedProject.year} // {selectedProject.tagline || selectedProject.category}
                    </span>
                    <h3 id="case-study-title" className="text-2xl md:text-3xl font-black text-white mt-1">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs font-mono text-emerald-400 mt-0.5 uppercase">
                      {selectedProject.category}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="font-mono text-xs px-3.5 py-1.5 border border-neutral-700 hover:border-cyan-400 hover:text-cyan-400 rounded-lg text-neutral-300 transition-colors"
                  >
                    ✕ CLOSE [ESC]
                  </button>
                </div>

                <div className="space-y-5 text-sm leading-relaxed text-neutral-300">
                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 uppercase font-semibold">PROBLEM</h4>
                    <p className="mt-1">{selectedProject.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 uppercase font-semibold">SOLUTION</h4>
                    <p className="mt-1">{selectedProject.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 uppercase font-semibold">MY CONTRIBUTION</h4>
                    <p className="mt-1">{selectedProject.contribution}</p>
                  </div>

                  {selectedProject.architecture && (
                    <div>
                      <h4 className="font-mono text-xs text-neutral-500 uppercase mb-2 font-semibold">
                        SYSTEM ARCHITECTURE
                      </h4>
                      <div className="font-mono text-xs bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800 flex flex-wrap items-center gap-2 text-cyan-400">
                        {selectedProject.architecture.map((layer, idx) => (
                          <span key={layer} className="flex items-center">
                            <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded font-semibold">
                              {layer}
                            </span>
                            {idx < selectedProject.architecture!.length - 1 && (
                              <span className="mx-1 text-neutral-600">➔</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.features && (
                    <div>
                      <h4 className="font-mono text-xs text-neutral-500 uppercase mb-2 font-semibold">KEY FEATURES</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                        {selectedProject.features.map((feat) => (
                          <li key={feat} className="flex items-center space-x-2">
                            <span className="text-emerald-400">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end space-x-3 font-mono text-xs">
                  {selectedProject.repository && (
                    <a
                      href={selectedProject.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-neutral-700 hover:border-cyan-400 hover:text-cyan-400 rounded-lg text-white transition-colors"
                    >
                      VIEW GITHUB REPOSITORY ↗
                    </a>
                  )}
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 transition-colors"
                  >
                    RETURN TO PORTFOLIO
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}
