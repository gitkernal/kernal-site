interface StatRowProps {
  label: string
  value: string | number
  accent?: boolean
}

export default function StatRow({ label, value, accent = false }: StatRowProps) {
  return (
    <div className="flex items-baseline justify-between py-2" style={{ borderBottom: '1px solid var(--bg3)' }}>
      <span className="font-sans text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--light)' }}>
        {label}
      </span>
      <span
        className="font-serif text-[16px] font-light"
        style={{ color: accent ? 'var(--amber)' : 'var(--text)' }}
      >
        {value}
      </span>
    </div>
  )
}
