"use client"

import { useState, useEffect } from "react"
import { Button, Card } from "@/components/ui"
import { suggestMeals, logMeal } from "@/lib/actions"
import { fmt } from "@/lib/format"

interface FoodItem {
  id: string
  name: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  category?: string
}

interface Suggestion {
  food_item: FoodItem
  quantity_g: number
  meal_type: number
  meal_label: string
  meal_icon: string
  reason: string
  macros: { calories: number; protein: number; carbs: number; fat: number }
}

export function MealSuggestions() {
  const [data, setData] = useState<{ suggestions: Suggestion[]; targetMeal: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState<Set<string>>(new Set())

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const res = await suggestMeals()
    setData(res as any)
    setLoading(false)
  }

  const add = async (s: Suggestion) => {
    await logMeal(s.food_item.id, s.quantity_g, s.meal_type)
    setAdded((prev) => new Set(prev).add(s.food_item.id))
  }

  if (!data || data.suggestions.length === 0) return null

  const barColor = (current: number, total: number) => {
    const pct = total > 0 ? (current / total) * 100 : 0
    if (pct > 90) return "bg-red-400"
    if (pct > 60) return "bg-amber-400"
    return "bg-blue-400"
  }

  return (
    <Card className="!p-4 border-dashed border-primary-200 bg-primary-50/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-primary-700 flex items-center gap-1.5">
          <span>{data.suggestions[0]?.meal_icon ?? "🤖"}</span>
          Suggestions pour votre {data.suggestions[0]?.meal_label?.toLowerCase() ?? "repas"}
        </h3>
        <button onClick={load} className="text-xs text-primary-500 hover:text-primary-700" disabled={loading}>
          {loading ? "..." : "⟳ Actualiser"}
        </button>
      </div>

      <div className="space-y-3">
        {data.suggestions.map((s, i) => (
          <div
            key={`${s.food_item.id}-${i}`}
            className="rounded-lg border border-primary-100 bg-white overflow-hidden"
          >
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{s.food_item.name}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      {s.quantity_g}g
                    </span>
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600">
                      {s.meal_label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{s.reason}</p>

                  {/* Mini barres macros */}
                  <div className="flex gap-3 mt-2">
                    <MacroMini label="Cal" value={s.macros.calories} color="bg-gray-500" />
                    <MacroMini label="Prot" value={s.macros.protein} unit="g" color="bg-blue-500" />
                    <MacroMini label="Gluc" value={s.macros.carbs} unit="g" color="bg-amber-500" />
                    <MacroMini label="Lip" value={s.macros.fat} unit="g" color="bg-rose-500" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                    {s.macros.protein > 20 && s.macros.fat < 5 ? "Riche en protéines maigres — idéal pour la récupération musculaire" :
                     s.macros.carbs > 40 ? "Charge en glucides — parfait avant / après sport" :
                     s.macros.fat > 15 ? "Acides gras essentiels — bon pour l'équilibre hormonal" :
                     "Repas équilibré pour combler vos besoins"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={added.has(s.food_item.id) ? "ghost" : "primary"}
                  onClick={() => add(s)}
                  disabled={added.has(s.food_item.id)}
                  className="ml-2 shrink-0"
                >
                  {added.has(s.food_item.id) ? "✓" : "+"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function MacroMini({ label, value, unit, color }: { label: string; value: number; unit?: string; color: string }) {
  return (
    <div className="flex items-center gap-1 text-[10px] text-gray-500">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      <span>{label}: {fmt(value, unit ? 1 : 0)}{unit ?? ""}</span>
    </div>
  )
}
