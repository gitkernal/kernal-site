import Window from './Window'
import StakeTab from '@/components/tabs/StakeTab'

interface StakeWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function StakeWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: StakeWindowProps) {
  return (
    <Window
      title="STAKE" fileExt=".db"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth} initialHeight={initialHeight}
    >
      <StakeTab />
    </Window>
  )
}
