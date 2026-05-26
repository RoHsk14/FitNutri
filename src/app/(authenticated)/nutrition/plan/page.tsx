import { Card, CardHeader, CardTitle } from "@/components/ui"
import { getCurrentProfile, getNutritionPlan, regenerateNutritionPlan } from "@/lib/actions"
import { fmt } from "@/lib/format"
import { redirect } from "next/navigation"

const MEAL_ICONS: Record<number, string> = {
  1: "🌅", 2: "🍎", 3: "☀️", 4: "🥜", 5: "🌙", 6: "🌃",
}

const GOAL_LABELS: Record<string, string> = {
  LOSE_FAT: "Perte de poids",
  GAIN_MUSCLE: "Prise de muscle",
  MAINTENANCE: "Remise en forme",
}

export default async function NutritionPlanPage() {
  const [profile, nutritionPlan] = await Promise.all([
    getCurrentProfile(),
    getNutritionPlan(),
  ])

  if (!profile || !nutritionPlan) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Aucun plan nutritionnel</CardTitle>
          </CardHeader>
          <div className="p-6 pt-0 space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Votre plan nutritionnel n&apos;a pas été généré. Cliquez ci-dessous pour le créer.
            </p>
            <form
              action={async () => {
                "use server"
                await regenerateNutritionPlan()
                redirect("/nutrition/plan")
              }}
            >
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Générer le plan nutritionnel
              </button>
            </form>
          </div>
        </Card>
      </div>
    )
  }

  const { plan, meals } = nutritionPlan

  return (
    <div className="space-y-6">
      {/* Résumé du plan */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Plan nutritionnel</h2>
            <p className="mt-1 text-sm text-primary-100">
              {GOAL_LABELS[profile.goal] ?? "Personnalisé"} · {profile.meals_per_day} repas/jour
            </p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {fmt(plan.total_calories, 0)} kcal
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold">{fmt(plan.protein_g, 1)}</p>
            <p className="text-xs text-primary-100">Protéines (g)</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold">{fmt(plan.carbs_g, 1)}</p>
            <p className="text-xs text-primary-100">Glucides (g)</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold">{fmt(plan.fat_g, 1)}</p>
            <p className="text-xs text-primary-100">Lipides (g)</p>
          </div>
        </div>
      </div>

      {/* Répartition par repas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Répartition par repas</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal: any) => (
            <div key={meal.meal_number} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{MEAL_ICONS[meal.meal_number] ?? "🍽️"}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{meal.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{fmt(meal.calories_target, 0)} kcal</p>
                </div>
              </div>
              <div className="mb-3 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>P: {fmt(meal.protein_target, 1)}g</span>
                <span>G: {fmt(meal.carbs_target, 1)}g</span>
                <span>L: {fmt(meal.fat_target, 1)}g</span>
              </div>
              {meal.items.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Suggestions</p>
                  {meal.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between rounded-md bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1.5 text-xs">
                      <span className="min-w-0 truncate font-medium text-gray-700 dark:text-gray-300">{item.food_item?.name ?? "Aliment"}</span>
                      <span className="shrink-0 text-gray-400 dark:text-gray-500">{item.quantity_g}g</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Restrictions */}
      {profile.dietary_restrictions && profile.dietary_restrictions.length > 0 && (
        <div className="rounded-xl border border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-4">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">Restrictions alimentaires</p>
          <div className="flex flex-wrap gap-2">
            {profile.dietary_restrictions.map((r: string) => (
              <span key={r} className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                {r === "vegan" ? "Végétalien" : r === "gluten_free" ? "Sans gluten" : r === "lactose_free" ? "Sans lactose" : r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
