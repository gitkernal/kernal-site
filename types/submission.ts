export type SubmissionMethod = 'github' | 'manual'
export type SubmissionStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected'

export interface Submission {
  id: string
  method: SubmissionMethod
  status: SubmissionStatus
  github_url?: string
  skill_name?: string
  skill_version?: string
  tier?: string
  category?: string
  description?: string
  author_name?: string
  author_wallet?: string
  skill_content?: string
  compat?: string[]
  submitter_wallet?: string
  review_notes?: string
  listing_fee_tx?: string
  created_at: string
  updated_at: string
}

export interface SubmitPayload {
  method: SubmissionMethod
  github_url?: string
  skill_name?: string
  skill_version?: string
  tier?: string
  category?: string
  description?: string
  author_name?: string
  author_wallet?: string
  skill_content?: string
  compat?: string[]
  submitter_wallet?: string
}
