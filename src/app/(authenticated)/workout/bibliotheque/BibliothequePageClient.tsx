"use client"

import { useState, useMemo } from "react"
import { ExerciseCard } from "@/components/workout"
import type { Database } from "@/lib/database.types"

type Exercise = Database["public"]["Tables"]["fit_exercises"]["Row"]

const ALL_EQUIPMENT = ["BARBELL", "DUMBBELL", "CABLE", "MACHINE", "BODYWEIGHT", "BAND", "KETTLEBELL", "TRX"]
const ALL_MECHANICS = ["COMPOUND", "ISOLATION"]

export default function BibliothequePageClient({ exercises: initial }: { exercises: Exercise[] }) {
  const [search, setSearch] = useState("")
  const [muscleFilter, setMuscleFilter] = useState("")
  const [equipmentFilter, setEquipmentFilter] = useState<string[]>([])
  const [mechanicsFilter, setMechanicsFilter] = useState<string[]>([])

  const muscleGroups = useMemo(() => {
    const set = new Set(initial.map((e) => e.muscle_group ?? "Autres"))
    return Array.from(set).sort()
  }, [initial])

  const filtered = useMemo(() => {
    return initial.filter((ex) => {
      if (search) {
        const q = search.toLowerCase()
        const name = (ex.name ?? "").toLowerCase()
        const desc = (ex.description ?? "").toLowerCase()
        const primary = (ex.primary_muscle ?? "").toLowerCase()
        if (!name.includes(q) && !desc.includes(q) && !primary.includes(q)) return false
      }
      if (muscleFilter && (ex.muscle_group ?? "Autres") !== muscleFilter) return false
      if (equipmentFilter.length > 0) {
        const eq: string[] = (ex.equipment ?? []) as any
        if (!equipmentFilter.some((e) => eq.includes(e))) return false
      }
      if (mechanicsFilter.length > 0) {
        if (!ex.mechanics || !mechanicsFilter.includes(ex.mechanics)) return false
      }
      return true
    })
  }, [initial, search, muscleFilter, equipmentFilter, mechanicsFilter])

  const toggleEquipment = (e: string) => {
    setEquipmentFilter((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev])
  }
  const toggleMechanics = (m: string) => {
    setMechanicsFilter((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev])
  }

  const grouped = useMemo(() => {
    const g: Record<string, typeof filtered> = {}
    for (const ex of filtered) {
      const group = ex.muscle_group ?? "Autres"
      if (!g[group]) g[group] = []
      g[group].push(ex)
    }
    return g
  }, [filtered])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filtered.length} / {initial.length} exercices
        </p>
      </div>

      {/* Recherche */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un exercice..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Groupe musculaire</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setMuscleFilter("")}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${!muscleFilter ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Tous
            </button>
            {muscleGroups.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMuscleFilter(m)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${muscleFilter === m ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Équipement</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_EQUIPMENT.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => toggleEquipment(e)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${equipmentFilter.includes(e) ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Type</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_MECHANICS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMechanics(m)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${mechanicsFilter.includes(m) ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {m === "COMPOUND" ? "Polyarticulaire" : "Isolement"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-400">Aucun exercice ne correspond à vos filtres.</p>
        </div>
      ) : (
        Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([group, exs]) => (
          <section key={group} id={group}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              {group}
              <span className="text-sm font-normal text-gray-400">({exs.length})</span>
            </h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {exs.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={{
                    id: ex.id,
                    name: ex.name,
                    muscle_group: ex.muscle_group,
                    description: ex.description,
                    image_url: ex.image_url,
                    video_url: ex.video_url,
                    ms_video_url: ex.ms_video_url,
                    primary_muscle: ex.primary_muscle,
                    synergist_muscles: ex.synergist_muscles,
                    mechanics: ex.mechanics,
                    equipment: ex.equipment,
                  }}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
