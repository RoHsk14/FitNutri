export interface GoalAdjustments {
  focusMuscles: string[]
  extraSets: Record<string, number>
  cardioEmphasis: number
  intensityModifier: number
}

const KEYWORD_MAP: Record<string, { muscles: string[]; sets: number }> = {
  pectoraux: { muscles: ["Pectoraux"], sets: 2 },
  torse: { muscles: ["Pectoraux"], sets: 2 },
  poitrine: { muscles: ["Pectoraux"], sets: 2 },
  chest: { muscles: ["Pectoraux"], sets: 2 },
  pecs: { muscles: ["Pectoraux"], sets: 2 },
  épaules: { muscles: ["Shoulders"], sets: 1 },
  shoulder: { muscles: ["Shoulders"], sets: 1 },
  epaules: { muscles: ["Shoulders"], sets: 1 },
  bras: { muscles: ["Biceps", "Triceps"], sets: 1 },
  biceps: { muscles: ["Biceps"], sets: 1 },
  triceps: { muscles: ["Triceps"], sets: 1 },
  dos: { muscles: ["Dos"], sets: 1 },
  dorsaux: { muscles: ["Dos"], sets: 1 },
  back: { muscles: ["Dos"], sets: 1 },
  lats: { muscles: ["Dos"], sets: 1 },
  abdominaux: { muscles: ["Abdominaux"], sets: 1 },
  abdos: { muscles: ["Abdominaux"], sets: 1 },
  abs: { muscles: ["Abdominaux"], sets: 1 },
  ventre: { muscles: ["Abdominaux"], sets: 1 },
  jambes: { muscles: ["Quadriceps", "Hamstrings", "Glutes"], sets: 1 },
  cuisses: { muscles: ["Quadriceps", "Hamstrings"], sets: 1 },
  quadriceps: { muscles: ["Quadriceps"], sets: 1 },
  mollets: { muscles: ["Calves"], sets: 1 },
  fessiers: { muscles: ["Glutes"], sets: 2 },
  fesses: { muscles: ["Glutes"], sets: 2 },
  glutes: { muscles: ["Glutes"], sets: 2 },
  "prise de masse": { muscles: ["Pectoraux", "Dos", "Quadriceps"], sets: 1 },
  force: { muscles: [], sets: 0 },
  volume: { muscles: [], sets: 0 },
  definition: { muscles: [], sets: 0 },
  seche: { muscles: [], sets: 0 },
}

const CARDIO_KEYWORDS = ["cardio", "maigrir", "perdre", "graisse", "ventre", "endurance", "souffle"]
const INTENSITY_KEYWORDS = {
  doucement: 0.7,
  progressif: 0.8,
  modéré: 0.9,
  intensif: 1.1,
  intense: 1.2,
  "très intense": 1.3,
  avancé: 1.2,
  débutant: 0.8,
}

export function analyzeGoalDescription(description: string | null | undefined): GoalAdjustments {
  const result: GoalAdjustments = {
    focusMuscles: [],
    extraSets: {},
    cardioEmphasis: 1,
    intensityModifier: 1,
  }

  if (!description) return result

  const lower = description.toLowerCase()

  // Détection des focus musculaires
  for (const [keyword, mapping] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      for (const muscle of mapping.muscles) {
        if (!result.focusMuscles.includes(muscle)) {
          result.focusMuscles.push(muscle)
        }
        result.extraSets[muscle] = Math.max(result.extraSets[muscle] ?? 0, mapping.sets)
      }
    }
  }

  // Détection du cardio
  for (const word of CARDIO_KEYWORDS) {
    if (lower.includes(word)) {
      result.cardioEmphasis = Math.max(result.cardioEmphasis, word === "ventre" ? 1.5 : 1.3)
    }
  }

  // Détection de l'intensité
  for (const [phrase, modifier] of Object.entries(INTENSITY_KEYWORDS)) {
    if (lower.includes(phrase)) {
      result.intensityModifier = modifier
    }
  }

  return result
}
