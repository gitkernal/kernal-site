import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    method, github_url, skill_name, skill_version, tier, category,
    description, author_name, author_wallet, skill_content,
    compat, submitter_wallet
  } = body

  if (!method) return NextResponse.json({ error: 'method required' }, { status: 400 })

  if (method === 'github' && !github_url) {
    return NextResponse.json({ error: 'github_url required' }, { status: 400 })
  }

  if (method === 'manual' && (!skill_name || !description || !author_name)) {
    return NextResponse.json({ error: 'skill_name, description, author_name required' }, { status: 400 })
  }

  const id = 'KRN-' + Date.now().toString(16).toUpperCase().slice(-8)

  const supabase = createClient()
  const { error } = await supabase.from('submissions').insert({
    id,
    method,
    github_url: github_url || null,
    skill_name: skill_name || null,
    skill_version: skill_version || '1.0.0',
    tier: tier || 'free',
    category: category || null,
    description: description || null,
    author_name: author_name || null,
    author_wallet: author_wallet || null,
    skill_content: skill_content || null,
    compat: compat || [],
    submitter_wallet: submitter_wallet || null,
    status: 'pending'
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    id,
    status: 'pending',
    message: 'Submission received. Review in 5–10 business days.'
  })
}
