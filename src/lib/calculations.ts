import type { OnboardingData, MacroResult } from "./types"

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
} as const

/** Calcule le BMR via Harris-Benedict (révisée, 1984) */
function calculateBMR(
  gender: string,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (gender === "MALE") {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age
}

/** Calcule le TDEE en multipliant le BMR par le coefficient d'activité */
function calculateTDEE(bmr: number, activityLevel: string): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel])
}

/** Détermine l'apport calorique cible selon l'objectif */
function getCalorieTarget(tdee: number, goal: string, gender: string): number {
  switch (goal) {
    case "LOSE_FAT":
      return gender === "FEMALE"
        ? tdee - 400  // déficit plus modéré pour les femmes (métabolisme adaptatif)
        : tdee - 500
    case "GAIN_MUSCLE":
      return gender === "FEMALE"
        ? tdee + 200  // surplus plus modéré pour limiter le gras
        : tdee + 300
    default:
      return tdee
  }
}

/** Calcule la répartition des macros selon le genre, l'objectif et le poids */
function calculateMacros(
  targetCalories: number,
  weightKg: number,
  goal: string,
  gender: string,
): { proteinG: number; fatG: number; carbsG: number } {
  let proteinG: number
  let fatG: number

  // Les femmes ont besoin de plus de lipides (santé hormonale) et légèrement moins de protéines/kg
  const proteinFactor = gender === "FEMALE" ? 0.9 : 1.0
  const fatRatio = gender === "FEMALE" ? 0.30 : 0.25

  switch (goal) {
    case "LOSE_FAT":
      proteinG = Math.round(2.2 * weightKg * proteinFactor)
      fatG = Math.round((fatRatio * targetCalories) / 9)
      break
    case "GAIN_MUSCLE":
      proteinG = Math.round(2.0 * weightKg * proteinFactor)
      fatG = Math.round((fatRatio * targetCalories) / 9)
      break
    default:
      proteinG = Math.round(1.6 * weightKg * proteinFactor)
      fatG = Math.round((fatRatio * targetCalories) / 9)
  }

  const proteinCalories = proteinG * 4
  const fatCalories = fatG * 9
  const carbsG = Math.round((targetCalories - proteinCalories - fatCalories) / 4)

  return { proteinG, fatG, carbsG: Math.max(carbsG, 0) }
}

/** Recommandation d'eau journalière selon le genre */
export function getWaterRecommendation(gender: string): number {
  return gender === "MALE" ? 2500 : 2000
}

/** Calcule l'IMC et la catégorie */
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } {
  const heightM = heightCm / 100
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10
  let category: string
  if (bmi < 18.5) category = "Insuffisance pondérale"
  else if (bmi < 25) category = "Corpulence normale"
  else if (bmi < 30) category = "Surpoids"
  else category = "Obésité"
  return { bmi, category }
}

/** Estime la durée (en semaines) pour atteindre l'objectif selon le profil */
export function estimateDuration(params: {
  gender: string
  goal: string
  currentWeightKg: number
  heightCm?: number
  age?: number
  targetWeightKg?: number | null
  activityLevel: string
  workoutSessionsPerWeek?: number
  mealsPerDay?: number
  dietaryRestrictions?: string[]
  goalDescription?: string
}): { weeks: number; label: string; detail: string; score: number } {
  const {
    gender, goal, currentWeightKg, heightCm, age, targetWeightKg,
    activityLevel, workoutSessionsPerWeek, mealsPerDay,
  } = params

  if (goal === "MAINTENANCE") return { weeks: 0, label: "Maintien", detail: "Objectif de remise en forme", score: 0 }
  if (!targetWeightKg || targetWeightKg <= 0) return { weeks: 0, label: "Non estimé", detail: "Aucun poids cible renseigné", score: 0 }

  const diff = Math.abs(currentWeightKg - targetWeightKg)
  if (diff < 0.5) return { weeks: 0, label: "Atteint", detail: "Vous êtes déjà à votre poids cible", score: 100 }

  // ── TAUX DE BASE (kg/semaine) selon le genre et l'objectif ──
  // Ce sont des rythmes réalistes pour quelqu'un de modérément actif avec 3 repas/jour
  const baseRates: Record<string, Record<string, number>> = {
    MALE:   { LOSE_FAT: 0.7, GAIN_MUSCLE: 0.35 },
    FEMALE: { LOSE_FAT: 0.55, GAIN_MUSCLE: 0.25 },
  }
  const baseRate = baseRates[gender]?.[goal] ?? 0.4

  // Semaines de base
  let weeks = diff / baseRate

  // ── MULTIPLICATEURS (chaque variable ajuste la durée, pas de limite) ──

  // Activité physique (impact FORT : sédentaire ×2, très actif ÷2)
  const activityMult: Record<string, number> = {
    SEDENTARY: 2.0, LIGHT: 1.5, MODERATE: 1.0, ACTIVE: 0.7, VERY_ACTIVE: 0.5,
  }
  weeks *= activityMult[activityLevel] ?? 1.0

  // Séances / semaine (0 séance = 30% plus long, 6 séances = 35% plus court)
  const sessions = workoutSessionsPerWeek ?? 3
  const sessionMult = Math.max(0.65, Math.min(1.3, 1.15 - (sessions - 2) * 0.08))
  weeks *= sessionMult

  // Repas / jour (fréquence = meilleur équilibre métabolique)
  const meals = mealsPerDay ?? 3
  const mealMult = Math.max(0.8, Math.min(1.2, 1.06 - (meals - 3) * 0.03))
  weeks *= mealMult

  // Âge (moins de 25 = plus rapide, plus de 50 = plus lent)
  const ageNum = age ?? 30
  if (ageNum < 25) weeks *= 0.85
  else if (ageNum < 35) weeks *= 1.0
  else if (ageNum < 45) weeks *= 1.15
  else if (ageNum < 55) weeks *= 1.3
  else weeks *= 1.5

  // IMC (surpoids = perte rapide au début, poids bas = prise facile)
  if (heightCm && heightCm > 0) {
    const heightM = heightCm / 100
    const bmi = currentWeightKg / (heightM * heightM)
    if (goal === "LOSE_FAT") {
      if (bmi > 30) weeks *= 0.7      // obésité → perte rapide au début
      else if (bmi > 25) weeks *= 0.85 // surpoids → perte modérée
    } else {
      if (bmi < 20) weeks *= 0.75     // mince → prise facile
      else if (bmi < 24) weeks *= 0.9
    }
  }

  // Arrondi
  weeks = Math.round(weeks)

  // Score de confiance (0-100) : à quel point l'estimation est fiable
  const hasTarget = targetWeightKg != null && targetWeightKg > 0
  const hasHeight = !!heightCm && heightCm > 0
  const confidence = (hasTarget ? 25 : 0) + (hasHeight ? 15 : 0) + (activityLevel ? 15 : 0)
    + (sessions > 0 ? 15 : 0) + (meals > 0 ? 10 : 0) + (ageNum > 0 ? 10 : 0)
    + (goal !== "MAINTENANCE" ? 10 : 0)

  const { label, detail } = formatWeeks(weeks, diff, confidence, gender, goal)
  return { weeks, label, detail, score: Math.min(confidence, 100) }
}

