import Window from './Window'
import ArticlesTab from '@/components/tabs/ArticlesTab'

interface ArticlesWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
}

export default function ArticlesWindow({ onClose, onFocus, zIndex }: ArticlesWindowProps) {
  return (
    <Window
      title="ARTICLES" fileExt=""
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={250} initialY={70} initialWidth={480} initialHeight={580}
    >
      <ArticlesTab />
    </Window>
  )
}
