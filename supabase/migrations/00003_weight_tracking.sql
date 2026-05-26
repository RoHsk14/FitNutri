-- Table de suivi du poids dans le temps
create table fit_weight_logs (
  id             uuid primary key default gen_random_uuid(),
  user_profile_id uuid not null references fit_user_profiles(id) on delete cascade,
  weight_kg      float not null,
  logged_at      timestamptz not null default now()
);

create index idx_fit_weight_logs_user on fit_weight_logs(user_profile_id, logged_at desc);

alter table fit_weight_logs enable row level security;
