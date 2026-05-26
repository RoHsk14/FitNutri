// Build comprehensive exercise DB from M&S category data - v2 with smarter inference
import { readFileSync, writeFileSync } from 'fs';

const lines = readFileSync('/tmp/ms_exercise_categories.txt', 'utf-8').split('\n').filter(Boolean);
const exerciseMap = new Map();
for (const line of lines) {
  const [slug, muscle] = line.split('|');
  if (!exerciseMap.has(slug)) exerciseMap.set(slug, new Set());
  exerciseMap.get(slug).add(muscle);
}

// Manual equipment overrides for specific exercises
const EQUIPMENT_OVERRIDES = {
  'squat': 'BARBELL',
  'close-grip-bench-press': 'BARBELL',
  'barbell-bench-press': 'BARBELL',
  'bench-pushups': 'BODYWEIGHT',
  'dumbbell-bench-press': 'DUMBBELL',
  'dumbbell-flys': 'DUMBBELL',
  'incline-bench-press': 'BARBELL',
  'decline-bench-press': 'BARBELL',
  'military-press': 'BARBELL',
  'standing-barbell-curl': 'BARBELL',
  'preacher-curl': 'BARBELL',
  'ez-bar-preacher-curl': 'BARBELL',
  'tricep-extension': 'CABLE',
  'lying-tricep-extension': 'BARBELL',
  'overhead-tricep-extension': 'DUMBBELL',
  'leg-press': 'MACHINE',
  '45-degree-leg-press': 'MACHINE',
  'leg-curl': 'MACHINE',
  'leg-extension': 'MACHINE',
  'standing-calf-raise': 'MACHINE',
  'seated-calf-raise': 'MACHINE',
  'hip-thrusts': 'BARBELL',
  'romanian-deadlift': 'BARBELL',
  'stiff-leg-deadlift-aka-romanian-deadlift': 'BARBELL',
  'barbell-hack-squat': 'BARBELL',
  'hack-squat': 'MACHINE',
  'push-up': 'BODYWEIGHT',
  'close-grip-pull-down': 'CABLE',
  'lat-pulldown': 'CABLE',
  'seated-row': 'CABLE',
  'cable-crossover': 'CABLE',
  'cable-crossovers': 'CABLE',
  'face-pull': 'CABLE',
  'dumbbell-lateral-raise': 'DUMBBELL',
  'dumbbell-front-raise': 'DUMBBELL',
  'bent-over-dumbbell-reverse-fly': 'DUMBBELL',
};

// Infer equipment from exercise name keywords
function inferEquipment(slug, name) {
  if (EQUIPMENT_OVERRIDES[slug]) return EQUIPMENT_OVERRIDES[slug];
  const lower = slug.toLowerCase() + ' ' + name.toLowerCase();
  if (lower.includes('barbell') || lower.includes('ez-bar') || lower.includes('ez bar') || lower.includes('ezbar')) return 'BARBELL';
  if (lower.includes('dumbbell') || lower.includes('db ')) return 'DUMBBELL';
  if (lower.includes('cable')) return 'CABLE';
  if (lower.includes('machine') || lower.includes('pec-dec') || lower.includes('pec dec') || lower.includes('press') && lower.includes('45')) return 'MACHINE';
  return 'BODYWEIGHT';
}

// Infer mechanics based on name and primary muscle
function inferMechanics(name, primaryMuscle) {
  const lower = name.toLowerCase();
  const ISOLATION_KEYWORDS = ['curl', 'extension', 'fly', 'raise', 'kickback', 'crunch', 'leg-raise', 'leg raise', 'calf', 'tricep', 'bicep', 'isolation'];
  const COMPOUND_KEYWORDS = ['press', 'squat', 'deadlift', 'row', 'pull', 'push', 'clean', 'snatch', 'bench', 'dip', 'lunge', 'thrust', 'pullover', 'chin-up', 'pull-up', 'push-up'];
  
  // If name clearly indicates isolation
  if (ISOLATION_KEYWORDS.some(k => lower.includes(k)) && !COMPOUND_KEYWORDS.some(k => lower.includes(k))) {
    return 'ISOLATION';
  }
  
  // If primary muscle is typically isolation
  if (['Biceps', 'Triceps', 'Calves', 'Abdominaux'].includes(primaryMuscle) && !COMPOUND_KEYWORDS.some(k => lower.includes(k))) {
    return 'ISOLATION';
  }
  
  return 'COMPOUND';
}

