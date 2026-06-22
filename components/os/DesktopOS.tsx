'use client'
import { useState, useCallback } from 'react'
import KernalLogo from './KernalLogo'
import Ticker from './Ticker'
import ThemeToggle from '@/components/ui/ThemeToggle'
import SkillsTab from '@/components/tabs/SkillsTab'
import SkillDetailTab from '@/components/tabs/SkillDetailTab'
import RunTab from '@/components/tabs/RunTab'
import SubmitTab from '@/components/tabs/SubmitTab'
import StakeTab from '@/components/tabs/StakeTab'
import TokenTab from '@/components/tabs/TokenTab'
import StatsTab from '@/components/tabs/StatsTab'
import RoadmapTab from '@/components/tabs/RoadmapTab'
import ArticlesTab from '@/components/tabs/ArticlesTab'
import DocsTab from '@/components/tabs/DocsTab'
import TerminalTab from '@/components/tabs/TerminalTab'
import type { Skill } from '@/types/skill'

type PageId = 'skills' | 'run' | 'submit' | 'stake' | 'token' | 'stats' | 'roadmap' | 'articles' | 'docs' | 'terminal'

const SIDEBAR_W = 180
const TOPBAR_H = 40
const TICKER_H = 28

const PAGES: { id: PageId; label: string; ext: string; icon: string }[] = [
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

export default function DesktopOS() {
  const [activePage, setActivePage] = useState<PageId>('skills')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [runSkillId, setRunSkillId] = useState<string>('')

  const navigate = useCallback((id: PageId) => {
    setActivePage(id)
    if (id !== 'skills') setSelectedSkill(null)
  }, [])

  const handleRunSkill = useCallback((skillId: string) => {
    setRunSkillId(skillId)
    setSelectedSkill(null)
    setActivePage('run')
  }, [])

  function renderPage() {
    switch (activePage) {
      case 'skills':
        return selectedSkill ? (
          <SkillDetailTab
            skill={selectedSkill}
            onBack={() => setSelectedSkill(null)}
            onRun={() => handleRunSkill(selectedSkill.id)}
          />
        ) : (
          <SkillsTab onSelectSkill={setSelectedSkill} onRunSkill={handleRunSkill} />
        )
      case 'run':      return <RunTab key={runSkillId} initialSkillId={runSkillId} />
      case 'submit':   return <SubmitTab />
      case 'stake':    return <StakeTab />
      case 'token':    return <TokenTab />
      case 'stats':    return <StatsTab />
      case 'roadmap':  return <RoadmapTab />
      case 'articles': return <ArticlesTab />
      case 'docs':     return <DocsTab />
      case 'terminal': return <TerminalTab />
      default:         return <SkillsTab onSelectSkill={setSelectedSkill} onRunSkill={handleRunSkill} />
    }
  }

  const isTerminal = activePage === 'terminal'

  return (
    <div
      className="app-bg fixed inset-0 flex flex-col overflow-hidden"
      style={{ paddingBottom: TICKER_H }}
    >
      {/* ── Top navbar ── */}
      <div
        className="flex items-stretch border-b shrink-0"
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

        {/* Page tabs — scrollable */}
        <div className="flex items-stretch flex-1 overflow-x-auto gap-0 px-1">
          {PAGES.map(page => {
            const isActive = activePage === page.id
            return (
              <button
                key={page.id}
                onClick={() => navigate(page.id)}
                className="px-3 flex items-center font-sans font-semibold uppercase whitespace-nowrap transition-colors relative shrink-0"
                style={{
                  fontSize: 11,
                  letterSpacing: '1.5px',
                  color: isActive ? 'var(--amber)' : 'var(--light)',
                  background: isActive ? 'rgba(226,144,30,0.08)' : 'transparent',
                  borderBottom: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                }}
              >
                {page.label}{page.ext}
              </button>
            )
          })}
        </div>

        {/* Right info */}
        <div className="flex items-center gap-2 px-4 shrink-0">
          <ThemeToggle />
          <span className="font-mono text-[9px]" style={{ color: 'var(--ghost)' }}>
            gitkernal.app
          </span>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="shrink-0 border-r overflow-y-auto"
          style={{ width: SIDEBAR_W, background: 'var(--bg2)', borderColor: 'var(--bg3)' }}
        >
          <div className="p-3 pt-4">
            <div
              className="font-mono text-[8px] tracking-widest uppercase mb-3 px-2"
              style={{ color: 'var(--light)' }}
            >
              Files
            </div>
            {PAGES.map(page => {
              const isActive = activePage === page.id
              return (
                <button
                  key={page.id}
                  onClick={() => navigate(page.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left mb-0.5 transition-colors"
                  style={{
                    background: isActive ? 'rgba(226,144,30,0.08)' : 'transparent',
                    borderRadius: 3,
                    borderLeft: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                  }}
                >
                  <span
                    className="shrink-0 font-mono text-[11px] w-4 text-center"
                    style={{ color: isActive ? 'var(--amber)' : 'var(--ghost)' }}
                  >
                    {page.icon}
                  </span>
                  <span
                    className="font-mono text-[10px] truncate flex-1"
                    style={{ color: isActive ? 'var(--text)' : 'var(--mid)' }}
                  >
                    {page.label}{page.ext}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main content — FULL BLEED, no window frame */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: isTerminal ? '#0D0D0A' : 'transparent' }}
        >
          {isTerminal ? (
            renderPage()
          ) : (
            <div
              className="content-card"
              style={{
                maxWidth: 1100,
                margin: '32px auto',
                padding: '40px 48px',
              }}
            >
              {renderPage()}
            </div>
          )}
        </main>
      </div>

      {/* ── Ticker ── */}
      <Ticker />
    </div>
  )
}
