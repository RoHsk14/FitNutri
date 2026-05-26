"use server"

import { cookies } from "next/headers"
import { getSupabaseAdmin, ensureBucket } from "./supabase-admin"
import { calculateNutrition, getWaterRecommendation, estimateDuration } from "./calculations"
import { onboardingSchema, weightLogSchema, profileUpdateSchema } from "./validation"
import { getWorkoutSplit, getSessionsPerWeek } from "./workout-splits"
import { selectExercisesForTarget } from "./exercise-selector"
import { analyzeGoalDescription } from "./goal-adapter"
import { analyzePhysiqueWithGemini, generateDailyCoachingMessage, generateRecipeWithGemini, suggestMealFromIngredients, analyzeNutritionalGapsWithGemini, generateCustomWorkoutWithGemini } from "./gemini"
import type { OnboardingData } from "./types"

// ─── PROFIL ───────────────────────────────────────────

export async function clearSession() {
  const cookieStore = cookies()
  cookieStore.delete("fit_user_id")
}

export async function submitOnboarding(data: OnboardingData) {
  const parsed = onboardingSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    throw new Error(firstError?.message ?? "Données invalides")
  }

  const supabase = getSupabaseAdmin()
  const result = calculateNutrition(data)

  // Durée estimée
  const workoutSessions = getSessionsPerWeek(data.activityLevel, data.gender)
  let duration = estimateDuration({
    gender: data.gender,
    goal: data.goal,
    currentWeightKg: data.weightKg,
    heightCm: data.heightCm,
    age: data.age,
    targetWeightKg: data.targetWeightKg,
    activityLevel: data.activityLevel,
    workoutSessionsPerWeek: workoutSessions,
    mealsPerDay: data.mealsPerDay,
    dietaryRestrictions: data.dietaryRestrictions,
    goalDescription: data.goalDescription,
  })

  // Analyse IA des photos si disponibles (optionnel, ne bloque pas le flow)
  let physiqueAdjustment = 1
  if (process.env.GEMINI_API_KEY && (data.currentPhysiqueImageUrl || data.goalImageUrl)) {
    try {
      const analysis = await analyzePhysiqueWithGemini(
        data.currentPhysiqueImageUrl,
        data.goalImageUrl,
        { gender: data.gender, age: data.age, weightKg: data.weightKg, heightCm: data.heightCm, goal: data.goal },
      )
      if (analysis?.durationAdjustment && analysis.durationAdjustment !== 1) {
        physiqueAdjustment = analysis.durationAdjustment
      }
    } catch {} // Échec silencieux → estimation sans IA
  }

  const finalWeeks = Math.round(duration.weeks * physiqueAdjustment)

  const clerkUserId = crypto.randomUUID()

  const { error: profileError } = await supabase.from("fit_user_profiles").upsert(
    {
      clerk_user_id: clerkUserId,
      age: data.age,
      gender: data.gender,
      current_weight_kg: data.weightKg,
      height_cm: data.heightCm,
      goal: data.goal,
      activity_level: data.activityLevel,
      dietary_restrictions: data.dietaryRestrictions,
      meals_per_day: data.mealsPerDay,
      target_calories: result.targetCalories,
      target_protein_g: result.proteinG,
      target_carbs_g: result.carbsG,
      target_fat_g: result.fatG,
      goal_description: data.goalDescription ?? null,
      goal_image_url: data.goalImageUrl ?? null,
      current_physique_image_url: data.currentPhysiqueImageUrl ?? null,
      estimated_duration_weeks: finalWeeks,
    },
    { onConflict: "clerk_user_id", ignoreDuplicates: false }
  )

  if (profileError) {
    console.error("Erreur sauvegarde profil:", profileError)
    throw new Error("Impossible de sauvegarder le profil")
  }

  const cookieStore = cookies()
  cookieStore.set("fit_user_id", clerkUserId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  })

  // Récupérer l'ID du profil pour la suite
  const { data: profile, error: fetchError } = await supabase
    .from("fit_user_profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single()

  if (fetchError) throw new Error("Impossible de recuperer le profil")

  // Générer automatiquement le plan d'entraînement
  try {
    await generateWorkoutPlan(profile.id, data.goal, data.activityLevel, data.gender, data.goalDescription)
  } catch (e) {
    console.error("Erreur génération plan entraînement:", e)
  }

  // Générer le plan nutritionnel
  try {
    await generateNutritionPlan(profile.id, result, data.mealsPerDay, data.dietaryRestrictions)
  } catch (e) {
    console.error("Erreur génération plan nutrition:", e)
  }

  return profile
}

