'use client'
import { useState, useEffect } from 'react'
import { SKILLS_DATA } from '@/lib/skills-data'

export default function StatsTab() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const totalInstalls = SKILLS_DATA.reduce((a, s) => a + s.installs, 0)
  const totalExecutions = SKILLS_DATA.reduce((a, s) => a + s.executions, 0)
  const freeCount = SKILLS_DATA.filter(s => s.tier === 'free').length
  const premiumCount = SKILLS_DATA.filter(s => s.tier === 'premium').length

  const topSkills = [...SKILLS_DATA].sort((a, b) => b.executions - a.executions).slice(0, 5)

  return (
    <div className="px-5 pb-24 pt-2">
      {/* Header */}
      <div className="mb-4">
        <div className="font-serif text-[32px] font-light italic mb-1" style={{ color: 'var(--text)' }}>
          Platform Stats
        </div>
        <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--light)' }}>
          KERNAL OS — Live metrics
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          ['Total Skills', '12'],
          ['Free Skills', String(freeCount)],
          ['Premium Skills', String(premiumCount)],
          ['Networks', 'Base, ETH, ARB'],
          ['Total Installs', mounted ? totalInstalls.toLocaleString() : '—'],
          ['Total Executions', mounted ? totalExecutions.toLocaleString() : '—'],
        ].map(([l, v]) => (
          <div key={l} className="border p-3" style={{ borderColor: 'var(--bg3)', background: 'var(--bg2)' }}>
            <div className="font-serif text-[20px] font-light" style={{ color: 'var(--amber)' }}>{v}</div>
            <div className="font-sans text-[9px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--light)' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Top skills by executions */}
      <div className="mb-4">
        <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
          Top Skills by Executions
        </div>
        <div className="border" style={{ borderColor: 'var(--bg3)' }}>
          {topSkills.map((skill, i) => (
            <div
              key={skill.id}
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: i < topSkills.length - 1 ? '1px solid var(--bg3)' : 'none' }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] w-4" style={{ color: 'var(--ghost)' }}>
                  {i + 1}
                </span>
                <div>
                  <div className="font-sans text-[12px] font-semibold" style={{ color: 'var(--text)' }}>
                    {skill.name}
                  </div>
                  <div className="font-sans text-[9px] tracking-widest uppercase" style={{ color: 'var(--light)' }}>
                    {skill.category}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[12px]" style={{ color: 'var(--amber)' }}>
                  {skill.executions.toLocaleString()}
                </div>
                <div className="font-sans text-[9px]" style={{ color: 'var(--ghost)' }}>runs</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
          Skills by Category
        </div>
        <div className="border" style={{ borderColor: 'var(--bg3)' }}>
          {['monitoring', 'trading', 'defi', 'research', 'protection', 'governance', 'automation'].map((cat, i, a) => {
            const count = SKILLS_DATA.filter(s => s.category === cat).length
            if (count === 0) return null
            return (
              <div
                key={cat}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < a.length - 1 ? '1px solid var(--bg3)' : 'none' }}
              >
                <span
                  className="font-sans text-[11px] font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--mid)' }}
                >
                  {cat}
                </span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--text)' }}>
                  {count} skill{count !== 1 ? 's' : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
