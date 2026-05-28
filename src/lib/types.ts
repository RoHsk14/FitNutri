export type Gender = "MALE" | "FEMALE"

export type Goal = "LOSE_FAT" | "GAIN_MUSCLE" | "MAINTENANCE"

export type ActivityLevel = "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | "VERY_ACTIVE"

export type WorkoutLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"

export type DietaryRestriction = "VEGAN" | "VEGETARIAN" | "GLUTEN_FREE" | "LACTOSE_FREE" | "NONE"

export interface OnboardingData {
  name: string
  age: number
  gender: Gender
  weightKg: number
  heightCm: number
  goal: Goal
  activityLevel: ActivityLevel
  mealsPerDay: number
  dietaryRestrictions: DietaryRestriction[]
  goalDescription?: string
  goalImageUrl?: string
  currentPhysiqueImageUrl?: string
  targetWeightKg?: number | null
}

export interface MacroResult {
  bmr: number
  tdee: number
  targetCalories: number
  proteinG: number
  carbsG: number
  fatG: number
}
