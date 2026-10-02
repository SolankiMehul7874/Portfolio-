'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorldStore } from '@/store/worldStore'
import { projects } from '@/data/projects'
import { usePointer } from '@/hooks/usePointer'

// =========================================================================
// 1. GLSL FLUID DISPLACEMENT SHADER FOR 3D CENTERPIECE
// Procedural liquid distortion & ink dispersion reacting to pointer & time
// =========================================================================
const fluidVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uActiveProject;
  
  varying vec2 vUv;
  varying float vElevation;

  // Classic Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;

    vec3 pos = position;
    
    // Wave 1: Slow global organic undulating swell
    float swell = snoise(pos.xy * 0.45 + uTime * 0.25) * 0.35;
    
    // Wave 2: Fast liquid ripple
    float ripple = sin(length(pos.xy - uPointer * 2.5) * 4.0 - uTime * 2.0) * 0.18;
    
    // Dynamic project index reaction
    float projectMod = sin(pos.x * 2.0 + uActiveProject * 1.57) * 0.15;

    float elevation = swell + ripple + projectMod;
    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fluidFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Dynamic fluid color interpolation
    float mixFactor = smoothstep(-0.3, 0.45, vElevation);
    vec3 baseColor = mix(uColorA, uColorB, mixFactor);

    // Subtle luminous grid scan lines
    float grid = step(0.96, fract(vUv.x * 32.0)) + step(0.96, fract(vUv.y * 32.0));
    vec3 gridColor = vec3(0.0, 0.94, 1.0) * grid * 0.15;

    // Outer edge vignette falloff
    float distFromCenter = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.55, 0.15, distFromCenter) * 0.75;

    gl_FragColor = vec4(baseColor + gridColor, alpha);
  }
