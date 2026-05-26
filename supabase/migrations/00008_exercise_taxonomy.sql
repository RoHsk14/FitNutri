-- Enrichir les exercices avec la taxonomie ExRx.net + vidéos Muscle & Strength
-- primary_muscle : muscle cible principal
-- synergist_muscles : muscles secondaires
-- mechanics : COMPOUND ou ISOLATION
-- equipment : BARBELL / DUMBBELL / BODYWEIGHT / CABLE / MACHINE
-- ms_video_url : lien direct vers la page Muscle & Strength

alter table fit_exercises
  add column if not exists primary_muscle text,
  add column if not exists synergist_muscles text[] default '{}',
  add column if not exists mechanics text check (mechanics in ('COMPOUND', 'ISOLATION')),
  add column if not exists equipment text,
  add column if not exists ms_video_url text;

-- Mise à jour des exercices existants
update fit_exercises set primary_muscle = 'Pectoraux', synergist_muscles = '{"Shoulders","Triceps"}', mechanics = 'COMPOUND', equipment = 'BARBELL', ms_video_url = 'https://www.muscleandstrength.com/exercises/barbell-bench-press.html' where name = 'Développé couché barre';

update fit_exercises set primary_muscle = 'Pectoraux', synergist_muscles = '{"Shoulders","Triceps"}', mechanics = 'COMPOUND', equipment = 'DUMBBELL', ms_video_url = null where name = 'Développé incliné haltères';

update fit_exercises set primary_muscle = 'Pectoraux', synergist_muscles = '{"Shoulders"}', mechanics = 'ISOLATION', equipment = 'CABLE', ms_video_url = null where name = 'Écarté à la poulie vis-à-vis';

update fit_exercises set primary_muscle = 'Pectoraux', synergist_muscles = '{"Shoulders","Triceps"}', mechanics = 'COMPOUND', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Pompes';

update fit_exercises set primary_muscle = 'Dos', synergist_muscles = '{"Biceps","Rear Delts"}', mechanics = 'COMPOUND', equipment = 'CABLE', ms_video_url = null where name = 'Tirage horizontal à la poulie';

update fit_exercises set primary_muscle = 'Dos', synergist_muscles = '{"Biceps"}', mechanics = 'COMPOUND', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Traction supination';

update fit_exercises set primary_muscle = 'Dos', synergist_muscles = '{"Biceps","Rear Delts"}', mechanics = 'COMPOUND', equipment = 'BARBELL', ms_video_url = null where name = 'Rowing barre';

update fit_exercises set primary_muscle = 'Dos', synergist_muscles = '{"Biceps"}', mechanics = 'COMPOUND', equipment = 'CABLE', ms_video_url = null where name = 'Tirage vertical (pull-down)';

update fit_exercises set primary_muscle = 'Shoulders', synergist_muscles = '{"Triceps"}', mechanics = 'COMPOUND', equipment = 'BARBELL', ms_video_url = null where name = 'Développé militaire';

update fit_exercises set primary_muscle = 'Shoulders', synergist_muscles = '{"Traps"}', mechanics = 'ISOLATION', equipment = 'DUMBBELL', ms_video_url = null where name = 'Élévation latérale';

update fit_exercises set primary_muscle = 'Rear Delts', synergist_muscles = '{"Traps","Rotator Cuff"}', mechanics = 'ISOLATION', equipment = 'CABLE', ms_video_url = null where name = 'Oiseau (face pull)';

update fit_exercises set primary_muscle = 'Quadriceps', synergist_muscles = '{"Glutes","Hamstrings","Lower Back"}', mechanics = 'COMPOUND', equipment = 'BARBELL', ms_video_url = 'https://www.muscleandstrength.com/exercises/squat.html' where name = 'Squat barre';

update fit_exercises set primary_muscle = 'Quadriceps', synergist_muscles = '{"Glutes","Hamstrings"}', mechanics = 'COMPOUND', equipment = 'MACHINE', ms_video_url = null where name = 'Presse à cuisses';

