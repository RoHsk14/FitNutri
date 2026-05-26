-- Migration : tables préfixées fit_ pour isolation sur projet partagé

-- 1. ENUMS
create type fit_gender as enum ('MALE', 'FEMALE');
create type fit_goal as enum ('LOSE_FAT', 'GAIN_MUSCLE', 'MAINTENANCE');
create type fit_activity_level as enum ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE');
create type fit_workout_level as enum ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- 2. USER PROFILES
create table fit_user_profiles (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,

  age           int not null,
  gender        fit_gender not null,
  current_weight_kg float not null,
  height_cm     float not null,
  goal          fit_goal not null,
  activity_level fit_activity_level not null,
  dietary_restrictions text[] not null default '{}',
  meals_per_day int not null default 3,

  target_calories int,
  target_protein_g float,
  target_carbs_g   float,
  target_fat_g     float,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index idx_fit_user_profiles_clerk on fit_user_profiles(clerk_user_id);

-- 3. WORKOUT PLANS
create table fit_workout_plans (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text not null,
  level          fit_workout_level not null,
  duration_weeks int not null,
  goal_type      fit_goal not null,
  user_profile_id uuid references fit_user_profiles(id) on delete cascade,
  created_at     timestamptz not null default now()
);

-- 4. EXERCISES
create table fit_exercises (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  muscle_group text not null,
  description text not null,
  video_url   text,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- 5. WORKOUT SESSIONS (exercises within a plan)
create table fit_workout_sessions (
  id             uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references fit_workout_plans(id) on delete cascade,
  exercise_id    uuid not null references fit_exercises(id) on delete cascade,
  day_of_week    int not null check (day_of_week between 1 and 7),
  sort_order     int not null default 0,
  sets           int not null,
  reps           int not null,
  rest_seconds   int not null default 60,

  unique (workout_plan_id, exercise_id, day_of_week)
);

-- 6. NUTRITION PLANS
create table fit_nutrition_plans (
  id             uuid primary key default gen_random_uuid(),
  user_profile_id uuid unique not null references fit_user_profiles(id) on delete cascade,
  meals_per_day  int not null,
  total_calories int not null,
  protein_g      float not null,
  carbs_g        float not null,
  fat_g          float not null,
  created_at     timestamptz not null default now()
);

-- 7. FOOD ITEMS
create table fit_food_items (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  calories_per_100g float not null,
  protein_per_100g  float not null,
  carbs_per_100g    float not null,
  fat_per_100g      float not null,
  category        text,
  created_at      timestamptz not null default now()
);

-- 8. MEAL FOOD ITEMS
create table fit_meal_food_items (
  id              uuid primary key default gen_random_uuid(),
  nutrition_plan_id uuid not null references fit_nutrition_plans(id) on delete cascade,
  food_item_id    uuid not null references fit_food_items(id) on delete cascade,
  meal_number     int not null,
  quantity_g      float not null
);

-- 9. AUTO-UPDATE updated_at
create or replace function fit_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_fit_user_profiles_updated_at
  before update on fit_user_profiles
  for each row execute function fit_set_updated_at();

-- 10. RLS (Row-Level Security)
alter table fit_user_profiles enable row level security;
alter table fit_workout_plans enable row level security;
alter table fit_workout_sessions enable row level security;
alter table fit_nutrition_plans enable row level security;
alter table fit_meal_food_items enable row level security;

create policy "users see own fit profile"
  on fit_user_profiles for all
  using (clerk_user_id = current_setting('app.user_id', true));

create policy "users see own fit workout plans"
  on fit_workout_plans for all
  using (user_profile_id in (
    select id from fit_user_profiles where clerk_user_id = current_setting('app.user_id', true)
  ));
