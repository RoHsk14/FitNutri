-- Migration 00010: Catalogue complet des exercices depuis Muscle & Strength
-- Généré le 2026-05-25
-- Source: 352 exercices classés par groupe musculaire

-- Supprime les anciens exercices (les sessions seront orphelines)
-- Les tables n'ont pas de données FK bloquantes; on supprime directement
delete from fit_workout_sessions;
delete from fit_workout_plans;
delete from fit_exercises;

-- Pas de séquence à reset (id est uuid)

insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values
  ('1 4 Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/1-4-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/1-4-squat.html'),
  ('1 Leg Pushup', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/1-leg-pushup.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/1-leg-pushup.html'),
  ('Presse à cuisses', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/45-degree-leg-press.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/45-degree-leg-press.html'),
  ('45 Degree Toe Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/45-degree-toe-raise.html', 'Calves', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/45-degree-toe-raise.html'),
  ('45 Degress Calf Press', 'Calves', '', 'https://www.muscleandstrength.com/exercises/45-degress-calf-press.html', 'Calves', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/45-degress-calf-press.html'),
  ('Abdominal Pendulum', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/abdominal-pendulum.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/abdominal-pendulum.html'),
  ('Alternate Bent Over Dumbbell Kickback', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/alternate-bent-over-dumbbell-kickback.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-bent-over-dumbbell-kickback.html'),
  ('Oiseau (face pull)', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-bent-over-dumbbell-reverse-fly.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-bent-over-dumbbell-reverse-fly.html'),
  ('Alternate Decline Dumbbell Flys', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/alternate-decline-dumbbell-flys.html', 'Pectoraux', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-decline-dumbbell-flys.html'),
  ('Alternate Dumbbell Bench Press Low Start', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-bench-press-low-start.html', 'Pectoraux', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-bench-press-low-start.html'),
  ('Écartés haltères alterné', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-flys.html', 'Pectoraux', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-flys.html'),
  ('Alternate Dumbbell Hammer Preacher Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-hammer-preacher-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-hammer-preacher-curl.html'),
  ('Alternate Dumbbell Lateral Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-lateral-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-lateral-raise.html'),
  ('Curl barre pupitre', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-preacher-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-preacher-curl.html'),
  ('Alternate Dumbbell Reverse Fly On Incline Bench', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-reverse-fly-on-incline-bench.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-dumbbell-reverse-fly-on-incline-bench.html'),
  ('Alternate Incline Dumbbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/alternate-incline-dumbbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-incline-dumbbell-curl.html'),
  ('Alternate Incline Dumbbell Flys', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/alternate-incline-dumbbell-flys.html', 'Pectoraux', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-incline-dumbbell-flys.html'),
  ('Alternate Incline Hammer Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/alternate-incline-hammer-curl.html', 'Biceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/alternate-incline-hammer-curl.html'),
  ('Extensions triceps haltères alterné', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/alternate-lying-dumbbell-extension.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-lying-dumbbell-extension.html'),
  ('Alternate Lying Dumbbell Reverse Fly', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-lying-dumbbell-reverse-fly.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-lying-dumbbell-reverse-fly.html'),
  ('Alternate Reach And Catch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/alternate-reach-and-catch.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/alternate-reach-and-catch.html'),
  ('Développé Arnold alterné', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-seated-arnold-press.html', 'Shoulders', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/alternate-seated-arnold-press.html'),
  ('Alternate Seated Bent Over Dumbbell Kickback', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/alternate-seated-bent-over-dumbbell-kickback.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-seated-bent-over-dumbbell-kickback.html'),
  ('Alternate Seated Bent Over Dumbbell Reverse Fly', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-seated-bent-over-dumbbell-reverse-fly.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-seated-bent-over-dumbbell-reverse-fly.html'),
  ('Alternate Seated Dumbbell Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-seated-dumbbell-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-seated-dumbbell-front-raise.html'),
  ('Alternate Seated Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-seated-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-seated-dumbbell-press.html'),
  ('Alternate Seated Hammer Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/alternate-seated-hammer-curl.html', 'Biceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/alternate-seated-hammer-curl.html'),
  ('Alternate Seated Palms In Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-seated-palms-in-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-seated-palms-in-dumbbell-press.html'),
  ('Alternate Standing Arnold Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-standing-arnold-press.html', 'Shoulders', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/alternate-standing-arnold-press.html'),
  ('Alternate Standing Dumbbell Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-standing-dumbbell-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-standing-dumbbell-front-raise.html'),
  ('Alternate Standing Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/alternate-standing-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/alternate-standing-dumbbell-press.html'),
  ('Curl marteau', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/alternate-standing-hammer-curl.html', 'Biceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/alternate-standing-hammer-curl.html'),
  ('Curl barre arrière', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/barbell-drag-curl.html', 'Biceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-drag-curl.html'),
  ('Curl marteau barre', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/barbell-hammer-curl.html', 'Biceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-hammer-curl.html'),
  ('Barbell Jumping Squats', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/barbell-jumping-squats.html', 'Quadriceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-jumping-squats.html'),
  ('Barbell Pullover And Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/barbell-pullover-and-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-pullover-and-press.html'),
  ('Barbell Side Bends', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/barbell-side-bends.html', 'Abdominaux', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-side-bends.html'),
  ('Barbell Side Lunge', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/barbell-side-lunge.html', 'Quadriceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-side-lunge.html'),
  ('Barbell Side Split Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/barbell-side-split-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-side-split-squat.html'),
  ('Barbell Split Jump', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/barbell-split-jump.html', 'Hamstrings', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-split-jump.html'),
  ('Barbell Step Ups', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/barbell-step-ups.html', 'Quadriceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-step-ups.html'),
  ('Tirage nuque', 'Dos', '', 'https://www.muscleandstrength.com/exercises/behind-neck-lat-pull-down.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/behind-neck-lat-pull-down.html'),
  ('Bench Jack Knife', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/bench-jack-knife.html', 'Abdominaux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/bench-jack-knife.html'),
  ('Bench One Leg Dumbbell Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/bench-one-leg-dumbbell-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/bench-one-leg-dumbbell-squat.html'),
  ('Bench Pushups', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/bench-pushups.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/bench-pushups.html'),
  ('Rowing barre', 'Dos', '', 'https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html', 'Dos', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html'),
  ('Bent Over Dumbbell Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/bent-over-dumbbell-row.html', 'Dos', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/bent-over-dumbbell-row.html'),
  ('Bent Over Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/bent-over-row.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/bent-over-row.html'),
  ('Bodyweight Wall Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/bodyweight-wall-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/bodyweight-wall-squat.html'),
  ('Mollets poulie', 'Calves', '', 'https://www.muscleandstrength.com/exercises/cable-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/cable-calf-raise.html');

insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values
  ('Cable Concentration Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/cable-concentration-curl.html', 'Biceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/cable-concentration-curl.html'),
  ('Cable Inner Chest Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/cable-inner-chest-press.html', 'Pectoraux', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/cable-inner-chest-press.html'),
  ('Kickback triceps poulie', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/cable-tricep-kickback.html', 'Triceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/cable-tricep-kickback.html'),
  ('Chair Twisting Knee Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/chair-twisting-knee-raise.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/chair-twisting-knee-raise.html'),
  ('Dips', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/chest-dip.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/chest-dip.html'),
  ('Traction supination', 'Dos', '', 'https://www.muscleandstrength.com/exercises/chin-up.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/chin-up.html'),
  ('Clean & press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/clean-press.html', 'Shoulders', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/clean-press.html'),
  ('Développé couché prise serrée', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/close-grip-bench-press.html', 'Triceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/close-grip-bench-press.html'),
  ('Close Grip Cable Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/close-grip-cable-curl.html', 'Biceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/close-grip-cable-curl.html'),
  ('Close Grip Chest Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/close-grip-chest-press.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/close-grip-chest-press.html'),
  ('Close Grip Ez Bar Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/close-grip-ez-bar-curl.html', 'Biceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/close-grip-ez-bar-curl.html'),
  ('Tirage vertical prise serrée', 'Dos', '', 'https://www.muscleandstrength.com/exercises/close-grip-pull-down.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/close-grip-pull-down.html'),
  ('Tractions prise serrée', 'Dos', '', 'https://www.muscleandstrength.com/exercises/close-grip-pull-up.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/close-grip-pull-up.html'),
  ('Curl barre prise serrée', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/close-grip-standing-barbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/close-grip-standing-barbell-curl.html'),
  ('Decline Abdominal Reach', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-abdominal-reach.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-abdominal-reach.html'),
  ('Decline Bench Alternate Knee Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-bench-alternate-knee-raise.html', 'Abdominaux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-bench-alternate-knee-raise.html'),
  ('Decline Bench Alternate Leg Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-bench-alternate-leg-raise.html', 'Abdominaux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-bench-alternate-leg-raise.html'),
  ('Decline Bench Barbell Lunge', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/decline-bench-barbell-lunge.html', 'Quadriceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/decline-bench-barbell-lunge.html'),
  ('Decline Bench Cable Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-bench-cable-crunch.html', 'Abdominaux', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/decline-bench-cable-crunch.html'),
  ('Decline Bench Knee Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-bench-knee-raise.html', 'Abdominaux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-bench-knee-raise.html'),
  ('Decline Bench Leg Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-bench-leg-raise.html', 'Abdominaux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-bench-leg-raise.html'),
  ('Decline Cable Flys', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/decline-cable-flys.html', 'Pectoraux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/decline-cable-flys.html'),
  ('Decline Cable Knee Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-cable-knee-raise.html', 'Abdominaux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/decline-cable-knee-raise.html'),
  ('Decline Close Grip Bench Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/decline-close-grip-bench-press.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-close-grip-bench-press.html'),
  ('Decline Dumbbell Flys', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/decline-dumbbell-flys.html', 'Pectoraux', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/decline-dumbbell-flys.html'),
  ('Decline Dumbbell Situp', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-dumbbell-situp.html', 'Abdominaux', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/decline-dumbbell-situp.html'),
  ('Decline Leg Raise With Hip Thrust', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-leg-raise-with-hip-thrust.html', 'Abdominaux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-leg-raise-with-hip-thrust.html'),
  ('Decline Lying Dumbbell Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/decline-lying-dumbbell-extension.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/decline-lying-dumbbell-extension.html'),
  ('Decline Lying Tricep Extension Skullcrusher', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/decline-lying-tricep-extension-skullcrusher.html', 'Triceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-lying-tricep-extension-skullcrusher.html'),
  ('Decline Smith Machine Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/decline-smith-machine-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/decline-smith-machine-bench-press.html'),
  ('Decline Weighted Twist', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/decline-weighted-twist.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/decline-weighted-twist.html'),
  ('Pompes profondes', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/deep-push-ups.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/deep-push-ups.html'),
  ('Deep Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/deep-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/deep-squat.html'),
  ('Dublin Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/dublin-press.html', 'Shoulders', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/dublin-press.html'),
  ('Développé couché haltères', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/dumbbell-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-bench-press.html'),
  ('Dumbbell Deadlift', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/dumbbell-deadlift.html', 'Hamstrings', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-deadlift.html'),
  ('Dumbbell Front Raise On Incline Bench', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/dumbbell-front-raise-on-incline-bench.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-front-raise-on-incline-bench.html'),
  ('Dumbbell Hammer Preacher Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/dumbbell-hammer-preacher-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-hammer-preacher-curl.html'),
  ('Dumbbell Jumping Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/dumbbell-jumping-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-jumping-squat.html'),
  ('Élévation latérale', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html'),
  ('Pullover haltère', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/dumbbell-pullover.html', 'Pectoraux', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-pullover.html'),
  ('Dumbbell Split Jump', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/dumbbell-split-jump.html', 'Quadriceps', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-split-jump.html'),
  ('Dumbbell Squat To Bench', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/dumbbell-squat-to-bench.html', 'Quadriceps', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-squat-to-bench.html'),
  ('Dumbbell Stiff Leg Deadlift On Bench', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/dumbbell-stiff-leg-deadlift-on-bench.html', 'Hamstrings', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-stiff-leg-deadlift-on-bench.html'),
  ('Dumbbell Wall Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/dumbbell-wall-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/dumbbell-wall-squat.html'),
  ('Exercise Ball Dip', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/exercise-ball-dip.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/exercise-ball-dip.html'),
  ('Exercise Ball Dumbbell Kickbacks', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/exercise-ball-dumbbell-kickbacks.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/exercise-ball-dumbbell-kickbacks.html'),
  ('Exercise Ball Hip Roll', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/exercise-ball-hip-roll.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/exercise-ball-hip-roll.html'),
  ('Exercise Ball Lateral Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/exercise-ball-lateral-raise.html', 'Shoulders', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/exercise-ball-lateral-raise.html'),
  ('Exercise Ball Leg Tuck', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/exercise-ball-leg-tuck.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/exercise-ball-leg-tuck.html');

insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values
  ('Exercise Ball One Arm Dumbbell Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/exercise-ball-one-arm-dumbbell-extension.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/exercise-ball-one-arm-dumbbell-extension.html'),
  ('Exercise Ball Two Arm Dumbbell Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/exercise-ball-two-arm-dumbbell-extension.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/exercise-ball-two-arm-dumbbell-extension.html'),
  ('Ez Bar Back Of The Head Lying Tricep Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/ez-bar-back-of-the-head-lying-tricep-extension.html', 'Triceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/ez-bar-back-of-the-head-lying-tricep-extension.html'),
  ('Ez Bar Incline Skullcrusher', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/ez-bar-incline-skullcrusher.html', 'Triceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/ez-bar-incline-skullcrusher.html'),
  ('Ez Bar Reverse Grip Bent Over Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/ez-bar-reverse-grip-bent-over-row.html', 'Dos', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/ez-bar-reverse-grip-bent-over-row.html'),
  ('Ez Bar Skullcrusher', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/ez-bar-skullcrusher.html', 'Triceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/ez-bar-skullcrusher.html'),
  ('Feet Forward Smith Machine Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/feet-forward-smith-machine-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/feet-forward-smith-machine-squat.html'),
  ('Flat Bench Cable Flys', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/flat-bench-cable-flys.html', 'Pectoraux', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/flat-bench-cable-flys.html'),
  ('Floor Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/floor-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/floor-bench-press.html'),
  ('Floor Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/floor-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/floor-calf-raise.html'),
  ('Front Squat To Bench', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/front-squat-to-bench.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/front-squat-to-bench.html'),
  ('Good Mornings', 'Glutes', '', 'https://www.muscleandstrength.com/exercises/good-mornings.html', 'Glutes', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/good-mornings.html'),
  ('Guillotine Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/guillotine-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/guillotine-press.html'),
  ('Hack One Leg Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/hack-one-leg-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/hack-one-leg-calf-raise.html'),
  ('Hack squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/hack-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/hack-squat.html'),
  ('Half Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/half-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/half-squat.html'),
  ('Hammer Bar Preacher Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/hammer-bar-preacher-curl.html', 'Biceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/hammer-bar-preacher-curl.html'),
  ('High Barbell Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/high-barbell-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/high-barbell-front-raise.html'),
  ('High Inverted Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/high-inverted-row.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/high-inverted-row.html'),
  ('High Weight Plate Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/high-weight-plate-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/high-weight-plate-front-raise.html'),
  ('Hip thrust', 'Glutes', '', 'https://www.muscleandstrength.com/exercises/hip-thrusts.html', 'Glutes', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/hip-thrusts.html'),
  ('Hyperextension', 'Glutes', '', 'https://www.muscleandstrength.com/exercises/hyperextension.html', 'Glutes', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/hyperextension.html'),
  ('Incline Bench Barbell Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/incline-bench-barbell-row.html', 'Dos', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/incline-bench-barbell-row.html'),
  ('Incline Bench Bodyweight Lunge', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/incline-bench-bodyweight-lunge.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/incline-bench-bodyweight-lunge.html'),
  ('Incline Bench Cable Row Rope Extension', 'Dos', '', 'https://www.muscleandstrength.com/exercises/incline-bench-cable-row-rope-extension.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/incline-bench-cable-row-rope-extension.html'),
  ('Incline Bench Cable Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/incline-bench-cable-row.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/incline-bench-cable-row.html'),
  ('Incline Bench Dumbbell Lunge', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/incline-bench-dumbbell-lunge.html', 'Quadriceps', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/incline-bench-dumbbell-lunge.html'),
  ('Incline Bench Hammer Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/incline-bench-hammer-curl.html', 'Biceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/incline-bench-hammer-curl.html'),
  ('Développé incliné haltères', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/incline-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/incline-bench-press.html'),
  ('Incline Bench Rope Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/incline-bench-rope-extension.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/incline-bench-rope-extension.html'),
  ('Incline Bench Two Arm Dumbbell Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/incline-bench-two-arm-dumbbell-row.html', 'Dos', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/incline-bench-two-arm-dumbbell-row.html'),
  ('Incline Cable Flys', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/incline-cable-flys.html', 'Pectoraux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/incline-cable-flys.html'),
  ('Incline Cable Tricep Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/incline-cable-tricep-extension.html', 'Triceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/incline-cable-tricep-extension.html'),
  ('Incline Close Grip Bench Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/incline-close-grip-bench-press.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/incline-close-grip-bench-press.html'),
  ('Incline Dumbbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/incline-dumbbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/incline-dumbbell-curl.html'),
  ('Incline Push Ups', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/incline-push-ups.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/incline-push-ups.html'),
  ('Incline Swiss Ball Push Up', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/incline-swiss-ball-push-up.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/incline-swiss-ball-push-up.html'),
  ('Inline Bench French Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/inline-bench-french-press.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/inline-bench-french-press.html'),
  ('Knee Pushups', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/knee-pushups.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/knee-pushups.html'),
  ('Kneeling Overhead Tricep Extension Over Flat Bench', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/kneeling-overhead-tricep-extension-over-flat-bench.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/kneeling-overhead-tricep-extension-over-flat-bench.html'),
  ('Lat Pull Down', 'Dos', '', 'https://www.muscleandstrength.com/exercises/lat-pull-down.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/lat-pull-down.html'),
  ('Lower Abdominal Hip Roll', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/lower-abdominal-hip-roll.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/lower-abdominal-hip-roll.html'),
  ('Lying Alternate Knee Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/lying-alternate-knee-raise.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/lying-alternate-knee-raise.html'),
  ('Lying Cable Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/lying-cable-crunch.html', 'Abdominaux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/lying-cable-crunch.html'),
  ('Lying Cable Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/lying-cable-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/lying-cable-front-raise.html'),
  ('Lying Cable Knee Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/lying-cable-knee-raise.html', 'Abdominaux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/lying-cable-knee-raise.html'),
  ('Lying Cable Pullover Rope Extension', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/lying-cable-pullover-rope-extension.html', 'Pectoraux', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/lying-cable-pullover-rope-extension.html'),
  ('Lying Cable Pullover', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/lying-cable-pullover.html', 'Pectoraux', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/lying-cable-pullover.html'),
  ('Lying Cable Tricep Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/lying-cable-tricep-extension.html', 'Triceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/lying-cable-tricep-extension.html'),
  ('Lying Dumbbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/lying-dumbbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/lying-dumbbell-curl.html');

insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values
  ('Lying Dumbbell Reverse Fly', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/lying-dumbbell-reverse-fly.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/lying-dumbbell-reverse-fly.html'),
  ('Lying Floor Leg Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/lying-floor-leg-raise.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/lying-floor-leg-raise.html'),
  ('Lying Heel Touches', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/lying-heel-touches.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/lying-heel-touches.html'),
  ('Lying High Pulley Cable Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/lying-high-pulley-cable-curl.html', 'Biceps', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/lying-high-pulley-cable-curl.html'),
  ('Lying High Pulley Close Grip Cable Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/lying-high-pulley-close-grip-cable-curl.html', 'Biceps', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/lying-high-pulley-close-grip-cable-curl.html'),
  ('Lying Rear Delt Barbell Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/lying-rear-delt-barbell-raise.html', 'Shoulders', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/lying-rear-delt-barbell-raise.html'),
  ('Lying Single Dumbbell Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/lying-single-dumbbell-extension.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/lying-single-dumbbell-extension.html'),
  ('Lying Wide Dumbbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/lying-wide-dumbbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/lying-wide-dumbbell-curl.html'),
  ('Machine Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/machine-row.html', 'Dos', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/machine-row.html'),
  ('Machine T Bar Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/machine-t-bar-row.html', 'Dos', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/machine-t-bar-row.html'),
  ('Military Press Behind Neck', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/military-press-behind-neck.html', 'Shoulders', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/military-press-behind-neck.html'),
  ('Développé militaire', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/military-press.html', 'Shoulders', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/military-press.html'),
  ('Narrow Hack Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/narrow-hack-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/narrow-hack-squat.html'),
  ('Narrow Smith Machine Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/narrow-smith-machine-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/narrow-smith-machine-squat.html'),
  ('Narrow Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/narrow-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/narrow-squat.html'),
  ('Narrow Stance 45 Degree Leg Press', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/narrow-stance-45-degree-leg-press.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/narrow-stance-45-degree-leg-press.html'),
  ('One Arm Bent Over Dumbbell Kickback', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-bent-over-dumbbell-kickback.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-bent-over-dumbbell-kickback.html'),
  ('One Arm Bent Over Dumbbell Reverse Fly', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-bent-over-dumbbell-reverse-fly.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-bent-over-dumbbell-reverse-fly.html'),
  ('One Arm Bent Over Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/one-arm-bent-over-row.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-arm-bent-over-row.html'),
  ('One Arm Cable Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-cable-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/one-arm-cable-front-raise.html'),
  ('One Arm Cable Reverse Fly', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-cable-reverse-fly.html', 'Shoulders', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/one-arm-cable-reverse-fly.html'),
  ('One Arm Cable Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/one-arm-cable-row.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/one-arm-cable-row.html'),
  ('One Arm Dumbbell Front Raise On Incline Bench', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-front-raise-on-incline-bench.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-front-raise-on-incline-bench.html'),
  ('One Arm Dumbbell Hammer Preacher Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-hammer-preacher-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-hammer-preacher-curl.html'),
  ('One Arm Dumbbell Reverse Fly On Incline Bench', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-reverse-fly-on-incline-bench.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-reverse-fly-on-incline-bench.html'),
  ('One Arm Dumbbell Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-row.html', 'Dos', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-row.html'),
  ('One Arm Lying Dumbbell Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-lying-dumbbell-extension.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-lying-dumbbell-extension.html'),
  ('One Arm Lying Dumbbell Reverse Fly', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-lying-dumbbell-reverse-fly.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-lying-dumbbell-reverse-fly.html'),
  ('One Arm Machine Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/one-arm-machine-row.html', 'Dos', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/one-arm-machine-row.html'),
  ('One Arm Preacher Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-preacher-curl.html', 'Biceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-arm-preacher-curl.html'),
  ('One Arm Pronated Dumbbell Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-pronated-dumbbell-extension.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-pronated-dumbbell-extension.html'),
  ('One Arm Prone Dumbbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-prone-dumbbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-prone-dumbbell-curl.html'),
  ('One Arm Prone Hammer Dumbbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-prone-hammer-dumbbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-prone-hammer-dumbbell-curl.html'),
  ('One Arm Seated Arnold Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-arnold-press.html', 'Shoulders', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-arm-seated-arnold-press.html'),
  ('One Arm Seated Bent Over Dumbbell Kickback', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-bent-over-dumbbell-kickback.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-seated-bent-over-dumbbell-kickback.html'),
  ('One Arm Seated Bent Over Dumbbell Reverse Fly', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-bent-over-dumbbell-reverse-fly.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-seated-bent-over-dumbbell-reverse-fly.html'),
  ('One Arm Seated Dumbbell Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-dumbbell-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-seated-dumbbell-front-raise.html'),
  ('One Arm Seated Dumbbell Kickback', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-dumbbell-kickback.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-seated-dumbbell-kickback.html'),
  ('One Arm Seated Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-seated-dumbbell-press.html'),
  ('One Arm Seated Hammer Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-hammer-curl.html', 'Biceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-arm-seated-hammer-curl.html'),
  ('One Arm Seated Overhead Tricep Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-overhead-tricep-extension.html', 'Triceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-arm-seated-overhead-tricep-extension.html'),
  ('One Arm Seated Palms In Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-seated-palms-in-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-seated-palms-in-dumbbell-press.html'),
  ('One Arm Standing Arnold Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-standing-arnold-press.html', 'Shoulders', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-arm-standing-arnold-press.html'),
  ('One Arm Standing Dumbbell Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-standing-dumbbell-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-standing-dumbbell-front-raise.html'),
  ('One Arm Standing Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-standing-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-standing-dumbbell-press.html'),
  ('One Arm Standing Palms In Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/one-arm-standing-palms-in-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/one-arm-standing-palms-in-dumbbell-press.html'),
  ('One Leg 45 Degree Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/one-leg-45-degree-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-leg-45-degree-calf-raise.html'),
  ('One Leg 45 Degree Leg Press', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/one-leg-45-degree-leg-press.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/one-leg-45-degree-leg-press.html'),
  ('One Leg Barbell Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/one-leg-barbell-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/one-leg-barbell-squat.html'),
  ('One Leg Bodyweight Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/one-leg-bodyweight-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-leg-bodyweight-squat.html');

insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values
  ('One Leg Bodyweight Wall Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/one-leg-bodyweight-wall-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-leg-bodyweight-wall-squat.html'),
  ('One Leg Cable Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/one-leg-cable-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/one-leg-cable-calf-raise.html'),
  ('One Leg Hack Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/one-leg-hack-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/one-leg-hack-squat.html'),
  ('One Leg Lying Cable Hamstring Curl', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/one-leg-lying-cable-hamstring-curl.html', 'Hamstrings', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/one-leg-lying-cable-hamstring-curl.html'),
  ('One Leg Lying Cable Knee Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/one-leg-lying-cable-knee-raise.html', 'Abdominaux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/one-leg-lying-cable-knee-raise.html'),
  ('One Leg Smith Machine Seated Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/one-leg-smith-machine-seated-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'MACHINE', 'https://www.muscleandstrength.com/exercises/one-leg-smith-machine-seated-calf-raise.html'),
  ('Overhead Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/overhead-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/overhead-squat.html'),
  ('Palms In Decline Dumbbell Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/palms-in-decline-dumbbell-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/palms-in-decline-dumbbell-bench-press.html'),
  ('Palms In Incline Dumbbell Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/palms-in-incline-dumbbell-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/palms-in-incline-dumbbell-bench-press.html'),
  ('Prone Incline Dumbbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/prone-incline-dumbbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/prone-incline-dumbbell-curl.html'),
  ('Reach And Catch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/reach-and-catch.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reach-and-catch.html'),
  ('Rear Delt Barbell Row To Neck', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/rear-delt-barbell-row-to-neck.html', 'Shoulders', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/rear-delt-barbell-row-to-neck.html'),
  ('Reverse Grip Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-bench-press.html'),
  ('Reverse Grip Bent Over Dumbbell Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-bent-over-dumbbell-row.html', 'Dos', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/reverse-grip-bent-over-dumbbell-row.html'),
  ('Reverse Grip Bent Over Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-bent-over-row.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-bent-over-row.html'),
  ('Reverse Grip Cable Tricep Kickback', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-cable-tricep-kickback.html', 'Triceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/reverse-grip-cable-tricep-kickback.html'),
  ('Reverse Grip Close Grip Bench Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-close-grip-bench-press.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-close-grip-bench-press.html'),
  ('Reverse Grip French Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-french-press.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-french-press.html'),
  ('Reverse Grip Incline Bench Barbell Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-incline-bench-barbell-row.html', 'Dos', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/reverse-grip-incline-bench-barbell-row.html'),
  ('Reverse Grip Incline Bench Cable Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-incline-bench-cable-row.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/reverse-grip-incline-bench-cable-row.html'),
  ('Reverse Grip Incline Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-incline-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-incline-bench-press.html'),
  ('Reverse Grip Incline Bench Two Arm Dumbbell Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-incline-bench-two-arm-dumbbell-row.html', 'Dos', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/reverse-grip-incline-bench-two-arm-dumbbell-row.html'),
  ('Reverse Grip Lat Pull Down', 'Dos', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-lat-pull-down.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-lat-pull-down.html'),
  ('Reverse Grip One Arm Seated Overhead Tricep Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-one-arm-seated-overhead-tricep-extension.html', 'Triceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-one-arm-seated-overhead-tricep-extension.html'),
  ('Reverse Grip One Arm Standing Overhead Cable Tricep Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-one-arm-standing-overhead-cable-tricep-extension.html', 'Triceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/reverse-grip-one-arm-standing-overhead-cable-tricep-extension.html'),
  ('Reverse Grip Seated French Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-seated-french-press.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-seated-french-press.html'),
  ('Reverse Grip Skullcrusher', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-skullcrusher.html', 'Triceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/reverse-grip-skullcrusher.html'),
  ('Reverse Grip Smith Machine Bent Over Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/reverse-grip-smith-machine-bent-over-row.html', 'Dos', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/reverse-grip-smith-machine-bent-over-row.html'),
  ('Rope Cable Preacher Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/rope-cable-preacher-curl.html', 'Biceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/rope-cable-preacher-curl.html'),
  ('Rope Crossover Seated Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/rope-crossover-seated-row.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/rope-crossover-seated-row.html'),
  ('Rope Pull Up', 'Dos', '', 'https://www.muscleandstrength.com/exercises/rope-pull-up.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/rope-pull-up.html'),
  ('Seated Alternate Dumbbell Lateral Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/seated-alternate-dumbbell-lateral-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/seated-alternate-dumbbell-lateral-raise.html'),
  ('Seated Alternating Front Back Barbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/seated-alternating-front-back-barbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/seated-alternating-front-back-barbell-press.html'),
  ('Développé Arnold', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/seated-arnold-press.html', 'Abdominaux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/seated-arnold-press.html'),
  ('Seated Barbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/seated-barbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/seated-barbell-curl.html'),
  ('Seated Barbell Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/seated-barbell-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/seated-barbell-front-raise.html'),
  ('Seated Bent Over Dumbbell Kickback', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/seated-bent-over-dumbbell-kickback.html', 'Triceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/seated-bent-over-dumbbell-kickback.html'),
  ('Seated Cable Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/seated-cable-crunch.html', 'Abdominaux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/seated-cable-crunch.html'),
  ('Seated Cable Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/seated-cable-curl.html', 'Biceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/seated-cable-curl.html'),
  ('Mollets assis', 'Calves', '', 'https://www.muscleandstrength.com/exercises/seated-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'MACHINE', 'https://www.muscleandstrength.com/exercises/seated-calf-raise.html'),
  ('Seated Dumbbell Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/seated-dumbbell-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/seated-dumbbell-front-raise.html'),
  ('Seated High Barbell Front Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/seated-high-barbell-front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/seated-high-barbell-front-raise.html'),
  ('Seated High Cable Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/seated-high-cable-row.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/seated-high-cable-row.html'),
  ('Seated One Arm Dumbbell Lateral Raise', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/seated-one-arm-dumbbell-lateral-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/seated-one-arm-dumbbell-lateral-raise.html'),
  ('Seated Row Using Rope', 'Dos', '', 'https://www.muscleandstrength.com/exercises/seated-row-using-rope.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/seated-row-using-rope.html'),
  ('Tirage horizontal à la poulie', 'Dos', '', 'https://www.muscleandstrength.com/exercises/seated-row.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/seated-row.html'),
  ('Side Crunch With Leg Lift', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/side-crunch-with-leg-lift.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/side-crunch-with-leg-lift.html'),
  ('Single Bench Dip', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/single-bench-dip.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/single-bench-dip.html'),
  ('Single Leg Extension', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/single-leg-extension.html', 'Quadriceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/single-leg-extension.html'),
  ('Sissy Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/sissy-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/sissy-squat.html');

insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values
  ('Sit Up', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/sit-up.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/sit-up.html'),
  ('Smith Machine Bent Over Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/smith-machine-bent-over-row.html', 'Dos', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-bent-over-row.html'),
  ('Smith Machine Bodyweight Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/smith-machine-bodyweight-row.html', 'Dos', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-bodyweight-row.html'),
  ('Smith Machine Close Grip Bench Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/smith-machine-close-grip-bench-press.html', 'Triceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-close-grip-bench-press.html'),
  ('Smith Machine Deadlift', 'Lower Back', '', 'https://www.muscleandstrength.com/exercises/smith-machine-deadlift.html', 'Lower Back', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-deadlift.html'),
  ('Smith Machine One Leg Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/smith-machine-one-leg-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-one-leg-squat.html'),
  ('Smith Machine Reverse Close Grip Bench Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/smith-machine-reverse-close-grip-bench-press.html', 'Triceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-reverse-close-grip-bench-press.html'),
  ('Smith Machine Shoulder Press Behind Neck', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/smith-machine-shoulder-press-behind-neck.html', 'Shoulders', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-shoulder-press-behind-neck.html'),
  ('Smith Machine Squat To Bench', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/smith-machine-squat-to-bench.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-squat-to-bench.html'),
  ('Smith Machine Wide Grip Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/smith-machine-wide-grip-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-wide-grip-bench-press.html'),
  ('Smith Machine Zercher Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/smith-machine-zercher-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/smith-machine-zercher-squat.html'),
  ('Speed Squats', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/speed-squats.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/speed-squats.html'),
  ('Squat To Bench', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/squat-to-bench.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/squat-to-bench.html'),
  ('Squat barre', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/squat.html'),
  ('Squatting Cable Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/squatting-cable-curl.html', 'Biceps', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/squatting-cable-curl.html'),
  ('Curl barre', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/standing-barbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/standing-barbell-curl.html'),
  ('Standing Barbell Twist', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/standing-barbell-twist.html', 'Abdominaux', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/standing-barbell-twist.html'),
  ('Standing Dublin Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/standing-dublin-press.html', 'Shoulders', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/standing-dublin-press.html'),
  ('Extensions triceps à la poulie', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/standing-low-pulley-overhead-tricep-extension.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/standing-low-pulley-overhead-tricep-extension.html'),
  ('Standing Oblique Cable Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/standing-oblique-cable-crunch.html', 'Abdominaux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/standing-oblique-cable-crunch.html'),
  ('Standing One Arm Cable Row', 'Dos', '', 'https://www.muscleandstrength.com/exercises/standing-one-arm-cable-row.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/standing-one-arm-cable-row.html'),
  ('Standing Palms In Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/standing-palms-in-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/standing-palms-in-dumbbell-press.html'),
  ('Standing Two Arm Tricep Cable Extension', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/standing-two-arm-tricep-cable-extension.html', 'Triceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/standing-two-arm-tricep-cable-extension.html'),
  ('RDL', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/stiff-leg-deadlift-aka-romanian-deadlift.html', 'Hamstrings', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/stiff-leg-deadlift-aka-romanian-deadlift.html'),
  ('Stiff Leg Deadlift On Bench', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/stiff-leg-deadlift-on-bench.html', 'Hamstrings', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/stiff-leg-deadlift-on-bench.html'),
  ('Straight Arm Lat Pull Down', 'Dos', '', 'https://www.muscleandstrength.com/exercises/straight-arm-lat-pull-down.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/straight-arm-lat-pull-down.html'),
  ('Sumo Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/sumo-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/sumo-squat.html'),
  ('Swiss Ball Barbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-barbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/swiss-ball-barbell-press.html'),
  ('Swiss Ball Cable Flys', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-cable-flys.html', 'Pectoraux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/swiss-ball-cable-flys.html'),
  ('Swiss Ball Dumbbell Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-dumbbell-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/swiss-ball-dumbbell-bench-press.html'),
  ('Swiss Ball Dumbbell Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-dumbbell-curl.html', 'Biceps', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/swiss-ball-dumbbell-curl.html'),
  ('Swiss Ball Dumbbell Flys', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-dumbbell-flys.html', 'Pectoraux', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/swiss-ball-dumbbell-flys.html'),
  ('Swiss Ball Dumbbell Press', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-dumbbell-press.html', 'Shoulders', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/swiss-ball-dumbbell-press.html'),
  ('Swiss Ball French Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-french-press.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/swiss-ball-french-press.html'),
  ('Swiss Ball Hover', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-hover.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/swiss-ball-hover.html'),
  ('Swiss Ball Push Up', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-push-up.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/swiss-ball-push-up.html'),
  ('Swiss Ball Wall Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/swiss-ball-wall-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/swiss-ball-wall-squat.html'),
  ('Three Bench Dip', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/three-bench-dip.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/three-bench-dip.html'),
  ('Toes In 45 Degree Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/toes-in-45-degree-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/toes-in-45-degree-calf-raise.html'),
  ('Toes In Leg Extension', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/toes-in-leg-extension.html', 'Quadriceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/toes-in-leg-extension.html'),
  ('Toes In Smith Machine Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/toes-in-smith-machine-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'MACHINE', 'https://www.muscleandstrength.com/exercises/toes-in-smith-machine-calf-raise.html'),
  ('Toes Out 45 Degree Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/toes-out-45-degree-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/toes-out-45-degree-calf-raise.html'),
  ('Toes Out Leg Extension', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/toes-out-leg-extension.html', 'Quadriceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/toes-out-leg-extension.html'),
  ('Toes Out Smith Machine Calf Raise', 'Calves', '', 'https://www.muscleandstrength.com/exercises/toes-out-smith-machine-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'MACHINE', 'https://www.muscleandstrength.com/exercises/toes-out-smith-machine-calf-raise.html'),
  ('Twisting Cable Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/twisting-cable-crunch.html', 'Abdominaux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/twisting-cable-crunch.html'),
  ('Twisting Decline Sit Up', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/twisting-decline-sit-up.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/twisting-decline-sit-up.html'),
  ('Twisting Dumbbell Bench Press', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/twisting-dumbbell-bench-press.html', 'Triceps', '{}', 'COMPOUND', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/twisting-dumbbell-bench-press.html'),
  ('Twisting Floor Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/twisting-floor-crunch.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/twisting-floor-crunch.html'),
  ('Twisting Lying Cable Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/twisting-lying-cable-crunch.html', 'Abdominaux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/twisting-lying-cable-crunch.html'),
  ('Two Arm Cable Curl On Incline Bench', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/two-arm-cable-curl-on-incline-bench.html', 'Biceps', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/two-arm-cable-curl-on-incline-bench.html');

insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values
  ('Two Arm Cable Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/two-arm-cable-curl.html', 'Biceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/two-arm-cable-curl.html'),
  ('Two Arm Cable Tricep Kickback', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/two-arm-cable-tricep-kickback.html', 'Triceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/two-arm-cable-tricep-kickback.html'),
  ('Underhand Close Grip Lat Pull Down', 'Dos', '', 'https://www.muscleandstrength.com/exercises/underhand-close-grip-lat-pull-down.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/underhand-close-grip-lat-pull-down.html'),
  ('V Bar Pull Up', 'Dos', '', 'https://www.muscleandstrength.com/exercises/v-bar-pull-up.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/v-bar-pull-up.html'),
  ('Walking Barbell Lunge', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/walking-barbell-lunge.html', 'Quadriceps', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/walking-barbell-lunge.html'),
  ('Weighted Bench Dips', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/weighted-bench-dips.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-bench-dips.html'),
  ('Weighted Chair Knee Raise', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/weighted-chair-knee-raise.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-chair-knee-raise.html'),
  ('Weighted Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/weighted-crunch.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-crunch.html'),
  ('Weighted Exercise Ball Sit Up', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/weighted-exercise-ball-sit-up.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-exercise-ball-sit-up.html'),
  ('Lève-jambes suspendu', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/weighted-hanging-knee-raise.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-hanging-knee-raise.html'),
  ('Weighted Side Touches', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/weighted-side-touches.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-side-touches.html'),
  ('Weighted Sissy Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/weighted-sissy-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-sissy-squat.html'),
  ('Weighted Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/weighted-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-squat.html'),
  ('Weighted Swiss Ball Wall Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/weighted-swiss-ball-wall-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-swiss-ball-wall-squat.html'),
  ('Weighted Three Bench Dips', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/weighted-three-bench-dips.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-three-bench-dips.html'),
  ('Weighted Tricep Dips', 'Triceps', '', 'https://www.muscleandstrength.com/exercises/weighted-tricep-dips.html', 'Triceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/weighted-tricep-dips.html'),
  ('Wide Grip Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/wide-grip-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/wide-grip-bench-press.html'),
  ('Wide Grip Cable Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/wide-grip-cable-curl.html', 'Biceps', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/wide-grip-cable-curl.html'),
  ('Wide Grip Chin Up', 'Dos', '', 'https://www.muscleandstrength.com/exercises/wide-grip-chin-up.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/wide-grip-chin-up.html'),
  ('Wide Grip Ez Bar Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/wide-grip-ez-bar-curl.html', 'Biceps', '{}', 'ISOLATION', 'BARBELL', 'https://www.muscleandstrength.com/exercises/wide-grip-ez-bar-curl.html'),
  ('Tractions prise large', 'Dos', '', 'https://www.muscleandstrength.com/exercises/wide-grip-pull-up.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/wide-grip-pull-up.html'),
  ('Wide Grip Push Ups', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/wide-grip-push-ups.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/wide-grip-push-ups.html'),
  ('Wide Hack Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/wide-hack-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/wide-hack-squat.html'),
  ('Wide Reverse Grip Bench Press', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/wide-reverse-grip-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/wide-reverse-grip-bench-press.html'),
  ('Wide Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/wide-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/wide-squat.html'),
  ('Wide Stance 45 Degree Leg Press', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/wide-stance-45-degree-leg-press.html', 'Quadriceps', '{}', 'COMPOUND', 'MACHINE', 'https://www.muscleandstrength.com/exercises/wide-stance-45-degree-leg-press.html'),
  ('Zerchers Squat', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/zerchers-squat.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/zerchers-squat.html'),
  ('Zottman Preacher Curl', 'Biceps', '', 'https://www.muscleandstrength.com/exercises/zottman-preacher-curl.html', 'Biceps', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/zottman-preacher-curl.html'),
  ('Développé couché barre', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/barbell-bench-press.html', 'Pectoraux', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/barbell-bench-press.html'),
  ('Pompes', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/push-up.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/push-up.html'),
  ('Soulevé de terre', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/deadlift.html', 'Hamstrings', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/deadlift.html'),
  ('RDL', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/romanian-deadlift.html', 'Hamstrings', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/romanian-deadlift.html'),
  ('Leg curl', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/leg-curl.html', 'Hamstrings', '{}', 'ISOLATION', 'MACHINE', 'https://www.muscleandstrength.com/exercises/leg-curl.html'),
  ('Extension jambes', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/leg-extension.html', 'Quadriceps', '{}', 'ISOLATION', 'MACHINE', 'https://www.muscleandstrength.com/exercises/leg-extension.html'),
  ('Tirage vertical (pull-down)', 'Dos', '', 'https://www.muscleandstrength.com/exercises/lat-pulldown.html', 'Dos', '{}', 'COMPOUND', 'CABLE', 'https://www.muscleandstrength.com/exercises/lat-pulldown.html'),
  ('Crunch', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/crunch.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/crunch.html'),
  ('Gainage', 'Abdominaux', '', 'https://www.muscleandstrength.com/exercises/plank.html', 'Abdominaux', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/plank.html'),
  ('Corde à sauter', 'Cardio', '', 'https://www.muscleandstrength.com/exercises/jump-rope.html', 'Cardio', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/jump-rope.html'),
  ('Mountain climbers', 'Cardio', '', 'https://www.muscleandstrength.com/exercises/mountain-climbers.html', 'Cardio', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/mountain-climbers.html'),
  ('Jumping jacks', 'Cardio', '', 'https://www.muscleandstrength.com/exercises/jumping-jacks.html', 'Cardio', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/jumping-jacks.html'),
  ('Burpees', 'Cardio', '', 'https://www.muscleandstrength.com/exercises/burpees.html', 'Cardio', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/burpees.html'),
  ('Dips', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/dips.html', 'Pectoraux', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/dips.html'),
  ('Mollets debout', 'Calves', '', 'https://www.muscleandstrength.com/exercises/standing-calf-raise.html', 'Calves', '{}', 'ISOLATION', 'MACHINE', 'https://www.muscleandstrength.com/exercises/standing-calf-raise.html'),
  ('Fentes', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/lunge.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/lunge.html'),
  ('Good morning', 'Hamstrings', '', 'https://www.muscleandstrength.com/exercises/good-morning.html', 'Hamstrings', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/good-morning.html'),
  ('Pont fessiers', 'Glutes', '', 'https://www.muscleandstrength.com/exercises/glute-bridge.html', 'Glutes', '{}', 'ISOLATION', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/glute-bridge.html'),
  ('Élévation avant', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/front-raise.html', 'Shoulders', '{}', 'ISOLATION', 'DUMBBELL', 'https://www.muscleandstrength.com/exercises/front-raise.html'),
  ('Rowing menton', 'Shoulders', '', 'https://www.muscleandstrength.com/exercises/upright-row.html', 'Shoulders', '{}', 'COMPOUND', 'BARBELL', 'https://www.muscleandstrength.com/exercises/upright-row.html'),
  ('Box jumps', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/box-jump.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/box-jump.html'),
  ('Step ups', 'Quadriceps', '', 'https://www.muscleandstrength.com/exercises/step-up.html', 'Quadriceps', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/step-up.html');

insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values
  ('Tractions', 'Dos', '', 'https://www.muscleandstrength.com/exercises/pull-up.html', 'Dos', '{}', 'COMPOUND', 'BODYWEIGHT', 'https://www.muscleandstrength.com/exercises/pull-up.html'),
  ('Écarté à la poulie vis-à-vis', 'Pectoraux', '', 'https://www.muscleandstrength.com/exercises/cable-crossover.html', 'Pectoraux', '{}', 'ISOLATION', 'CABLE', 'https://www.muscleandstrength.com/exercises/cable-crossover.html');


-- Exercices avec noms français (à utiliser dans les splits):
-- barbell-bench-press=Développé couché barre
-- incline-bench-press=Développé incliné haltères
-- push-up=Pompes
-- chest-dip=Dips
-- close-grip-bench-press=Développé couché prise serrée
-- squat=Squat barre
-- 45-degree-leg-press=Presse à cuisses
-- dumbbell-lunge=Fentes haltères
-- leg-curl=Leg curl
-- leg-extension=Extension jambes
-- standing-barbell-curl=Curl barre
-- standing-hammer-curl=Curl marteau
-- preacher-curl=Curl pupitre
-- tricep-extension=Extensions triceps
-- military-press=Développé militaire
-- dumbbell-lateral-raise=Élévation latérale
-- bent-over-dumbbell-reverse-fly=Oiseau
-- bent-over-barbell-row=Rowing barre
-- seated-row=Tirage horizontal à la poulie
-- chin-up=Traction supination
-- lat-pulldown=Tirage vertical
-- hanging-leg-raise=Lève-jambes suspendu
-- crunch=Crunch
-- plank=Gainage
-- romanian-deadlift=Soulevé de terre roumain
-- hip-thrusts=Hip thrust
-- standing-calf-raise=Mollets debout
-- jump-rope=Corde à sauter
-- leg-press=Presse à cuisses
-- deadlift=Soulevé de terre
-- stiff-leg-deadlift-aka-romanian-deadlift=RDL
-- dumbbell-bench-press=Développé couché haltères
-- dumbbell-flys=Écartés haltères
-- decline-bench-press=Développé couché décliné
-- barbell-pullover=Pullover barre
-- dumbbell-pullover=Pullover haltère
-- cable-pullover=Pullover poulie
-- cable-crossover=Crossover poulie
-- cable-crossovers=Crossover poulie
-- dip=Dips
-- tricep-dip=Dips triceps
-- weighted-chest-dip=Dips lestés
-- deep-push-ups=Pompes profondes
-- hack-squat=Hack squat
-- barbell-hack-squat=Hack squat barre
-- lunge=Fentes
-- walking-lunge=Fentes marchées
-- barbell-lunge=Fentes barre
-- bulgarian-split-squat=Bulgarian split squat
-- step-up=Step ups
-- box-jump=Box jumps
-- good-morning=Good morning
-- glute-bridge=Pont fessiers
-- cable-calf-raise=Mollets poulie
-- seated-calf-raise=Mollets assis
-- donkey-calf-raise=Mollets âne
-- cable-row=Rowing poulie
-- close-grip-pull-down=Tirage vertical prise serrée
-- pull-up=Tractions
-- wide-grip-pull-up=Tractions prise large
-- close-grip-pull-up=Tractions prise serrée
-- face-pull=Face pull
-- reverse-fly=Oiseau haltères
-- dumbbell-front-raise=Élévation avant
-- seated-military-press=Développé militaire assis
-- arnold-press=Développé Arnold
-- ez-bar-preacher-curl=Curl pupitre barre EZ
-- dumbbell-curl=Curl haltères
-- lying-tricep-extension=Extensions triceps couché
-- overhead-tricep-extension=Extensions triceps nuque
-- cable-tricep-kickback=Kickback triceps poulie
-- side-plank=Gainage latéral
-- cable-crunch=Crunch poulie
-- mountain-climber=Mountain climbers
-- mountain-climbers=Mountain climbers
-- burpee=Burpees
-- burpees=Burpees
-- jumping-jack=Jumping jacks
-- jumping-jacks=Jumping jacks
-- t-bar-row=Tirage barre au sol
-- close-grip-standing-barbell-curl=Curl barre prise serrée
-- barbell-drag-curl=Curl barre arrière
-- barbell-hammer-curl=Curl marteau barre
-- alternate-dumbbell-curl=Curl haltères alterné
-- alternate-dumbbell-flys=Écartés haltères alterné
-- alternate-lying-dumbbell-extension=Extensions triceps haltères alterné
-- seated-arnold-press=Développé Arnold
-- alternate-seated-arnold-press=Développé Arnold alterné
-- behind-neck-lat-pull-down=Tirage nuque
-- v-bar-pull-down=Tirage barre V
-- clean-press=Clean & press
-- alternate-bent-over-dumbbell-reverse-fly=Oiseau (face pull)
-- alternate-standing-hammer-curl=Curl marteau
-- standing-low-pulley-overhead-tricep-extension=Extensions triceps à la poulie
-- alternate-dumbbell-preacher-curl=Curl barre pupitre
-- weighted-hanging-knee-raise=Lève-jambes suspendu

