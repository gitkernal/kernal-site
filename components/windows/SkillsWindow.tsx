'use client'
import { useState } from 'react'
import Window from './Window'
import SkillsTab from '@/components/tabs/SkillsTab'
import SkillDetailTab from '@/components/tabs/SkillDetailTab'
import type { Skill } from '@/types/skill'

interface SkillsWindowProps {
  onClose: () => void
  onFocus: () => void
  zIndex: number
  onRunSkill?: (skillId: string) => void
}

export default function SkillsWindow({ onClose, onFocus, zIndex, onRunSkill }: SkillsWindowProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  return (
    <Window
      title="SKILLS" fileExt=".db"
      onClose={onClose} onFocus={onFocus} zIndex={zIndex}
      initialX={80} initialY={50} initialWidth={460} initialHeight={580}
    >
      {selectedSkill ? (
        <SkillDetailTab
          skill={selectedSkill}
          onBack={() => setSelectedSkill(null)}
          onRun={() => { onRunSkill?.(selectedSkill.id); setSelectedSkill(null) }}
        />
      ) : (
        <SkillsTab
          onSelectSkill={setSelectedSkill}
          onRunSkill={onRunSkill}
        />
      )}
    </Window>
  )
}
