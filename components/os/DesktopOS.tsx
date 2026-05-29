'use client'
import { useState, useCallback } from 'react'
import KernalLogo from './KernalLogo'
import Ticker from './Ticker'
import SkillsWindow from '@/components/windows/SkillsWindow'
import RunWindow from '@/components/windows/RunWindow'
import SubmitWindow from '@/components/windows/SubmitWindow'
import StakeWindow from '@/components/windows/StakeWindow'
import TokenWindow from '@/components/windows/TokenWindow'
import StatsWindow from '@/components/windows/StatsWindow'
import RoadmapWindow from '@/components/windows/RoadmapWindow'
import ArticlesWindow from '@/components/windows/ArticlesWindow'
import DocsWindow from '@/components/windows/DocsWindow'
import TerminalWindow from '@/components/windows/TerminalWindow'

type WindowId = 'skills' | 'run' | 'submit' | 'stake' | 'token' | 'stats' | 'roadmap' | 'articles' | 'docs' | 'terminal'

interface OpenWindow {
  id: WindowId
  zIndex: number
  initialSkillId?: string
}

const DESKTOP_ICONS: { id: WindowId; label: string; ext: string }[] = [
  { id: 'skills', label: 'SKILLS', ext: '.db' },
  { id: 'run', label: 'RUN', ext: '.exe' },
  { id: 'submit', label: 'SUBMIT', ext: '.md' },
  { id: 'stake', label: 'STAKE', ext: '.db' },
  { id: 'token', label: 'TOKEN', ext: '.db' },
  { id: 'stats', label: 'STATS', ext: '' },
  { id: 'roadmap', label: 'ROADMAP', ext: '' },
  { id: 'articles', label: 'ARTICLES', ext: '' },
  { id: 'docs', label: 'DOCS', ext: '' },
  { id: 'terminal', label: 'TERMINAL', ext: '' },
]

let zCounter = 10

export default function DesktopOS() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([])

  const openWindow = useCallback((id: WindowId, initialSkillId?: string) => {
    setOpenWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, zIndex: ++zCounter } : w)
      }
      return [...prev, { id, zIndex: ++zCounter, initialSkillId }]
    })
  }, [])

  const closeWindow = useCallback((id: WindowId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const focusWindow = useCallback((id: WindowId) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: ++zCounter } : w))
  }, [])

  const handleRunSkill = useCallback((skillId: string) => {
    openWindow('run', skillId)
  }, [openWindow])

  function getWindow(w: OpenWindow) {
    const props = {
      onClose: () => closeWindow(w.id),
      onFocus: () => focusWindow(w.id),
      zIndex: w.zIndex
    }
    switch (w.id) {
      case 'skills':    return <SkillsWindow key={w.id} {...props} onRunSkill={handleRunSkill} />
      case 'run':       return <RunWindow key={w.id} {...props} initialSkillId={w.initialSkillId} />
      case 'submit':    return <SubmitWindow key={w.id} {...props} />
      case 'stake':     return <StakeWindow key={w.id} {...props} />
      case 'token':     return <TokenWindow key={w.id} {...props} />
      case 'stats':     return <StatsWindow key={w.id} {...props} />
      case 'roadmap':   return <RoadmapWindow key={w.id} {...props} />
      case 'articles':  return <ArticlesWindow key={w.id} {...props} />
      case 'docs':      return <DocsWindow key={w.id} {...props} />
      case 'terminal':  return <TerminalWindow key={w.id} {...props} />
      default: return null
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Desktop background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(var(--bg3) 1px, transparent 1px),
            linear-gradient(90deg, var(--bg3) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top menubar */}
      <div
        className="absolute top-0 left-0 right-0 h-8 flex items-center px-4 border-b z-40"
        style={{ background: 'var(--bg2)', borderColor: 'var(--bg3)' }}
      >
        <KernalLogo size={20} />
        <span
          className="font-serif text-[14px] font-light italic ml-2 mr-6"
          style={{ color: 'var(--text)' }}
        >
          KERNAL
        </span>
        <div className="flex items-center gap-4">
          {DESKTOP_ICONS.map(icon => (
            <button
              key={icon.id}
              onClick={() => openWindow(icon.id)}
              className="font-sans text-[10px] font-semibold tracking-widest uppercase transition-colors"
              style={{ color: 'var(--mid)' }}
            >
              {icon.label}
            </button>
          ))}
        </div>
        <div className="ml-auto font-mono text-[9px]" style={{ color: 'var(--light)' }}>
          gitkernal.xyz
        </div>
      </div>

      {/* Desktop icons */}
      <div className="absolute top-12 left-6 flex flex-col gap-1 z-10">
        {DESKTOP_ICONS.map(icon => (
          <button
            key={icon.id}
            onDoubleClick={() => openWindow(icon.id)}
            className="flex items-center gap-2 px-2 py-1 text-left rounded transition-colors hover:bg-bg3/50 group"
          >
            <span className="font-mono text-[14px]" style={{ color: 'var(--amber)' }}>
              {icon.id === 'terminal' ? '>' : icon.ext === '.db' ? '▣' : icon.ext === '.exe' ? '▶' : icon.ext === '.md' ? '✎' : '◈'}
            </span>
            <span className="font-mono text-[10px]" style={{ color: 'var(--text)' }}>
              {icon.label}{icon.ext}
            </span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {openWindows.map(w => getWindow(w))}

      {/* Welcome message if no windows open */}
      {openWindows.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <KernalLogo size={64} color="var(--bg3)" />
            <div
              className="font-sans text-[10px] tracking-widest uppercase mt-3"
              style={{ color: 'var(--bg3)' }}
            >
              Double-click an icon to open
            </div>
          </div>
        </div>
      )}

      {/* Ticker */}
      <Ticker />
    </div>
  )
}
