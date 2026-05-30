import Window from './Window'
import DocsTab from '@/components/tabs/DocsTab'

interface DocsWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function DocsWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: DocsWindowProps) {
  return (
    <Window
      title="DOCS"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth} initialHeight={initialHeight}
    >
      <DocsTab />
    </Window>
  )
}
