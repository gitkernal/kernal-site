interface LabelProps {
  children: React.ReactNode
  className?: string
}

export default function Label({ children, className = '' }: LabelProps) {
  return (
    <div
      className={`font-sans text-[9px] font-semibold tracking-widest uppercase ${className}`}
      style={{ color: 'var(--light)' }}
    >
      {children}
    </div>
  )
}
