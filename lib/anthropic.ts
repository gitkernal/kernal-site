import Anthropic from '@anthropic-ai/sdk'

let _client: Anthropic | null = null
let _direct: Anthropic | null = null

/**
 * Shared Anthropic client.
 *
 * Prefers Virtuals Compute (free inference credits) when VIRTUALS_API_KEY is set,
 * and falls back to the direct Anthropic API otherwise. The endpoint is
 * Anthropic-compatible, so this is just a base-URL + key swap.
 *
 * IMPORTANT: the Anthropic SDK appends "/v1/messages" to baseURL itself. The
 * base URL must therefore NOT include a trailing "/v1" — otherwise requests go
 * to ".../v1/v1/messages". VIRTUALS_BASE_URL defaults to the bare host for that
 * reason; override it if Virtuals' actual path differs.
 */
export function getAnthropicClient(): Anthropic {
  if (_client) return _client

  const virtualsKey = process.env.VIRTUALS_API_KEY
  if (virtualsKey) {
    _client = new Anthropic({
      apiKey: virtualsKey,
      baseURL: process.env.VIRTUALS_BASE_URL || 'https://compute.virtuals.io',
    })
  } else {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  return _client
}

/** Direct Anthropic client, used only as a fallback when Virtuals is down. */
function getDirectAnthropicClient(): Anthropic | null {
  if (_direct) return _direct
  if (!process.env.ANTHROPIC_API_KEY) return null
  _direct = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _direct
}

const usingVirtuals = () => !!process.env.VIRTUALS_API_KEY

/**
 * Model id for the active client (also used for log lines).
 *
 * Virtuals Compute exposes a different model identifier than the direct
 * Anthropic API: its /v1/models ids are hyphen-separated (e.g.
 * "anthropic-claude-sonnet-4-6"), NOT the slash form "anthropic/claude-...".
 * Sending the slash form returns 500 "Invalid model provided". Overridable via
 * VIRTUALS_MODEL. The direct-Anthropic fallback uses claude-sonnet-4-6.
 */
export function getModel(): string {
  if (usingVirtuals()) {
    return process.env.VIRTUALS_MODEL || 'anthropic-claude-sonnet-4-6'
  }
  return 'claude-sonnet-4-6'
}

/**
 * Ordered model candidates to try on Virtuals before giving up. If one returns
 * an upstream-availability error (503/502/529, "Service unavailable",
 * "overloaded"), we advance to the next. All ids are from Virtuals' /v1/models.
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
  return msg.includes('service unavailable') || msg.includes('overloaded') || msg.includes('unavailable')
}

type CreateParams = Omit<Anthropic.MessageCreateParamsNonStreaming, 'model'>

/**
 * Create a message with resilience: on Virtuals, try each candidate model in
 * turn; if every Virtuals model is unavailable and ANTHROPIC_API_KEY is set,
 * fall back to the direct Anthropic API. The SDK already retries each call
 * (maxRetries) for transient blips, so reaching the next candidate means the
 * model/provider is persistently down, not a momentary hiccup.
 */
export async function createMessage(params: CreateParams): Promise<Anthropic.Message> {
  if (usingVirtuals()) {
    const client = getAnthropicClient()
    let lastErr: unknown
    for (const model of virtualsModelCandidates()) {
      try {
        return await client.messages.create({ ...params, model })
      } catch (e) {
        lastErr = e
        if (!isUpstreamUnavailable(e)) throw e // not an availability issue — surface it
      }
    }
    // Every Virtuals model was unavailable — fall back to direct Anthropic.
    const direct = getDirectAnthropicClient()
    if (direct) {
      return await direct.messages.create({ ...params, model: 'claude-sonnet-4-6' })
    }
    throw lastErr
  }

  return await getAnthropicClient().messages.create({ ...params, model: getModel() })
}
