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
  FEMALE: {
    BEGINNER: {
      title: "Full Body",
      sessions: [
        {
          day: 1, label: "Full Body A",
          targets: [
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Glutes", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["CABLE"] },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 30, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 3, label: "Full Body B",
          targets: [
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["MACHINE", "BARBELL"] },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["BODYWEIGHT", "DUMBBELL"] },
            { primaryMuscle: "Dos", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND", equipment: ["BARBELL"] },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 5, label: "Full Body C",
          targets: [
            { primaryMuscle: "Glutes", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "ISOLATION", equipment: ["BARBELL"] },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Shoulders", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Biceps", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
          ],
        },
      ],
    },
    INTERMEDIATE: {
      title: "Upper / Lower (4j)",
      sessions: [
        {
          day: 1, label: "Lower A (Jambes + Fessiers)",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Quadriceps", count: 1, sets: 4, reps: 10, restSeconds: 90, mechanics: "COMPOUND" },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "ISOLATION" },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 2, label: "Upper A (Pousser)",
          targets: [
            { primaryMuscle: "Pectoraux", count: 2, sets: 4, reps: 10, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Shoulders", count: 2, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Triceps", count: 1, sets: 3, reps: 12, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 4, label: "Lower B (Jambes + Fessiers)",
          targets: [
            { primaryMuscle: "Hamstrings", count: 1, sets: 4, reps: 12, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Quadriceps", count: 3, sets: 3, reps: 12, restSeconds: 90 },
            { primaryMuscle: "Abdominaux", count: 2, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
        {
          day: 5, label: "Upper B (Tirer)",
          targets: [
            { primaryMuscle: "Dos", count: 3, sets: 4, reps: 10, restSeconds: 60 },
            { primaryMuscle: "Biceps", count: 1, sets: 3, reps: 12, restSeconds: 45, mechanics: "ISOLATION" },
            { primaryMuscle: "Rear Delts", count: 1, sets: 3, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
          ],
        },
      ],
    },
    ADVANCED: {
      title: "Split Jambes / Haut du corps",
      sessions: [
        {
          day: 1, label: "Jambes Lourdes",
          targets: [
            { primaryMuscle: "Glutes", count: 1, sets: 4, reps: 8, restSeconds: 90 },
            { primaryMuscle: "Quadriceps", count: 2, sets: 4, reps: 10, restSeconds: 90 },
            { primaryMuscle: "Hamstrings", count: 1, sets: 3, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Calves", count: 1, sets: 4, reps: 15, restSeconds: 45, mechanics: "ISOLATION" },
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
          day: 3, label: "Fessiers + Cardio",
          targets: [
            { primaryMuscle: "Glutes", count: 2, sets: 4, reps: 12, restSeconds: 60 },
            { primaryMuscle: "Cardio", count: 3, sets: 3, reps: 20, restSeconds: 30 },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 30, restSeconds: 30 },
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
          day: 6, label: "Full Body + Cardio",
          targets: [
            { primaryMuscle: "Cardio", count: 3, sets: 3, reps: 20, restSeconds: 30 },
            { primaryMuscle: "Pectoraux", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND", equipment: ["BODYWEIGHT"] },
            { primaryMuscle: "Quadriceps", count: 1, sets: 3, reps: 12, restSeconds: 60, mechanics: "COMPOUND" },
            { primaryMuscle: "Rear Delts", count: 1, sets: 3, reps: 15, restSeconds: 45 },
            { primaryMuscle: "Abdominaux", count: 1, sets: 3, reps: 30, restSeconds: 30 },
          ],
        },
      ],
    },
  },
}

export function getWorkoutSplit(gender: string, level: string): WorkoutSplitTemplate | undefined {
  const byGender = GENDER_SPLITS[gender]
  if (!byGender) return GENDER_SPLITS["MALE"]?.[level]
  return byGender[level] ?? GENDER_SPLITS["MALE"]?.[level]
}

export function getSessionsPerWeek(activityLevel: string, gender: string): number {
  let level: string = "BEGINNER"
  if (activityLevel === "LIGHT" || activityLevel === "MODERATE") level = "INTERMEDIATE"
  if (activityLevel === "ACTIVE" || activityLevel === "VERY_ACTIVE") level = "ADVANCED"
  const split = getWorkoutSplit(gender, level)
  return split?.sessions.filter(s => s.targets.length > 0).length ?? 3
}

export { GENDER_SPLITS }
