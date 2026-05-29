interface DividerProps {
  className?: string
}

export default function Divider({ className = '' }: DividerProps) {
  return <div className={`h-px ${className}`} style={{ background: 'var(--bg3)' }} />
}
