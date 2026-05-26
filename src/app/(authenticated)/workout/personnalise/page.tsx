"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui"
import type { CustomWorkoutSession } from "@/lib/gemini"

const MUSCLE_GROUPS = [
  "Pectoraux", "Dos", "Quadriceps", "Fessiers", "Hamstrings",
  "Shoulders", "Biceps", "Triceps", "Abdominaux", "Calves",
  "Cardio",
]

export default function CustomWorkoutPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [duration, setDuration] = useState(30)
  const [session, setSession] = useState<CustomWorkoutSession | null>(null)
  const [loading, setLoading] = useState(false)

  const toggleMuscle = (m: string) => {
    setSelected((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    )
  }

  const handleGenerate = async () => {
    if (selected.length === 0) return
    setLoading(true)
    setSession(null)
    const fd = new FormData()
    fd.set("targetMuscles", selected.join(","))
    fd.set("duration", String(duration))
    try {
      const res = await fetch("/api/ai/custom-workout", { method: "POST", body: fd })
      if (res.ok) setSession(await res.json())
    } catch {}
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Séance personnalisée</h1>
        <p className="text-sm text-gray-500">Choisis les muscles à cibler et laisse l&apos;IA créer ta séance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Muscles à cibler</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMuscle(m)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selected.includes(m)
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm text-gray-500">Durée :</label>
          <input
            type="range"
            min={15}
            max={90}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700 w-12">{duration} min</span>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={selected.length === 0 || loading}
          className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Génération..." : "Générer la séance"}
        </button>
      </Card>

      {session && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{session.title}</CardTitle>
              <span className="text-xs text-gray-400">~{session.durationMinutes} min</span>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Échauffement</p>
              <div className="flex flex-wrap gap-1.5">
                {session.warmUp.map((w, i) => (
                  <span key={i} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700">{w}</span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {session.exercises.map((ex, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{ex.name}</p>
                    <p className="text-xs text-gray-400">{ex.muscleGroup}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{ex.sets}×{ex.reps}</p>
                    <p>{ex.restSeconds}s repos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
