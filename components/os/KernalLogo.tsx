interface KernalLogoProps {
  size?: number
  /** Stroke color of the K. Defaults to currentColor so it inherits --text and
   *  stays visible on both light (dark K) and dark (light K) surfaces. */
  color?: string
  /** The amber accent block at the joint — matches the logo's amber block. */
  blockColor?: string
  className?: string
}

export default function KernalLogo({
  size = 40,
  color = 'currentColor',
  blockColor = '#E2901E',
  className = '',
}: KernalLogoProps) {
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
      {/* amber accent block at the joint */}
      <rect x="20" y="44" width="12" height="12" fill={blockColor} />
    </svg>
  )
}
