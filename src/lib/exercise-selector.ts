import type { SupabaseClient } from "@supabase/supabase-js"
import type { SessionTarget } from "./workout-splits"

export interface ExerciseRow {
  id: string
  name: string
  muscle_group: string
  description: string | null
  video_url: string | null
  image_url: string | null
  primary_muscle: string | null
  mechanics: string | null
  equipment: string | null
}

/** Sélectionne aléatoirement des exercices depuis la DB pour une cible donnée */
export async function selectExercisesForTarget(
  target: SessionTarget,
  supabase: SupabaseClient,
  options: {
    gender?: string
    excludeIds?: string[]
    limit?: number
  } = {},
): Promise<ExerciseRow[]> {
  const { gender, excludeIds = [], limit = target.count } = options

  // Essai 1 : tous les filtres
  let exercises = await queryExercises(supabase, target.primaryMuscle, {
    mechanics: target.mechanics,
    equipment: target.equipment,
  })

  // Essai 2 : fallback sans équipement
  if (exercises.length === 0 && target.equipment && target.equipment.length > 0) {
    exercises = await queryExercises(supabase, target.primaryMuscle, {
      mechanics: target.mechanics,
    })
  }

  // Essai 3 : fallback sans mécanique
  if (exercises.length === 0 && target.mechanics) {
    exercises = await queryExercises(supabase, target.primaryMuscle, {
      equipment: target.equipment,
    })
  }

  // Essai 4 : fallback complet (juste le muscle)
  if (exercises.length === 0) {
    exercises = await queryExercises(supabase, target.primaryMuscle)
  }

  // Exclure les déjà sélectionnés
  const available = exercises.filter(e => !excludeIds.includes(e.id))
  if (available.length === 0) return []

  return pickByGender(available, limit, gender)
}

async function queryExercises(
  supabase: SupabaseClient,
  primaryMuscle: string,
  filters?: { mechanics?: string; equipment?: string[] },
): Promise<ExerciseRow[]> {
  let query = supabase
    .from("fit_exercises")
    .select("id, name, muscle_group, description, video_url, image_url, primary_muscle, mechanics, equipment")
    .or(`primary_muscle.eq.${primaryMuscle},muscle_group.eq.${primaryMuscle}`)

  if (filters?.mechanics) {
    query = query.eq("mechanics", filters.mechanics)
  }
  if (filters?.equipment && filters.equipment.length > 0) {
    query = query.in("equipment", filters.equipment)
  }

  const { data } = await query
  return (data ?? []) as ExerciseRow[]
}

function pickByGender(exercises: ExerciseRow[], count: number, gender?: string): ExerciseRow[] {
  if (exercises.length === 0) return []

  const preferredNames = gender === "FEMALE"
    ? ["Hip thrust", "RDL", "Leg curl", "Fentes", "Squat barre", "Mollets debout", "Presse à cuisses"]
    : ["Développé couché barre", "Développé incliné haltères", "Curl barre", "Dips", "Rowing barre", "Squat barre"]

  const preferred = exercises.filter(e => preferredNames.includes(e.name))
  const other = exercises.filter(e => !preferredNames.includes(e.name))
  const pool = [...shuffle(preferred), ...shuffle(other)]

  return pool.slice(0, Math.min(count, pool.length))
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
