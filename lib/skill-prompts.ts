type Config = Record<string, string | number | boolean>

interface SkillPrompt {
  system: string
  user: string
}

export function buildSkillPrompt(skillId: string, config: Config): SkillPrompt | null {
  const builders: Record<string, (c: Config) => SkillPrompt> = {

    'wallet-digest': (c) => ({
      system: `You are an on-chain intelligence agent specializing in wallet analysis on Base Network.
Provide structured, data-driven analysis. Format with clear sections and specific observations.
If live blockchain data is unavailable, state this clearly and provide the analysis framework with what you do know about typical wallet patterns.`,
      user: `Execute wallet-digest skill.

Wallet address: ${c.wallet_address}
Time window: ${c.time_window || '24h'}

Provide a complete wallet digest covering:

## Portfolio Overview
- Estimated major token holdings (ETH, stablecoins, notable tokens)
- Approximate total portfolio composition

## Activity Summary (${c.time_window || '24h'})
- Transaction count and types (swaps, transfers, DeFi interactions)
- Notable large transactions (>$10k if visible)
- Protocol interactions (which DEXs, lending platforms, etc.)

## PnL Assessment
- Realized gains/losses from swaps if determinable
- Unrealized position changes

## Risk Indicators
- Concentration risk
- Unusual activity patterns
- Any flagged behaviors

## Key Takeaways
3-5 bullet points summarizing the most important observations.`
    }),

    'token-alert': (c) => ({
      system: `You are a crypto market analyst agent. Provide precise, data-informed token analysis.
Be specific about conditions and thresholds. Institutional tone — no hype.`,
      user: `Execute token-alert skill.

Token: ${c.token}
Alert threshold: ${c.threshold_pct || 5}% price change
Timeframe: ${c.timeframe || '24h'}

## Current Market Status
Analyze this token's current conditions.

## Price Trend Analysis
- Recent price action and momentum
- Key support/resistance levels if known
- Volume conditions

## Alert Evaluation
- Would a ${c.threshold_pct || 5}% threshold trigger right now?
- Directional bias (bullish/bearish/neutral)

## Volume Analysis
- Normal vs anomalous volume conditions
- Whale activity signals if visible

## Risk Factors
- What could cause sudden moves
- Liquidity depth concerns

## Verdict
Single clear assessment: ALERT TRIGGER / WATCHING / NO ACTION`
    }),

    'defi-monitor': (c) => ({
      system: `You are a DeFi position monitoring agent specialized in liquidity pools and lending protocols on Base Network.
Provide precise risk assessments with specific metrics where possible.`,
      user: `Execute defi-monitor skill.

Pool/Position: ${c.position_address}
Protocol: ${c.protocol || 'Uniswap v3'}

## Pool Health Assessment
Current liquidity, TVL estimates, and pool depth analysis for ${c.protocol || 'Uniswap v3'} on Base.

## Impermanent Loss Analysis
- Current price range and IL risk
- Scenarios: IL at ±10%, ±20%, ±50% price deviation
- Fee income vs IL tradeoff

## APR Conditions
- Current estimated APR for this pool type
- Fee tier performance
- Reward token conditions if applicable

## Position Recommendations
- Hold / add / reduce / exit assessment
- Optimal rebalancing conditions
- Risk flags requiring immediate attention`
    }),

    'yield-optimizer': (c) => ({
      system: `You are a yield farming optimization agent on Base Network.
Analyze yield conditions across Aerodrome, Curve, and Beefy. Provide actionable compound timing recommendations.`,
      user: `Execute yield-optimizer skill.

Vault/Pool: ${c.vault_address}
Compound threshold: ${c.compound_threshold || 0.5}% APR gain trigger

## Current Yield Landscape (Base Network)
Top yield opportunities right now on Aerodrome, Curve, Beefy.

## Compound Analysis for Your Position
- Estimated pending rewards value
- Gas cost on Base for compounding (~$0.10-0.30 typical)
- Net APR gain from compounding now

## Timing Recommendation
- Compound NOW vs WAIT decision based on ${c.compound_threshold || 0.5}% threshold
- Optimal compound frequency for this vault type
- Gas threshold to wait for

## Market Context
- Protocol token price impact on yield
- Pool TVL trends affecting APR`
    }),

    'gas-tracker': (c) => ({
      system: `You are a Base Network gas optimization agent. Provide precise gas analysis with actionable timing recommendations.`,
      user: `Execute gas-tracker skill.

Alert threshold: ${c.alert_threshold || 0.01} gwei

## Current Gas Conditions (Base)
Base L2 gas price analysis. Base typically runs 0.001-0.1 gwei. Current market context.

## Threshold Evaluation
- Does current gas meet the ${c.alert_threshold || 0.01} gwei alert threshold?
- Alert status: TRIGGER / STANDBY

## Historical Context
- Is this high, normal, or low for Base?
- Best time windows for transactions (typically low congestion periods)

## Transaction Timing Guide
- Simple transfers: optimal when
- Complex swaps: optimal when
- Large DeFi operations: optimal when

## L1 Data Cost Component
Base's L1 data posting cost impact on total transaction cost`
    }),

    'alpha-digest': (c) => ({
      system: `You are a senior crypto intelligence analyst. Synthesize on-chain data, market narrative, and whale behavior into actionable alpha.
Be specific and contrarian where warranted. No generic commentary. Institutional grade analysis only.`,
      user: `Execute alpha-digest skill.

Tracked tokens: ${c.tokens}
${c.whale_wallets ? `Whale wallets to analyze: ${c.whale_wallets}` : ''}

## Market Narrative (Current)
Key themes dominating crypto discourse right now. What's being overplayed vs underplayed.

## Token Intelligence
For each token in [${c.tokens}]:
- Current positioning (crowded/uncrowded trade?)
- On-chain signal strength
- Risk/reward at current levels

${c.whale_wallets ? `## Whale Activity Analysis
For wallets: ${c.whale_wallets}
- Recent notable moves
- Pattern changes vs historical behavior
- What they appear to be positioning for` : ''}

## Cross-Asset Signals
- Correlation breakdowns creating opportunity
- Rotation signals between sectors

## Ranked Opportunities
Top 3 actionable insights, each with:
- The opportunity
- Confidence level (High/Medium/Low)
- Key risk that invalidates the thesis
- Time horizon`
    }),

    'arbitrage-scanner': (c) => ({
      system: `You are a DeFi arbitrage analysis agent on Base Network. Provide systematic arbitrage opportunity analysis with realistic profitability estimates.`,
      user: `Execute arbitrage-scanner skill.

Token pairs: ${c.token_pairs}
Minimum profit threshold: $${c.min_profit_usd || 50}

## DEX Landscape (Base Network)
Current price and liquidity conditions on Uniswap v3, Aerodrome, Curve, Velodrome for these pairs.

## Arbitrage Opportunity Analysis
For each pair in [${c.token_pairs}]:
- Price discrepancy estimates between DEXs
- Gross profit estimate
- Gas cost (Base: typically $0.50-2.00 for complex arb)
- Flash loan fee (Balancer: 0.01%)
- Net profit estimate
- Does this exceed $${c.min_profit_usd || 50} threshold?

## Execution Conditions
- Slippage impact at various position sizes
- Competition level (is this pair actively arbitraged?)
- Block time constraints

## Risk Assessment
- Sandwich attack exposure
- Revert risk
- Recommended max position size`
    }),

    'sniper-skill': (c) => ({
      system: `You are an on-chain trading strategy analyst specializing in new token launches on Base Network.`,
      user: `Execute sniper-skill analysis mode.

Max spend: ${c.max_spend_eth} ETH
Min liquidity: ${c.min_liquidity || 5} ETH
Honeypot check: ${c.honeypot_check !== false ? 'enabled' : 'disabled'}

Note: Live pool sniping requires the hosted execution environment (coming at TGE). This is pre-execution analysis.

## New Launch Environment (Base)
Current state of new token launches on Base. Volume of launches per day, average performance patterns.

## Filter Effectiveness Analysis
For your configured filters (min liquidity: ${c.min_liquidity || 5} ETH, honeypot check: ${c.honeypot_check !== false ? 'enabled' : 'disabled'}):
- Estimated % of launches that would pass all filters
- False positive rate for honeypot detection
- Historical performance of launches meeting these criteria

## Execution Strategy
- Optimal gas multiplier for snipes on Base
- MEV risk and mitigation (flashbots routing)
- Position sizing strategy for ${c.max_spend_eth} ETH budget
- Take-profit and stop-loss recommendations

## Risk Analysis
- Rug pull indicators to monitor post-buy
- Liquidity removal detection
- Tax token risk even after honeypot check`
    }),

    'copy-trader': (c) => ({
      system: `You are a smart money tracking and copy trading analyst on Base Network.`,
      user: `Execute copy-trader analysis.

Mirror wallet: ${c.watch_wallet}
Max spend per trade: ${c.max_spend_eth} ETH
Delay: ${c.delay_minutes || 0} minutes

## Wallet Intelligence Analysis
For address ${c.watch_wallet}:
- Classification: is this likely a sophisticated trader, protocol, or bot?
- Historical performance signals (win rate estimation based on patterns)
- Typical trade size and frequency
- Preferred protocols and token types

## Copy Strategy Assessment
With ${c.delay_minutes || 0} minute delay and ${c.max_spend_eth} ETH max per trade:
- Expected slippage disadvantage from delay
- Position sizing recommendation (% of original trade to copy)
- Token types to exclude from copying

## Risk Factors
- Self-sandwich risk (copying your own mirror wallet)
- Exit liquidity risk (copying into low-liquidity positions)
- When this wallet's style is likely to fail

## Optimization Recommendations
- Better delay setting for this wallet's trading style
- Pairs to blacklist based on historical patterns
- Stop-loss rules for copied positions`
    }),

    'mev-guard': (c) => ({
      system: `You are an MEV protection specialist for Base Network transactions.`,
      user: `Execute mev-guard analysis.

Protection mode: ${c.mode || 'flashbots'}

## MEV Threat Assessment (Base Network)
Current MEV activity levels on Base. Types of MEV most prevalent: sandwich attacks, frontrunning, backrunning.

## Flashbots Protect vs MEV Blocker (Base)
Comparison for your use case:
- Flashbots Protect: inclusion guarantee, builder relationship, latency
- MEV Blocker: auction model, profit sharing, coverage

## Recommendation for Your Setup
- Which mode fits better: ${c.mode || 'flashbots'}
- Expected sandwich protection rate
- Gas overhead: approximately 5-15% extra

## Transaction Types by MEV Risk
- High risk (need protection): large swaps, sniping, arbitrage
- Medium risk: medium swaps >$5k
- Low risk (protection optional): small swaps, transfers

## Setup Verification
How to confirm MEV Guard is active and working correctly with your agent`
    }),

    'portfolio-rebalancer': (c) => ({
      system: `You are a portfolio management agent specializing in automated rebalancing on Base Network.`,
      user: `Execute portfolio-rebalancer analysis.

Target ETH allocation: ${c.target_eth_pct || 50}%
Drift threshold: ${c.drift_threshold || 5}%

## Current Portfolio Optimization
For a portfolio targeting ${c.target_eth_pct || 50}% ETH with ${c.drift_threshold || 5}% drift tolerance:

## Rebalancing Strategy
- Optimal rebalancing frequency for this threshold
- Expected gas cost per rebalancing event on Base (~$0.40-2.00)
- Minimum portfolio size where this strategy is gas-efficient

## Market Timing Considerations
- Is now a good time to rebalance to ETH-heavy (${c.target_eth_pct || 50}%)?
- Alternative target allocations to consider

## Execution Mechanics
- Trade routing: Uniswap v3 recommended pairs and fee tiers
- Slippage management for rebalancing trades
- Tax efficiency considerations for frequent rebalancing

## Risk Analysis
- Maximum drift before portfolio health is impacted
- Black swan scenarios where auto-rebalancing could hurt`
    }),

    'governance-voter': (c) => ({
      system: `You are a DAO governance analyst specializing in on-chain voting strategy on Base Network.`,
      user: `Execute governance-voter analysis.

DAO contract: ${c.dao_contract}
Vote rule: ${c.vote_rule || 'security, upgrade, treasury'}

## DAO Analysis
For governance contract ${c.dao_contract}:
- Protocol this likely governs (based on Base deployment patterns)
- Typical proposal types and frequency
- Voter participation rates in DeFi governance generally

## Vote Rule Evaluation
For keywords [${c.vote_rule || 'security, upgrade, treasury'}]:
- Coverage: what % of typical proposals would match these keywords?
- Edge cases: proposals that match but shouldn't be auto-voted
- Missing rules: common proposal types not covered

## Governance Best Practices
- Which proposal types are safe to auto-vote YES
- Which always require manual review
- Delegation vs direct voting tradeoffs

## Setup Recommendations
- Additional keywords to add based on your strategy
- When to set abstain_unknown: true vs false
- Minimum quorum to consider a proposal legitimate`
    })
  }

  const builder = builders[skillId]
  if (!builder) return null
  return builder(config)
}
