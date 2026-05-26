-- Nettoyage complet de la base avant migration 00010
-- Ordre FK : d'abord les tables enfants, puis les parents

delete from fit_meal_food_items;
delete from fit_daily_meals;
delete from fit_workout_sessions;
delete from fit_workout_plans;
delete from fit_exercises;
delete from fit_food_items;
delete from fit_nutrition_plans;
delete from fit_user_profiles;
delete from fit_weight_logs;
delete from fit_water_logs;

-- Reset séquences (uuid columns = pas de séquence, mais safe)
-- Note: fit_exercises(id) est uuid, pas de séquence
-- On supprime les enums et types si besoin (optionnel)

-- Vérification
select 'fit_exercises' as tbl, count(*) as remaining from fit_exercises
union all select 'fit_workout_sessions', count(*) from fit_workout_sessions
union all select 'fit_workout_plans', count(*) from fit_workout_plans
union all select 'fit_user_profiles', count(*) from fit_user_profiles
union all select 'fit_food_items', count(*) from fit_food_items
union all select 'fit_nutrition_plans', count(*) from fit_nutrition_plans
union all select 'fit_meal_food_items', count(*) from fit_meal_food_items
union all select 'fit_daily_meals', count(*) from fit_daily_meals
union all select 'fit_weight_logs', count(*) from fit_weight_logs
union all select 'fit_water_logs', count(*) from fit_water_logs;
