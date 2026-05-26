"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { Button, Input, Card } from "@/components/ui"
import { searchFoods, logMeal, removeMeal } from "@/lib/actions"
import { fmt } from "@/lib/format"

interface FoodItem {
  id: string
  name: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  category: string | null
}

interface DailyMeal {
  id: string
  meal_number: number
  quantity_g: number
  food_item: FoodItem
}

interface Props {
  initialMeals: DailyMeal[]
  totals: { calories: number; protein: number; carbs: number; fat: number }
  targetCalories?: number
  targetProtein?: number
  targetCarbs?: number
  targetFat?: number
  mealsPerDay?: number
}

const MEAL_NAMES = ["Petit-déjeuner", "Collation matin", "Déjeuner", "Collation après-midi", "Dîner", "Collation soir"]

export function FoodLogger({ initialMeals, totals, targetCalories, targetProtein, targetCarbs, targetFat, mealsPerDay }: Props) {
  const [meals, setMeals] = useState(initialMeals)
  const [dayTotals, setDayTotals] = useState(totals)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<FoodItem[]>([])
  const [selectedMeal, setSelectedMeal] = useState(1)
  const [quantity, setQuantity] = useState("100")
  const [pending, startTransition] = useTransition()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (search.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      const r = await searchFoods(search)
      setResults(r)
    }, 200)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setResults([])
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleAdd = (food: FoodItem) => {
    startTransition(async () => {
      await logMeal(food.id, Number(quantity), selectedMeal)
      refreshMeals()
      setSearch("")
      setResults([])
    })
  }

  const handleRemove = (mealId: string) => {
    startTransition(async () => {
      await removeMeal(mealId)
      refreshMeals()
    })
  }

  const refreshMeals = async () => {
    const { getDailyMeals } = await import("@/lib/actions")
    const fresh = await getDailyMeals()
    setMeals(fresh.meals)
    setDayTotals(fresh.totals)
  }

  const grouped = meals.reduce<Record<number, DailyMeal[]>>((acc, m) => {
    if (!acc[m.meal_number]) acc[m.meal_number] = []
    acc[m.meal_number].push(m)
    return acc
  }, {})

  const maxMeals = mealsPerDay ?? 5

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div ref={searchRef} className="relative">
        <div className="flex flex-wrap gap-2">
          <div className="w-full sm:flex-1">
            <Input
              placeholder="Rechercher un aliment (ex: poulet, riz...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm flex-1 sm:flex-none"
          >
            {Array.from({ length: maxMeals }, (_, i) => (
              <option key={i + 1} value={i + 1}>{MEAL_NAMES[i] ?? `Repas ${i + 1}`}</option>
            ))}
          </select>
          <div className="w-20">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="g"
            />
          </div>
        </div>
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {results.map((food) => (
              <button
                key={food.id}
                onClick={() => handleAdd(food)}
                disabled={pending}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{food.name}</p>
                  <p className="text-xs text-gray-400">{fmt(food.calories_per_100g)} kcal/100g · P:{fmt(food.protein_per_100g)} G:{fmt(food.carbs_per_100g)} L:{fmt(food.fat_per_100g)}</p>
                </div>
                <span className="text-xs text-primary-600 font-medium">+ Ajouter</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MacroStat label="Calories" current={dayTotals.calories} target={targetCalories ?? 0} unit="kcal" color="text-blue-600" />
        <MacroStat label="Protéines" current={dayTotals.protein} target={targetProtein ?? 0} unit="g" color="text-blue-600" />
        <MacroStat label="Glucides" current={dayTotals.carbs} target={targetCarbs ?? 0} unit="g" color="text-amber-600" />
        <MacroStat label="Lipides" current={dayTotals.fat} target={targetFat ?? 0} unit="g" color="text-rose-600" />
      </div>

      {/* Repas par groupe */}
      <div className="space-y-4">
        {Array.from({ length: maxMeals }, (_, i) => {
          const num = i + 1
          const items = grouped[num] ?? []
          return (
            <Card key={num} className="!p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">{MEAL_NAMES[i] ?? `Repas ${num}`}</h3>
                <span className="text-xs text-gray-400">
                  {items.reduce((s, m) => s + Math.round((m.food_item.calories_per_100g * m.quantity_g) / 100), 0)} kcal
                </span>
              </div>
              {items.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Aucun aliment enregistré</p>
              ) : (
                <div className="space-y-1">
                  {items.map((m) => {
                    const kcal = Math.round((m.food_item.calories_per_100g * m.quantity_g) / 100)
                    return (
                      <div key={m.id} className="flex items-center justify-between rounded bg-gray-50 px-3 py-1.5 text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate text-gray-900">{m.food_item.name}</span>
                          <span className="shrink-0 text-gray-400 text-xs">{m.quantity_g}g</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 text-xs">{kcal} kcal</span>
                          <button
                            onClick={() => handleRemove(m.id)}
                            disabled={pending}
                            className="text-gray-300 hover:text-red-500 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function MacroStat({ label, current, target, unit, color }: { label: string; current: number; target: number; unit: string; color: string }) {
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-bold ${current > target ? "text-red-500" : color}`}>
        {fmt(current, unit === "kcal" ? 0 : 1)}{unit}
      </p>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${current > target ? "bg-red-400" : "bg-blue-400"}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400">/{fmt(target, unit === "kcal" ? 0 : 1)}{unit}</p>
    </div>
  )
}
