-- Table de suivi d'hydratation
create table fit_water_logs (
  id             uuid primary key default gen_random_uuid(),
  user_profile_id uuid not null references fit_user_profiles(id) on delete cascade,
  amount_ml      float not null,
  logged_at      timestamptz not null default now()
);

create index idx_fit_water_logs_user on fit_water_logs(user_profile_id, logged_at desc);

alter table fit_water_logs enable row level security;
