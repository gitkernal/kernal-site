import Window from './Window'
import ArticlesTab from '@/components/tabs/ArticlesTab'

interface ArticlesWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function ArticlesWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: ArticlesWindowProps) {
  return (
    <Window
      title="ARTICLES"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth} initialHeight={initialHeight}
    >
      <ArticlesTab />
    </Window>
  )
}
