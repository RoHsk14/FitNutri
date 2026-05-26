-- Table de suivi de complétion des exercices
create table fit_workout_completions (
  id                  uuid primary key default gen_random_uuid(),
  user_profile_id     uuid not null references fit_user_profiles(id) on delete cascade,
  workout_session_id  uuid not null references fit_workout_sessions(id) on delete cascade,
  completed           boolean not null default true,
  completed_at        timestamptz not null default now()
);

create index idx_fit_workout_completions_user
  on fit_workout_completions(user_profile_id, completed_at desc);

create index idx_fit_workout_completions_session
  on fit_workout_completions(workout_session_id);

alter table fit_workout_completions enable row level security;