`

function FluidMesh({ projectIndex }: { projectIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pointer = usePointer()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uActiveProject: { value: 0 },
      uColorA: { value: new THREE.Color('#030712') },
      uColorB: { value: new THREE.Color('#0e7490') },
    }),
    []
  )

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial
    mat.uniforms.uTime.value += delta
    mat.uniforms.uPointer.value.lerp(
      new THREE.Vector2(pointer.current.x, pointer.current.y),
      1 - Math.exp(-6 * delta)
    )
    mat.uniforms.uActiveProject.value = THREE.MathUtils.lerp(
      mat.uniforms.uActiveProject.value,
      projectIndex,
      1 - Math.exp(-8 * delta)
    )
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1.2]} rotation={[-0.4, 0, 0]}>
      <planeGeometry args={[14, 10, 64, 64]} />
      <shaderMaterial
        vertexShader={fluidVertexShader}
        fragmentShader={fluidFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        wireframe={false}
      />
    </mesh>
  )
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions] = useMemo(() => {
    const count = 300
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return [pos]
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00f0ff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// =========================================================================
// 2. 3D CAROUSEL COMPONENT (MIRROR HALL INSPIRED)
// Spatial cards with depth, rotation, one dominant active project, and dossier
// =========================================================================
export function ProjectsShowcase() {
  // Gate mounting: only subscribe and evaluate when in Part 3 Projects range (0.57 - 0.83)
  const isMounted = useWorldStore((s) => s.progress >= 0.57 && s.progress <= 0.83)
  const progress = useWorldStore((s) => (isMounted ? Math.round(s.progress * 100) / 100 : 0))
  const projectIndex = useWorldStore((s) => s.projectIndex)
  const setProjectIndex = useWorldStore((s) => s.setProjectIndex)
  const nextProject = useWorldStore((s) => s.nextProject)
  const prevProject = useWorldStore((s) => s.prevProject)
  const isCaseStudyOpen = useWorldStore((s) => s.isCaseStudyOpen)
  const setCaseStudyOpen = useWorldStore((s) => s.setCaseStudyOpen)

  const sectionOpacity = useMemo(() => {
    if (!isMounted) return 0
    if (progress < 0.64) {
      return (progress - 0.58) / 0.06 // 0 -> 1
    } else if (progress > 0.77) {
      return Math.max(0, 1 - (progress - 0.77) / 0.05) // 1 -> 0
    }
    return 1
  }, [progress, isMounted])

  const activeProject = projects[projectIndex % projects.length]

  // Keyboard controls for projects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMounted) return
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (e.key === 'Escape') {
        setCaseStudyOpen(false)
      } else if (e.key === 'ArrowLeft') {
        prevProject()
      } else if (e.key === 'ArrowRight') {
        nextProject()
      } else if (e.key === 'Enter') {
        setCaseStudyOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMounted, prevProject, nextProject, setCaseStudyOpen])

  if (!isMounted && sectionOpacity <= 0.001) return null

  return (
    <section
      aria-label="Experimental Projects Showcase"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden flex flex-col justify-between pt-16 pb-16 px-4 sm:px-8 select-none will-change-opacity"
      style={{ opacity: sectionOpacity }}
    >
      {/* Background 3D WebGL Fluid Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Canvas
          frameloop={isMounted && sectionOpacity > 0.05 ? 'always' : 'never'}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <FluidMesh projectIndex={projectIndex} />
          <ParticleField />
        </Canvas>
      </div>

      {/* Header telemetry badge */}
      <div className="relative z-10 max-w-6xl mx-auto w-full text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 tracking-widest uppercase backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>PART 03 // FEATURED PROJECTS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-sans tracking-tight">
          FEATURED PROJECTS & ARCHITECTURE
        </h2>
      </div>

      {/* 3D Spatial Carousel Stage */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex items-center justify-center my-4 perspective-[1200px]">
        <div className="relative w-full max-w-2xl min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
          {projects.map((proj, idx) => {
            const total = projects.length
            const offset = ((idx - (projectIndex % total) + total + Math.floor(total / 2)) % total) - Math.floor(total / 2)
            const isActive = offset === 0

            // 3D positioning
            const translateX = offset * 280
            const translateZ = isActive ? 0 : -180 - Math.abs(offset) * 60
            const rotateY = offset * -24
            const scale = isActive ? 1.0 : 0.85
            const cardOpacity = isActive ? 1.0 : Math.max(0.15, 0.45 - Math.abs(offset) * 0.15)
            const isClickable = Math.abs(offset) === 1

            return (
              <div
                key={proj.id}
                onClick={() => {
                  if (offset < 0) prevProject()
                  if (offset > 0) nextProject()
                }}
                className={`absolute w-full p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border transition-all duration-500 ease-out will-change-transform pointer-events-auto ${
                  isActive
                    ? 'bg-neutral-950/90 border-cyan-400/60 shadow-[0_0_50px_rgba(0,240,255,0.22)] z-30 cursor-default'
                    : 'bg-neutral-950/60 border-white/[0.08] hover:border-cyan-500/30 shadow-xl z-10'
                } ${isClickable ? 'cursor-pointer' : ''}`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity: cardOpacity,
                }}
              >
                {/* Active glow top edge */}
                {isActive && (
                  <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}

                <div className="flex flex-col h-full justify-between space-y-4">
                  {/* Top category & index */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      0{idx + 1} / 0{total}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {proj.title}
                    </h3>
                    {proj.tagline && (
                      <div className="text-xs font-mono text-cyan-300/80 mt-0.5">
                        {proj.tagline} • {proj.year}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
                    {proj.shortDescription}
                  </p>

                  {/* Key Contribution */}
                  <div className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">
                      CORE CONTRIBUTION:
                    </div>
                    <div className="text-xs text-neutral-200 mt-1 line-clamp-2">
                      {proj.contribution}
                    </div>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    {proj.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-cyan-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions: Explore Dossier & GitHub */}
                  {isActive && (
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
                      <button
                        onClick={() => setCaseStudyOpen(true)}
                        className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 flex items-center space-x-2"
                      >
                        <span>VIEW CASE STUDY</span>
                        <span>➔</span>
                      </button>

                      {proj.repository && (
                        <a
                          href={proj.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-neutral-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
                        >
                          <span>GITHUB REPO</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Carousel Stepper Bar */}
      <div className="relative z-10 max-w-xl mx-auto w-full flex items-center justify-between backdrop-blur-xl bg-neutral-950/80 border border-neutral-800/80 p-2 sm:p-2.5 rounded-2xl shadow-2xl">
        <button
          onClick={prevProject}
          className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-cyan-400 hover:text-cyan-300 border border-neutral-800 hover:border-cyan-500/50 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95"
        >
          <span>‹</span>
          <span>PREVIOUS</span>
        </button>

        {/* Indicator dots */}
        <div className="flex items-center space-x-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setProjectIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === projectIndex % projects.length
                  ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
              aria-label={`Slide to project ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextProject}
          className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-cyan-400 hover:text-cyan-300 border border-neutral-800 hover:border-cyan-500/50 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95"
        >
          <span>NEXT</span>
          <span>›</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* CASE STUDY / DOSSIER MODAL                           */}
      {/* ==================================================== */}
      {isCaseStudyOpen && activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setCaseStudyOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#070a10] border border-cyan-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,240,255,0.25)] space-y-6 text-left"
          >
            {/* Close Button */}
            <button
              onClick={() => setCaseStudyOpen(false)}
              aria-label="Close dossier modal"
              className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-cyan-400/60 flex items-center space-x-1.5 transition-colors font-mono text-xs"
            >
              <span>✕</span>
              <span className="text-[10px] text-neutral-400">ESC</span>
            </button>

            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                CASE STUDY // {activeProject.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {activeProject.title}
              </h2>
            </div>

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <div className="text-xs font-mono text-red-400 uppercase font-semibold">
                  PROBLEM STATEMENT
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {activeProject.problem}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                  ENGINEERED SOLUTION
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {activeProject.solution}
                </p>
              </div>
            </div>

            {/* System Architecture Flow */}
            {activeProject.architecture && (
              <div className="space-y-2">
                <div className="text-xs font-mono text-neutral-400 uppercase font-semibold">
                  ARCHITECTURE PIPELINE:
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  {activeProject.architecture.map((arch, i) => (
                    <div key={i} className="flex items-center">
                      <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-cyan-300">
                        {arch}
                      </span>
                      {i < activeProject.architecture!.length - 1 && (
                        <span className="text-neutral-600 mx-1.5">➔</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features & Challenges */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-neutral-400 uppercase font-semibold">
                KEY FEATURES & RESILIENCE:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeProject.features?.map((feat, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Results */}
            {activeProject.results && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5">
                <div className="text-xs font-mono text-cyan-300 uppercase font-bold">
                  VERIFIED RESULTS:
                </div>
                {activeProject.results.map((res, i) => (
                  <div key={i} className="text-xs text-neutral-200">
                    ★ {res}
                  </div>
                ))}
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
              {activeProject.repository && (
                <a
                  href={activeProject.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-white flex items-center space-x-2 transition-colors"
                >
                  <span>VIEW GITHUB REPOSITORY</span>
                  <span>↗</span>
                </a>
              )}
              <button
                onClick={() => setCaseStudyOpen(false)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-mono font-bold transition-all"
              >
                CLOSE CASE STUDY
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
