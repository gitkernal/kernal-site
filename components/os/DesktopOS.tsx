'use client'
import { useState, useCallback, useEffect } from 'react'
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
  x: number
  y: number
}

const SIDEBAR_W = 180
const TOPBAR_H = 40
const WIN_W = 680
const WIN_H = 520

const DESKTOP_ICONS: { id: WindowId; label: string; ext: string; icon: string }[] = [
  { id: 'skills',   label: 'SKILLS',   ext: '.db',  icon: '▣' },
  { id: 'run',      label: 'RUN',      ext: '.exe', icon: '▶' },
  { id: 'submit',   label: 'SUBMIT',   ext: '.md',  icon: '✎' },
  { id: 'stake',    label: 'STAKE',    ext: '.db',  icon: '▣' },
  { id: 'token',    label: 'TOKEN',    ext: '.db',  icon: '▣' },
  { id: 'stats',    label: 'STATS',    ext: '',     icon: '◈' },
  { id: 'roadmap',  label: 'ROADMAP',  ext: '',     icon: '◈' },
  { id: 'articles', label: 'ARTICLES', ext: '',     icon: '◈' },
  { id: 'docs',     label: 'DOCS',     ext: '',     icon: '◈' },
  { id: 'terminal', label: 'TERMINAL', ext: '',     icon: '>' },
]

let zCounter = 10

function getDefaultPosition(openCount: number): { x: number; y: number } {
  const slot = openCount % 8
  return {
    x: SIDEBAR_W + 40 + slot * 30,
    y: TOPBAR_H + 20 + slot * 30,
  }
}

