import Window from './Window'
import RunTab from '@/components/tabs/RunTab'

interface RunWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialSkillId?: string
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function RunWindow({
  onClose, onFocus, zIndex, initialSkillId,
  initialX, initialY, initialWidth, initialHeight
}: RunWindowProps) {
  return (
    <Window
      title="RUN" fileExt=".exe"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth} initialHeight={initialHeight}
    >
      <RunTab initialSkillId={initialSkillId} />
    </Window>
  )
}
