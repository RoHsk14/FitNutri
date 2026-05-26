"use server"

import { cookies } from "next/headers"
import { analyzeMealTextWithGemini } from "./gemini"
import { estimateMealLocally } from "./meal-estimator"
import { getSupabaseAdmin } from "./supabase-admin"
import type { MealAnalysis } from "./gemini"

export async function analyzeMealDescription(description: string): Promise<{
  analysis: MealAnalysis
  source: "gemini" | "local"
} | null> {
  // Essayer Gemini d'abord
  const geminiResult = await analyzeMealTextWithGemini(description)
  if (geminiResult) {
    return { analysis: geminiResult, source: "gemini" }
  }

  // Fallback local si Gemini indisponible (quota épuisé, etc.)
  const localResult = estimateMealLocally(description)
  if (localResult) {
    return { analysis: localResult, source: "local" }
  }

  return null
}

export async function logAnalyzedMeal(
  analysis: MealAnalysis,
  mealNumber: number,
  logDate?: string,
) {
  const cookieStore = cookies()
  const clerkUserId = cookieStore.get("fit_user_id")?.value
  if (!clerkUserId) throw new Error("Profil introuvable")

  const supabase = getSupabaseAdmin()

  const { data: profile } = await supabase
    .from("fit_user_profiles")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .single()

  if (!profile) throw new Error("Profil introuvable")

  const { data: existing } = await supabase
    .from("fit_food_items")
    .select("id")
    .eq("name", analysis.food_name)
    .maybeSingle()

  let foodItemId: string

  if (existing) {
    foodItemId = existing.id
  } else {
    const { data: newFood } = await supabase
      .from("fit_food_items")
      .insert({
        name: analysis.food_name,
        calories_per_100g: Math.round((analysis.calories / analysis.quantity_g) * 100),
        protein_per_100g: Math.round((analysis.protein_g / analysis.quantity_g) * 100 * 10) / 10,
        carbs_per_100g: Math.round((analysis.carbs_g / analysis.quantity_g) * 100 * 10) / 10,
        fat_per_100g: Math.round((analysis.fat_g / analysis.quantity_g) * 100 * 10) / 10,
        category: "Saisie rapide",
      })
      .select("id")
      .single()

    if (!newFood) throw new Error("Impossible de créer l'aliment")
    foodItemId = newFood.id
  }

  const { error } = await supabase.from("fit_daily_meals").insert({
    user_profile_id: profile.id,
    food_item_id: foodItemId,
    quantity_g: analysis.quantity_g,
    meal_number: mealNumber,
    log_date: logDate ?? new Date().toISOString().split("T")[0],
  })

  if (error) throw new Error("Impossible d'enregistrer le repas")
}
