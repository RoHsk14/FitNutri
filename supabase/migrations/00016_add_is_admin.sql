-- Ajout du rôle admin directement en base
alter table fit_user_profiles add column is_admin boolean not null default false;
