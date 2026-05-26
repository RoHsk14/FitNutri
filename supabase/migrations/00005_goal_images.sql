-- Ajout des colonnes pour l'objectif personnalisé et les images
alter table fit_user_profiles add column if not exists goal_description text;
alter table fit_user_profiles add column if not exists goal_image_url text;
alter table fit_user_profiles add column if not exists current_physique_image_url text;
alter table fit_user_profiles add column if not exists estimated_duration_weeks int;