// ─── UPLOAD IMAGE ────────────────────────────────────────

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File
  if (!file) throw new Error("Aucun fichier fourni")

  const profile = await getCurrentProfile()
  if (!profile) throw new Error("Profil introuvable")

  await ensureBucket()

  const supabase = getSupabaseAdmin()
  const ext = file.name.split(".").pop() ?? "jpg"
  const filePath = `${profile.id}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from("fit-physique-images")
    .upload(filePath, file, { upsert: false })

  if (error) throw new Error("Impossible d'uploader l'image")

  const { data: publicUrl } = supabase.storage
    .from("fit-physique-images")
    .getPublicUrl(filePath)

  return publicUrl.publicUrl
}

export async function getCurrentProfile() {
  const cookieStore = cookies()
  const clerkUserId = cookieStore.get("fit_user_id")?.value
  if (!clerkUserId) return null

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("fit_user_profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    return null
  }
  return data
}

// ─── PLAN NUTRITIONNEL ───────────────────────────────

/** Distribution macro par repas selon mealsPerDay */
const MEAL_DISTRIBUTION: Record<number, { ratio: number; label: string }[]> = {
  3: [
    { ratio: 0.30, label: "Petit-déjeuner" },
    { ratio: 0.40, label: "Déjeuner" },
    { ratio: 0.30, label: "Dîner" },
  ],
  4: [
    { ratio: 0.25, label: "Petit-déjeuner" },
    { ratio: 0.35, label: "Déjeuner" },
    { ratio: 0.15, label: "Collation" },
    { ratio: 0.25, label: "Dîner" },
  ],
  5: [
    { ratio: 0.25, label: "Petit-déjeuner" },
    { ratio: 0.10, label: "Collation matin" },
    { ratio: 0.30, label: "Déjeuner" },
    { ratio: 0.15, label: "Collation après-midi" },
    { ratio: 0.20, label: "Dîner" },
  ],
  6: [
    { ratio: 0.20, label: "Petit-déjeuner" },
    { ratio: 0.10, label: "Collation matin" },
    { ratio: 0.25, label: "Déjeuner" },
    { ratio: 0.10, label: "Collation après-midi" },
    { ratio: 0.20, label: "Dîner" },
    { ratio: 0.15, label: "Collation soir" },
  ],
}

export interface MealPlanItem {
  meal_number: number
  label: string
  calories_target: number
  protein_target: number
  carbs_target: number
  fat_target: number
}

export async function generateNutritionPlan(
  profileId: string,
  macros: { targetCalories: number; proteinG: number; carbsG: number; fatG: number },
  mealsPerDay: number,
  restrictions?: string[],
) {
  const supabase = getSupabaseAdmin()
  const dist = MEAL_DISTRIBUTION[mealsPerDay] ?? MEAL_DISTRIBUTION[3]

  const planItems: MealPlanItem[] = dist.map((m, i) => ({
    meal_number: i + 1,
    label: m.label,
    calories_target: Math.round(macros.targetCalories * m.ratio),
    protein_target: Math.round(macros.proteinG * m.ratio),
    carbs_target: Math.round(macros.carbsG * m.ratio),
    fat_target: Math.round(macros.fatG * m.ratio),
  }))

  // Supprimer l'ancien plan s'il existe (un par profil)
  await supabase.from("fit_nutrition_plans").delete().eq("user_profile_id", profileId)

  // Créer le plan
  const { data: plan, error: planError } = await supabase
    .from("fit_nutrition_plans")
    .insert({
      user_profile_id: profileId,
      meals_per_day: mealsPerDay,
      total_calories: macros.targetCalories,
      protein_g: macros.proteinG,
      carbs_g: macros.carbsG,
      fat_g: macros.fatG,
    })
    .select()
    .single()

  if (planError) {
    console.error("Erreur création plan nutrition:", planError)
    return planItems
  }

  // Suggérer des aliments pour chaque repas (basé sur les plans Clean Bulk M&S)
  const { data: foods } = await supabase.from("fit_food_items").select("*")

  if (foods && plan) {
    const suggestions = getMealSuggestions(planItems, foods as any[], restrictions)

    if (suggestions.length > 0) {
      // Nettoyer les anciennes suggestions
      await supabase.from("fit_meal_food_items").delete().eq("nutrition_plan_id", plan.id)

      const inserts = suggestions.map((s) => ({
        nutrition_plan_id: plan.id,
        food_item_id: s.food_item_id,
        meal_number: s.meal_number,
        quantity_g: s.quantity_g,
      }))

      await supabase.from("fit_meal_food_items").insert(inserts)
    }
  }

  return planItems
}

interface FoodSuggestion {
  food_item_id: string
  meal_number: number
  quantity_g: number
}

/** Catégories d'aliments appropriées par type de repas */
const MEAL_FOOD_MAP: Record<number, { protein: string[]; carbs: string[]; fats: string[] }> = {
  1: {  // Petit-déjeuner
    protein: ["Œufs", "Produits laitiers", "Compléments"],
    carbs: ["Céréales", "Fruits"],
    fats: ["Olégineux"],
  },
  2: {  // Collation matin
    protein: ["Produits laitiers", "Compléments"],
    carbs: ["Fruits", "Céréales"],
    fats: ["Olégineux"],
  },
  3: {  // Déjeuner
    protein: ["Viandes", "Poissons", "Œufs", "Légumineuses"],
    carbs: ["Féculents", "Légumineuses", "Céréales"],
    fats: ["Matières grasses", "Olégineux", "Légumes"],
  },
  4: {  // Collation après-midi
    protein: ["Compléments", "Produits laitiers", "Viandes"],
    carbs: ["Fruits", "Céréales"],
    fats: ["Olégineux"],
  },
  5: {  // Dîner
    protein: ["Viandes", "Poissons", "Œufs", "Légumineuses"],
    carbs: ["Féculents", "Légumes", "Légumineuses"],
    fats: ["Matières grasses", "Olégineux"],
  },
  6: {  // Collation soir
    protein: ["Produits laitiers", "Compléments"],
    carbs: ["Fruits", "Céréales"],
    fats: ["Olégineux"],
  },
}

function isExcluded(f: any, vegan: boolean, veggie: boolean, gf: boolean, lf: boolean): boolean {
  if (vegan && (f.category === "Viandes" || f.category === "Poissons" || f.category === "Œufs" || f.category === "Produits laitiers")) return true
  if (!vegan && veggie && (f.category === "Viandes" || f.category === "Poissons")) return true
  if (gf && f.name.match(/blé|pain|pâtes|farine|seigle|orge/i)) return true
  if (lf && f.category === "Produits laitiers") return true
  return false
}

function pickFood(foods: any[], candidates: any[], mealNum: number): any | null {
  if (candidates.length === 0) return null
  // Variation basée sur le numéro du repas + date pour ne pas toujours proposer le même
  const daySeed = new Date().getDate()
  const idx = (daySeed + mealNum * 7 + candidates.length) % candidates.length
  return candidates[idx]
}

function getMealSuggestions(
  planItems: MealPlanItem[],
  foods: any[],
  restrictions?: string[],
): FoodSuggestion[] {
  const suggestions: FoodSuggestion[] = []

  const isVegan = restrictions?.includes("VEGAN") ?? false
  const isVeggie = isVegan || (restrictions?.includes("VEGETARIAN") ?? false)
  const isGF = restrictions?.includes("GLUTEN_FREE") ?? false
  const isLF = restrictions?.includes("LACTOSE_FREE") ?? false

  // Filtrer une fois pour tous les repas
  const validFoods = foods.filter((f: any) => !isExcluded(f, isVegan, isVeggie, isGF, isLF))

  for (const meal of planItems) {
    const foodMap = MEAL_FOOD_MAP[meal.meal_number] ?? MEAL_FOOD_MAP[3]
    const mealNum = meal.meal_number

    // 1. Source de protéines
    const proteinCandidates = validFoods.filter((f: any) =>
      foodMap.protein.includes(f.category) &&
      f.protein_per_100g > (mealNum === 1 ? 8 : 15)
    )
    const proteinFood = pickFood(validFoods, proteinCandidates, mealNum)
    if (!proteinFood) continue

    // 2. Source de glucides
    const carbCandidates = validFoods.filter((f: any) =>
      foodMap.carbs.includes(f.category) &&
      f.carbs_per_100g > 15 && f.fat_per_100g < 10
    )
    const carbFood = pickFood(validFoods, carbCandidates, mealNum + 1)

    // 3. Source de lipides (si repas avec assez de gras)
    const fatCandidates = validFoods.filter((f: any) =>
      foodMap.fats.includes(f.category) &&
      f.fat_per_100g > 30
    )
    const fatFood = meal.fat_target > 8 ? pickFood(validFoods, fatCandidates, mealNum + 2) : null

    // Quantité protéines : viser le target protéines
    const proteinQty = Math.min(Math.max(
      Math.round((meal.protein_target / proteinFood.protein_per_100g) * 100 / 10) * 10,
      30
    ), 300)

    suggestions.push({
      food_item_id: proteinFood.id,
      meal_number: mealNum,
      quantity_g: proteinQty,
    })

    // Quantité glucides : viser ~60% du target carbs
    if (carbFood) {
      const carbQty = Math.min(Math.max(
        Math.round((meal.carbs_target * 0.6 / carbFood.carbs_per_100g) * 100 / 10) * 10,
        30
      ), 300)
      suggestions.push({
        food_item_id: carbFood.id,
        meal_number: mealNum,
        quantity_g: carbQty,
      })
    }

    // Quantité lipides : compléter les besoins
    if (fatFood) {
      const fatQty = Math.min(Math.max(
        Math.round((meal.fat_target * 0.3 / fatFood.fat_per_100g) * 100 / 5) * 5,
        10
      ), 50)
      suggestions.push({
        food_item_id: fatFood.id,
        meal_number: mealNum,
        quantity_g: fatQty,
      })
    }
  }

  return suggestions
}

// ─── PLAN D'ENTRAÎNEMENT ─────────────────────────────

export async function generateWorkoutPlan(
  userProfileId: string,
  goal: string,
  activityLevel: string,
  gender: string,
  goalDescription?: string | null,
) {
  const supabase = getSupabaseAdmin()

  let level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" = "BEGINNER"
  if (activityLevel === "LIGHT" || activityLevel === "MODERATE") level = "INTERMEDIATE"
  if (activityLevel === "ACTIVE" || activityLevel === "VERY_ACTIVE") level = "ADVANCED"

  // Analyser la description d'objectif pour ajuster le programme
  const adjustments = analyzeGoalDescription(goalDescription)

  const split = getWorkoutSplit(gender, level, goal)
  if (!split) return

  const intensity = adjustments.intensityModifier
  const cardioBoost = adjustments.cardioEmphasis

  let title = split.title
  let description = `Programme ${level} - ${split.title}`
  if (adjustments.focusMuscles.length > 0) {
    title += ` (${adjustments.focusMuscles.join(", ")})`
    description += ` · Focus : ${adjustments.focusMuscles.join(", ")}`
  }

  const { data: plan, error: planError } = await supabase
    .from("fit_workout_plans")
    .insert({
      title,
      description,
      level,
      duration_weeks: Math.round(8 * cardioBoost),
      goal_type: goal as any,
      user_profile_id: userProfileId,
    })
    .select("id")
    .single()

  if (planError || !plan) {
    console.error("Erreur création plan:", planError)
    return
  }

  // Sélection dynamique des exercices par cible musculaire
  const usedExerciseIds: string[] = []

  for (const session of split.sessions) {
    if (session.targets.length === 0) continue

    const inserts: {
      workout_plan_id: string
      exercise_id: string
      day_of_week: number
      sort_order: number
      sets: number
      reps: number
      rest_seconds: number
    }[] = []

    let sortOrder = 0
    for (const target of session.targets) {
      // Appliquer les ajustements d'objectif
      const extraSets = adjustments.extraSets[target.primaryMuscle] ?? 0
      const adjustedTarget = {
        ...target,
        sets: Math.round(target.sets * intensity) + extraSets,
        count: target.count + (adjustments.focusMuscles.includes(target.primaryMuscle) ? 1 : 0),
      }

      const exercises = await selectExercisesForTarget(adjustedTarget, supabase, {
        gender,
        excludeIds: usedExerciseIds,
      })

      for (const ex of exercises) {
        usedExerciseIds.push(ex.id)
        inserts.push({
          workout_plan_id: plan.id,
          exercise_id: ex.id,
          day_of_week: session.day,
          sort_order: sortOrder++,
          sets: adjustedTarget.sets,
          reps: adjustedTarget.reps,
          rest_seconds: adjustedTarget.restSeconds,
        })
      }
    }

    if (inserts.length > 0) {
      const { error: sessError } = await supabase
        .from("fit_workout_sessions")
        .insert(inserts)

      if (sessError) console.error("Erreur insertion sessions:", sessError)
    }
  }
}

export async function getTodaysWorkout() {
  const profile = await getCurrentProfile()
  if (!profile) return null

  const supabase = getSupabaseAdmin()
  const today = new Date().getDay()
  const dayOfWeek = today === 0 ? 7 : today // dimanche = 7

  // Récupérer le plan actif
  const { data: plan } = await supabase
    .from("fit_workout_plans")
    .select("id, title, level")
    .eq("user_profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!plan) return null

  const { data: sessions } = await supabase
    .from("fit_workout_sessions")
    .select("id, sets, reps, rest_seconds, sort_order, exercise:fit_exercises(name, muscle_group, description, image_url, video_url, primary_muscle, synergist_muscles, mechanics, equipment)")
    .eq("workout_plan_id", plan.id)
    .eq("day_of_week", dayOfWeek)
    .order("sort_order")

  if (!sessions || sessions.length === 0) return null

  // Chercher le label du jour dans le split correspondant au genre + niveau
  const split = getWorkoutSplit(profile.gender, plan.level)
  const dayLabel = split?.sessions.find(s => s.day === dayOfWeek)?.label ?? `Jour ${dayOfWeek}`

  return {
    title: plan.title,
    dayLabel,
    exercises: sessions,
  }
}

export async function getWeeklyWorkout() {
  const profile = await getCurrentProfile()
  if (!profile) return null

  const supabase = getSupabaseAdmin()

  const { data: plan } = await supabase
    .from("fit_workout_plans")
    .select("*")
    .eq("user_profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!plan) return null

  const { data: sessions } = await supabase
    .from("fit_workout_sessions")
    .select("id, day_of_week, sort_order, sets, reps, rest_seconds, exercise:fit_exercises(name, muscle_group, description, image_url, video_url, primary_muscle, synergist_muscles, mechanics, equipment)")
    .eq("workout_plan_id", plan.id)
    .order("day_of_week")
    .order("sort_order")

  if (!sessions) return null

  // Chercher les labels des séances
  const split = getWorkoutSplit(profile.gender, plan.level)
  const dayLabels: Record<number, string> = {}
  for (const s of split?.sessions ?? []) {
    dayLabels[s.day] = s.label
  }

  // Grouper par jour
  const byDay: Record<number, typeof sessions> = {}
  for (const s of sessions) {
    if (!byDay[s.day_of_week]) byDay[s.day_of_week] = []
    byDay[s.day_of_week].push(s)
  }

  const days = Object.entries(byDay).map(([day, exs]) => ({
    day: Number(day),
    dayName: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"][Number(day) - 1],
    label: dayLabels[Number(day)] ?? null,
    exercises: exs,
  }))

  return { plan, days }
}

// ─── COMPLÉTION EXERCICES ─────────────────────────────

export async function toggleExerciseCompletion(sessionId: string, completed: boolean) {
  const profile = await getCurrentProfile()
  if (!profile) throw new Error("Aucun profil trouvé")

  const supabase = getSupabaseAdmin()

  if (completed) {
    const { error } = await supabase.from("fit_workout_completions").insert({
      user_profile_id: profile.id,
      workout_session_id: sessionId,
    })
    if (error && error.code !== "23505") throw error
  } else {
    await supabase
      .from("fit_workout_completions")
      .delete()
      .eq("user_profile_id", profile.id)
      .eq("workout_session_id", sessionId)
      .gte("completed_at", new Date().toISOString().split("T")[0])
      .lt("completed_at", new Date(new Date().getTime() + 86400000).toISOString().split("T")[0])
  }
}

export async function getTodaysCompletions() {
  const profile = await getCurrentProfile()
  if (!profile) return []

  const supabase = getSupabaseAdmin()
  const today = new Date().toISOString().split("T")[0]

  const { data } = await supabase
    .from("fit_workout_completions")
    .select("workout_session_id")
    .eq("user_profile_id", profile.id)
    .gte("completed_at", today)
    .lt("completed_at", new Date(new Date().getTime() + 86400000).toISOString().split("T")[0])

  return data?.map(d => d.workout_session_id) ?? []
}

export async function getWeeklyCompletions() {
  const profile = await getCurrentProfile()
  if (!profile) return { daily: {} as Record<string, string[]>, weeklyCount: 0 }

  const supabase = getSupabaseAdmin()
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data } = await supabase
    .from("fit_workout_completions")
    .select("workout_session_id, completed_at")
    .eq("user_profile_id", profile.id)
    .gte("completed_at", weekAgo.toISOString())

  const daily: Record<string, string[]> = {}
  let weeklyCount = 0
  for (const c of data ?? []) {
    const day = c.completed_at.split("T")[0]
    if (!daily[day]) daily[day] = []
    daily[day].push(c.workout_session_id)
    weeklyCount++
  }

  return { daily, weeklyCount }
}

// ─── LOG ALIMENTATION ─────────────────────────────────

export async function searchFoods(query: string) {
  if (!query || query.length < 2) return []
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from("fit_food_items")
    .select("id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, category")
    .ilike("name", `%${query}%`)
    .limit(10)
  return data ?? []
}

export async function getCommonFoods() {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from("fit_food_items")
    .select("*")
    .limit(30)
  return data ?? []
}

export async function logMeal(
  foodItemId: string,
  quantityG: number,
  mealNumber: number,
  logDate?: string,
) {
  const profile = await getCurrentProfile()
  if (!profile) throw new Error("Profil introuvable")

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("fit_daily_meals").insert({
    user_profile_id: profile.id,
    food_item_id: foodItemId,
    quantity_g: quantityG,
    meal_number: mealNumber,
    log_date: logDate ?? new Date().toISOString().split("T")[0],
  })

  if (error) {
    console.error("Erreur log repas:", error)
    throw new Error("Impossible d'enregistrer le repas")
  }
}

export async function removeMeal(mealId: string) {
  const supabase = getSupabaseAdmin()
  await supabase.from("fit_daily_meals").delete().eq("id", mealId)
}

export async function getDailyMeals(logDate?: string) {
  const profile = await getCurrentProfile()
  if (!profile) return { meals: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } }

  const supabase = getSupabaseAdmin()
  const date = logDate ?? new Date().toISOString().split("T")[0]

  const { data } = await supabase
    .from("fit_daily_meals")
    .select("id, meal_number, quantity_g, food_item:fit_food_items(*)")
    .eq("user_profile_id", profile.id)
    .eq("log_date", date)
    .order("meal_number")
    .order("created_at")

  const raw = (data ?? []) as any[]

  // Normaliser la jointure Supabase (food_item est un tableau [{...}])
  const meals = raw.map((m: any) => ({
    id: m.id,
    meal_number: m.meal_number,
    quantity_g: m.quantity_g,
    food_item: Array.isArray(m.food_item) ? m.food_item[0] : m.food_item,
  }))

  // Calculer les totaux (arrondis à 2 décimales)
  const totals = meals.reduce(
    (acc, m) => {
      const f = m.food_item ?? {} as any
      const ratio = m.quantity_g / 100
      return {
        calories: acc.calories + Math.round((f.calories_per_100g ?? 0) * ratio),
        protein: Math.round((acc.protein + (f.protein_per_100g ?? 0) * ratio) * 100) / 100,
        carbs: Math.round((acc.carbs + (f.carbs_per_100g ?? 0) * ratio) * 100) / 100,
        fat: Math.round((acc.fat + (f.fat_per_100g ?? 0) * ratio) * 100) / 100,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return { meals, totals }
}

export async function getNutritionPlan() {
  const profile = await getCurrentProfile()
  if (!profile) return null

  const supabase = getSupabaseAdmin()

  const { data: plan } = await supabase
    .from("fit_nutrition_plans")
    .select("id, meals_per_day, total_calories, protein_g, carbs_g, fat_g")
    .eq("user_profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!plan) return null

  const { data: planItems } = await supabase
    .from("fit_meal_food_items")
    .select("id, meal_number, quantity_g, food_item:fit_food_items(id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, category)")
    .eq("nutrition_plan_id", plan.id)
    .order("meal_number")

  // Calculer les cibles par repas (arrondies à 2 décimales)
  const dist = MEAL_DISTRIBUTION[plan.meals_per_day] ?? MEAL_DISTRIBUTION[3]
  const mealTargets = dist.map((m, i) => ({
    meal_number: i + 1,
    label: m.label,
    calories_target: Math.round(plan.total_calories * m.ratio),
    protein_target: Math.round(plan.protein_g * m.ratio * 100) / 100,
    carbs_target: Math.round(plan.carbs_g * m.ratio * 100) / 100,
    fat_target: Math.round(plan.fat_g * m.ratio * 100) / 100,
  }))

  // Grouper les items par meal_number
  const itemsByMeal: Record<number, any[]> = {}
  for (const item of planItems ?? []) {
    const num = item.meal_number
    if (!itemsByMeal[num]) itemsByMeal[num] = []
    const food = Array.isArray(item.food_item) ? item.food_item[0] : item.food_item
    const ratio = item.quantity_g / 100
    itemsByMeal[num].push({
      ...item,
      food_item: food,
      macros: {
        calories: Math.round((food?.calories_per_100g ?? 0) * ratio),
        protein: Math.round((food?.protein_per_100g ?? 0) * ratio * 10) / 10,
        carbs: Math.round((food?.carbs_per_100g ?? 0) * ratio * 10) / 10,
        fat: Math.round((food?.fat_per_100g ?? 0) * ratio * 10) / 10,
      },
    })
  }

  return {
    plan: {
      total_calories: plan.total_calories,
      protein_g: plan.protein_g,
      carbs_g: plan.carbs_g,
      fat_g: plan.fat_g,
      meals_per_day: plan.meals_per_day,
    },
    meals: mealTargets.map((mt) => ({
      ...mt,
      items: itemsByMeal[mt.meal_number] ?? [],
    })),
  }
}

// ─── SUIVI DE POIDS ───────────────────────────────────

export async function logWeight(weightKg: number) {
  const parsed = weightLogSchema.safeParse({ weightKg })
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Poids invalide")

  const profile = await getCurrentProfile()
  if (!profile) throw new Error("Profil introuvable")

  const supabase = getSupabaseAdmin()

  const { error } = await supabase.from("fit_weight_logs").insert({
    user_profile_id: profile.id,
    weight_kg: weightKg,
  })

  if (error) throw new Error("Impossible d'enregistrer le poids")

  // Mettre à jour le poids courant
  await supabase
    .from("fit_user_profiles")
    .update({ current_weight_kg: weightKg })
    .eq("id", profile.id)
}

export async function getWeightHistory(days = 30) {
  const profile = await getCurrentProfile()
  if (!profile) return []

  const supabase = getSupabaseAdmin()
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data } = await supabase
    .from("fit_weight_logs")
    .select("weight_kg, logged_at")
    .eq("user_profile_id", profile.id)
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: true })

  return (data ?? []).map((d: any) => ({
    date: d.logged_at?.split("T")[0],
    kg: d.weight_kg,
  }))
}

// ─── MISE À JOUR DU PROFIL ────────────────────────────

export async function updateProfile(updates: Record<string, any>) {
  const parsed = profileUpdateSchema.safeParse(updates)
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Données invalides")

  const profile = await getCurrentProfile()
  if (!profile) throw new Error("Profil introuvable")

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from("fit_user_profiles")
    .update(parsed.data)
    .eq("id", profile.id)

  if (error) throw new Error("Impossible de mettre à jour le profil")
}

// ─── HYDRATATION ───────────────────────────────────────

export async function logWater(amountMl: number) {
  const profile = await getCurrentProfile()
  if (!profile) throw new Error("Profil introuvable")

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("fit_water_logs").insert({
    user_profile_id: profile.id,
    amount_ml: amountMl,
  })
  if (error) throw new Error("Impossible d'enregistrer l'eau")
}

export async function getWaterIntake() {
  const profile = await getCurrentProfile()
  if (!profile) return { total: 0, goal: 2000 }

  const supabase = getSupabaseAdmin()
  const today = new Date().toISOString().split("T")[0]

  const { data } = await supabase
    .from("fit_water_logs")
    .select("amount_ml")
    .eq("user_profile_id", profile.id)
    .gte("logged_at", today)

  const total = ((data ?? []) as any[]).reduce((sum: number, d: any) => sum + d.amount_ml, 0)
  const goal = getWaterRecommendation(profile.gender)
  return { total, goal }
}

// ─── SUGGESTION REPAS INTELLIGENTE ─────────────────────

const MEAL_TYPE_LABELS: Record<number, { label: string; icon: string }> = {
  1: { label: "Petit-déjeuner", icon: "🌅" },
  2: { label: "Collation matin", icon: "🍎" },
  3: { label: "Déjeuner", icon: "☀️" },
  4: { label: "Collation après-midi", icon: "🥜" },
  5: { label: "Dîner", icon: "🌙" },
  6: { label: "Collation soir", icon: "🌃" },
}

interface SuggestionItem {
  food_item: any
  quantity_g: number
  reason: string
  meal_type: number
  meal_label: string
  meal_icon: string
  macros: { calories: number; protein: number; carbs: number; fat: number }
}

/** Suggère des aliments pour compléter les macros restants du jour */
export async function suggestMeals() {
  const profile = await getCurrentProfile()
  if (!profile) return { suggestions: [], targetMeal: 1 }

  const supabase = getSupabaseAdmin()
  const { meals, totals } = await getDailyMeals()

  const remaining = {
    calories: (profile.target_calories ?? 0) - totals.calories,
    protein: (profile.target_protein_g ?? 0) - totals.protein,
    carbs: (profile.target_carbs_g ?? 0) - totals.carbs,
    fat: (profile.target_fat_g ?? 0) - totals.fat,
  }

  if (remaining.calories <= 0 || remaining.protein <= 0) return { suggestions: [], targetMeal: 1 }

  // Déterminer quel repas est le plus sous-alimenté
  const mealCounts: Record<number, number> = {}
  for (let i = 1; i <= (profile.meals_per_day ?? 3); i++) mealCounts[i] = 0
  meals.forEach((m: any) => { mealCounts[m.meal_number] = (mealCounts[m.meal_number] ?? 0) + 1 })

  // Repas vide ou le moins rempli
  const emptyMeals = Object.entries(mealCounts)
    .filter(([, count]) => count === 0)
    .map(([num]) => Number(num))

  // Si tous les repas ont au moins 1 aliment, suggérer pour un repas existant
  const targetMeal = emptyMeals.length > 0
    ? emptyMeals[0]
    : Object.entries(mealCounts).sort((a, b) => a[1] - b[1])[0]?.[0]
      ? Number(Object.entries(mealCounts).sort((a, b) => a[1] - b[1])[0][0])
      : 1

  const mt = MEAL_TYPE_LABELS[targetMeal] ?? { label: "Repas", icon: "🍽️" }

  // Récupérer les aliments
  const { data: foods } = await supabase
    .from("fit_food_items")
    .select("*")
    .limit(50)

  if (!foods) return []

  const suggestions: SuggestionItem[] = []

  // 1. Priorité protéines (d'autant plus si homme)
  if (remaining.protein > 15) {
    const proteinMin = profile.gender === "MALE" ? 20 : 15  // seuil + haut pour hommes
    const highProtein = (foods as any[])
      .filter((f) => f.protein_per_100g > proteinMin && f.fat_per_100g < (profile.gender === "FEMALE" ? 20 : 15))
      .sort((a, b) => b.protein_per_100g - a.protein_per_100g)
      .slice(0, 2)

    highProtein.forEach((food) => {
      const qty = Math.min(Math.round((remaining.protein / food.protein_per_100g) * 100 / 10) * 10, 250)
      if (qty >= 30) {
        const ratio = qty / 100
        suggestions.push({
          food_item: food,
          quantity_g: qty,
          meal_type: targetMeal,
          meal_label: mt.label,
          meal_icon: mt.icon,
          reason: `💪 ${food.name} : ${(food.protein_per_100g * ratio).toFixed(1)}g de protéines pour ${qty}g (${Math.round(food.calories_per_100g * ratio)} kcal)`,
          macros: {
            calories: Math.round(food.calories_per_100g * ratio),
            protein: Math.round(food.protein_per_100g * ratio * 10) / 10,
            carbs: Math.round(food.carbs_per_100g * ratio * 10) / 10,
            fat: Math.round(food.fat_per_100g * ratio * 10) / 10,
          },
        })
      }
    })
  }

  // 2. Si déficit glucides → glucides complexes + fibres
  if (remaining.carbs > 20) {
    const carbFoods = (foods as any[])
      .filter((f) => f.carbs_per_100g > 20 && f.fat_per_100g < 10)
      .sort((a, b) => b.carbs_per_100g - a.carbs_per_100g)
      .slice(0, 2)

    carbFoods.forEach((food) => {
      const qty = Math.min(Math.round((remaining.carbs / food.carbs_per_100g) * 100 / 10) * 10, 300)
      if (qty >= 30) {
        const ratio = qty / 100
        suggestions.push({
          food_item: food,
          quantity_g: qty,
          meal_type: targetMeal,
          meal_label: mt.label,
          meal_icon: mt.icon,
          reason: `🌾 ${food.name} : ${(food.carbs_per_100g * ratio).toFixed(1)}g de glucides pour ${qty}g — idéal en ${mt.label.toLowerCase()}`,
          macros: {
            calories: Math.round(food.calories_per_100g * ratio),
            protein: Math.round(food.protein_per_100g * ratio * 10) / 10,
            carbs: Math.round(food.carbs_per_100g * ratio * 10) / 10,
            fat: Math.round(food.fat_per_100g * ratio * 10) / 10,
          },
        })
      }
    })
  }

  // 3. Si déficit lipides → bonnes graisses
  if (remaining.fat > 10) {
    const fatFoods = (foods as any[])
      .filter((f) => f.fat_per_100g > 10 && f.carbs_per_100g < 20)
      .sort((a, b) => b.fat_per_100g - a.fat_per_100g)
      .slice(0, 2)

    fatFoods.forEach((food) => {
      const qty = Math.min(Math.round((remaining.fat / food.fat_per_100g) * 100 / 5) * 5, 100)
      if (qty >= 15) {
        const ratio = qty / 100
        suggestions.push({
          food_item: food,
          quantity_g: qty,
          meal_type: targetMeal,
          meal_label: mt.label,
          meal_icon: mt.icon,
          reason: `🥑 ${food.name} : ${(food.fat_per_100g * ratio).toFixed(1)}g de lipides pour ${qty}g — bonnes graisses essentielles`,
          macros: {
            calories: Math.round(food.calories_per_100g * ratio),
            protein: Math.round(food.protein_per_100g * ratio * 10) / 10,
            carbs: Math.round(food.carbs_per_100g * ratio * 10) / 10,
            fat: Math.round(food.fat_per_100g * ratio * 10) / 10,
          },
        })
      }
    })
  }

  // 4. Fallback : aliment équilibré
  if (suggestions.length === 0) {
    const balanced = (foods as any[])
      .filter((f) => f.calories_per_100g > 50 && f.calories_per_100g < 300)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    balanced.forEach((food) => {
      const qty = Math.min(Math.round((remaining.calories / food.calories_per_100g) * 100 / 10) * 10, 200)
      if (qty >= 30) {
        const ratio = qty / 100
        suggestions.push({
          food_item: food,
          quantity_g: qty,
          meal_type: targetMeal,
          meal_label: mt.label,
          meal_icon: mt.icon,
          reason: `🍽️ ${food.name} : ${Math.round(food.calories_per_100g * ratio)} kcal pour ${qty}g — parfait pour votre ${mt.label.toLowerCase()}`,
          macros: {
            calories: Math.round(food.calories_per_100g * ratio),
            protein: Math.round(food.protein_per_100g * ratio * 10) / 10,
            carbs: Math.round(food.carbs_per_100g * ratio * 10) / 10,
            fat: Math.round(food.fat_per_100g * ratio * 10) / 10,
          },
        })
      }
    })
  }

  return { suggestions: suggestions.slice(0, 5), targetMeal }
}

// ─── REGÉNÉRER PLAN NUTRITIONNEL ─────────────────────

export async function regenerateNutritionPlan() {
  const profile = await getCurrentProfile()
  if (!profile) throw new Error("Profil introuvable")

  const result = calculateNutritionFromProfile(profile)
  await generateNutritionPlan(profile.id, result, profile.meals_per_day, profile.dietary_restrictions)
  return { ok: true }
}

function calculateNutritionFromProfile(profile: any) {
  return {
    targetCalories: profile.target_calories,
    proteinG: profile.target_protein_g,
    carbsG: profile.target_carbs_g,
    fatG: profile.target_fat_g,
  }
}

// ─── HISTORIQUE ENTRAÎNEMENT ─────────────────────────

export async function getWorkoutHistory(limitDays = 90) {
  const profile = await getCurrentProfile()
  if (!profile) return []

  const supabase = getSupabaseAdmin()
  const since = new Date()
  since.setDate(since.getDate() - limitDays)

  const { data } = await supabase
    .from("fit_workout_completions")
    .select(`
      completed_at,
      workout_session_id,
      workout_session:fit_workout_sessions!inner(
        exercise_id,
        exercise:fit_exercises!inner(name, muscle_group)
      )
    `)
    .eq("user_profile_id", profile.id)
    .gte("completed_at", since.toISOString())
    .order("completed_at", { ascending: false })

  const grouped: Record<string, { count: number; exercises: string[] }> = {}
  for (const c of data ?? []) {
    const day = (c as any).completed_at?.split("T")[0]
    if (!day) continue
    if (!grouped[day]) grouped[day] = { count: 0, exercises: [] }
    grouped[day].count++
    const ws = (c as any).workout_session
    const exercise = Array.isArray(ws) ? ws[0] : ws
    if (exercise?.exercise) {
      const ex = Array.isArray(exercise.exercise) ? exercise.exercise[0] : exercise.exercise
      if (ex?.name && !grouped[day].exercises.includes(ex.name)) {
        grouped[day].exercises.push(ex.name)
      }
    }
  }

  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, data]) => ({ date, ...data }))
}

// ─── IA COACHING ──────────────────────────────────────

export async function getCoachingMessage() {
  const profile = await getCurrentProfile()
  if (!profile) return null

  const today = new Date().getDay()
  const dayOfWeek = today === 0 ? 7 : today
  const completions = await getWeeklyCompletions()
  const weekProgressPercent = Math.min(100, Math.round((completions.weeklyCount / 21) * 100))

  return generateDailyCoachingMessage({
    gender: profile.gender,
    goal: profile.goal,
    age: profile.age,
    goalDescription: profile.goal_description,
    currentPhysiqueImageUrl: profile.current_physique_image_url,
    hasWorkoutToday: !!completions.daily[new Date().toISOString().split("T")[0]],
    weekProgressPercent,
  })
}

// ─── IA RECETTES ──────────────────────────────────────

export async function generateRecipeAction(formData: FormData) {
  const mealType = formData.get("mealType") as string
  const restrictions = (formData.get("restrictions") as string)?.split(",").map(s => s.trim()).filter(Boolean) ?? []
  const preferences = formData.get("preferences") as string
  const ingredients = formData.get("ingredients") as string

  const profile = await getCurrentProfile()
  if (!profile) return null

  return generateRecipeWithGemini({
    targetCalories: Math.round(profile.target_calories / (profile.meals_per_day || 3)),
    targetProteinG: Math.round(profile.target_protein_g / (profile.meals_per_day || 3)),
    targetCarbsG: Math.round(profile.target_carbs_g / (profile.meals_per_day || 3)),
    targetFatG: Math.round(profile.target_fat_g / (profile.meals_per_day || 3)),
    mealType,
    restrictions,
    preferences,
    availableIngredients: ingredients || undefined,
  })
}

export async function suggestMealAction(formData: FormData) {
  const ingredients = formData.get("ingredients") as string
  return suggestMealFromIngredients({ ingredients })
}

export async function analyzeGapsAction() {
  const profile = await getCurrentProfile()
  if (!profile) return null

  const today = new Date().toISOString().split("T")[0]
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from("fit_daily_meals")
    .select("meal_type, food:fit_food_items(name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g), quantity_g")
    .eq("user_profile_id", profile.id)
    .eq("date", today)

  const meals = (data ?? []).map((d: any) => {
    const food = Array.isArray(d.food) ? d.food[0] : d.food
    const qty = d.quantity_g || 100
    return {
      name: food?.name ?? "Repas",
      calories: Math.round(((food?.calories_per_100g ?? 0) * qty) / 100),
      protein_g: Math.round(((food?.protein_per_100g ?? 0) * qty) / 100),
      carbs_g: Math.round(((food?.carbs_per_100g ?? 0) * qty) / 100),
      fat_g: Math.round(((food?.fat_per_100g ?? 0) * qty) / 100),
    }
  })

  return analyzeNutritionalGapsWithGemini(meals, {
    calories: profile.target_calories,
    protein_g: profile.target_protein_g,
    carbs_g: profile.target_carbs_g,
    fat_g: profile.target_fat_g,
  })
}

export async function generateCustomWorkoutAction(formData: FormData) {
  const targetMuscles = (formData.get("targetMuscles") as string)?.split(",").map(s => s.trim()).filter(Boolean) ?? []
  const duration = parseInt(formData.get("duration") as string) || undefined

  const profile = await getCurrentProfile()
  if (!profile) return null

  return generateCustomWorkoutWithGemini({
    targetMuscles,
    goal: profile.goal,
    gender: profile.gender,
    durationMinutes: duration,
  })
}
