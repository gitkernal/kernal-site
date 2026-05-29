import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tier = searchParams.get('tier')
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const supabase = createClient()
  let query = supabase
    .from('skills')
    .select('*')
    .eq('status', 'live')
    .order('installs', { ascending: false })

  if (tier && tier !== 'all') query = query.eq('tier', tier)
  if (category && category !== 'all') query = query.eq('category', category)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, error } = await query

  if (error) {
    // Fall back to static data if Supabase isn't configured
    const { SKILLS_DATA } = await import('@/lib/skills-data')
    let filtered = [...SKILLS_DATA]
    if (tier && tier !== 'all') filtered = filtered.filter(s => s.tier === tier)
    if (category && category !== 'all') filtered = filtered.filter(s => s.category === category)
    if (search) filtered = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    return NextResponse.json({ skills: filtered })
  }

  return NextResponse.json({ skills: data })
}
