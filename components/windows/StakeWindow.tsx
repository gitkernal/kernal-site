import Window from './Window'
import StakeTab from '@/components/tabs/StakeTab'

interface StakeWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
}

export default function StakeWindow({ onClose, onFocus, zIndex }: StakeWindowProps) {
  return (
    <Window
      title="STAKE" fileExt=".db"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={320} initialY={60} initialWidth={440} initialHeight={580}
    >
      <StakeTab />
    </Window>
  )
}
