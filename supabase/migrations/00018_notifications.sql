-- Table des notifications
create table fit_notifications (
  id                uuid primary key default gen_random_uuid(),
  user_profile_id   uuid not null references fit_user_profiles(id) on delete cascade,
  title             text not null,
  body              text,
  link              text,
  is_read           boolean not null default false,
  created_at        timestamptz not null default now()
);

create index idx_notifications_user_unread
  on fit_notifications(user_profile_id, is_read, created_at desc);

create index idx_notifications_user_all
  on fit_notifications(user_profile_id, created_at desc);

alter table fit_notifications enable row level security;
