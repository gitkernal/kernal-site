'use client'
import { useState, useEffect } from 'react'
import { SKILLS_DATA } from '@/lib/skills-data'
import type { Skill } from '@/types/skill'

interface UseSkillsOptions {
  tier?: string
  category?: string
  search?: string
}

export function useSkills(options: UseSkillsOptions = {}) {
  const [skills, setSkills] = useState<Skill[]>(SKILLS_DATA)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (options.tier) params.set('tier', options.tier)
    if (options.category) params.set('category', options.category)
    if (options.search) params.set('search', options.search)

    setLoading(true)
    fetch(`/api/skills?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.skills && d.skills.length > 0) {
          setSkills(d.skills)
        }
        // else keep SKILLS_DATA fallback already in state
      })
      .catch(() => {
        // Keep static data on network error
      })
      .finally(() => setLoading(false))
  }, [options.tier, options.category, options.search])

  return { skills, loading, error }
}
