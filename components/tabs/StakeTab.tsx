'use client'
import { useWallet } from '@/hooks/useWallet'
import KernalLogo from '@/components/os/KernalLogo'

const KRN_CA = process.env.NEXT_PUBLIC_KRN_CONTRACT || '0x974B53861d975E727305298D2718849c43046ba3'
const KRN_UNISWAP_URL = `https://app.uniswap.org/swap?outputCurrency=${KRN_CA}&chain=base`

export default function StakeTab() {
  const { address, krnBalance, tier, isConnecting, connect, disconnect } = useWallet()

  const getProgress = () => {
    if (!krnBalance) return 0
    const n = parseFloat(krnBalance.replace(/,/g, ''))
    return Math.min((n / 10_000_000) * 100, 100)
  }

  if (!address) {
    return (
      <div className="px-5 pb-24 pt-2">
        <div className="mb-4">
          <div
            className="font-sans text-[10px] font-semibold tracking-widest uppercase mb-1"
            style={{ color: 'var(--light)' }}
          >
            $KRN Staking
          </div>
          <div
            className="font-serif text-[36px] font-light leading-none tracking-tight italic mb-2"
            style={{ color: 'var(--text)' }}
          >
            Earn execution fees
          </div>
          <div className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--mid)' }}>
            Stake $KRN to earn 50% of all KERNAL execution fees. Paid in ETH. Real yield from real usage.
          </div>
        </div>

        <div className="flex border mb-4" style={{ borderColor: 'var(--bg3)' }}>
          {[['0.2%', 'Execution Fee'], ['50%', 'To Stakers'], ['ETH', 'Yield Token']].map(([v, l], i, a) => (
            <div
              key={l}
              className={`flex-1 text-center py-3 ${i < a.length - 1 ? 'border-r' : ''}`}
              style={{ borderColor: 'var(--bg3)' }}
            >
              <div className="font-serif text-[20px]" style={{ color: 'var(--amber)' }}>{v}</div>
              <div
                className="font-sans text-[8px] tracking-widest uppercase mt-1"
                style={{ color: 'var(--light)' }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        <div className="border p-6 mb-4" style={{ background: 'var(--dark)', borderColor: 'var(--darkB)' }}>
          <div className="flex justify-center mb-4 opacity-20">
            <KernalLogo size={48} />
          </div>
          <div
            className="font-serif text-[18px] text-center italic mb-4"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Connect wallet to view position
          </div>
          <div className="space-y-2">
            <button
              onClick={() => connect('metamask')}
              disabled={isConnecting}
              className="w-full py-3 font-sans text-[11px] font-semibold tracking-widest uppercase disabled:opacity-50"
              style={{ background: 'var(--amber)', color: 'var(--dark)' }}
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
            <button
              onClick={() => connect('coinbase')}
              disabled={isConnecting}
              className="w-full py-3 font-sans text-[11px] font-semibold tracking-widest uppercase border disabled:opacity-50"
              style={{ borderColor: 'var(--darkB)', color: 'rgba(255,255,255,0.4)' }}
            >
              Connect Coinbase Wallet
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {[
            ['10M $KRN', 'Premium Access + Staking Yield'],
            ['100M $KRN', 'Priority Access + Priority Support']
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between border p-3"
              style={{ borderColor: 'var(--bg3)' }}
            >
              <span className="font-mono text-[11px]" style={{ color: 'var(--amber)' }}>{k}</span>
              <span className="font-sans text-[11px]" style={{ color: 'var(--mid)' }}>{v}</span>
            </div>
          ))}
        </div>

        <a
          href={KRN_UNISWAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 text-center font-sans text-[11px] font-semibold tracking-widest uppercase border"
          style={{ borderColor: 'var(--bg3)', color: 'var(--mid)' }}
        >
          Buy $KRN on Uniswap →
        </a>
      </div>
    )
  }

  return (
    <div className="px-5 pb-24 pt-2">
      <div className="font-mono text-[10px] tracking-widest mb-4" style={{ color: 'var(--amber)' }}>
        ● {address.slice(0, 6)}...{address.slice(-4)}
      </div>

      <div className="border mb-4" style={{ borderColor: 'var(--bg3)' }}>
        {[
          ['$KRN Balance', krnBalance ? `${krnBalance} KRN` : '...'],
          ['$KRN Staked', '— (at TGE)'],
          ['Current Tier', tier],
          ['Pending ETH Yield', '— (at TGE)'],
        ].map(([l, v], i, a) => (
          <div key={l}>
            <div className="flex items-baseline justify-between px-4 py-3">
              <span
                className="font-sans text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: 'var(--light)' }}
              >
                {l}
              </span>
              <span
                className="font-serif text-[18px] font-light"
                style={{ color: l === 'Current Tier' && v !== 'None' ? 'var(--amber)' : 'var(--text)' }}
              >
                {v}
              </span>
            </div>
            {i < a.length - 1 && <div className="h-px" style={{ background: 'var(--bg3)' }} />}
          </div>
        ))}
      </div>

      {/* Tier progress bar */}
      <div className="mb-4">
        <div
          className="flex justify-between font-sans text-[9px] tracking-widest uppercase mb-2"
          style={{ color: 'var(--light)' }}
        >
          <span>0</span>
          <span>10M (Premium)</span>
          <span>100M (Priority)</span>
        </div>
        <div className="h-1" style={{ background: 'var(--bg3)' }}>
          <div
            className="h-full transition-all"
            style={{ width: `${getProgress()}%`, background: 'var(--amber)' }}
          />
        </div>
      </div>

      <div className="border p-4 mb-4" style={{ background: 'var(--dark)', borderColor: 'var(--darkB)' }}>
        <div className="font-mono text-[9px] tracking-widest mb-2" style={{ color: 'var(--amber)' }}>
          STAKING CONTRACT
        </div>
        <div className="font-sans text-[13px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Staking contract deploys at TGE. All execution fees from launch date will be claimable.
        </div>
        <a
          href={KRN_UNISWAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 text-center font-sans text-[11px] font-semibold tracking-widest uppercase"
          style={{ background: 'var(--amber)', color: 'var(--dark)' }}
        >
          Buy $KRN on Uniswap →
        </a>
      </div>

      <button
        onClick={disconnect}
        className="w-full py-3 font-sans text-[10px] font-semibold tracking-widest uppercase border"
        style={{ borderColor: 'var(--bg3)', color: 'var(--ghost)' }}
      >
        Disconnect
      </button>
    </div>
  )
}
