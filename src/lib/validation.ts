import { z } from "zod"

export const onboardingSchema = z.object({
  age: z.number().min(12, "Âge minimum : 12 ans").max(120, "Âge maximum : 120 ans"),
  gender: z.enum(["MALE", "FEMALE"]),
  weightKg: z.number().min(20, "Poids minimum : 20 kg").max(400, "Poids maximum : 400 kg"),
  heightCm: z.number().min(80, "Taille minimum : 80 cm").max(250, "Taille maximum : 250 cm"),
  goal: z.enum(["LOSE_FAT", "GAIN_MUSCLE", "MAINTENANCE"]),
  activityLevel: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"]),
  mealsPerDay: z.number().min(1).max(6),
  dietaryRestrictions: z.array(z.enum(["VEGAN", "VEGETARIAN", "GLUTEN_FREE", "LACTOSE_FREE", "NONE"])),
  goalDescription: z.string().max(500, "Description trop longue (max 500 caractères)").optional(),
  goalImageUrl: z.string().url().optional().or(z.literal("")),
  currentPhysiqueImageUrl: z.string().url().optional().or(z.literal("")),
  targetWeightKg: z.number().min(20).max(400).nullable().optional(),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

export const weightLogSchema = z.object({
  weightKg: z.number().min(20, "Poids minimum : 20 kg").max(400, "Poids maximum : 400 kg"),
})

export const profileUpdateSchema = z.object({
  current_weight_kg: z.number().min(20).max(400).optional(),
  goal: z.enum(["LOSE_FAT", "GAIN_MUSCLE", "MAINTENANCE"]).optional(),
  activity_level: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"]).optional(),
  meals_per_day: z.number().min(1).max(6).optional(),
  dietary_restrictions: z.array(z.string()).optional(),
})
