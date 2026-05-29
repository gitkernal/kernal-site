interface KernalLogoProps {
  size?: number
  color?: string
  className?: string
}

export default function KernalLogo({ size = 40, color = '#B87420', className = '' }: KernalLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
    >
      <line x1="26" y1="13" x2="26" y2="87" stroke={color} strokeWidth="13" strokeLinecap="square" />
      <line x1="26" y1="50" x2="84" y2="14" stroke={color} strokeWidth="13" strokeLinecap="square" />
      <line x1="26" y1="50" x2="84" y2="86" stroke={color} strokeWidth="13" strokeLinecap="square" />
    </svg>
  )
}
