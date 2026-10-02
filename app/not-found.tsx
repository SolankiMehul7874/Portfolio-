'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-center p-6 font-mono text-center space-y-4">
      <h1 className="text-4xl font-bold text-cyan-400 tracking-wider">404 // ROUTE NOT FOUND</h1>
      <p className="text-sm text-neutral-400 max-w-md">
        The requested 4D spatial coordinate does not exist in the active viewport.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
      >
        RETURN TO BASE MATRIX
      </Link>
    </div>
  )
}