function formatWeeks(
  weeks: number, diffKg: number, confidence: number, gender: string, goal: string,
): { label: string; detail: string } {
  const detail = `${diffKg.toFixed(1)} kg d'écart · estimation fiable à ${confidence}%`

  if (weeks <= 2) return { label: "2 semaines", detail }
  if (weeks <= 3) return { label: "3 semaines", detail }
  if (weeks <= 4) return { label: "1 mois", detail }
  if (weeks <= 6) return { label: "1 mois et demi", detail }
  if (weeks <= 8) return { label: "2 mois", detail }
  if (weeks <= 10) return { label: "2 mois et demi", detail }
  if (weeks <= 12) return { label: "3 mois", detail }
  if (weeks <= 14) return { label: "3 mois et demi", detail }
  if (weeks <= 16) return { label: "4 mois", detail }
  if (weeks <= 18) return { label: "4 mois et demi", detail }
  if (weeks <= 20) return { label: "5 mois", detail }
  if (weeks <= 22) return { label: "5 mois et demi", detail }
  if (weeks <= 24) return { label: "6 mois", detail }
  if (weeks <= 26) return { label: "6 mois et demi", detail }
  if (weeks <= 28) return { label: "7 mois", detail }
  if (weeks <= 30) return { label: "7 mois et demi", detail }
  if (weeks <= 32) return { label: "8 mois", detail }
  if (weeks <= 34) return { label: "8 mois et demi", detail }
  if (weeks <= 36) return { label: "9 mois", detail }
  if (weeks <= 39) return { label: "9 mois et demi", detail }
  if (weeks <= 42) return { label: "10 mois", detail }
  if (weeks <= 45) return { label: "10 mois et demi", detail }
  if (weeks <= 48) return { label: "11 mois", detail }
  if (weeks <= 52) return { label: "1 an", detail }
  if (weeks <= 56) return { label: "1 an et 1 mois", detail }
  if (weeks <= 60) return { label: "1 an et 2 mois", detail }
  if (weeks <= 64) return { label: "1 an et 3 mois", detail }
  if (weeks <= 68) return { label: "1 an et 4 mois", detail }
  if (weeks <= 72) return { label: "1 an et 5 mois", detail }
  if (weeks <= 76) return { label: "1 an et 6 mois", detail }
  if (weeks <= 80) return { label: "1 an et 7 mois", detail }
  if (weeks <= 84) return { label: "1 an et 8 mois", detail }
  if (weeks <= 88) return { label: "1 an et 9 mois", detail }
  if (weeks <= 92) return { label: "1 an et 10 mois", detail }
  if (weeks <= 96) return { label: "1 an et 11 mois", detail }
  if (weeks <= 104) return { label: "2 ans", detail }
  if (weeks <= 112) return { label: "2 ans et 2 mois", detail }
  if (weeks <= 120) return { label: "2 ans et 4 mois", detail }
  if (weeks <= 128) return { label: "2 ans et 6 mois", detail }
  if (weeks <= 136) return { label: "2 ans et 8 mois", detail }
  if (weeks <= 144) return { label: "2 ans et 10 mois", detail }
  return { label: "3 ans et plus", detail }
}

/** Fonction principale : calcule BMR → TDEE → calories cibles → macros */
export function calculateNutrition(data: OnboardingData): MacroResult {
  const bmr = Math.round(calculateBMR(data.gender, data.weightKg, data.heightCm, data.age))
  const tdee = calculateTDEE(bmr, data.activityLevel)
  const targetCalories = getCalorieTarget(tdee, data.goal, data.gender)
  const macros = calculateMacros(targetCalories, data.weightKg, data.goal, data.gender)

  return { bmr, tdee, targetCalories, ...macros }
}
