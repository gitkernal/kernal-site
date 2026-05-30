'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { SKILLS_DATA } from '@/lib/skills-data'

type LineType = 'output' | 'input' | 'error' | 'success' | 'banner'
interface Line { text: string; type: LineType }

const BANNER: Line[] = [
  { text: '  ██╗  ██╗███████╗██████╗ ███╗  ██╗ █████╗ ██╗', type: 'banner' },
  { text: '  ██║ ██╔╝██╔════╝██╔══██╗████╗ ██║██╔══██╗██║', type: 'banner' },
  { text: '  █████╔╝ █████╗  ██████╔╝██╔██╗██║███████║██║', type: 'banner' },
  { text: '  ██╔═██╗ ██╔══╝  ██╔══██╗██║╚████║██╔══██║██║', type: 'banner' },
  { text: '  ██║ ╚██╗███████╗██║  ██║██║ ╚███║██║  ██║███████╗', type: 'banner' },
  { text: '  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚══╝╚═╝  ╚═╝╚══════╝', type: 'banner' },
  { text: '', type: 'output' },
  { text: '  KERNAL OS v2.0.0  ·  Base Network  ·  claude-sonnet-4-6', type: 'output' },
  { text: '  Type "help" for available commands.', type: 'output' },
  { text: '', type: 'output' },
]

const MAX_HISTORY = 50
const HISTORY_KEY = 'kernal_terminal_history'

function parseCommand(input: string) {
  const parts = input.trim().split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args: string[] = []
  const flags: Record<string, string> = {}
  let i = 1
  while (i < parts.length) {
    if (parts[i].startsWith('--')) {
      const key = parts[i].slice(2)
      const next = parts[i + 1]
      if (next && !next.startsWith('--')) {
        flags[key] = next
        i += 2
      } else {
        flags[key] = 'true'
        i++
      }
    } else {
      args.push(parts[i])
      i++
    }
  }
  return { cmd, args, flags }
}

interface TerminalTabProps {
  className?: string
}