export default function DesktopOS() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([])
  const [activeId, setActiveId] = useState<WindowId | null>(null)

  // Auto-open SKILLS.db on first load
  useEffect(() => {
    const pos = getDefaultPosition(0)
    setOpenWindows([{ id: 'skills', zIndex: ++zCounter, x: pos.x, y: pos.y }])
    setActiveId('skills')
  }, [])

  const openWindow = useCallback((id: WindowId, initialSkillId?: string) => {
    setActiveId(id)
    setOpenWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, zIndex: ++zCounter } : w)
      }
      const pos = getDefaultPosition(prev.length)
      return [...prev, { id, zIndex: ++zCounter, initialSkillId, x: pos.x, y: pos.y }]
    })
  }, [])

  const closeWindow = useCallback((id: WindowId) => {
    setOpenWindows(prev => {
      const remaining = prev.filter(w => w.id !== id)
      if (remaining.length > 0) {
        const top = remaining.reduce((a, b) => a.zIndex > b.zIndex ? a : b)
        setActiveId(top.id)
      } else {
        setActiveId(null)
      }
      return remaining
    })
  }, [])

  const focusWindow = useCallback((id: WindowId) => {
    setActiveId(id)
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: ++zCounter } : w))
  }, [])

  const handleRunSkill = useCallback((skillId: string) => {
    openWindow('run', skillId)
  }, [openWindow])

  function getWindow(w: OpenWindow) {
    const shared = {
      onClose: () => closeWindow(w.id),
      onFocus: () => focusWindow(w.id),
      zIndex: w.zIndex,
      initialX: w.x,
      initialY: w.y,
      initialWidth: WIN_W,
      initialHeight: WIN_H,
    }
    switch (w.id) {
      case 'skills':   return <SkillsWindow   key={w.id} {...shared} onRunSkill={handleRunSkill} />
      case 'run':      return <RunWindow      key={w.id} {...shared} initialSkillId={w.initialSkillId} />
      case 'submit':   return <SubmitWindow   key={w.id} {...shared} />
      case 'stake':    return <StakeWindow    key={w.id} {...shared} />
      case 'token':    return <TokenWindow    key={w.id} {...shared} />
      case 'stats':    return <StatsWindow    key={w.id} {...shared} />
      case 'roadmap':  return <RoadmapWindow  key={w.id} {...shared} />
      case 'articles': return <ArticlesWindow key={w.id} {...shared} />
      case 'docs':     return <DocsWindow     key={w.id} {...shared} />
      case 'terminal': return (
        <TerminalWindow
          key={w.id}
          onClose={() => closeWindow(w.id)}
          onFocus={() => focusWindow(w.id)}
          zIndex={w.zIndex}
          initialX={w.x}
          initialY={w.y}
          initialWidth={560}
          initialHeight={380}
        />
      )
      default: return null
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Desktop background — subtle amber grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,116,32,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,116,32,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* ── Top navbar ── */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-stretch border-b"
        style={{ height: TOPBAR_H, background: 'var(--bg2)', borderColor: 'var(--bg3)' }}
      >
        {/* Logo section */}
        <div
          className="flex items-center gap-2 px-4 shrink-0 border-r"
          style={{ width: SIDEBAR_W, borderColor: 'var(--bg3)' }}
        >
          <KernalLogo size={18} />
          <span
            className="font-serif text-[15px] font-light italic"
            style={{ color: 'var(--text)' }}
          >
            KERNAL
          </span>
        </div>

        {/* Window tabs — scrollable */}
        <div className="flex items-stretch flex-1 overflow-x-auto gap-0 px-1">
          {DESKTOP_ICONS.map(icon => {
            const isOpen = openWindows.some(w => w.id === icon.id)
            const isActive = activeId === icon.id
            return (
              <button
                key={icon.id}
                onClick={() => openWindow(icon.id)}
                className="px-3 flex items-center font-sans font-semibold uppercase whitespace-nowrap transition-colors relative shrink-0"
                style={{
                  fontSize: 11,
                  letterSpacing: '1.5px',
                  color: isActive ? 'var(--amber)' : isOpen ? 'var(--text)' : 'var(--light)',
                  background: isActive ? 'rgba(184,116,32,0.06)' : 'transparent',
                  borderBottom: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                }}
              >
                {icon.label}{icon.ext}
                {isOpen && !isActive && (
                  <span
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--amber)', opacity: 0.5 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Right info */}
        <div
          className="flex items-center px-4 shrink-0 font-mono text-[9px]"
          style={{ color: 'var(--ghost)' }}
        >
          gitkernal.xyz
        </div>
      </div>

      {/* ── Main layout: sidebar + canvas ── */}
      <div
        className="absolute left-0 right-0"
        style={{ top: TOPBAR_H, bottom: 28 }}
      >
        {/* Sidebar */}
        <div
          className="absolute top-0 bottom-0 left-0 border-r overflow-y-auto"
          style={{
            width: SIDEBAR_W,
            background: 'var(--bg2)',
            borderColor: 'var(--bg3)',
            zIndex: 30
          }}
        >
          <div className="p-3 pt-4">
            <div
              className="font-mono text-[8px] tracking-widest uppercase mb-3 px-2"
              style={{ color: 'var(--light)' }}
            >
              Files
            </div>
            {DESKTOP_ICONS.map(icon => {
              const isOpen = openWindows.some(w => w.id === icon.id)
              const isActive = activeId === icon.id
              return (
                <button
                  key={icon.id}
                  onClick={() => openWindow(icon.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left mb-0.5 transition-colors"
                  style={{
                    background: isActive ? 'rgba(184,116,32,0.12)' : 'transparent',
                    borderRadius: 3,
                    borderLeft: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                  }}
                >
                  <span
                    className="shrink-0 font-mono text-[11px] w-4 text-center"
                    style={{ color: isActive ? 'var(--amber)' : 'var(--ghost)' }}
                  >
                    {icon.icon}
                  </span>
                  <span
                    className="font-mono text-[10px] truncate flex-1"
                    style={{ color: isActive ? 'var(--text)' : 'var(--mid)' }}
                  >
                    {icon.label}{icon.ext}
                  </span>
                  {isOpen && !isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: 'var(--amber)', opacity: 0.4 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Sidebar footer */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-3 border-t"
            style={{ borderColor: 'var(--bg3)' }}
          >
            <div className="font-mono text-[8px] tracking-widest" style={{ color: 'var(--ghost)' }}>
              {openWindows.length} window{openWindows.length !== 1 ? 's' : ''} open
            </div>
          </div>
        </div>

        {/* Canvas — where windows live */}
        <div
          className="absolute top-0 bottom-0 right-0"
          style={{ left: SIDEBAR_W }}
        >
          {/* Windows */}
          {openWindows.map(w => getWindow(w))}

          {/* Empty state */}
          {openWindows.length === 0 && (
            <div className="flex items-center justify-center h-full pointer-events-none select-none">
              <div className="text-center">
                <KernalLogo size={48} color="var(--bg3)" />
                <div
                  className="font-sans font-semibold tracking-widest uppercase mt-4"
                  style={{ fontSize: 11, color: 'var(--ghost)' }}
                >
                  DOUBLE-CLICK AN ICON TO OPEN
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Ticker ── */}
      <Ticker />
    </div>
  )
}
