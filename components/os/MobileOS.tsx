'use client'
import { useState } from 'react'
import KernalLogo from './KernalLogo'
import Ticker from './Ticker'
import HomeTab from '@/components/tabs/HomeTab'
import SkillsTab from '@/components/tabs/SkillsTab'
import SkillDetailTab from '@/components/tabs/SkillDetailTab'
import RunTab from '@/components/tabs/RunTab'
import SubmitTab from '@/components/tabs/SubmitTab'
import StakeTab from '@/components/tabs/StakeTab'
import TokenTab from '@/components/tabs/TokenTab'
import StatsTab from '@/components/tabs/StatsTab'
import RoadmapTab from '@/components/tabs/RoadmapTab'
import LeaderboardTab from '@/components/tabs/LeaderboardTab'
import ArticlesTab from '@/components/tabs/ArticlesTab'
import DocsTab from '@/components/tabs/DocsTab'
import type { Skill } from '@/types/skill'
import ThemeToggle from '@/components/ui/ThemeToggle'

type Tab = 'home' | 'skills' | 'run' | 'submit' | 'stake' | 'token' | 'stats' | 'roadmap' | 'leaderboard' | 'articles' | 'docs'

const NAV_TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'run', label: 'Run' },
  { id: 'stake', label: 'Stake' },
  { id: 'submit', label: 'Submit' },
]

const MORE_TABS: { id: Tab; label: string }[] = [
  { id: 'token', label: 'Token' },
  { id: 'stats', label: 'Stats' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'leaderboard', label: 'Leaders' },
  { id: 'articles', label: 'Articles' },
  { id: 'docs', label: 'Docs' },
]

export default function MobileOS() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [runSkillId, setRunSkillId] = useState('')
  const [showMore, setShowMore] = useState(false)

  function handleNavigate(tab: string) {
    setActiveTab(tab as Tab)
    setShowMore(false)
  }

  function handleSelectSkill(skill: Skill) {
    setSelectedSkill(skill)
  }

  function handleRunSkill(skillId: string) {
    setRunSkillId(skillId)
    setActiveTab('run')
  }

  function renderContent() {
    if (activeTab === 'skills' && selectedSkill) {
      return (
        <SkillDetailTab
          skill={selectedSkill}
          onBack={() => setSelectedSkill(null)}
          onRun={() => { handleRunSkill(selectedSkill.id); setSelectedSkill(null) }}
        />
      )
    }

    switch (activeTab) {
      case 'home':        return <HomeTab onNavigate={handleNavigate} />
      case 'skills':      return <SkillsTab onSelectSkill={handleSelectSkill} onRunSkill={handleRunSkill} />
      case 'run':         return <RunTab initialSkillId={runSkillId} />
      case 'submit':      return <SubmitTab />
      case 'stake':       return <StakeTab />
      case 'token':       return <TokenTab />
      case 'stats':       return <StatsTab />
      case 'roadmap':     return <RoadmapTab />
      case 'leaderboard': return <LeaderboardTab />
      case 'articles':    return <ArticlesTab />
      case 'docs':        return <DocsTab />
      default: return null
    }
  }

  const allTabs = [...NAV_TABS, ...MORE_TABS]
  const currentTabLabel = allTabs.find(t => t.id === activeTab)?.label || activeTab

  return (
    <div
      className="app-bg fixed inset-0 flex flex-col"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-12 shrink-0 border-b"
        style={{ background: 'var(--bg2)', borderColor: 'var(--bg3)' }}
      >
        <div className="flex items-center gap-2">
          <KernalLogo size={24} />
          <span className="font-serif text-[16px] font-light italic" style={{ color: 'var(--text)' }}>
            KERNAL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--amber)' }}>
            {currentTabLabel.toUpperCase()}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {/* More menu overlay */}
      {showMore && (
        <div
          className="absolute inset-0 z-50 flex items-end"
          style={{ background: 'rgba(14,23,20,0.6)' }}
          onClick={() => setShowMore(false)}
        >
          <div
            className="w-full border-t p-4 pb-24 grid grid-cols-3 gap-2"
            style={{ background: 'var(--bg2)', borderColor: 'var(--bg3)' }}
            onClick={e => e.stopPropagation()}
          >
            {MORE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowMore(false) }}
                className="py-3 font-sans text-[10px] font-semibold tracking-widest uppercase border"
                style={{
                  borderColor: activeTab === tab.id ? 'var(--amber)' : 'var(--bg3)',
                  color: activeTab === tab.id ? 'var(--amber)' : 'var(--mid)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div
        className="shrink-0 border-t pb-7"
        style={{ background: 'var(--bg2)', borderColor: 'var(--bg3)' }}
      >
        <div className="flex">
          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowMore(false) }}
              className="flex-1 py-3 font-sans text-[9px] font-semibold tracking-widest uppercase border-t-2 transition-colors"
              style={{
                borderColor: activeTab === tab.id ? 'var(--amber)' : 'transparent',
                color: activeTab === tab.id ? 'var(--amber)' : 'var(--light)'
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setShowMore(m => !m)}
            className="flex-1 py-3 font-sans text-[9px] font-semibold tracking-widest uppercase border-t-2 transition-colors"
            style={{
              borderColor: showMore ? 'var(--amber)' : 'transparent',
              color: showMore ? 'var(--amber)' : 'var(--light)'
            }}
          >
            More
          </button>
        </div>
        <Ticker />
      </div>
    </div>
  )
}
