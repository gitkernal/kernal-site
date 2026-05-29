'use client'
import { useState } from 'react'
import Window from './Window'
import RunTab from '@/components/tabs/RunTab'

interface RunWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  initialSkillId?: string
}

export default function RunWindow({ onClose, onFocus, zIndex, initialSkillId }: RunWindowProps) {
  return (
    <Window
      title="RUN" fileExt=".exe"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={220} initialY={80} initialWidth={500} initialHeight={620}
    >
      <RunTab initialSkillId={initialSkillId} />
    </Window>
  )
}
