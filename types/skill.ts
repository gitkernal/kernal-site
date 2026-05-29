export type SkillTier = 'free' | 'premium'
export type SkillCategory = 'monitoring' | 'trading' | 'defi' | 'research' | 'protection' | 'governance' | 'automation'
export type TriggerType = 'scheduled' | 'on_event' | 'manual'
export type SkillStatus = 'live' | 'deprecated' | 'beta'

export interface ConfigField {
  k: string
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea'
  label: string
  placeholder?: string
  required: boolean
  default?: string | number | boolean
  options?: string[]
}

export interface Skill {
  id: string
  name: string
  version: string
  tier: SkillTier
  category: SkillCategory
  trigger_type: TriggerType
  tagline: string
  description: string
  deps: string[]
  compat: string[]
  config_schema: ConfigField[]
  author: string
  author_wallet?: string
  github_url?: string
  installs: number
  executions: number
  risk_level: string
  gas_cost: string
  status: SkillStatus
  created_at: string
  updated_at: string
}
