'use client'

const PHASES = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'complete',
    items: [
      'KERNAL OS concept and design system',
      '12 AI skills built and tested',
      'Anthropic API integration (claude-sonnet-4-6)',
      'Base Network on-chain reads',
      '$KRN token deployed on Base',
      'Public testnet environment',
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Launch',
    status: 'active',
    items: [
      'Full-stack site launch (Next.js 14)',
      'Supabase skill registry live',
      'Real Anthropic execution on all 12 skills',
      'Wallet connection + KRN balance reads',
      'Skill submission pipeline',
      'Community skill review process',
    ]
  },
  {
    phase: 'Phase 3',
    title: 'TGE',
    status: 'upcoming',
    items: [
      'Token Generation Event',
      'Staking contract deployment',
      'ETH yield distribution begins',
      'Listing fee mechanism activates',
      '5M KRN required for skill submission',
      'Priority tier launch',
    ]
  },
  {
    phase: 'Phase 4',
    title: 'Ecosystem',
    status: 'upcoming',
    items: [
      'Skill composition (chain multiple skills)',
      'Scheduled execution (cron triggers)',
      'On-chain event triggers',
      'KERNAL SDK for third-party skill builders',
      'Cross-chain expansion (Arbitrum, Optimism)',
      'Governance voting via $KRN',
    ]
  }
]

export default function RoadmapTab() {
  return (
    <div className="px-5 pb-24 pt-2">
      <div className="mb-6">
        <div className="font-serif text-[32px] font-light italic mb-1" style={{ color: 'var(--text)' }}>
          Roadmap
        </div>
        <div className="font-sans text-[13px]" style={{ color: 'var(--mid)' }}>
          Building the AI skill layer for Base Network
        </div>
      </div>

      <div className="space-y-6">
        {PHASES.map(({ phase, title, status, items }) => (
          <div key={phase}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-2 h-2 shrink-0 rounded-full"
                style={{
                  background: status === 'complete' ? 'var(--greenM)'
                    : status === 'active' ? 'var(--amber)'
                    : 'var(--bg3)'
                }}
              />
              <div>
                <span
                  className="font-mono text-[9px] tracking-widest uppercase mr-2"
                  style={{ color: 'var(--light)' }}
                >
                  {phase}
                </span>
                <span
                  className="font-serif text-[18px] font-light"
                  style={{
                    color: status === 'complete' ? 'var(--text)'
                      : status === 'active' ? 'var(--amber)'
                      : 'var(--ghost)'
                  }}
                >
                  {title}
                </span>
              </div>
              <div className="ml-auto">
                <span
                  className="font-mono text-[8px] tracking-widest uppercase px-2 py-0.5"
                  style={{
                    background: status === 'complete' ? 'var(--green)'
                      : status === 'active' ? 'rgba(226,144,30,0.2)'
                      : 'var(--bg3)',
                    color: status === 'complete' ? 'var(--greenM)'
                      : status === 'active' ? 'var(--amber)'
                      : 'var(--mid)'
                  }}
                >
                  {status}
                </span>
              </div>
            </div>
            <div
              className="border ml-5"
              style={{ borderColor: 'var(--bg3)', borderLeft: '2px solid var(--bg3)' }}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-2 flex items-center gap-2"
                  style={{ borderBottom: i < items.length - 1 ? '1px solid var(--bg3)' : 'none' }}
                >
                  <span
                    className="text-[10px]"
                    style={{ color: status === 'complete' ? 'var(--greenM)' : 'var(--bg3)' }}
                  >
                    {status === 'complete' ? '✓' : '○'}
                  </span>
                  <span className="font-sans text-[12px]" style={{ color: 'var(--text)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
