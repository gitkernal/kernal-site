import Window from './Window'
import TokenTab from '@/components/tabs/TokenTab'

interface TokenWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function TokenWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: TokenWindowProps) {
  return (
    <Window
      title="TOKEN" fileExt=".db"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth} initialHeight={initialHeight}
    >
      <TokenTab />
    </Window>
  )
}
