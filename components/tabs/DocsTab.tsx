'use client'
import { useState } from 'react'

const SECTIONS = [
  {
    id: 'quickstart',
    title: 'Quickstart',
    content: `## Running a Skill

1. Open the **RUN.exe** window (or RUN tab on mobile)
2. Select a skill from the dropdown
3. Fill in the required configuration fields
4. Click **Execute Skill**
5. View real-time logs and output in the terminal panel

Free skills run immediately. Premium skills require 10M+ $KRN in your connected wallet.

## Connecting Your Wallet

Click **STAKE.db** or **STAKE** tab to connect your wallet. KERNAL reads your $KRN balance directly from Base mainnet to determine your tier.

Supported: MetaMask, Coinbase Wallet, any EIP-1193 compatible wallet.`
  },
  {
    id: 'skill-schema',
    title: 'Skill Schema',
    content: `## SKILL.md Format

\`\`\`markdown
---
name: my-skill
version: 1.0.0
tier: free
category: monitoring
trigger_type: manual
tagline: One-line description
description: Full description
author: your-name
author_wallet: 0x...
deps: []
compat: [base, ethereum]
config_schema:
  - k: wallet_address
    type: text
    label: Wallet Address
    placeholder: "0x..."
    required: true
---

## System Prompt
You are an agent that...

## User Prompt Template
Execute {name} for wallet {wallet_address}.
\`\`\`

**Config types:** text, number, select, checkbox, textarea

**Categories:** monitoring, trading, defi, research, protection, governance, automation

**Trigger types:** scheduled, on_event, manual`
  },
  {
    id: 'api',
    title: 'API Reference',
    content: `## Endpoints

### GET /api/skills
Returns all live skills with optional filtering.

Query params:
- \`tier\`: free | premium | all
- \`category\`: monitoring | trading | defi | ...
- \`search\`: text search on name

### POST /api/execute
Execute a skill via Anthropic API.

Body:
\`\`\`json
{
  "skill_id": "wallet-digest",
  "config": { "wallet_address": "0x..." },
  "wallet_address": "0x..."
}
\`\`\`

Returns: \`{ output, skill_id, duration_ms }\`

### POST /api/submit
Submit a skill for review.

### GET /api/wallet/:address
Returns KRN balance and tier for an address.

### PATCH /api/admin/submissions/:id
Admin-only: Update submission status.
Header: \`x-admin-secret: <secret>\``
  },
  {
    id: 'tiers',
    title: 'Access Tiers',
    content: `## Tier System

| Tier | KRN Required | Benefits |
|------|-------------|---------|
| Free | 0 | 6 free skills |
| Premium | 10M KRN | All 12 skills + staking yield |
| Priority | 100M KRN | Priority execution + support |

Tier is determined at execution time by reading your wallet's $KRN balance from the Base mainnet contract:

\`\`\`
0x974B53861d975E727305298D2718849c43046ba3
\`\`\`

## Revenue Distribution

Every skill execution charges 0.2% of the equivalent cost.

- 50% → $KRN stakers (ETH yield)
- 50% → skill author (paid to author_wallet)

Revenue distribution begins at TGE when the staking contract is deployed.`
  },
  {
    id: 'faq',
    title: 'FAQ',
    content: `**Q: Is KERNAL self-custodial?**
A: Yes. KERNAL never holds your funds. Wallet connection only reads your $KRN balance — no signing required to execute skills.

**Q: Where does the AI output come from?**
A: All skill execution calls the Anthropic API (claude-sonnet-4) server-side. The API key is never exposed to the client.

**Q: Can skills execute on-chain transactions?**
A: Currently, skills are analysis and intelligence tools — they return text output. Live on-chain execution (swaps, snipes, governance votes) launches with the hosted execution environment at TGE.

**Q: How are submission fees handled at TGE?**
A: The 5M $KRN listing fee is burned on rejection and refunded on acceptance. This is enforced by the submission smart contract.

**Q: How often is $KRN balance checked?**
A: On every skill execution. There is no cached tier — your current balance is always the source of truth.

**Q: What model does KERNAL use?**
A: claude-sonnet-4-5-20251001 via the Anthropic API.`
  }
]

export default function DocsTab() {
  const [selected, setSelected] = useState('quickstart')
  const section = SECTIONS.find(s => s.id === selected)

  return (
    <div className="flex h-full pb-24">
      {/* Sidebar */}
      <div
        className="w-28 shrink-0 border-r overflow-y-auto"
        style={{ borderColor: 'var(--bg3)' }}
      >
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className="w-full text-left px-3 py-3 font-sans text-[10px] font-semibold tracking-widest uppercase border-b transition-colors"
            style={{
              borderColor: 'var(--bg3)',
              color: selected === s.id ? 'var(--amber)' : 'var(--mid)',
              background: selected === s.id ? 'var(--bg2)' : 'transparent'
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {section && (
          <div
            className="font-sans text-[12px] leading-relaxed whitespace-pre-line"
            style={{ color: 'var(--text)' }}
          >
            <div className="font-serif text-[24px] font-light italic mb-3" style={{ color: 'var(--text)' }}>
              {section.title}
            </div>
            {section.content}
          </div>
        )}
      </div>
    </div>
  )
}
