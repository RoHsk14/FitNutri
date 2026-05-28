-- Table pour l'historique des séances personnalisées (sans affecter le programme principal)
create table fit_custom_workout_logs (
  id                uuid primary key default gen_random_uuid(),
  user_profile_id   uuid not null references fit_user_profiles(id) on delete cascade,
  exercise_name     text not null,
  muscle_group      text,
  sets              int not null,
  reps              int not null,
  rest_seconds      int not null default 60,
  completed_at      timestamptz not null default now()
);

create index idx_custom_workout_logs_user
  on fit_custom_workout_logs(user_profile_id, completed_at desc);

alter table fit_custom_workout_logs enable row level security;
