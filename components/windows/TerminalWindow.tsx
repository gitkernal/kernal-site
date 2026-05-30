'use client'
import Window from './Window'
import TerminalTab from '@/components/tabs/TerminalTab'

interface TerminalWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
}

export default function TerminalWindow({
  onClose, onFocus, zIndex,
  initialX, initialY, initialWidth, initialHeight
}: TerminalWindowProps) {
  return (
    <Window
      title="TERMINAL"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={initialX} initialY={initialY}
      initialWidth={initialWidth ?? 600} initialHeight={initialHeight ?? 420}
    >
      <TerminalTab />
    </Window>
  )
}
