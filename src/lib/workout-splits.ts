export interface SessionTarget {
  primaryMuscle: string
  count: number
  sets: number
  reps: number
  restSeconds: number
  mechanics?: "COMPOUND" | "ISOLATION"
  equipment?: string[]
}

export interface WorkoutSplitTemplate {
  title: string
  sessions: {
    day: number
    label: string
    targets: SessionTarget[]
  }[]
}

const GENDER_SPLITS: Record<string, Record<string, WorkoutSplitTemplate>> = {
  MALE: {
    BEGINNER: {
      title: "Full Body",
      sessions: [
        {
          day: 1, label: "Full Body A",
          targets: [
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["BARBELL", "DUMBBELL"] },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["BARBELL", "CABLE"] },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Shoulders", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Biceps", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 3, label: "Full Body B",
          targets: [
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["BODYWEIGHT", "BARBELL"] },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["BODYWEIGHT", "CABLE"] },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["MACHINE", "BARBELL"] },
            { primaryMuscle: "Triceps", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 5, label: "Full Body C",
          targets: [
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["DUMBBELL"] },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["CABLE", "BARBELL"] },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["DUMBBELL", "BARBELL"] },
            { primaryMuscle: "Biceps", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION", equipment: ["DUMBBELL"] },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 30, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
      ],
    },
    INTERMEDIATE: {
      title: "Push / Pull / Legs",
      sessions: [
        {
          day: 1, label: "Push",
          targets: [
            { primaryMuscle: "Pectoraux", count: 2, sets: 4, reps: 10, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Shoulders", count: 2, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Triceps", count: 2, sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          day: 2, label: "Pull",
          targets: [
            { primaryMuscle: "Dos", count: 3, sets: 4, reps: 10, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Biceps", count: 2, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Rear Delts", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 3, label: "Legs",
          targets: [
            { primaryMuscle: "Quadriceps", count: 3, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 4, label: "Push",
          targets: [
            { primaryMuscle: "Pectoraux", count: 2, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Shoulders", count: 2, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Triceps", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 5, label: "Pull",
          targets: [
            { primaryMuscle: "Dos", count: 2, sets: 4, reps: 10, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Biceps", count: 2, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 6, label: "Legs",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Abdominaux", count: 2, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
      ],
    },
    ADVANCED: {
      title: "Split par muscle",
      sessions: [
        {
          day: 1, label: "Pectoraux + Triceps",
          targets: [
            { primaryMuscle: "Pectoraux", count: 4, sets: 4, reps: 8, restSeconds: 60 },
            { primaryMuscle: "Triceps", count: 2, sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          day: 2, label: "Dos + Biceps",
          targets: [
            { primaryMuscle: "Dos", count: 4, sets: 4, reps: 8, restSeconds: 60 },
            { primaryMuscle: "Biceps", count: 2, sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          day: 3, label: "Épaules + Abdos",
          targets: [
            { primaryMuscle: "Shoulders", count: 3, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Abdominaux", count: 3, sets: 3, reps: 15, restSeconds: 30 },
          ],
        },
        { day: 4, label: "Repos", targets: [] },
        {
          day: 5, label: "Jambes",
          targets: [
            { primaryMuscle: "Quadriceps", count: 3, sets: 4, reps: 10, restSeconds: 90 },
            { primaryMuscle: "Hamstrings", count: 2, sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          day: 6, label: "Cardio + Full Body",
          targets: [
            { primaryMuscle: "Cardio", count: 4, sets: 3, reps: 20, restSeconds: 30 },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 30, restSeconds: 30 },
          ],
        },
      ],
    },
  },
}

const FEMALE_GOAL_SPLITS: Record<string, Record<string, WorkoutSplitTemplate>> = {
  GAIN_MUSCLE: {
    BEGINNER: {
      title: "Full Body (bas du corps prioritaire)",
      sessions: [
        {
          day: 1, label: "Full Body A - Jambes lourdes",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND", equipment: ["DUMBBELL"] },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND", equipment: ["CABLE"] },
          ],
        },
        {
          day: 3, label: "Full Body B - Fessiers + Dos",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 12, restSeconds: 90, mechanics: "ISOLATION", equipment: ["BARBELL"] },
            { primaryMuscle: "Hamstrings", count: 1, sets: 4, reps: 10, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["MACHINE"] },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 5, label: "Full Body C - Jambes + Épaules",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 1, sets: 4, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Shoulders", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Calves", count: 1, sets: 4, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
      ],
    },
    INTERMEDIATE: {
      title: "Lower / Upper (3j bas + 1j haut)",
      sessions: [
        {
          day: 1, label: "Lower A - Quadriceps + Fessiers",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 10, restSeconds: 90 },
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Calves", count: 1, sets: 4, reps: 12, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 2, label: "Haut du corps - Pousser",
          targets: [
            { primaryMuscle: "Pectoraux", count: 2, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Shoulders", count: 2, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Triceps", count: 2, sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          day: 4, label: "Lower B - Fessiers + Ischios",
          targets: [
            { primaryMuscle: "Glutes", count: 3, sets: 4, reps: 10, restSeconds: 90 },
            { primaryMuscle: "Hamstrings", count: 2, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90 },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
        {
          day: 5, label: "Lower C - Jambes complètes",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 1, sets: 4, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Calves", count: 1, sets: 4, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
      ],
    },
    ADVANCED: {
      title: "Split bas du corps (4j jambes + 2j haut)",
      sessions: [
        {
          day: 1, label: "Quadriceps + Fessiers (lourd)",
          targets: [
            { primaryMuscle: "Quadriceps", count: 3, sets: 4, reps: 8, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 10, restSeconds: 90 },
            { primaryMuscle: "Calves", count: 1, sets: 4, reps: 12, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 2, label: "Pectoraux + Épaules + Triceps",
          targets: [
            { primaryMuscle: "Pectoraux", count: 3, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Shoulders", count: 2, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Triceps", count: 1, sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          day: 3, label: "Fessiers + Ischios + Abdos",
          targets: [
            { primaryMuscle: "Glutes", count: 3, sets: 4, reps: 10, restSeconds: 90 },
            { primaryMuscle: "Hamstrings", count: 2, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Abdominaux", count: 2, sets: 3, reps: 15, restSeconds: 45 },
            { primaryMuscle: "Calves", count: 1, sets: 4, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        { day: 4, label: "Repos", targets: [] },
        {
          day: 5, label: "Dos + Biceps",
          targets: [
            { primaryMuscle: "Dos", count: 4, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Biceps", count: 2, sets: 3, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Rear Delts", count: 1, sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
        {
          day: 6, label: "Jambes (volume) + Cardio",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Cardio", count: 2, sets: 3, reps: 20, restSeconds: 30 },
          ],
        },
      ],
    },
  },

  LOSE_FAT: {
    BEGINNER: {
      title: "Full Body (jambes + cardio intégré)",
      sessions: [
        {
          day: 1, label: "Full Body A - Jambes + Cardio",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 3, reps: 15, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 1, sets: 3, reps: 15, restSeconds: 60 },
            { primaryMuscle: "Cardio", count: 1, sets: 3, reps: 30, restSeconds: 30 },
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND", equipment: ["DUMBBELL"] },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 20, restSeconds: 30, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 3, label: "Full Body B - Fessiers + Cardio",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 3, reps: 15, restSeconds: 60 },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 15, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Cardio", count: 1, sets: 3, reps: 30, restSeconds: 30 },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND", equipment: ["CABLE"] },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 20, restSeconds: 30, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 5, label: "Full Body C - Circuit",
          targets: [
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 1, sets: 3, reps: 15, restSeconds: 45 },
            { primaryMuscle: "Cardio", count: 2, sets: 3, reps: 30, restSeconds: 30 },
            { primaryMuscle: "Shoulders", count: 1, sets: 3, reps: 12, restSeconds: 45, mechanics: "COMPOUND" },
            { primaryMuscle: "Abdominaux", count: 2, sets: 3, reps: 25, restSeconds: 30, mechanics: "ISOLATION" },
          ],
        },
      ],
    },
    INTERMEDIATE: {
      title: "Upper / Lower (cardio actif)",
      sessions: [
        {
          day: 1, label: "Lower A - Brûle-graisse jambes",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 12, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 2, sets: 3, reps: 15, restSeconds: 45 },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 15, restSeconds: 45 },
            { primaryMuscle: "Cardio", count: 1, sets: 3, reps: 25, restSeconds: 30 },
          ],
        },
        {
          day: 2, label: "Upper A - Circuit haut",
          targets: [
            { primaryMuscle: "Pectoraux", count: 2, sets: 3, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Dos", count: 2, sets: 3, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Shoulders", count: 1, sets: 3, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Cardio", count: 1, sets: 3, reps: 25, restSeconds: 30 },
          ],
        },
        {
          day: 4, label: "Lower B - Fessiers actifs",
          targets: [
            { primaryMuscle: "Glutes", count: 3, sets: 3, reps: 15, restSeconds: 45 },
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Abdominaux", count: 2, sets: 3, reps: 20, restSeconds: 30 },
            { primaryMuscle: "Cardio", count: 1, sets: 3, reps: 25, restSeconds: 30 },
          ],
        },
        {
          day: 5, label: "Upper B + Cardio",
          targets: [
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Dos", count: 2, sets: 3, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Biceps", count: 1, sets: 3, reps: 12, restSeconds: 45, mechanics: "ISOLATION" },
            { primaryMuscle: "Triceps", count: 1, sets: 3, reps: 12, restSeconds: 45, mechanics: "ISOLATION" },
            { primaryMuscle: "Cardio", count: 1, sets: 3, reps: 25, restSeconds: 30 },
          ],
        },
      ],
    },
    ADVANCED: {
      title: "Split jambes + cardio haute fréquence",
      sessions: [
        {
          day: 1, label: "Jambes + Cardio HIIT",
          targets: [
            { primaryMuscle: "Quadriceps", count: 3, sets: 4, reps: 12, restSeconds: 45, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Cardio", count: 2, sets: 4, reps: 20, restSeconds: 20 },
          ],
        },
        {
          day: 2, label: "Pectoraux + Dos (superset)",
          targets: [
            { primaryMuscle: "Pectoraux", count: 3, sets: 3, reps: 12, restSeconds: 30 },
            { primaryMuscle: "Dos", count: 3, sets: 3, reps: 12, restSeconds: 30 },
            { primaryMuscle: "Abdominaux", count: 2, sets: 3, reps: 20, restSeconds: 20 },
          ],
        },
        {
          day: 3, label: "Fessiers + Ischios + Cardio",
          targets: [
            { primaryMuscle: "Glutes", count: 3, sets: 4, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Hamstrings", count: 2, sets: 4, reps: 12, restSeconds: 45 },
            { primaryMuscle: "Cardio", count: 2, sets: 4, reps: 20, restSeconds: 20 },
          ],
        },
        { day: 4, label: "Repos", targets: [] },
        {
          day: 5, label: "Épaules + Bras + Cardio",
          targets: [
            { primaryMuscle: "Shoulders", count: 3, sets: 3, reps: 12, restSeconds: 30 },
            { primaryMuscle: "Biceps", count: 2, sets: 3, reps: 12, restSeconds: 30 },
            { primaryMuscle: "Triceps", count: 2, sets: 3, reps: 12, restSeconds: 30 },
            { primaryMuscle: "Cardio", count: 1, sets: 3, reps: 25, restSeconds: 20 },
          ],
        },
        {
          day: 6, label: "Jambes volume + Abdos",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 12, restSeconds: 45, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 15, restSeconds: 45 },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 15, restSeconds: 45 },
            { primaryMuscle: "Abdominaux", count: 3, sets: 3, reps: 25, restSeconds: 20 },
          ],
        },
      ],
    },
  },

  MAINTENANCE: {
    BEGINNER: {
      title: "Full Body (jambes priorité modérée)",
      sessions: [
        {
          day: 1, label: "Full Body A",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 1, sets: 3, reps: 12, restSeconds: 90 },
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["DUMBBELL"] },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["CABLE"] },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 3, label: "Full Body B",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 3, reps: 12, restSeconds: 90 },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Shoulders", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND" },
          ],
        },
        {
          day: 5, label: "Full Body C",
          targets: [
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 1, sets: 3, reps: 12, restSeconds: 90 },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Biceps", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Calves", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
      ],
    },
    INTERMEDIATE: {
      title: "Upper / Lower (équilibré)",
      sessions: [
        {
          day: 1, label: "Lower A - Jambes + Fessiers",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 3, reps: 12, restSeconds: 90 },
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          day: 2, label: "Upper A - Pousser",
          targets: [
            { primaryMuscle: "Pectoraux", count: 2, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Shoulders", count: 2, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Triceps", count: 1, sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          day: 4, label: "Lower B - Jambes actives",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 1, sets: 3, reps: 12, restSeconds: 90 },
            { primaryMuscle: "Abdominaux", count: 2, sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
        {
          day: 5, label: "Upper B - Tirer",
          targets: [
            { primaryMuscle: "Dos", count: 3, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Biceps", count: 1, sets: 3, reps: 12, restSeconds: 45, mechanics: "ISOLATION" },
            { primaryMuscle: "Rear Delts", count: 1, sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
      ],
    },
    ADVANCED: {
      title: "Split libre (bas 60% / haut 40%)",
      sessions: [
        {
          day: 1, label: "Quadriceps + Fessiers",
          targets: [
            { primaryMuscle: "Quadriceps", count: 3, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Calves", count: 1, sets: 4, reps: 15, restSeconds: 45 },
          ],
        },
        {
          day: 2, label: "Dos + Biceps",
          targets: [
            { primaryMuscle: "Dos", count: 4, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Biceps", count: 2, sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          day: 3, label: "Fessiers + Ischios + Cardio léger",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Hamstrings", count: 2, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Cardio", count: 1, sets: 3, reps: 20, restSeconds: 45 },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
        { day: 4, label: "Repos", targets: [] },
        {
          day: 5, label: "Pectoraux + Épaules + Triceps",
          targets: [
            { primaryMuscle: "Pectoraux", count: 3, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Shoulders", count: 2, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Triceps", count: 1, sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          day: 6, label: "Jambes (volume) + Abdos",
          targets: [
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 2, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Abdominaux", count: 2, sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
      ],
    },
  },
}

export function getWorkoutSplit(gender: string, level: string, goal = "GAIN_MUSCLE"): WorkoutSplitTemplate | undefined {
  if (gender === "FEMALE") {
    const byGoal = FEMALE_GOAL_SPLITS[goal]
    if (byGoal?.[level]) return byGoal[level]
    return FEMALE_GOAL_SPLITS["GAIN_MUSCLE"]?.[level] ?? GENDER_SPLITS["MALE"]?.[level]
  }
  return GENDER_SPLITS["MALE"]?.[level]
}

export function getSessionsPerWeek(activityLevel: string, gender: string, goal = "GAIN_MUSCLE"): number {
  let level: string = "BEGINNER"
  if (activityLevel === "LIGHT" || activityLevel === "MODERATE") level = "INTERMEDIATE"
  if (activityLevel === "ACTIVE" || activityLevel === "VERY_ACTIVE") level = "ADVANCED"
  const split = getWorkoutSplit(gender, level, goal)
  return split?.sessions.filter(s => s.targets.length > 0).length ?? 3
}

export { GENDER_SPLITS, FEMALE_GOAL_SPLITS }