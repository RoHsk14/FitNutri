-- Table pour les check-ins quotidiens (streak / présence)
create table fit_daily_check_ins (
  id                uuid primary key default gen_random_uuid(),
  user_profile_id   uuid not null references fit_user_profiles(id) on delete cascade,
  check_in_date     date not null default current_date,
  created_at        timestamptz not null default now()
);

create unique index idx_daily_check_ins_user_date
  on fit_daily_check_ins(user_profile_id, check_in_date);

create index idx_daily_check_ins_user_date_desc
  on fit_daily_check_ins(user_profile_id, check_in_date desc);

alter table fit_daily_check_ins enable row level security;
