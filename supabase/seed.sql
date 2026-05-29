-- KERNAL OS — Seed Data (12 skills)

insert into skills (id, name, version, tier, category, trigger_type, tagline, description, deps, compat, config_schema, author, installs, executions, risk_level, gas_cost, status) values

('wallet-digest', 'Wallet Digest', '1.0.0', 'free', 'monitoring', 'scheduled',
 'Full on-chain wallet intelligence in one shot',
 'Analyzes a wallet''s full on-chain activity — token balances, recent transactions, PnL, and behavioral patterns — then generates a structured digest with key observations and risk flags.',
 '{}', '{base,ethereum,arbitrum}',
 '[{"k":"wallet_address","type":"text","label":"Wallet Address","placeholder":"0x...","required":true},{"k":"time_window","type":"select","label":"Time Window","required":false,"default":"24h","options":["1h","24h","7d","30d"]}]',
 'kernal-labs', 2847, 18423, 'Low', 'None', 'live'),

('token-alert', 'Token Alert', '1.0.0', 'free', 'monitoring', 'on_event',
 'Real-time price and volume anomaly detection',
 'Monitors token price movements and volume spikes against configurable thresholds. Alerts when conditions are met with market context and recommended actions.',
 '{}', '{base,ethereum}',
 '[{"k":"token","type":"text","label":"Token Symbol or Address","placeholder":"ETH, USDC, or 0x...","required":true},{"k":"threshold_pct","type":"number","label":"Alert Threshold (%)","placeholder":"5","required":false,"default":5},{"k":"timeframe","type":"select","label":"Timeframe","required":false,"default":"24h","options":["1h","4h","24h","7d"]}]',
 'kernal-labs', 3102, 24891, 'Low', 'None', 'live'),

('defi-monitor', 'DeFi Monitor', '1.0.0', 'free', 'defi', 'scheduled',
 'LP position health and IL tracking',
 'Monitors DeFi positions across Uniswap v3, Aerodrome, and Curve on Base. Tracks impermanent loss, fee earnings, pool health, and rebalancing signals.',
 '{}', '{base}',
 '[{"k":"position_address","type":"text","label":"Pool or Position Address","placeholder":"0x...","required":true},{"k":"protocol","type":"select","label":"Protocol","required":false,"default":"Uniswap v3","options":["Uniswap v3","Aerodrome","Curve","Beefy"]}]',
 'kernal-labs', 1893, 11247, 'Low', 'None', 'live'),

('yield-optimizer', 'Yield Optimizer', '1.0.0', 'free', 'defi', 'scheduled',
 'Optimal compound timing and yield routing',
 'Analyzes yield farming positions and calculates optimal compound timing based on gas costs, pending rewards, and net APR impact. Routes yield to maximize returns across Base protocols.',
 '{defi-monitor}', '{base}',
 '[{"k":"vault_address","type":"text","label":"Vault or Pool Address","placeholder":"0x...","required":true},{"k":"compound_threshold","type":"number","label":"Compound Trigger (% APR gain)","placeholder":"0.5","required":false,"default":0.5}]',
 'kernal-labs', 1204, 8932, 'Low', 'Low', 'live'),

('gas-tracker', 'Gas Tracker', '1.0.0', 'free', 'monitoring', 'on_event',
 'Base gas optimization and timing alerts',
 'Monitors Base network gas prices in real-time and alerts when conditions meet your threshold. Provides timing recommendations for different transaction types based on historical patterns.',
 '{}', '{base}',
 '[{"k":"alert_threshold","type":"number","label":"Alert Threshold (gwei)","placeholder":"0.01","required":false,"default":0.01}]',
 'kernal-labs', 4231, 31847, 'Low', 'None', 'live'),

('alpha-digest', 'Alpha Digest', '1.0.0', 'premium', 'research', 'scheduled',
 'Institutional-grade on-chain alpha synthesis',
 'Synthesizes on-chain data, whale wallet movements, and market narrative into a structured alpha report. Identifies conviction trades, rotation signals, and cross-asset opportunities with risk-adjusted scoring.',
 '{wallet-digest,token-alert}', '{base,ethereum,arbitrum}',
 '[{"k":"tokens","type":"text","label":"Token Watchlist (comma-separated)","placeholder":"ETH, USDC, AERO","required":true},{"k":"whale_wallets","type":"text","label":"Whale Wallets to Track (optional)","placeholder":"0x..., 0x...","required":false}]',
 'kernal-labs', 892, 4231, 'Low', 'None', 'live'),

