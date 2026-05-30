import Window from './Window'
import StatsTab from '@/components/tabs/StatsTab'

interface StatsWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function StatsWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: StatsWindowProps) {
  return (
    <Window
      title="STATS"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth} initialHeight={initialHeight}
    >
      <StatsTab />
    </Window>
  )
}
