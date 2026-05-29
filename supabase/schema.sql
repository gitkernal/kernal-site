-- KERNAL OS — Supabase Schema

-- Skills registry
create table if not exists skills (
  id            text primary key,
  name          text not null unique,
  version       text not null default '1.0.0',
  tier          text not null check (tier in ('free', 'premium')),
  category      text not null,
  trigger_type  text not null check (trigger_type in ('scheduled', 'on_event', 'manual')),
  tagline       text not null,
  description   text not null,
  deps          text[] not null default '{}',
  compat        text[] not null default '{}',
  config_schema jsonb not null default '[]',
  author        text not null default 'kernal-labs',
  author_wallet text,
  github_url    text,
  installs      integer not null default 0,
  executions    integer not null default 0,
  risk_level    text not null default 'Low',
  gas_cost      text not null default 'None',
  status        text not null default 'live' check (status in ('live', 'deprecated', 'beta')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Skill executions log
create table if not exists executions (
  id            uuid primary key default gen_random_uuid(),
  skill_id      text not null references skills(id),
  wallet_address text,
  config_used   jsonb not null default '{}',
  prompt_tokens integer,
  output_tokens integer,
  duration_ms   integer,
  success       boolean not null,
  error_message text,
  created_at    timestamptz not null default now()
);

-- Skill submissions
create table if not exists submissions (
  id            text primary key,
  method        text not null check (method in ('github', 'manual')),
  status        text not null default 'pending' check (status in ('pending', 'reviewing', 'accepted', 'rejected')),
  github_url    text,
  skill_name    text,
  skill_version text,
  tier          text,
  category      text,
  description   text,
  author_name   text,
  author_wallet text,
  skill_content text,
  compat        text[],
  submitter_wallet text,
  review_notes  text,
  listing_fee_tx text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Staking snapshots
create table if not exists staking_snapshots (
  id            uuid primary key default gen_random_uuid(),
  total_staked  numeric not null default 0,
  total_stakers integer not null default 0,
  eth_distributed numeric not null default 0,
  snapshot_at   timestamptz not null default now()
);

-- RLS
alter table skills enable row level security;
alter table executions enable row level security;
alter table submissions enable row level security;

-- Skills: public read
create policy "skills_public_read" on skills for select using (true);
create policy "skills_service_write" on skills for all using (auth.role() = 'service_role');

-- Executions: insert for all, read for service
create policy "executions_insert" on executions for insert with check (true);
create policy "executions_service_read" on executions for select using (auth.role() = 'service_role');

-- Submissions: insert for all
create policy "submissions_insert" on submissions for insert with check (true);
create policy "submissions_service_all" on submissions for all using (auth.role() = 'service_role');

-- Indexes
create index if not exists idx_skills_tier on skills(tier);
create index if not exists idx_skills_category on skills(category);
create index if not exists idx_skills_status on skills(status);
create index if not exists idx_executions_skill_id on executions(skill_id);
create index if not exists idx_executions_wallet on executions(wallet_address);
create index if not exists idx_submissions_status on submissions(status);
create index if not exists idx_submissions_wallet on submissions(submitter_wallet);

-- increment_executions RPC
create or replace function increment_executions(skill_id_param text)
returns void as $$
  update skills set executions = executions + 1, updated_at = now()
  where id = skill_id_param;
$$ language sql security definer;
