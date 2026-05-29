interface ActionButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'outline' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
}

export default function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  type = 'button'
}: ActionButtonProps) {
  const styles = {
    primary: {
      background: 'var(--dark)',
      color: 'var(--bg)',
      border: 'none'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--bg3)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--mid)',
      border: '1px solid var(--bg3)'
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 font-sans text-[11px] font-semibold tracking-widest uppercase transition-opacity disabled:opacity-50 ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  )
}