export default function TerminalTab({ className = '' }: TerminalTabProps) {
  const { address, tier, krnBalance } = useWallet()
  const [lines, setLines] = useState<Line[]>(BANNER)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
  })
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const processCommand = useCallback((raw: string) => {
    const { cmd, args, flags } = parseCommand(raw)

    setLines(prev => [...prev, { text: `kernal@registry:~$ ${raw}`, type: 'input' }])

    if (cmd === 'clear') {
      setLines(BANNER)
      return
    }

    const output = ((): Line[] => {
      switch (cmd) {
        case 'help':
          return [{ type: 'output', text:
`  Available commands:

  help                      Show this help
  skills                    List all skills
    --tier free|premium     Filter by tier
    --category <cat>        Filter by category
  skill <name>              Show skill details
  install <name>            Register skill locally
  run <name>                Open in RUN interface
  wallet                    Show wallet & tier info
  stats                     Platform statistics
  token                     $KRN token info
  ca                        Show contract address
  clear                     Clear terminal` }]

        case 'skills': {
          let data = [...SKILLS_DATA]
          if (flags.tier) data = data.filter(s => s.tier === flags.tier)
          if (flags.category) data = data.filter(s => s.category === flags.category)
          if (!data.length) return [{ type: 'error', text: '  No skills match the filter.' }]
          const rows = data.map(s =>
            `  ${s.id.padEnd(26)} [${s.tier.padEnd(7)}]  ${s.tagline}`
          )
          return [{ type: 'output', text: `  ${data.length} skill${data.length !== 1 ? 's' : ''} found:\n\n${rows.join('\n')}` }]
        }

        case 'skill': {
          const name = args.join(' ')
          if (!name) return [{ type: 'error', text: '  Usage: skill <name>' }]
          const s = SKILLS_DATA.find(x =>
            x.id === name ||
            x.id.includes(name.toLowerCase()) ||
            x.name.toLowerCase().includes(name.toLowerCase())
          )
          if (!s) return [{ type: 'error', text: `  Skill not found: ${name}` }]
          return [{ type: 'output', text:
`  ${s.name}  v${s.version}
  ${'─'.repeat(40)}
  ID:         ${s.id}
  Tier:       ${s.tier}
  Category:   ${s.category}
  Risk:       ${s.risk_level}
  Networks:   ${s.compat.join(', ')}

  ${s.tagline}

  ${s.description}

  Installs:   ${s.installs.toLocaleString()}
  Executions: ${s.executions.toLocaleString()}` }]
        }

        case 'install': {
          const name = args.join(' ')
          if (!name) return [{ type: 'error', text: '  Usage: install <skill-name>' }]
          const s = SKILLS_DATA.find(x =>
            x.id === name || x.name.toLowerCase().includes(name.toLowerCase())
          )
          if (!s) return [{ type: 'error', text: `  Skill not found: ${name}` }]
          return [
            { type: 'output', text: `  ▸ Installing ${s.name}...` },
            { type: 'success', text: `  ✓ Registered in local registry` },
            { type: 'success', text: `  ✓ Config schema loaded (${s.config_schema.length} fields)` },
            { type: 'output', text: `  ▸ Open RUN.exe → skill id: ${s.id}` },
          ]
        }

        case 'run': {
          const name = args.join(' ')
          if (!name) return [{ type: 'error', text: '  Usage: run <skill-name>' }]
          const s = SKILLS_DATA.find(x =>
            x.id === name || x.name.toLowerCase().includes(name.toLowerCase())
          )
          if (!s) return [{ type: 'error', text: `  Skill not found: ${name}` }]
          return [{ type: 'output', text: `  ▸ Open RUN.exe and select: ${s.name}` }]
        }

        case 'wallet':
          if (!address) return [{ type: 'output', text: '  No wallet connected.\n  Open STAKE.db to connect.' }]
          return [{ type: 'output', text:
`  Address:  ${address}
  Balance:  ${krnBalance || '...'} KRN
  Tier:     ${tier}` }]

        case 'stats':
          return [{ type: 'output', text:
`  Platform Statistics:
  ${'─'.repeat(32)}
  Skills live:   12
  Installs:      ~16,904 total
  Executions:    ~113,110 total
  Networks:      Base, Ethereum, Arbitrum
  Model:         claude-sonnet-4-6` }]

        case 'token':
          return [{ type: 'output', text:
`  $KRN Token — Base Network
  ${'─'.repeat(48)}
  Contract:  0x974B53861d975E727305298D2718849c43046ba3
  Premium:   10,000,000 KRN   (all premium skills)
  Priority:  100,000,000 KRN  (priority + support)
  Uniswap:   app.uniswap.org → Base → $KRN` }]

        case 'ca':
          return [{ type: 'success', text: '  0x974B53861d975E727305298D2718849c43046ba3' }]

        default:
          return [{ type: 'error', text: `  Command not found: ${cmd}. Type "help" for available commands.` }]
      }
    })()

    setLines(prev => [...prev, ...output])
  }, [address, tier, krnBalance])

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (!input.trim()) return
      processCommand(input)
      const next = [input, ...history].slice(0, MAX_HISTORY)
      setHistory(next)
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      setHistIdx(-1)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx)
      setInput(history[idx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : history[idx])
    } else if (e.key === 'c' && e.ctrlKey) {
      setInput('')
      setHistIdx(-1)
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines(BANNER)
    }
  }

  return (
    <div
      className={`h-full flex flex-col terminal-container ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed p-3 cursor-text select-text">
        {lines.map((line, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap"
            style={{
              color: line.type === 'error' ? '#FF5555'
                : line.type === 'input' ? '#B87420'
                : '#00FF88'
            }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="shrink-0 flex items-center gap-2 px-3 py-2"
        style={{ borderTop: '1px solid #1E1E18' }}
      >
        <span
          className="font-mono text-[11px] shrink-0 select-none"
          style={{ color: '#B87420' }}
        >
          kernal@registry:~$
        </span>
        <div className="relative flex-1 flex items-center font-mono text-[11px]" style={{ color: '#00FF88' }}>
          <span className="whitespace-pre" style={{ minHeight: '1em' }}>{input}</span>
          <span className="terminal-cursor" style={{ color: '#00FF88' }}>█</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            className="absolute inset-0 w-full bg-transparent opacity-0 font-mono text-[11px] cursor-text"
            style={{ caretColor: 'transparent' }}
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  )
}
