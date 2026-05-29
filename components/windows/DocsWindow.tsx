import Window from './Window'
import DocsTab from '@/components/tabs/DocsTab'

interface DocsWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
}

export default function DocsWindow({ onClose, onFocus, zIndex }: DocsWindowProps) {
  return (
    <Window
      title="DOCS" fileExt=""
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={180} initialY={60} initialWidth={520} initialHeight={580}
    >
      <DocsTab />
    </Window>
  )
}
