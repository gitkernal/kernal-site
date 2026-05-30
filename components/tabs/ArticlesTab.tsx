'use client'
import { useState } from 'react'

const ARTICLES = [
  {
    id: 'a1',
    title: 'What is KERNAL?',
    date: '2024-11-01',
    tag: 'Intro',
    content: `KERNAL is an AI skill operating system built on Base Network. It provides a registry of composable AI skills that can be executed on-demand, triggered by on-chain events, or scheduled to run autonomously.

Each skill is a specialized AI agent — a focused prompt system paired with the Anthropic API — designed to solve a specific on-chain or off-chain task. Skills range from wallet analysis and yield optimization to sniper bots and governance automation.

The $KRN token gates access to premium skills and distributes 50% of all execution fees to stakers. Authors who contribute accepted skills earn 50% of fees from their work, creating a self-sustaining ecosystem where quality skills are rewarded.

The KERNAL OS interface mimics a file manager for AI agents — each skill is a file you can open, configure, and run.`
  },
  {
    id: 'a2',
    title: 'Understanding the Skill Tier System',
    date: '2024-11-08',
    tag: 'Guide',
    content: `KERNAL skills are divided into two tiers: Free and Premium.

**Free Skills** are accessible to anyone without holding $KRN. These include utility skills like Wallet Digest, Token Alert, Gas Tracker, and DeFi Monitor — core primitives that power the platform.

**Premium Skills** require holding at least 10,000,000 $KRN in your connected wallet on Base Network. Premium skills include more alpha-sensitive capabilities: Alpha Digest, Arbitrage Scanner, Copy Trader, Sniper, MEV Guard, Portfolio Rebalancer, and Governance Voter.

The gate is enforced on-chain: your $KRN balance is read from the contract at execution time. There is no subscription or account required — just hold the tokens.

**Priority Tier** (100M+ $KRN) provides execution priority, dedicated support, and early access to new skills before they go live.`
  },
  {
    id: 'a3',
    title: 'How Skill Execution Works',
    date: '2024-11-15',
    tag: 'Technical',
    content: `When you click "Execute Skill" in KERNAL, here's what happens:

1. **Frontend validation** — Your config parameters are checked against the skill's schema. Required fields must be filled.

2. **API call** — A POST request hits /api/execute with your skill_id, config, and wallet address.

3. **Supabase lookup** — The server fetches the skill definition from the database (or falls back to static data if unavailable).

4. **Premium gate** — If the skill is premium-tier, your $KRN balance is read directly from the Base mainnet contract using viem. No cached data.

5. **Anthropic call** — The server calls claude-sonnet-4-6 with a skill-specific system prompt and a user prompt built from your config.

6. **Logging** — The execution is logged to Supabase: success/failure, token usage, duration, wallet address.

7. **Response** — The model output is returned to your browser and displayed in the terminal output panel.

Everything runs server-side except the wallet connection. Your Anthropic API key never leaves the server.`
  },
  {
    id: 'a4',
    title: 'Submitting a Skill to KERNAL',
    date: '2024-11-22',
    tag: 'Guide',
    content: `Any developer can submit a skill to the KERNAL registry. Accepted skills earn 50% of all execution fees paid to their author wallet in perpetuity.

**Submission Methods:**

*GitHub URL* — Submit a repository containing a SKILL.md file in a /skills/ directory. The SKILL.md defines your skill's metadata, config schema, and system/user prompt templates.

*Manual Entry* — Paste your skill content directly into the submission form.

**Review Process:**

All submissions go through a review period of 5-10 business days. Reviewers check for:
- Prompt quality and reliability
- Config schema completeness
- Safety and compliance
- Originality and value to the ecosystem

**At TGE:**

A listing fee of 5,000,000 $KRN will be required to submit. This fee burns on rejection and is refunded on acceptance. This mechanism aligns incentives and ensures quality submissions.

Revenue is paid on-chain to the author_wallet you specify in your submission. This wallet can be changed before the skill goes live.`
  }
]

export default function ArticlesTab() {
  const [selected, setSelected] = useState<string | null>(null)
  const article = ARTICLES.find(a => a.id === selected)

  if (article) {
    return (
      <div className="pb-24">
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--bg3)' }}>
          <button
            onClick={() => setSelected(null)}
            className="font-sans text-[9px] tracking-widest uppercase"
            style={{ color: 'var(--light)' }}
          >
            ← Back to Articles
          </button>
        </div>
        <div className="px-5 pt-4">
          <div
            className="font-mono text-[9px] tracking-widest uppercase mb-1"
            style={{ color: 'var(--amber)' }}
          >
            {article.tag} · {article.date}
          </div>
          <div className="font-serif text-[28px] font-light italic mb-4" style={{ color: 'var(--text)' }}>
            {article.title}
          </div>
          <div className="font-sans text-[13px] leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>
            {article.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <div className="px-5 pt-4 pb-2 mb-2" style={{ borderBottom: '1px solid var(--bg3)' }}>
        <div className="font-serif text-[28px] font-light italic" style={{ color: 'var(--text)' }}>Articles</div>
      </div>
      <div>
        {ARTICLES.map((a, i) => (
          <div
            key={a.id}
            className="px-5 py-4 cursor-pointer transition-colors"
            style={{ borderBottom: i < ARTICLES.length - 1 ? '1px solid var(--bg3)' : 'none' }}
            onClick={() => setSelected(a.id)}
          >
            <div className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: 'var(--amber)' }}>
              {a.tag} · {a.date}
            </div>
            <div className="font-serif text-[18px] font-light" style={{ color: 'var(--text)' }}>
              {a.title}
            </div>
            <div className="font-sans text-[12px] mt-1" style={{ color: 'var(--light)' }}>
              {a.content.slice(0, 100)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
