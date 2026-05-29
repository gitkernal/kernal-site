import Window from './Window'
import SubmitTab from '@/components/tabs/SubmitTab'

interface SubmitWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
}

export default function SubmitWindow({ onClose, onFocus, zIndex }: SubmitWindowProps) {
  return (
    <Window
      title="SUBMIT" fileExt=".md"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={180} initialY={100} initialWidth={480} initialHeight={600}
    >
      <SubmitTab />
    </Window>
  )
}
