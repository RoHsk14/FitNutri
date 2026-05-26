"use client"

import { useState, useTransition } from "react"
import { analyzeMealDescription, logAnalyzedMeal } from "@/lib/meal-analyzer"
import { fmt } from "@/lib/format"
import type { MealAnalysis } from "@/lib/gemini"

interface Props {
  mealsPerDay: number
  onMealAdded?: () => void
}

const MEAL_NAMES = ["Petit-déjeuner", "Collation matin", "Déjeuner", "Collation après-midi", "Dîner", "Collation soir"]

export function QuickMealInput({ mealsPerDay, onMealAdded }: Props) {
  const [description, setDescription] = useState("")
  const [analysis, setAnalysis] = useState<(MealAnalysis & { source: "gemini" | "local" }) | null>(null)
  const [selectedMeal, setSelectedMeal] = useState(1)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  const handleAnalyze = () => {
    if (description.length < 3) return
    setSaved(false)
    setError("")
    setAnalysis(null)
    startTransition(async () => {
      try {
        const result = await analyzeMealDescription(description)
        if (!result) {
          setError("Impossible d'analyser ce repas. Sois plus précis (ex: 200g poulet, 250g riz).")
          return
        }
        setAnalysis({ ...result.analysis, source: result.source })
      } catch {
        setError("Erreur lors de l'analyse")
      }
    })
  }

  const handleSave = () => {
    if (!analysis) return
    startTransition(async () => {
      try {
        await logAnalyzedMeal(analysis, selectedMeal)
        setSaved(true)
        setDescription("")
        setAnalysis(null)
        onMealAdded?.()
      } catch {
        setError("Erreur lors de l'enregistrement")
      }
    })
  }

  return (
    <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/30 p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100">
          <svg className="h-3.5 w-3.5 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v12m0 0l-3-3m3 3l3-3M5 18v1a2 2 0 002 2h10a2 2 0 002-2v-1" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-primary-700">Saisie rapide</h3>
        <span className="text-[10px] text-primary-400">— Décris ton repas, estimation automatique</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: 200g de riz, 150g de poulet, brocoli vapeur"
          className="min-h-[44px] w-full flex-1 resize-none rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
          rows={2}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnalyze() } }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select
          value={selectedMeal}
          onChange={(e) => setSelectedMeal(Number(e.target.value))}
          className="rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-xs"
        >
          {Array.from({ length: mealsPerDay }, (_, i) => (
            <option key={i + 1} value={i + 1}>{MEAL_NAMES[i] ?? `Repas ${i + 1}`}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={pending || description.length < 3}
          className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition-all"
        >
          {pending ? "Analyse..." : "Analyser"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      {/* Résultat */}
      {analysis && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">{analysis.food_name}</p>
              <p className="text-xs text-gray-400">~{analysis.quantity_g}g estimés</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                analysis.source === "gemini"
                  ? "bg-purple-50 text-purple-600"
                  : "bg-amber-50 text-amber-600"
              }`}>
                {analysis.source === "gemini" ? "IA" : "Estimation"}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600">
                {analysis.calories} kcal
              </span>
            </div>
          </div>
          <div className="mb-3 flex gap-3 text-[11px]">
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-600">P:{fmt(analysis.protein_g)}g</span>
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-600">G:{fmt(analysis.carbs_g)}g</span>
            <span className="rounded-md bg-rose-50 px-2 py-0.5 text-rose-600">L:{fmt(analysis.fat_g)}g</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-all"
            >
              {pending ? "..." : "Ajouter au journal"}
            </button>
            <button
              type="button"
              onClick={() => { setAnalysis(null); setDescription("") }}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
          </div>
          {saved && (
            <p className="mt-2 text-xs text-emerald-600">✓ Ajouté à votre journal !</p>
          )}
        </div>
      )}
    </div>
  )
}
