'use client'
import { useState, useRef, useEffect } from 'react'
import Window from './Window'

interface TerminalWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
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
  run <id>      Show skill run instructions
  token         Show $KRN token info
  stats         Show platform statistics
  clear         Clear terminal
  version       Show version info`,

  token: `$KRN Token — Base Network
Contract: 0x974B53861d975E727305298D2718849c43046ba3
Premium:  10,000,000 KRN
Priority: 100,000,000 KRN
Uniswap:  app.uniswap.org → Base → $KRN`,

  version: 'KERNAL OS v2.0.0 | Next.js 14 | claude-sonnet-4 | Base Network',

  stats: `Platform Statistics:
Skills:      12 live
Installs:    ~16,904 total
Executions:  ~113,110 total
Networks:    Base, Ethereum, Arbitrum`,
}

export default function TerminalWindow({ onClose, onFocus, zIndex }: TerminalWindowProps) {
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

    if (trimmed === 'skills') {
      const { SKILLS_DATA } = require('@/lib/skills-data')
      const output = SKILLS_DATA.map((s: { name: string; tier: string; category: string }) =>
        `  ${s.name.padEnd(24)} [${s.tier}] ${s.category}`
      ).join('\n')
      setLines(prev => [...prev, { text: output, type: 'output' }])
      return
    }

    if (trimmed === 'skills free') {
      const { SKILLS_DATA } = require('@/lib/skills-data')
      const output = SKILLS_DATA.filter((s: { tier: string }) => s.tier === 'free')
        .map((s: { name: string; tagline: string }) => `  ${s.name.padEnd(24)} ${s.tagline}`).join('\n')
      setLines(prev => [...prev, { text: output, type: 'output' }])
      return
    }

    if (trimmed === 'skills prem') {
      const { SKILLS_DATA } = require('@/lib/skills-data')
      const output = SKILLS_DATA.filter((s: { tier: string }) => s.tier === 'premium')
        .map((s: { name: string; tagline: string }) => `  ${s.name.padEnd(24)} ${s.tagline}`).join('\n')
      setLines(prev => [...prev, { text: output, type: 'output' }])
      return
    }

    if (COMMANDS[trimmed]) {
      setLines(prev => [...prev, { text: COMMANDS[trimmed], type: 'output' }])
      return
    }

    setLines(prev => [...prev, { text: `Command not found: ${trimmed}. Type "help" for commands.`, type: 'error' }])
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
      title="TERMINAL" fileExt=""
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={400} initialY={120} initialWidth={500} initialHeight={400}
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
        <div className="flex items-center gap-1 mt-2 pt-2" style={{ borderTop: '1px solid var(--darkB)' }}>
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
