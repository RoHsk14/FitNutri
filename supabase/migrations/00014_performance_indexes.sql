-- Indexes manquants pour accélérer les requêtes fréquentes

-- fit_workout_plans : recherché par user_profile_id (getTodaysWorkout, getWeeklyWorkout)
create index if not exists idx_fit_workout_plans_user
  on fit_workout_plans(user_profile_id, created_at desc);

-- fit_workout_sessions : recherché par workout_plan_id + day_of_week
create index if not exists idx_fit_workout_sessions_plan_day
  on fit_workout_sessions(workout_plan_id, day_of_week, sort_order);

-- fit_nutrition_plans : recherché par user_profile_id (getNutritionPlan)
create index if not exists idx_fit_nutrition_plans_user
  on fit_nutrition_plans(user_profile_id, created_at desc);

-- fit_meal_food_items : recherché par nutrition_plan_id (getNutritionPlan)
create index if not exists idx_fit_meal_food_items_plan
  on fit_meal_food_items(nutrition_plan_id, meal_number);

-- fit_daily_meals : index existant (idx_fit_daily_meals_date) mais ajout food_item_id pour les jointures
create index if not exists idx_fit_daily_meals_food
  on fit_daily_meals(food_item_id);

-- fit_workout_completions : index existant mais ajout pour les requêtes par date uniquement
create index if not exists idx_fit_workout_completions_date
  on fit_workout_completions(completed_at desc);

-- fit_weight_logs : index existant, ajout pour les jointures
create index if not exists idx_fit_weight_logs_user_date
  on fit_weight_logs(user_profile_id, logged_at desc);

-- fit_food_items : index pour les recherches textuelles (librairie aliments)
create index if not exists idx_fit_food_items_name
  on fit_food_items(name text_pattern_ops);
