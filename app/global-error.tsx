'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-center p-6 font-mono text-center space-y-4">
        <h1 className="text-2xl font-bold text-cyan-400 tracking-wider">SYSTEM EXCEPTION ENCOUNTERED</h1>
        <p className="text-xs text-neutral-400 max-w-md">
          A runtime error occurred during experience rendering.
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          RELOAD EXPERIENCE
        </button>
      </body>
    </html>
  )
}
