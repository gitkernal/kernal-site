import Window from './Window'
import StatsTab from '@/components/tabs/StatsTab'

interface StatsWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
}

export default function StatsWindow({ onClose, onFocus, zIndex }: StatsWindowProps) {
  return (
    <Window
      title="STATS" fileExt=""
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={200} initialY={70} initialWidth={440} initialHeight={560}
    >
      <StatsTab />
    </Window>
  )
}
