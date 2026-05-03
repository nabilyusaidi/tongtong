import { useEffect, useRef, useState } from 'react'
import Calculator from './components/Calculator'
import Guide from './components/Guide'
import Explanation from './components/Explanation'
import ResultCard from './components/ResultCard'

const taglines = ['tongtong','Go Dutch', 'Chip In', 'AA', '除',]

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function App() {
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('hs_theme')
    if (stored === 'light') return false
    if (stored === 'dark') return true
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('hs_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-neutral-950 text-slate-900 dark:text-white transition-colors">
      <nav className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/5 bg-white shadow-sm shadow-slate-300/40 dark:bg-neutral-950 dark:shadow-none">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tight text-blue-600 dark:text-blue-300">TongTong</span>
          <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-2 py-0.5 rounded-full">beta</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 dark:text-neutral-500 hidden sm:block">Split fuel and toll fairly</span>
          <button
            type="button"
            onClick={() => setIsDark(d => !d)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-blue-600 dark:text-blue-200 leading-tight mb-2">
            Nanti kita tongtong tau.
          </h1>
          <p className="text-slate-600 dark:text-neutral-400 text-sm mb-4">Split fuel and toll costs fairly.</p>
          <div className="flex flex-wrap gap-2">
            {taglines.map(tag => (
              <span key={tag} className="text-xs border border-slate-300 bg-white/70 dark:bg-transparent dark:border-white/10 text-slate-600 dark:text-neutral-400 px-3 py-1 rounded-full shadow-sm shadow-slate-300/30 dark:shadow-none">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div>
            <Guide />
          </div>
          <div>
            <Calculator onResultChange={setResult} resultTargetRef={resultRef} />
          </div>
          {result && (
            <div ref={resultRef} className="md:col-span-2">
              <ResultCard result={result} />
            </div>
          )}
        </div>

        <Explanation />
      </div>
    </div>
  )
}
