import { getAnthropicClient, getModel } from '@/lib/anthropic'
import { createClient } from '@/lib/supabase'
import { checkPremiumAccess } from '@/lib/onchain'
import { NextRequest, NextResponse } from 'next/server'

const MAX_PROMPT_CHARS = 2000
const DAILY_LIMIT = 10
const MAX_TOKENS = 8000

const SYSTEM_PROMPT = `You are KERNAL's AI coding agent. You build complete, working web applications from user descriptions.

RULES:
- Output a complete, runnable project.
- Prefer a single-file approach when possible: one index.html with inline CSS and JS, OR a React app using only these files: App.js, styles.css, index.js.
- Use modern, clean, aesthetic design by default. Dark theme, good typography, smooth interactions.
- NO external API calls that need keys. NO backend. Frontend only.
- Use CDN imports for libraries when needed (via <script> or esm.sh).
- Make it actually work, not a mockup.

OUTPUT FORMAT — respond with ONLY a JSON object, no markdown fences, no preamble:
{
  "explanation": "1-2 sentence summary of what you built",
  "framework": "html" | "react",
  "files": {
    "index.html": "...file contents...",
    "style.css": "...",
    "app.js": "..."
  },
  "entryFile": "index.html"
}

For React framework, use files: { "App.js": "...", "styles.css": "...", "index.js": "..." } with entryFile "index.js".`

type ConversationMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(req: NextRequest) {
  const { prompt, wallet_address, conversation } = await req.json()

  // 1. Validate prompt
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ error: 'Prompt required (max 2000 chars)' }, { status: 400 })
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json(
      { error: 'PROMPT_TOO_LONG', message: `Prompt too long (max ${MAX_PROMPT_CHARS} chars)` },
      { status: 400 }
    )
  }

  // 2. Premium gate
  if (!wallet_address) {
    return NextResponse.json(
      { error: 'WALLET_REQUIRED', message: 'Connect wallet with 10M $KRN to use AI coding' },
      { status: 403 }
    )
  }
  const hasAccess = await checkPremiumAccess(wallet_address)
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'PREMIUM_REQUIRED', message: 'Requires 10,000,000 $KRN on Base' },
      { status: 403 }
    )
  }

  // 3. Rate limit (10 per 24h per wallet)
  const supabase = createClient()
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: usage } = await supabase
    .from('terminal_usage')
    .select('id')
    .eq('wallet_address', wallet_address)
    .gte('created_at', dayAgo)

  if (usage && usage.length >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: 'RATE_LIMIT', message: `Daily limit reached (${DAILY_LIMIT}/day). Try again tomorrow.` },
      { status: 429 }
    )
  }

  // 4. Build messages (include conversation history for iterative edits)
  const history: ConversationMessage[] = Array.isArray(conversation)
    ? conversation
        .filter(
          (m): m is ConversationMessage =>
            m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
        )
        .slice(-10)
    : []

  const messages: ConversationMessage[] = [...history, { role: 'user', content: prompt }]

  // 5. Generate
  try {
    const anthropic = getAnthropicClient()
    const message = await anthropic.messages.create({
      model: getModel(),
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON response (strip any accidental fences)
    const clean = text.replace(/```json|```/g, '').trim()
    let project
    try {
      project = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'Generation parse failed, try rephrasing' }, { status: 500 })
    }

    if (!project || typeof project.files !== 'object' || !project.files) {
      return NextResponse.json({ error: 'Generation produced no files, try rephrasing' }, { status: 500 })
    }

    // Log usage
    await supabase.from('terminal_usage').insert({ wallet_address })

    return NextResponse.json({
      explanation: project.explanation || 'Built your app.',
      framework: project.framework === 'react' ? 'react' : 'html',
      files: project.files,
      entryFile: project.entryFile || (project.framework === 'react' ? 'index.js' : 'index.html'),
      usage: { input: message.usage.input_tokens, output: message.usage.output_tokens }
    })
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Generation failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
