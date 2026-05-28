"use client"

import { useState, useEffect, useCallback } from "react"
import { FoodLogger, MealSuggestions, QuickMealInput } from "@/components/dashboard"
import { RecipeGenerator } from "@/components/ai/RecipeGenerator"
import { NutritionGapsAnalyzer } from "@/components/ai/NutritionGapsAnalyzer"
import { Card, CardHeader, CardTitle } from "@/components/ui"
import { getNutritionPageData } from "@/lib/actions"
import { fmt } from "@/lib/format"

const MEAL_ICONS: Record<number, string> = {
  1: "🌅", 2: "🍎", 3: "☀️", 4: "🥜", 5: "🌙", 6: "🌃",
}

export default function NutritionPage() {
  const [data, setData] = useState<{
    profile: any
    dailyMeals: any
    nutritionPlan: any
  } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    getNutritionPageData().then(setData)
  }, [refreshKey])

  const handleMealAdded = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal alimentaire</h1>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  const { profile, dailyMeals, nutritionPlan } = data

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Journal alimentaire</h2>
      </div>

      {profile && nutritionPlan ? (
        <>
          {/* Objectifs du jour */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniBox label="Calories" current={dailyMeals.totals.calories} target={nutritionPlan.plan.total_calories} unit="kcal" color="text-gray-900" />
            <MiniBox label="Protéines" current={dailyMeals.totals.protein} target={nutritionPlan.plan.protein_g} unit="g" color="text-blue-600" />
            <MiniBox label="Glucides" current={dailyMeals.totals.carbs} target={nutritionPlan.plan.carbs_g} unit="g" color="text-amber-600" />
            <MiniBox label="Lipides" current={dailyMeals.totals.fat} target={nutritionPlan.plan.fat_g} unit="g" color="text-rose-600" />
          </div>

          {/* Plan du jour */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
              </svg>
              Plan du jour
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nutritionPlan.meals.map((meal: any) => {
                const actualKcal = dailyMeals.meals
                  .filter((m: any) => m.meal_number === meal.meal_number)
                  .reduce((s: number, m: any) => s + Math.round((m.food_item.calories_per_100g * m.quantity_g) / 100), 0)
                return (
                  <div key={meal.meal_number} className={`rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                    actualKcal > 0 ? "border-l-4 border-l-emerald-400" : "border-gray-100"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{MEAL_ICONS[meal.meal_number] ?? "🍽️"}</span>
                        <span className="text-sm font-semibold text-gray-800">{meal.label}</span>
                      </div>
                      <span className="text-xs text-gray-400 tabular-nums">
                        {actualKcal}/{meal.calories_target} kcal
                      </span>
                    </div>
                    <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full transition-all ${
                        actualKcal >= meal.calories_target ? "bg-emerald-400" : actualKcal > 0 ? "bg-blue-400" : "bg-gray-200"
                      }`} style={{ width: `${Math.min(Math.round((actualKcal / meal.calories_target) * 100), 100)}%` }} />
                    </div>
                    <div className="mb-2 flex gap-2 text-[10px] text-gray-400">
                      <span>P:{fmt(meal.protein_target)}g</span>
                      <span>G:{fmt(meal.carbs_target)}g</span>
                      <span>L:{fmt(meal.fat_target)}g</span>
                    </div>
                    {meal.items.length > 0 ? (
                      <div className="space-y-1">
                        {meal.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-1.5 text-xs">
                            <span className="min-w-0 truncate font-medium text-gray-700">{item.food_item?.name ?? "Aliment"}</span>
                            <div className="flex shrink-0 items-center gap-2 text-gray-400">
                              <span>{item.quantity_g}g</span>
                              <span>{item.macros?.calories ?? 0} kcal</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-300 italic">Aucune suggestion</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Saisie rapide */}
          <QuickMealInput mealsPerDay={nutritionPlan.plan.meals_per_day} onMealAdded={handleMealAdded} />

          {/* Journal alimentaire */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Journal du jour</h2>
            <FoodLogger
              key={refreshKey}
              initialMeals={dailyMeals.meals as any}
              totals={dailyMeals.totals}
              targetCalories={nutritionPlan.plan.total_calories}
              targetProtein={nutritionPlan.plan.protein_g}
              targetCarbs={nutritionPlan.plan.carbs_g}
              targetFat={nutritionPlan.plan.fat_g}
              mealsPerDay={nutritionPlan.plan.meals_per_day}
            />
          </Card>

          {/* Suggestions + IA */}
          <MealSuggestions key={refreshKey} maxSuggestions={10} />
          <RecipeGenerator />
          <NutritionGapsAnalyzer />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucun plan nutritionnel</CardTitle>
          </CardHeader>
          <div className="p-6 pt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Votre plan nutritionnel n&apos;a pas été généré. Rendez-vous dans{" "}
              <a href="/nutrition/plan" className="text-primary-600 underline">Plan</a> pour le créer.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

function MiniBox({ label, current, target, unit, color }: { label: string; current: number; target: number; unit: string; color: string }) {
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-bold ${current > target ? "text-red-500" : color}`}>
        {fmt(current, unit === "kcal" ? 0 : 1)}{unit}
      </p>
      <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${current > target ? "bg-red-400" : "bg-blue-400"}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400">/ {fmt(target, unit === "kcal" ? 0 : 1)}{unit}</p>
    </div>
  )
}
