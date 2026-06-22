import Anthropic from '@anthropic-ai/sdk'

let _client: Anthropic | null = null

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

/**
 * Model id for the active client.
 *
 * Virtuals Compute may expose a different model identifier than the direct
 * Anthropic API, so it is overridable via VIRTUALS_MODEL. The direct-Anthropic
 * fallback uses claude-sonnet-4-6.
 */
export function getModel(): string {
  if (process.env.VIRTUALS_API_KEY) {
    return process.env.VIRTUALS_MODEL || 'anthropic/claude-sonnet-4-5'
  }
  return 'claude-sonnet-4-6'
}
