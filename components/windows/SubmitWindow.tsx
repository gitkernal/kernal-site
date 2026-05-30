import Window from './Window'
import SubmitTab from '@/components/tabs/SubmitTab'

interface SubmitWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function SubmitWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: SubmitWindowProps) {
  return (
    <Window
      title="SUBMIT" fileExt=".md"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth} initialHeight={initialHeight}
    >
      <SubmitTab />
    </Window>
  )
}
