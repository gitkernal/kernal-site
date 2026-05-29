'use client'
import Pill from '@/components/ui/Pill'
import type { Skill } from '@/types/skill'

interface SkillDetailTabProps {
  skill: Skill
  onBack?: () => void
  onRun?: () => void
}

export default function SkillDetailTab({ skill, onBack, onRun }: SkillDetailTabProps) {
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
        {onBack && (
          <button
            onClick={onBack}
            className="font-sans text-[9px] tracking-widest uppercase mb-3 block"
            style={{ color: 'var(--light)' }}
          >
            ← Back
          </button>
        )}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-serif text-[28px] font-light italic" style={{ color: 'var(--text)' }}>
              {skill.name}
            </div>
            <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--light)' }}>
              v{skill.version} · {skill.category} · {skill.trigger_type}
            </div>
          </div>
          <Pill tier={skill.tier} />
        </div>
        <div className="font-sans text-[13px] leading-snug mt-2" style={{ color: 'var(--mid)' }}>
          {skill.tagline}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-b" style={{ borderColor: 'var(--bg3)' }}>
        {[
          ['Installs', skill.installs.toLocaleString()],
          ['Executions', skill.executions.toLocaleString()],
          ['Risk', skill.risk_level]
        ].map(([l, v], i, a) => (
          <div
            key={l}
            className={`text-center py-3 ${i < a.length - 1 ? 'border-r' : ''}`}
            style={{ borderColor: 'var(--bg3)' }}
          >
            <div className="font-serif text-[18px] font-light" style={{ color: 'var(--amber)' }}>{v}</div>
            <div className="font-sans text-[8px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--light)' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
        <div className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
          Description
        </div>
        <div className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text)' }}>
          {skill.description}
        </div>
      </div>

      {/* Config schema */}
      {skill.config_schema.length > 0 && (
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
          <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
            Parameters
          </div>
          <div className="space-y-2">
            {skill.config_schema.map(f => (
              <div key={f.k} className="flex justify-between items-baseline">
                <span className="font-mono text-[10px]" style={{ color: 'var(--text)' }}>{f.k}</span>
                <span className="font-sans text-[10px]" style={{ color: 'var(--ghost)' }}>
                  {f.type}{f.required ? ' · required' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compatibility */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
        <div className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
          Compatibility
        </div>
        <div className="flex gap-2 flex-wrap">
          {skill.compat.map(c => (
            <span
              key={c}
              className="font-mono text-[9px] px-2 py-0.5 border"
              style={{ borderColor: 'var(--bg3)', color: 'var(--mid)' }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Dependencies */}
      {skill.deps.length > 0 && (
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
          <div className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
            Dependencies
          </div>
          <div className="flex gap-2 flex-wrap">
            {skill.deps.map(d => (
              <span
                key={d}
                className="font-mono text-[9px] px-2 py-0.5"
                style={{ background: 'var(--bg3)', color: 'var(--mid)' }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
        <div className="flex justify-between">
          <span className="font-sans text-[10px]" style={{ color: 'var(--light)' }}>Author</span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--text)' }}>{skill.author}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-sans text-[10px]" style={{ color: 'var(--light)' }}>Gas Cost</span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--text)' }}>{skill.gas_cost}</span>
        </div>
      </div>

      {/* Run button */}
      <div className="px-5 py-4">
        <button
          onClick={onRun}
          className="w-full py-3.5 font-sans text-[11px] font-semibold tracking-widest uppercase"
          style={{ background: 'var(--dark)', color: 'var(--bg)' }}
        >
          ▶ Run {skill.name} →
        </button>
      </div>
    </div>
  )
}
