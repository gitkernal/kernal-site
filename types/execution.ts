export interface Execution {
  id: string
  skill_id: string
  wallet_address?: string
  config_used: Record<string, unknown>
  prompt_tokens?: number
  output_tokens?: number
  duration_ms?: number
  success: boolean
  error_message?: string
  created_at: string
}

export interface ExecutePayload {
  skill_id: string
  config: Record<string, string | number | boolean>
  wallet_address?: string
}

export interface ExecuteResult {
  output: string
  skill_id: string
  duration_ms: number
}
