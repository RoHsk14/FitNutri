"use client"

import { useState } from "react"
import type { NutritionalGap } from "@/lib/gemini"

export function NutritionGapsAnalyzer() {
  const [gaps, setGaps] = useState<NutritionalGap[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    setGaps(null)
    try {
      const res = await fetch("/api/ai/analyze-gaps", { method: "POST" })
      if (res.ok) setGaps(await res.json())
    } catch {}
    setLoading(false)
  }

  const totalDeficit = gaps?.reduce((s, g) => s + Math.max(0, g.deficit), 0) ?? 0

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-sm">
            🧠
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Analyse nutritionnelle IA</p>
            <p className="text-[10px] text-gray-400">Détecte les carences de votre journée</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? "Analyse..." : "Analyser"}
        </button>
      </div>

      {gaps && gaps.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">
            {totalDeficit > 0 ? `${gaps.length} carence(s) détectée(s)` : "Tout est équilibré ✅"}
          </p>
          {gaps.map((g) => (
            <div key={g.nutrient} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-900">{g.nutrient}</p>
                <span className="text-xs font-medium text-rose-600">
                  -{g.deficit > 0 ? `${g.deficit}` : `${Math.abs(g.deficit)}`}{g.nutrient === "Calories" ? " kcal" : "g"}
                </span>
              </div>
              <div className="mb-1.5 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${g.deficit > 0 ? "bg-rose-400" : "bg-emerald-400"}`}
                  style={{ width: `${Math.min(100, Math.round((g.current / g.target) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1.5">
                <span>{Math.round(g.current)} / {g.target}</span>
              </div>
              <p className="text-xs text-gray-500 italic">💡 {g.suggestion}</p>
            </div>
          ))}
        </div>
      )}

      {gaps && gaps.length === 0 && (
        <p className="text-sm text-emerald-600">✅ Tous vos objectifs sont atteints aujourd&apos;hui !</p>
      )}
    </div>
  )
}
