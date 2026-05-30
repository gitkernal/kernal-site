'use client'
import { useState, useEffect } from 'react'
import KernalLogo from './KernalLogo'

interface BootScreenProps {
  onComplete: () => void
}

const BOOT_LINES = [
  { text: 'KERNAL OS v2.0.0 — initializing...', delay: 0 },
  { text: 'Loading skill registry...', delay: 300 },
  { text: '✓ 12 skills indexed', delay: 600 },
  { text: 'Connecting to Base Network (chain: 8453)...', delay: 900 },
  { text: '✓ RPC endpoint online', delay: 1200 },
  { text: 'Loading Anthropic inference engine...', delay: 1500 },
  { text: '✓ claude-sonnet-4-6 ready', delay: 1800 },
  { text: 'Checking $KRN contract...', delay: 2100 },
  { text: '✓ 0x974B...046ba3 verified', delay: 2400 },
  { text: 'Mounting skill execution environment...', delay: 2700 },
  { text: '✓ All systems nominal', delay: 3000 },
  { text: '', delay: 3200 },
  { text: 'BOOT COMPLETE. Press any key or wait...', delay: 3400 },
]

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    BOOT_LINES.forEach(({ text, delay }) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, text])
        if (delay >= 3400) {
          setDone(true)
        }
      }, delay)
    })

    // Auto-advance after 4.2s
    const autoAdvance = setTimeout(onComplete, 4200)
    return () => clearTimeout(autoAdvance)
  }, [onComplete])

  useEffect(() => {
    if (!done) return
    const handler = () => onComplete()
    window.addEventListener('keydown', handler)
    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('click', handler)
    }
  }, [done, onComplete])

  return (
    <div
      className="fixed inset-0 flex flex-col items-start justify-center p-8 md:p-16"
      style={{ background: 'var(--dark)' }}
    >
      <div className="mb-8">
        <KernalLogo size={48} color="#B87420" />
      </div>

      <div className="font-mono text-[12px] leading-relaxed max-w-lg">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className="transition-opacity duration-200"
            style={{
              color: line.startsWith('✓') ? 'var(--greenM)'
                : line.startsWith('BOOT COMPLETE') ? 'var(--amber)'
                : 'var(--mid)',
              opacity: 1
            }}
          >
            {line || ' '}
          </div>
        ))}
        {visibleLines.length < BOOT_LINES.length && (
          <div className="animate-pulse" style={{ color: 'var(--amber)' }}>█</div>
        )}
      </div>

      {done && (
        <div
          className="mt-6 font-sans text-[10px] tracking-widest uppercase animate-pulse"
          style={{ color: 'var(--ghost)' }}
        >
          Click or press any key to continue
        </div>
      )}
    </div>
  )
}