function slugToName(slug) {
  const clean = slug.replace('/exercises/', '').replace('.html', '');
  return clean.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Map English slugs to French names for our existing exercises
// Exercices manuels qui ne sont pas tagués par catégorie musculaire sur M&S
// Ce sont des exercices populaires qui existent sur M&S mais ne figurent dans
// aucune page de catégorie musculaire (chest, back, etc.)
const MANUAL_EXERCISES = [
  { slug: 'barbell-bench-press', name: 'Barbell Bench Press', nameFrench: 'Développé couché barre', primaryMuscle: 'Pectoraux', equipment: 'BARBELL', mechanics: 'COMPOUND' },
  { slug: 'push-up', name: 'Push Up', nameFrench: 'Pompes', primaryMuscle: 'Pectoraux', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'squat', name: 'Squat', nameFrench: 'Squat barre', primaryMuscle: 'Quadriceps', equipment: 'BARBELL', mechanics: 'COMPOUND' },
  { slug: 'deadlift', name: 'Deadlift', nameFrench: 'Soulevé de terre', primaryMuscle: 'Hamstrings', equipment: 'BARBELL', mechanics: 'COMPOUND' },
  { slug: 'romanian-deadlift', name: 'Romanian Deadlift', nameFrench: 'RDL', primaryMuscle: 'Hamstrings', equipment: 'BARBELL', mechanics: 'COMPOUND' },
  { slug: 'leg-curl', name: 'Leg Curl', nameFrench: 'Leg curl', primaryMuscle: 'Hamstrings', equipment: 'MACHINE', mechanics: 'ISOLATION' },
  { slug: 'leg-extension', name: 'Leg Extension', nameFrench: 'Extension jambes', primaryMuscle: 'Quadriceps', equipment: 'MACHINE', mechanics: 'ISOLATION' },
  { slug: 'lat-pulldown', name: 'Lat Pulldown', nameFrench: 'Tirage vertical (pull-down)', primaryMuscle: 'Dos', equipment: 'CABLE', mechanics: 'COMPOUND' },
  { slug: 'crunch', name: 'Crunch', nameFrench: 'Crunch', primaryMuscle: 'Abdominaux', equipment: 'BODYWEIGHT', mechanics: 'ISOLATION' },
  { slug: 'plank', name: 'Plank', nameFrench: 'Gainage', primaryMuscle: 'Abdominaux', equipment: 'BODYWEIGHT', mechanics: 'ISOLATION' },
  { slug: 'jump-rope', name: 'Jump Rope', nameFrench: 'Corde à sauter', primaryMuscle: 'Cardio', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'mountain-climbers', name: 'Mountain Climbers', nameFrench: 'Mountain climbers', primaryMuscle: 'Cardio', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'jumping-jacks', name: 'Jumping Jacks', nameFrench: 'Jumping jacks', primaryMuscle: 'Cardio', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'burpees', name: 'Burpees', nameFrench: 'Burpees', primaryMuscle: 'Cardio', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'dips', name: 'Dips', nameFrench: 'Dips', primaryMuscle: 'Pectoraux', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'standing-calf-raise', name: 'Standing Calf Raise', nameFrench: 'Mollets debout', primaryMuscle: 'Calves', equipment: 'MACHINE', mechanics: 'ISOLATION' },
  { slug: 'lunge', name: 'Lunge', nameFrench: 'Fentes', primaryMuscle: 'Quadriceps', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'good-morning', name: 'Good Morning', nameFrench: 'Good morning', primaryMuscle: 'Hamstrings', equipment: 'BARBELL', mechanics: 'COMPOUND' },
  { slug: 'glute-bridge', name: 'Glute Bridge', nameFrench: 'Pont fessiers', primaryMuscle: 'Glutes', equipment: 'BODYWEIGHT', mechanics: 'ISOLATION' },
  { slug: 'front-raise', name: 'Front Raise', nameFrench: 'Élévation avant', primaryMuscle: 'Shoulders', equipment: 'DUMBBELL', mechanics: 'ISOLATION' },
  { slug: 'upright-row', name: 'Upright Row', nameFrench: 'Rowing menton', primaryMuscle: 'Shoulders', equipment: 'BARBELL', mechanics: 'COMPOUND' },
  { slug: 'box-jump', name: 'Box Jump', nameFrench: 'Box jumps', primaryMuscle: 'Quadriceps', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'step-up', name: 'Step Up', nameFrench: 'Step ups', primaryMuscle: 'Quadriceps', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'pull-up', name: 'Pull Up', nameFrench: 'Tractions', primaryMuscle: 'Dos', equipment: 'BODYWEIGHT', mechanics: 'COMPOUND' },
  { slug: 'cable-crossover', name: 'Cable Crossover', nameFrench: 'Écarté à la poulie vis-à-vis', primaryMuscle: 'Pectoraux', equipment: 'CABLE', mechanics: 'ISOLATION' },
];

// Manual muscle overrides for exercises M&S miscategorizes
const MUSCLE_OVERRIDES = {
  'bent-over-barbell-row': 'Dos',
  'close-grip-bench-press': 'Triceps',
  'close-grip-chest-press': 'Triceps',
  'dumbbell-deadlift': 'Hamstrings',
  'tricep-dip': 'Triceps',
  'chest-dip': 'Pectoraux',
  'weighted-chest-dip': 'Pectoraux',
  'dip': 'Pectoraux',
  'pull-up': 'Dos',
  'chin-up': 'Dos',
  'close-grip-pull-up': 'Dos',
  'wide-grip-pull-up': 'Dos',
  'cable-pullover': 'Dos',
  'dumbbell-pullover': 'Pectoraux',
  'barbell-pullover': 'Pectoraux',
  'barbell-pullover-and-press': 'Pectoraux',
  'lunge': 'Quadriceps',
  'dumbbell-lunge': 'Quadriceps',
  'walking-lunge': 'Quadriceps',
  'barbell-lunge': 'Quadriceps',
  'reverse-lunge': 'Quadriceps',
  'side-lunge': 'Quadriceps',
  'bulgarian-split-squat': 'Quadriceps',
  'box-jump': 'Quadriceps',
  'step-up': 'Quadriceps',
  'barbell-step-ups': 'Quadriceps',
  'glute-bridge': 'Glutes',
  'hip-thrusts': 'Glutes',
  'romanian-deadlift': 'Hamstrings',
  'dumbbell-lateral-raise': 'Shoulders',
  'alternate-dumbbell-lateral-raise': 'Shoulders',
  'military-press': 'Shoulders',
  'seated-military-press': 'Shoulders',
  'arnold-press': 'Shoulders',
  'alternate-seated-arnold-press': 'Shoulders',
  'dumbbell-front-raise': 'Shoulders',
  'alternate-seated-dumbbell-front-raise': 'Shoulders',
  'alternate-standing-dumbbell-front-raise': 'Shoulders',
  'front-raise': 'Shoulders',
  'upright-row': 'Shoulders',
  'dumbbell-upright-row': 'Shoulders',
  'barbell-upright-row': 'Shoulders',
  'stiff-leg-deadlift-aka-romanian-deadlift': 'Hamstrings',
  'deadlift': 'Hamstrings',
  'good-morning': 'Hamstrings',
  'crunch': 'Abdominaux',
  'plank': 'Abdominaux',
  'side-plank': 'Abdominaux',
  'cable-crunch': 'Abdominaux',
  'hanging-leg-raise': 'Abdominaux',
  'mountain-climber': 'Abdominaux',
  'mountain-climbers': 'Abdominaux',
  'burpee': 'Cardio',
  'burpees': 'Cardio',
  'jumping-jack': 'Cardio',
  'jumping-jacks': 'Cardio',
  'jump-rope': 'Cardio',
  'corde-a-sauter': 'Cardio',
};

const FRENCH_NAMES = {
  'barbell-bench-press': 'Développé couché barre',
  'incline-bench-press': 'Développé incliné haltères',
  'push-up': 'Pompes',
  'chest-dip': 'Dips',
  'close-grip-bench-press': 'Développé couché prise serrée',
  'squat': 'Squat barre',
  '45-degree-leg-press': 'Presse à cuisses',
  'dumbbell-lunge': 'Fentes',
  'leg-curl': 'Leg curl',
  'leg-extension': 'Extension jambes',
  'standing-barbell-curl': 'Curl barre',
  'standing-hammer-curl': 'Curl marteau',
  'preacher-curl': 'Curl barre pupitre',
  'tricep-extension': 'Extensions triceps à la poulie',
  'military-press': 'Développé militaire',
  'dumbbell-lateral-raise': 'Élévation latérale',
  'bent-over-dumbbell-reverse-fly': 'Oiseau (face pull)',
  'bent-over-barbell-row': 'Rowing barre',
  'seated-row': 'Tirage horizontal à la poulie',
  'chin-up': 'Traction supination',
  'lat-pulldown': 'Tirage vertical (pull-down)',
  'hanging-leg-raise': 'Lève-jambes suspendu',
  'crunch': 'Crunch',
  'plank': 'Gainage',
  'romanian-deadlift': 'RDL',
  'hip-thrusts': 'Hip thrust',
  'standing-calf-raise': 'Mollets debout',
  'jump-rope': 'Corde à sauter',
  '45-degree-leg-press': 'Presse à cuisses',
  'leg-press': 'Presse à cuisses',
  'standing-hammer-curl': 'Curl marteau',
  'tricep-extension': 'Extensions triceps à la poulie',
  'preacher-curl': 'Curl barre pupitre',
  'squat': 'Squat barre',
  'barbell-bench-press': 'Développé couché barre',
  'deadlift': 'Soulevé de terre',
  'romanian-deadlift': 'RDL',
  'stiff-leg-deadlift-aka-romanian-deadlift': 'RDL',
  'dumbbell-bench-press': 'Développé couché haltères',
  'dumbbell-flys': 'Écartés haltères',
  'decline-bench-press': 'Développé couché décliné',
  'barbell-pullover': 'Pullover barre',
  'dumbbell-pullover': 'Pullover haltère',
  'cable-pullover': 'Pullover poulie',
  'cable-crossover': 'Crossover poulie',
  'cable-crossovers': 'Crossover poulie',
  'dip': 'Dips',
  'tricep-dip': 'Dips triceps',
  'weighted-chest-dip': 'Dips lestés',
  'push-up': 'Pompes',
  'deep-push-ups': 'Pompes profondes',
  'leg-press': 'Presse à cuisses',
  '45-degree-leg-press': 'Presse à cuisses 45°',
  'hack-squat': 'Hack squat',
  'barbell-hack-squat': 'Hack squat barre',
  'lunge': 'Fentes',
  'dumbbell-lunge': 'Fentes haltères',
  'walking-lunge': 'Fentes marchées',
  'barbell-lunge': 'Fentes barre',
  'bulgarian-split-squat': 'Bulgarian split squat',
  'step-up': 'Step ups',
  'box-jump': 'Box jumps',
  'romanian-deadlift': 'Soulevé de terre roumain',
  'stiff-leg-deadlift-aka-romanian-deadlift': 'RDL',
  'good-morning': 'Good morning',
  'glute-bridge': 'Pont fessiers',
  'hip-thrusts': 'Hip thrust',
  'cable-calf-raise': 'Mollets poulie',
  'seated-calf-raise': 'Mollets assis',
  'donkey-calf-raise': 'Mollets âne',
  'lat-pulldown': 'Tirage vertical',
  'seated-row': 'Rowing poulie',
  'cable-row': 'Rowing poulie',
  'close-grip-pull-down': 'Tirage vertical prise serrée',
  'pull-up': 'Tractions',
  'wide-grip-pull-up': 'Tractions prise large',
  'chin-up': 'Traction supination',
  'close-grip-pull-up': 'Tractions prise serrée',
  'face-pull': 'Face pull',
  'bent-over-dumbbell-reverse-fly': 'Oiseau',
  'reverse-fly': 'Oiseau haltères',
  'dumbbell-lateral-raise': 'Élévation latérale',
  'dumbbell-front-raise': 'Élévation avant',
  'military-press': 'Développé militaire',
  'seated-military-press': 'Développé militaire assis',
  'arnold-press': 'Développé Arnold',
  'standing-barbell-curl': 'Curl barre',
  'preacher-curl': 'Curl pupitre',
  'ez-bar-preacher-curl': 'Curl pupitre barre EZ',
  'dumbbell-curl': 'Curl haltères',
  'standing-hammer-curl': 'Curl marteau',
  'tricep-extension': 'Extensions triceps',
  'lying-tricep-extension': 'Extensions triceps couché',
  'overhead-tricep-extension': 'Extensions triceps nuque',
  'cable-tricep-kickback': 'Kickback triceps poulie',
  'crunch': 'Crunch',
  'hanging-leg-raise': 'Lève-jambes suspendu',
  'plank': 'Gainage',
  'side-plank': 'Gainage latéral',
  'cable-crunch': 'Crunch poulie',
  'mountain-climber': 'Mountain climbers',
  'mountain-climbers': 'Mountain climbers',
  'burpee': 'Burpees',
  'burpees': 'Burpees',
  'jumping-jack': 'Jumping jacks',
  'jumping-jacks': 'Jumping jacks',
  'bent-over-barbell-row': 'Rowing barre',
  't-bar-row': 'Tirage barre au sol',
  'close-grip-standing-barbell-curl': 'Curl barre prise serrée',
  'barbell-drag-curl': 'Curl barre arrière',
  'barbell-hammer-curl': 'Curl marteau barre',
  'alternate-dumbbell-curl': 'Curl haltères alterné',
  'alternate-dumbbell-flys': 'Écartés haltères alterné',
  'alternate-lying-dumbbell-extension': 'Extensions triceps haltères alterné',
  'seated-arnold-press': 'Développé Arnold',
  'alternate-seated-arnold-press': 'Développé Arnold alterné',
  'behind-neck-lat-pull-down': 'Tirage nuque',
  'v-bar-pull-down': 'Tirage barre V',
  'clean-press': 'Clean & press',
  'seated-row': 'Tirage horizontal à la poulie',
  '45-degree-leg-press': 'Presse à cuisses',
  'alternate-bent-over-dumbbell-reverse-fly': 'Oiseau (face pull)',
  'alternate-standing-hammer-curl': 'Curl marteau',
  'standing-low-pulley-overhead-tricep-extension': 'Extensions triceps à la poulie',
  'alternate-dumbbell-preacher-curl': 'Curl barre pupitre',
  'weighted-hanging-knee-raise': 'Lève-jambes suspendu',
};

const EXERCISE_TYPE_MAP = {
  'Strength': 'STRENGTH',
  'Cardio': 'CARDIO',
};

console.error('Building exercise database v2...');

const seen = new Set();
const exercises = [];

for (const [slug, muscles] of exerciseMap) {
  const slugClean = slug.replace('/exercises/', '').replace('.html', '');
  const key = slugClean.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  
  let primaryMuscle = MUSCLE_OVERRIDES[slugClean] || [...muscles][0];
  // Prioritize Dos over other muscle groups for back exercises
  if (muscles.has('Dos') && primaryMuscle !== 'Dos' && !MUSCLE_OVERRIDES[slugClean]) {
    primaryMuscle = 'Dos';
  }
  const name = slugToName(slug);
  const equipment = inferEquipment(slugClean, name);
  const mechanics = inferMechanics(name, primaryMuscle);
  const pageUrl = `https://www.muscleandstrength.com/exercises/${slugClean}.html`;
  
  exercises.push({
    slug: slugClean,
    name,
    nameFrench: FRENCH_NAMES[slugClean] || null,
    primaryMuscle,
    synergistMuscles: [],
    mechanics,
    equipment,
    exerciseType: 'STRENGTH',
    msVideoUrl: pageUrl,
  });
}

// Add manual exercises (those missing from M&S category pages)
for (const m of MANUAL_EXERCISES) {
  if (!seen.has(m.slug)) {
    seen.add(m.slug);
    exercises.push({
      slug: m.slug,
      name: m.name,
      nameFrench: m.nameFrench,
      primaryMuscle: m.primaryMuscle,
      synergistMuscles: [],
      mechanics: m.mechanics,
      equipment: m.equipment,
      exerciseType: 'STRENGTH',
      msVideoUrl: `https://www.muscleandstrength.com/exercises/${m.slug}.html`,
    });
  }
}

console.error(`Total exercises: ${exercises.length}`);
console.error(`With French names: ${exercises.filter(e => e.nameFrench).length}`);

// Organize by muscle group for stats
const byMuscle = {};
for (const ex of exercises) {
  byMuscle[ex.primaryMuscle] = (byMuscle[ex.primaryMuscle] || 0) + 1;
}
for (const [m, c] of Object.entries(byMuscle).sort((a, b) => b[1] - a[1])) {
  console.error(`  ${m}: ${c}`);
}

// Generate SQL - DELETE + fresh insert
let sql = `-- Migration 00010: Catalogue complet des exercices depuis Muscle & Strength
-- Généré le ${new Date().toISOString().split('T')[0]}
-- Source: ${exercises.length} exercices classés par groupe musculaire

-- Supprime les anciennes sessions et exercices
delete from fit_workout_sessions;
delete from fit_workout_plans;
delete from fit_exercises;

`;

function sanitize(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

const BATCH = 50;
for (let i = 0; i < exercises.length; i += BATCH) {
  const batch = exercises.slice(i, i + BATCH);
  sql += `insert into fit_exercises (name, muscle_group, description, video_url, primary_muscle, synergist_muscles, mechanics, equipment, ms_video_url) values\n`;
  const rows = batch.map(ex => {
    const syn = ex.synergistMuscles.length > 0
      ? `'{${ex.synergistMuscles.map(s => `"${s}"`).join(',')}}'`
      : `'{}'`;
    const name = sanitize(ex.nameFrench || ex.name);
    const muscleGroup = sanitize(ex.primaryMuscle);
    const desc = "''";
    const video = sanitize(ex.msVideoUrl);
    return `  (${name}, ${muscleGroup}, ${desc}, ${video}, ${muscleGroup}, ${syn}, ${sanitize(ex.mechanics)}, ${sanitize(eq.equipment)}, ${video})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// Add French name aliases as a comment at the end
sql += `\n-- Exercices avec noms français (à utiliser dans les splits):\n`;
sql += `-- ${Object.entries(FRENCH_NAMES).map(([slug, name]) => `${slug}=${name}`).join('\n-- ')}

`;

writeFileSync('supabase/migrations/00010_ms_exercises_complete.sql', sql);
console.error(`Wrote supabase/migrations/00010_ms_exercises_complete.sql (${(sql.length / 1024).toFixed(0)} KB)`);

// Also save JSON
writeFileSync('tmp/ms_exercises_db_v2.json', JSON.stringify(exercises, null, 2));
console.error(`Wrote tmp/ms_exercises_db_v2.json`);
