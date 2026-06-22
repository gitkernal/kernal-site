import Anthropic from '@anthropic-ai/sdk'

let _virtuals: Anthropic | null = null
let _direct: Anthropic | null = null

/**
 * Inference provider strategy for the production app.
 *
 * IMPORTANT: Virtuals Compute's free credits (Tier: Spark) are designed to power
 * *Claude Code* via a local claude-code-router on localhost:3456 — NOT to serve a
 * deployed app's end-user traffic. A Vercel function can't reach that local router,
 * and calling compute.virtuals.io directly is an unsupported path that 503s under
 * load. So production defaults to the direct Anthropic API (reliable, supported).
 *
 * Set INFERENCE_PROVIDER=virtuals to force the Virtuals path (best-effort, free)
 * with automatic fallback to the direct Anthropic API when Virtuals is unavailable.
 */
function preferVirtuals(): boolean {
  if (process.env.INFERENCE_PROVIDER === 'virtuals') return true
  if (process.env.INFERENCE_PROVIDER === 'anthropic') return false
  // Default: direct Anthropic when its key exists; Virtuals only if it's all we have.
  return !process.env.ANTHROPIC_API_KEY && !!process.env.VIRTUALS_API_KEY
}

/** Direct Anthropic client (paid, reliable). Null if no key configured. */
function getDirectClient(): Anthropic | null {
  if (_direct) return _direct
  if (!process.env.ANTHROPIC_API_KEY) return null
  _direct = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _direct
}

/**
 * Virtuals Compute client. Null if no key configured.
 *
 * The Anthropic SDK appends "/v1/messages" to baseURL itself, so VIRTUALS_BASE_URL
 * must be the bare host (no trailing "/v1") or requests double to ".../v1/v1/messages".
 */
function getVirtualsClient(): Anthropic | null {
  if (_virtuals) return _virtuals
  if (!process.env.VIRTUALS_API_KEY) return null
  _virtuals = new Anthropic({
    apiKey: process.env.VIRTUALS_API_KEY,
    baseURL: process.env.VIRTUALS_BASE_URL || 'https://compute.virtuals.io',
  })
  return _virtuals
}

const DIRECT_MODEL = 'claude-sonnet-4-6'

/**
 * Virtuals model candidates, tried in order on availability errors. Ids are
 * hyphen-separated per Virtuals' /v1/models (NOT the slash form, which 500s with
 * "Invalid model provided"). Overridable via VIRTUALS_MODEL.
 */
function virtualsModelCandidates(): string[] {
  const configured = process.env.VIRTUALS_MODEL
  const fallbacks = [
    'anthropic-claude-sonnet-4-6',
    'anthropic-claude-sonnet-4-5',
    'anthropic-claude-opus-4-8',
  ]
  if (configured) return [configured, ...fallbacks.filter(m => m !== configured)]
  return fallbacks
}

function isUpstreamUnavailable(e: unknown): boolean {
  const status = (e as { status?: number })?.status
  if (status === 502 || status === 503 || status === 529) return true
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase()
  return msg.includes('unavailable') || msg.includes('overloaded')
}

type CreateParams = Omit<Anthropic.MessageCreateParamsNonStreaming, 'model'>

/**
 * Create a message using the configured provider.
 *
 * Default (production): direct Anthropic API.
 * INFERENCE_PROVIDER=virtuals: try each Virtuals model candidate; if all are
 * unavailable, fall back to the direct Anthropic API when ANTHROPIC_API_KEY is set.
 */
export async function createMessage(params: CreateParams): Promise<Anthropic.Message> {
  if (preferVirtuals()) {
    const virtuals = getVirtualsClient()
    if (virtuals) {
      let lastErr: unknown
      for (const model of virtualsModelCandidates()) {
        try {
          return await virtuals.messages.create({ ...params, model })
        } catch (e) {
          lastErr = e
          if (!isUpstreamUnavailable(e)) throw e // surface non-availability errors
        }
      }
      const direct = getDirectClient()
      if (direct) return await direct.messages.create({ ...params, model: DIRECT_MODEL })
      throw lastErr
    }
  }

  const direct = getDirectClient()
  if (direct) return await direct.messages.create({ ...params, model: DIRECT_MODEL })

  // No Anthropic key but a Virtuals key exists — last resort.
  const virtuals = getVirtualsClient()
  if (virtuals) {
    return await virtuals.messages.create({ ...params, model: virtualsModelCandidates()[0] })
  }

  throw new Error('No inference provider configured (set ANTHROPIC_API_KEY or VIRTUALS_API_KEY)')
}
