'use client'
import { useState } from 'react'
import { SKILLS_DATA } from '@/lib/skills-data'
import Pill from '@/components/ui/Pill'
import type { Skill } from '@/types/skill'

const CATEGORIES = ['all', 'monitoring', 'trading', 'defi', 'research', 'protection', 'governance', 'automation']

interface SkillsTabProps {
  onSelectSkill?: (skill: Skill) => void
  onRunSkill?: (skillId: string) => void
}

export default function SkillsTab({ onSelectSkill, onRunSkill }: SkillsTabProps) {
  const [tier, setTier] = useState<'all' | 'free' | 'premium'>('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = SKILLS_DATA.filter(s => {
    if (tier !== 'all' && s.tier !== tier) return false
    if (category !== 'all' && s.category !== category) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.tagline.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="pb-24">
      {/* Search */}
      <div className="px-5 pt-3 pb-3" style={{ borderBottom: '1px solid var(--bg3)' }}>
        <input
          className="fi w-full"
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tier filter */}
      <div className="flex border-b" style={{ borderColor: 'var(--bg3)' }}>
        {(['all', 'free', 'premium'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className="flex-1 py-2 font-sans text-[9px] font-semibold tracking-widest uppercase transition-colors"
            style={{
              color: tier === t ? 'var(--amber)' : 'var(--light)',
              borderBottom: tier === t ? '2px solid var(--amber)' : '2px solid transparent'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 px-5 py-2 overflow-x-auto border-b" style={{ borderColor: 'var(--bg3)' }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="shrink-0 px-2 py-1 font-sans text-[8px] font-semibold tracking-widest uppercase border transition-colors"
            style={{
              borderColor: category === c ? 'var(--amber)' : 'var(--bg3)',
              color: category === c ? 'var(--amber)' : 'var(--light)',
              background: 'transparent'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Skills list */}
      <div>
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center font-sans text-[12px]" style={{ color: 'var(--light)' }}>
            No skills found
          </div>
        ) : (
          filtered.map((skill, i) => (
            <div
              key={skill.id}
              className="px-5 py-4 transition-colors cursor-pointer"
              style={{
                borderBottom: i < filtered.length - 1 ? '1px solid var(--bg3)' : 'none',
              }}
              onClick={() => onSelectSkill?.(skill)}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="font-serif text-[16px] font-light" style={{ color: 'var(--text)' }}>
                    {skill.name}
                  </div>
                  <div
                    className="font-sans text-[10px] font-semibold tracking-widest uppercase"
                    style={{ color: 'var(--light)' }}
                  >
                    {skill.category}
                  </div>
                </div>
                <Pill tier={skill.tier} />
              </div>
              <div className="font-sans text-[12px] leading-snug mb-2" style={{ color: 'var(--mid)' }}>
                {skill.tagline}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <span className="font-mono text-[9px]" style={{ color: 'var(--ghost)' }}>
                    ↓ {skill.installs.toLocaleString()}
                  </span>
                  <span className="font-mono text-[9px]" style={{ color: 'var(--ghost)' }}>
                    ▶ {skill.executions.toLocaleString()}
                  </span>
                </div>
                {onRunSkill && (
                  <button
                    onClick={e => { e.stopPropagation(); onRunSkill(skill.id) }}
                    className="font-sans text-[9px] font-semibold tracking-widest uppercase px-2 py-1 border"
                    style={{ borderColor: 'var(--bg3)', color: 'var(--mid)' }}
                  >
                    Run →
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
