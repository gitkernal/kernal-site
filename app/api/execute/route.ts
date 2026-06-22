import { createMessage } from '@/lib/anthropic'
import { createClient } from '@/lib/supabase'
import { buildSkillPrompt } from '@/lib/skill-prompts'
import { SKILLS_DATA } from '@/lib/skills-data'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { skill_id, config, wallet_address } = body

  if (!skill_id) {
    return NextResponse.json({ error: 'skill_id required' }, { status: 400 })
  }

  // Try Supabase first, fall back to static data
  let skill: Record<string, unknown> | null = null
  try {
    const supabase = createClient()
    const { data } = await supabase.from('skills').select('*').eq('id', skill_id).single()
    skill = data
  } catch {}

  if (!skill) {
    const staticSkill = SKILLS_DATA.find(s => s.id === skill_id)
    if (staticSkill) skill = staticSkill as unknown as Record<string, unknown>
  }

  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }

  // Premium gate
  if (skill.tier === 'premium') {
    if (!wallet_address) {
      return NextResponse.json(
        { error: 'PREMIUM_GATE', message: 'Connect wallet to run premium skills' },
        { status: 403 }
      )
    }
    const { checkPremiumAccess } = await import('@/lib/onchain')
    const hasAccess = await checkPremiumAccess(wallet_address)
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'PREMIUM_GATE', message: 'Requires 10,000,000 $KRN on Base' },
        { status: 403 }
      )
    }
  }

  const prompt = buildSkillPrompt(skill_id, config || {})
  if (!prompt) {
    return NextResponse.json({ error: 'Skill prompt not found' }, { status: 400 })
  }

  const startTime = Date.now()

  try {
    const message = await createMessage({
      max_tokens: 1500,
      system: prompt.system,
      messages: [{ role: 'user', content: prompt.user }]
    })

    const output = message.content[0].type === 'text' ? message.content[0].text : ''
    const duration_ms = Date.now() - startTime

    // Log to Supabase (non-blocking)
    try {
      const supabase = createClient()
      await supabase.from('executions').insert({
        skill_id,
        wallet_address: wallet_address || null,
        config_used: config || {},
        prompt_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
        duration_ms,
        success: true
      })
      await supabase.rpc('increment_executions', { skill_id_param: skill_id })
    } catch {}

    return NextResponse.json({ output, skill_id, duration_ms })

  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Execution failed'
    const duration_ms = Date.now() - startTime

    try {
      const supabase = createClient()
      await supabase.from('executions').insert({
        skill_id,
        wallet_address: wallet_address || null,
        config_used: config || {},
        duration_ms,
        success: false,
        error_message: errorMessage
      })
    } catch {}

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
