import Window from './Window'
import RoadmapTab from '@/components/tabs/RoadmapTab'

interface RoadmapWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
}

export default function RoadmapWindow({ onClose, onFocus, zIndex }: RoadmapWindowProps) {
  return (
    <Window
      title="ROADMAP" fileExt=""
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={160} initialY={80} initialWidth={460} initialHeight={580}
    >
      <RoadmapTab />
    </Window>
  )
}
