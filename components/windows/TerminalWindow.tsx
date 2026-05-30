'use client'
import { useState, useRef, useEffect } from 'react'
import Window from './Window'
import { SKILLS_DATA } from '@/lib/skills-data'

interface TerminalWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

const BANNER = [
  'KERNAL OS v2.0.0',
  'Type "help" for available commands.',
  ''
]

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  skills        List all skills
  skills free   List free skills
  skills prem   List premium skills
  token         Show $KRN token info
  stats         Show platform statistics
  clear         Clear terminal
  version       Show version info`,

  token: `$KRN Token — Base Network
Contract: 0x974B53861d975E727305298D2718849c43046ba3
Premium:  10,000,000 KRN
Priority: 100,000,000 KRN
Uniswap:  app.uniswap.org → Base → $KRN`,

  version: 'KERNAL OS v2.0.0 | Next.js 14 | claude-sonnet-4-5-20251001 | Base Network',

  stats: `Platform Statistics:
Skills:      12 live
Installs:    ~16,904 total
Executions:  ~113,110 total
Networks:    Base, Ethereum, Arbitrum`,
}

export default function TerminalWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: TerminalWindowProps) {
  const [lines, setLines] = useState<{ text: string; type: 'output' | 'input' | 'error' }[]>(
    BANNER.map(t => ({ text: t, type: 'output' }))
  )
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [lines])

  function processCommand(cmd: string) {
    const trimmed = cmd.trim().toLowerCase()
    setLines(prev => [...prev, { text: `> ${cmd}`, type: 'input' }])

    if (trimmed === 'clear') {
      setLines(BANNER.map(t => ({ text: t, type: 'output' })))
      return
    }

    if (trimmed === 'skills' || trimmed === 'skills free' || trimmed === 'skills prem') {
      let data = SKILLS_DATA
      if (trimmed === 'skills free') data = data.filter((s: { tier: string }) => s.tier === 'free')
      if (trimmed === 'skills prem') data = data.filter((s: { tier: string }) => s.tier === 'premium')
      const output = data.map((s: { name: string; tier: string; category: string; tagline: string }) =>
        `  ${s.name.padEnd(26)} [${s.tier}] ${s.tagline}`
      ).join('\n')
      setLines(prev => [...prev, { text: output, type: 'output' }])
      return
    }

    if (COMMANDS[trimmed]) {
      setLines(prev => [...prev, { text: COMMANDS[trimmed], type: 'output' }])
      return
    }

    setLines(prev => [...prev, {
      text: `Command not found: ${trimmed}. Type "help" for commands.`,
      type: 'error'
    }])
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input)
      setHistory(prev => [input, ...prev])
      setHistIdx(-1)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      const newIdx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(newIdx)
      setInput(history[newIdx] || '')
    } else if (e.key === 'ArrowDown') {
      const newIdx = Math.max(histIdx - 1, -1)
      setHistIdx(newIdx)
      setInput(newIdx === -1 ? '' : history[newIdx])
    }
  }

  return (
    <Window
      title="TERMINAL"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth ?? 560} initialHeight={initialHeight ?? 380}
    >
      <div
        className="h-full flex flex-col p-3 cursor-text"
        style={{ background: 'var(--dark)' }}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={i}
              className="whitespace-pre-wrap"
              style={{
                color: line.type === 'input' ? 'var(--amber)'
                  : line.type === 'error' ? '#B83420'
                  : 'var(--ghost)'
              }}
            >
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div
          className="flex items-center gap-1 mt-2 pt-2"
          style={{ borderTop: '1px solid var(--darkB)' }}
        >
          <span className="font-mono text-[11px]" style={{ color: 'var(--amber)' }}>{'>'}</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent font-mono text-[11px] outline-none"
            style={{ color: 'var(--ghost)' }}
          />
        </div>
      </div>
    </Window>
  )
}
