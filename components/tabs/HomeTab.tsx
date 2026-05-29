'use client'
import KernalLogo from '@/components/os/KernalLogo'

interface HomeTabProps {
  onNavigate?: (tab: string) => void
}

export default function HomeTab({ onNavigate }: HomeTabProps) {
  return (
    <div className="px-5 pb-24 pt-6">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <KernalLogo size={56} />
        </div>
        <div
          className="font-serif text-[42px] font-light leading-none tracking-tight italic mb-2"
          style={{ color: 'var(--text)' }}
        >
          KERNAL
        </div>
        <div
          className="font-sans text-[11px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--amber)' }}
        >
          AI Skill OS for Base Network
        </div>
      </div>

      {/* Tagline */}
      <div
        className="font-serif text-[18px] font-light leading-snug text-center mb-6"
        style={{ color: 'var(--mid)' }}
      >
        Deploy, execute, and compose autonomous AI skills on-chain.
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 border mb-6" style={{ borderColor: 'var(--bg3)' }}>
        {[
          ['12', 'Skills Live'],
          ['0.2%', 'Execution Fee'],
          ['50%', 'To Stakers']
        ].map(([v, l], i, a) => (
          <div
            key={l}
            className={`text-center py-4 ${i < a.length - 1 ? 'border-r' : ''}`}
            style={{ borderColor: 'var(--bg3)' }}
          >
            <div className="font-serif text-[24px]" style={{ color: 'var(--amber)' }}>{v}</div>
            <div
              className="font-sans text-[8px] tracking-widest uppercase mt-1"
              style={{ color: 'var(--light)' }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="space-y-2 mb-6">
        {[
          { label: 'SKILLS.db', desc: 'Browse 12 live skills', tab: 'skills' },
          { label: 'RUN.exe', desc: 'Execute any skill now', tab: 'run' },
          { label: 'STAKE.db', desc: 'Stake $KRN, earn ETH', tab: 'stake' },
          { label: 'SUBMIT.md', desc: 'Submit your own skill', tab: 'submit' }
        ].map(({ label, desc, tab }) => (
          <button
            key={tab}
            onClick={() => onNavigate?.(tab)}
            className="w-full flex items-center justify-between border p-3 transition-colors text-left"
            style={{ borderColor: 'var(--bg3)', background: 'var(--bg2)' }}
          >
            <span className="font-mono text-[11px]" style={{ color: 'var(--text)' }}>{label}</span>
            <span className="font-sans text-[10px]" style={{ color: 'var(--light)' }}>{desc} →</span>
          </button>
        ))}
      </div>

      {/* Token info */}
      <div
        className="border p-4"
        style={{ borderColor: 'var(--bg3)', background: 'var(--bg2)' }}
      >
        <div
          className="font-mono text-[9px] tracking-widest uppercase mb-3"
          style={{ color: 'var(--amber)' }}
        >
          $KRN — Base Network
        </div>
        <div
          className="font-mono text-[10px] break-all mb-2"
          style={{ color: 'var(--ghost)' }}
        >
          0x974B53861d975E727305298D2718849c43046ba3
        </div>
        <div className="space-y-1">
          {[
            ['Premium Tier', '10,000,000 KRN'],
            ['Priority Tier', '100,000,000 KRN']
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="font-sans text-[10px]" style={{ color: 'var(--mid)' }}>{k}</span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--amber)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
