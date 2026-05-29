import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    const { SKILLS_DATA } = await import('@/lib/skills-data')
    const skill = SKILLS_DATA.find(s => s.id === params.id)
    if (!skill) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ skill })
  }

  return NextResponse.json({ skill: data })
}