update fit_exercises set primary_muscle = 'Quadriceps', synergist_muscles = '{"Glutes","Hamstrings"}', mechanics = 'COMPOUND', equipment = 'DUMBBELL', ms_video_url = null where name = 'Fentes';

update fit_exercises set primary_muscle = 'Hamstrings', synergist_muscles = '{}', mechanics = 'ISOLATION', equipment = 'MACHINE', ms_video_url = null where name = 'Leg curl';

update fit_exercises set primary_muscle = 'Quadriceps', synergist_muscles = '{}', mechanics = 'ISOLATION', equipment = 'MACHINE', ms_video_url = null where name = 'Extension jambes';

update fit_exercises set primary_muscle = 'Biceps', synergist_muscles = '{"Forearms"}', mechanics = 'ISOLATION', equipment = 'BARBELL', ms_video_url = 'https://www.muscleandstrength.com/exercises/standing-barbell-curl.html' where name = 'Curl barre';

update fit_exercises set primary_muscle = 'Biceps', synergist_muscles = '{"Brachialis","Forearms"}', mechanics = 'ISOLATION', equipment = 'DUMBBELL', ms_video_url = null where name = 'Curl marteau';

update fit_exercises set primary_muscle = 'Triceps', synergist_muscles = '{}', mechanics = 'ISOLATION', equipment = 'CABLE', ms_video_url = null where name = 'Extensions triceps à la poulie';

update fit_exercises set primary_muscle = 'Triceps', synergist_muscles = '{"Chest","Shoulders"}', mechanics = 'COMPOUND', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Dips';

update fit_exercises set primary_muscle = 'Biceps', synergist_muscles = '{"Forearms"}', mechanics = 'ISOLATION', equipment = 'BARBELL', ms_video_url = null where name = 'Curl barre pupitre';

update fit_exercises set primary_muscle = 'Triceps', synergist_muscles = '{"Chest","Shoulders"}', mechanics = 'COMPOUND', equipment = 'BARBELL', ms_video_url = null where name = 'Développé couché prise serrée';

update fit_exercises set primary_muscle = 'Abdominaux', synergist_muscles = '{}', mechanics = 'ISOLATION', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Crunch';

update fit_exercises set primary_muscle = 'Abdominaux', synergist_muscles = '{"Hip Flexors"}', mechanics = 'ISOLATION', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Lève-jambes suspendu';

update fit_exercises set primary_muscle = 'Abdominaux', synergist_muscles = '{}', mechanics = 'ISOLATION', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Gainage';

update fit_exercises set primary_muscle = 'Cardio', synergist_muscles = '{"Core","Hip Flexors"}', mechanics = 'COMPOUND', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Mountain climbers';

update fit_exercises set primary_muscle = 'Cardio', synergist_muscles = '{"Calves","Shoulders"}', mechanics = 'COMPOUND', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Jumping jacks';

update fit_exercises set primary_muscle = 'Cardio', synergist_muscles = '{"Chest","Quadriceps","Shoulders"}', mechanics = 'COMPOUND', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Burpees';

update fit_exercises set primary_muscle = 'Cardio', synergist_muscles = '{"Calves","Shoulders"}', mechanics = 'COMPOUND', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Corde à sauter';

update fit_exercises set primary_muscle = 'Hamstrings', synergist_muscles = '{"Glutes","Lower Back"}', mechanics = 'COMPOUND', equipment = 'BARBELL', ms_video_url = 'https://www.muscleandstrength.com/exercises/romanian-deadlift' where name = 'RDL';

update fit_exercises set primary_muscle = 'Glutes', synergist_muscles = '{"Hamstrings"}', mechanics = 'ISOLATION', equipment = 'BARBELL', ms_video_url = null where name = 'Hip thrust';

update fit_exercises set primary_muscle = 'Calves', synergist_muscles = '{}', mechanics = 'ISOLATION', equipment = 'BODYWEIGHT', ms_video_url = null where name = 'Mollets debout';
