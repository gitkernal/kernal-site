'use client'
import { SKILLS_DATA } from '@/lib/skills-data'

const MOCK_LEADERS = [
  { rank: 1, address: '0xf39F...d266', tier: 'Priority', executions: 847, krn: '142M' },
  { rank: 2, address: '0x7099...79C8', tier: 'Priority', executions: 612, krn: '118M' },
  { rank: 3, address: '0x3C44...93bc', tier: 'Premium', executions: 445, krn: '47M' },
  { rank: 4, address: '0x9065...7099', tier: 'Premium', executions: 321, krn: '28M' },
  { rank: 5, address: '0x1cB8...57AB', tier: 'Premium', executions: 287, krn: '15M' },
  { rank: 6, address: '0x8626...1C84', tier: 'Premium', executions: 203, krn: '12M' },
  { rank: 7, address: '0xdD2F...02C9', tier: 'Free', executions: 156, krn: '2.4M' },
  { rank: 8, address: '0x2546...64C6', tier: 'Free', executions: 134, krn: '0' },
  { rank: 9, address: '0xcd3B...B52C', tier: 'Free', executions: 98, krn: '0' },
  { rank: 10, address: '0x15d3...37B2', tier: 'Free', executions: 71, krn: '0' },
]

export default function LeaderboardTab() {
  const topByInstalls = [...SKILLS_DATA].sort((a, b) => b.installs - a.installs).slice(0, 5)

  return (
    <div className="px-5 pb-24 pt-2">
      <div className="mb-4">
        <div className="font-serif text-[32px] font-light italic mb-1" style={{ color: 'var(--text)' }}>
          Leaderboard
        </div>
        <div className="font-sans text-[12px]" style={{ color: 'var(--mid)' }}>
          Top wallets by execution count
        </div>
      </div>

      {/* Top wallets */}
      <div className="border mb-6" style={{ borderColor: 'var(--bg3)' }}>
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: '1px solid var(--bg3)', background: 'var(--bg2)' }}
        >
          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--light)' }}>
            Wallet
          </span>
          <div className="flex gap-4">
            <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--light)' }}>
              Tier
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--light)' }}>
              Runs
            </span>
          </div>
        </div>
        {MOCK_LEADERS.map(({ rank, address, tier, executions }, i) => (
          <div
            key={rank}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < MOCK_LEADERS.length - 1 ? '1px solid var(--bg3)' : 'none' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[10px] w-4"
                style={{ color: rank <= 3 ? 'var(--amber)' : 'var(--ghost)' }}
              >
                {rank <= 3 ? ['①', '②', '③'][rank - 1] : rank}
              </span>
              <span className="font-mono text-[11px]" style={{ color: 'var(--text)' }}>{address}</span>
            </div>
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-[9px] tracking-widest"
                style={{ color: tier === 'Priority' ? 'var(--amber)' : tier === 'Premium' ? 'var(--amberL)' : 'var(--ghost)' }}
              >
                {tier}
              </span>
              <span className="font-mono text-[11px]" style={{ color: 'var(--text)' }}>
                {executions}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Top skills */}
      <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
        Most Installed Skills
      </div>
      <div className="border" style={{ borderColor: 'var(--bg3)' }}>
        {topByInstalls.map((skill, i) => (
          <div
            key={skill.id}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < topByInstalls.length - 1 ? '1px solid var(--bg3)' : 'none' }}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] w-4" style={{ color: 'var(--ghost)' }}>{i + 1}</span>
              <div>
                <div className="font-sans text-[12px] font-semibold" style={{ color: 'var(--text)' }}>
                  {skill.name}
                </div>
                <div className="font-sans text-[9px] uppercase tracking-widest" style={{ color: 'var(--light)' }}>
                  {skill.category}
                </div>
              </div>
            </div>
            <span className="font-mono text-[11px]" style={{ color: 'var(--amber)' }}>
              ↓ {skill.installs.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
