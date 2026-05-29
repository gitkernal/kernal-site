'use client'
import CopyButton from '@/components/ui/CopyButton'

const KRN_CA = '0x974B53861d975E727305298D2718849c43046ba3'

export default function TokenTab() {
  return (
    <div className="px-5 pb-24 pt-2">
      {/* Header */}
      <div className="mb-6">
        <div className="font-serif text-[42px] font-light italic leading-none mb-2" style={{ color: 'var(--text)' }}>
          $KRN
        </div>
        <div className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--mid)' }}>
          The KERNAL protocol token. Powers access, governance, and revenue sharing for AI skill execution on Base Network.
        </div>
      </div>

      {/* Contract address */}
      <div className="border p-4 mb-4" style={{ borderColor: 'var(--bg3)', background: 'var(--bg2)' }}>
        <div className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
          Contract Address — Base
        </div>
        <div className="font-mono text-[10px] break-all mb-2" style={{ color: 'var(--text)' }}>
          {KRN_CA}
        </div>
        <CopyButton text={KRN_CA} />
      </div>

      {/* Tokenomics */}
      <div className="mb-4">
        <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
          Tokenomics
        </div>
        <div className="border" style={{ borderColor: 'var(--bg3)' }}>
          {[
            ['Total Supply', '1,000,000,000 KRN'],
            ['Network', 'Base (EVM L2)'],
            ['Premium Tier', '10,000,000 KRN'],
            ['Priority Tier', '100,000,000 KRN'],
            ['Execution Fee', '0.2% per run'],
            ['Staker Share', '50% of all fees'],
            ['Author Share', '50% of skill fees'],
          ].map(([k, v], i, a) => (
            <div
              key={k}
              className="flex items-baseline justify-between px-4 py-3"
              style={{ borderBottom: i < a.length - 1 ? '1px solid var(--bg3)' : 'none' }}
            >
              <span className="font-sans text-[11px]" style={{ color: 'var(--mid)' }}>{k}</span>
              <span className="font-mono text-[11px]" style={{ color: 'var(--text)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Utility */}
      <div className="mb-4">
        <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
          Token Utility
        </div>
        <div className="space-y-3">
          {[
            { title: 'Premium Access', desc: 'Hold 10M+ $KRN to unlock all premium skills including Alpha Digest, Sniper, and Copy Trader.' },
            { title: 'Priority Access', desc: 'Hold 100M+ $KRN for priority execution queue, dedicated support, and early feature access.' },
            { title: 'Staking Yield', desc: 'Stake $KRN to earn ETH from platform execution fees. Distributed proportionally to stakers.' },
            { title: 'Governance', desc: 'Vote on protocol upgrades, skill approvals, fee parameters, and treasury allocation.' },
            { title: 'Skill Submission', desc: 'Listing fee of 5M $KRN required to submit a skill for review. Burns on rejection, refunds on acceptance.' }
          ].map(({ title, desc }) => (
            <div key={title} className="border p-3" style={{ borderColor: 'var(--bg3)' }}>
              <div className="font-sans text-[11px] font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</div>
              <div className="font-sans text-[11px] leading-snug" style={{ color: 'var(--mid)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Buy button */}
      <a
        href={`https://app.uniswap.org/swap?outputCurrency=${KRN_CA}&chain=base`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-3.5 text-center font-sans text-[11px] font-semibold tracking-widest uppercase"
        style={{ background: 'var(--amber)', color: 'var(--dark)' }}
      >
        Buy $KRN on Uniswap →
      </a>
    </div>
  )
}
