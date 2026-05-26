-- Remplacer les vidéos YouTube par les URLs Muscle & Strength comme source prioritaire
-- ms_video_url devient la source vidéo principale, video_url reste en fallback
-- Ces lignes complètent celles déjà définies dans 00008

-- Haut du corps
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/push-up.html' where name = 'Pompes';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/incline-bench-press.html' where name = 'Développé incliné haltères';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/military-press.html' where name = 'Développé militaire';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/close-grip-bench-press.html' where name = 'Développé couché prise serrée';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/chin-up.html' where name = 'Traction supination';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/seated-row.html' where name = 'Tirage horizontal à la poulie';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html' where name = 'Rowing barre';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/standing-hammer-curl.html' where name = 'Curl marteau';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/preacher-curl.html' where name = 'Curl barre pupitre';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/tricep-extension.html' where name = 'Extensions triceps à la poulie';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/chest-dip.html' where name = 'Dips';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html' where name = 'Élévation latérale';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/bent-over-dumbbell-reverse-fly.html' where name = 'Oiseau (face pull)';

-- Jambes
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/leg-curl.html' where name = 'Leg curl';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/leg-extension.html' where name = 'Extension jambes';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/45-degree-leg-press.html' where name = 'Presse à cuisses';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/dumbbell-lunge.html' where name = 'Fentes';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/hanging-leg-raise.html' where name = 'Lève-jambes suspendu';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/hip-thrusts.html' where name = 'Hip thrust';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/standing-calf-raise.html' where name = 'Mollets debout';
update fit_exercises set ms_video_url = 'https://www.muscleandstrength.com/exercises/jump-rope.html' where name = 'Corde à sauter';
