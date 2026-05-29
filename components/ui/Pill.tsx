interface PillProps {
  tier: 'free' | 'premium'
  className?: string
}

export default function Pill({ tier, className = '' }: PillProps) {
  const isFree = tier === 'free'
  return (
    <span
      className={`inline-block font-mono text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5 ${className}`}
      style={{
        background: isFree ? 'var(--bg3)' : 'var(--amber)',
        color: isFree ? 'var(--mid)' : 'var(--dark)'
      }}
    >
      {isFree ? 'FREE' : '⬡ PREMIUM'}
    </span>
  )
}
