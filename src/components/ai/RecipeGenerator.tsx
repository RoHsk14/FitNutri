"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui"
import type { GeneratedRecipe } from "@/lib/gemini"

export function RecipeGenerator() {
  const [mealType, setMealType] = useState("déjeuner")
  const [preferences, setPreferences] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"generate" | "suggest">("generate")

  const handleGenerate = async () => {
    setLoading(true)
    setRecipe(null)
    const fd = new FormData()
    fd.set("mealType", mealType)
    fd.set("preferences", preferences)
    fd.set("ingredients", ingredients)
    const action = mode === "suggest" ? "/api/ai/suggest-meal" : "/api/ai/generate-recipe"
    try {
      const res = await fetch(action, { method: "POST", body: fd })
      if (res.ok) setRecipe(await res.json())
    } catch {}
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>🍳 Assistant recettes IA</CardTitle>
          <button
            type="button"
            onClick={() => setMode(mode === "generate" ? "suggest" : "generate")}
            className="text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            {mode === "generate" ? "→ Avec mes ingrédients" : "→ Générer une recette"}
          </button>
        </div>
      </CardHeader>
      <div className="space-y-3">
        {mode === "generate" ? (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type de repas</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="petit-déjeuner">Petit-déjeuner</option>
                <option value="déjeuner">Déjeuner</option>
                <option value="dîner">Dîner</option>
                <option value="collation">Collation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Préférences (optionnel)</label>
              <input
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="ex: j'adore le poulet, sans gluten"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ingrédients disponibles</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="ex: poulet, riz, brocoli, œufs, tomates"
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Génération en cours..." : mode === "generate" ? "Générer une recette" : "Que cuisiner ?"}
        </button>

        {recipe && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-3">
            <div className="flex items-start justify-between">
              <p className="font-semibold text-gray-900">{recipe.name}</p>
              <span className="text-xs text-gray-400">{recipe.prepTimeMinutes} min</span>
            </div>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>🔥 {recipe.calories} kcal</span>
              <span>🥩 {recipe.protein_g}g P</span>
              <span>🍚 {recipe.carbs_g}g G</span>
              <span>🧈 {recipe.fat_g}g L</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Ingrédients :</p>
              <ul className="text-xs text-gray-500 space-y-0.5 list-disc pl-4">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Instructions :</p>
              <ol className="text-xs text-gray-500 space-y-1 list-decimal pl-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