('arbitrage-scanner', 'Arbitrage Scanner', '1.0.0', 'premium', 'trading', 'on_event',
 'Cross-DEX arb detection with net profit calc',
 'Scans price discrepancies across Uniswap v3, Aerodrome, and Curve on Base. Calculates net profit after gas and flash loan fees, with execution window estimates and slippage modeling.',
 '{}', '{base}',
 '[{"k":"token_pairs","type":"text","label":"Token Pairs (comma-separated)","placeholder":"ETH/USDC, WBTC/ETH","required":true},{"k":"min_profit_usd","type":"number","label":"Min Profit Threshold (USD)","placeholder":"50","required":false,"default":50}]',
 'kernal-labs', 623, 2891, 'Medium', 'Medium', 'live'),

('sniper-skill', 'Sniper', '1.0.0', 'premium', 'trading', 'on_event',
 'New pool launch detection and entry execution',
 'Detects new liquidity pool launches on Base and executes entry positions based on configurable filters — minimum liquidity, honeypot check, tax validation. Runs in analysis mode until TGE.',
 '{}', '{base}',
 '[{"k":"max_spend_eth","type":"number","label":"Max Spend (ETH)","placeholder":"0.1","required":true},{"k":"min_liquidity","type":"number","label":"Min Initial Liquidity (ETH)","placeholder":"5","required":false,"default":5},{"k":"honeypot_check","type":"checkbox","label":"Enable Honeypot Detection","required":false,"default":true}]',
 'kernal-labs', 1102, 5847, 'High', 'Medium', 'live'),

('copy-trader', 'Copy Trader', '1.0.0', 'premium', 'trading', 'on_event',
 'Smart money mirroring with configurable delay',
 'Mirrors trades from a specified smart money wallet with configurable delay and position sizing. Includes trade filtering, risk limits, and exit coordination based on wallet behavioral patterns.',
 '{wallet-digest}', '{base,ethereum}',
 '[{"k":"watch_wallet","type":"text","label":"Mirror Wallet Address","placeholder":"0x...","required":true},{"k":"max_spend_eth","type":"number","label":"Max Spend per Trade (ETH)","placeholder":"0.1","required":true},{"k":"delay_minutes","type":"number","label":"Entry Delay (minutes)","placeholder":"0","required":false,"default":0}]',
 'kernal-labs', 741, 3102, 'High', 'Low', 'live'),

('mev-guard', 'MEV Guard', '1.0.0', 'premium', 'protection', 'manual',
 'Sandwich attack protection via private mempool routing',
 'Routes transactions through Flashbots Protect or MEV Blocker to prevent sandwich attacks. Analyzes transaction risk level and selects optimal protection mode automatically.',
 '{}', '{base,ethereum}',
 '[{"k":"mode","type":"select","label":"Protection Mode","required":false,"default":"flashbots","options":["flashbots","mev-blocker","auto"]}]',
 'kernal-labs', 567, 2341, 'Low', 'Low', 'live'),

('portfolio-rebalancer', 'Portfolio Rebalancer', '1.0.0', 'premium', 'automation', 'scheduled',
 'Drift-based automatic portfolio rebalancing',
 'Monitors portfolio allocation against target weights and triggers rebalancing when drift exceeds threshold. Gas-aware execution with slippage optimization on Base.',
 '{gas-tracker}', '{base}',
 '[{"k":"target_eth_pct","type":"number","label":"Target ETH Allocation (%)","placeholder":"50","required":false,"default":50},{"k":"drift_threshold","type":"number","label":"Rebalance Trigger Drift (%)","placeholder":"5","required":false,"default":5}]',
 'kernal-labs', 412, 1893, 'Medium', 'Medium', 'live'),

('governance-voter', 'Governance Voter', '1.0.0', 'premium', 'governance', 'on_event',
 'Automated DAO voting with rule-based logic',
 'Monitors DAO proposal queues and votes automatically based on configurable rules — keyword matching, proposal type, and quorum thresholds. Supports Snapshot and on-chain governance.',
 '{}', '{base,ethereum}',
 '[{"k":"dao_contract","type":"text","label":"DAO Contract Address","placeholder":"0x...","required":true},{"k":"vote_rule","type":"text","label":"Vote YES on Keywords","placeholder":"security, upgrade, treasury","required":false,"default":"security, upgrade, treasury"}]',
 'kernal-labs', 289, 1204, 'Low', 'Low', 'live')

on conflict (id) do update set
  installs = excluded.installs,
  executions = excluded.executions,
  updated_at = now();
