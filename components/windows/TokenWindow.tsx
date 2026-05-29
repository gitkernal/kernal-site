import Window from './Window'
import TokenTab from '@/components/tabs/TokenTab'

interface TokenWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
}

export default function TokenWindow({ onClose, onFocus, zIndex }: TokenWindowProps) {
  return (
    <Window
      title="TOKEN" fileExt=".db"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={140} initialY={90} initialWidth={440} initialHeight={580}
    >
      <TokenTab />
    </Window>
  )
}
