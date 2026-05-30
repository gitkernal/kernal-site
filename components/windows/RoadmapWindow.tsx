import Window from './Window'
import RoadmapTab from '@/components/tabs/RoadmapTab'

interface RoadmapWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function RoadmapWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: RoadmapWindowProps) {
  return (
    <Window
      title="ROADMAP"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth} initialHeight={initialHeight}
    >
      <RoadmapTab />
    </Window>
  )
}
