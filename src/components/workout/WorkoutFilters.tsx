"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

interface Props {
  weekly: {
    plan: { title: string; description: string; duration_weeks: number; level?: string; goal_type?: string }
    days: {
      day: number
      dayName: string
      label: string | null
      exercises: any[]
    }[]
  }
  currentDay: number
  initialCompletions: {
    daily: Record<string, string[]>
    weeklyCount: number
  }
}

const ALL_MUSCLES = ["Pectoraux", "Dos", "Quadriceps", "Shoulders", "Biceps", "Triceps", "Abdominaux", "Hamstrings", "Glutes", "Cardio", "Calves"]
const ALL_EQUIPMENT = ["BARBELL", "DUMBBELL", "BODYWEIGHT", "CABLE", "MACHINE"]

const EQUIPMENT_LABELS: Record<string, string> = {
  BARBELL: "Barre", DUMBBELL: "Haltères", BODYWEIGHT: "Poids du corps", CABLE: "Poulie", MACHINE: "Machine",
}

const dayColors = ["bg-rose-50 border-rose-200", "bg-orange-50 border-orange-200", "bg-amber-50 border-amber-200", "bg-lime-50 border-lime-200", "bg-emerald-50 border-emerald-200", "bg-sky-50 border-sky-200", "bg-violet-50 border-violet-200"]

const dayAccentColors = ["rose", "orange", "amber", "lime", "emerald", "sky", "violet"]

const WARMUP_LABELS: Record<string, string> = {
  PUSH: "Échauffement Poussée", PULL: "Échauffement Tirage", LEGS: "Échauffement Jambes",
  FULL_BODY: "Échauffement Général", SHOULDERS: "Échauffement Épaules", GLUTES: "Échauffement Fessiers", CORE: "Échauffement Gainage",
}

function getWarmUpType(label: string | null): string {
  const l = (label ?? "").toLowerCase()
  if (l.includes("push") || l.includes("pectoraux") || l.includes("épaules") || l.includes("triceps")) return "PUSH"
  if (l.includes("pull") || l.includes("dos") || l.includes("biceps")) return "PULL"
  if (l.includes("leg") || l.includes("jambe") || l.includes("quadri") || l.includes("fessier")) return "LEGS"
  if (l.includes("full") || l.includes("general")) return "FULL_BODY"
  if (l.includes("shoulder") || l.includes("epaule")) return "SHOULDERS"
  if (l.includes("glute") || l.includes("fessier")) return "GLUTES"
  if (l.includes("core") || l.includes("gainage") || l.includes("abdo")) return "CORE"
  return "FULL_BODY"
}

function getWarmUpTypeLabel(label: string | null): string {
  return WARMUP_LABELS[getWarmUpType(label ?? "")] ?? "Échauffement"
}

function ProgressRing({ pct, size = 44, stroke = 4, color = "text-primary-600" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className={`-rotate-90 ${color}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="opacity-10" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
    </svg>
  )
}

export function WorkoutFilters({ weekly, currentDay, initialCompletions }: Props) {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [selectedMechanics, setSelectedMechanics] = useState<string>("")

  const toggleMuscle = (m: string) => {
    setSelectedMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  const toggleEquipment = (e: string) => {
    setSelectedEquipment(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  const hasFilters = selectedMuscles.length > 0 || selectedEquipment.length > 0 || selectedMechanics !== ""

  const filteredDays = useMemo(() => {
    if (!hasFilters) return weekly.days
    return weekly.days.map(d => ({
      ...d,
      exercises: d.exercises.filter((ex: any) => {
        const e = ex.exercise
        if (selectedMuscles.length > 0) {
          const matches = selectedMuscles.some(m => e.primary_muscle === m || e.muscle_group === m)
          if (!matches) return false
        }
        if (selectedEquipment.length > 0) {
          if (!e.equipment || !selectedEquipment.includes(e.equipment)) return false
        }
        if (selectedMechanics && e.mechanics !== selectedMechanics) return false
        return true
      }),
    }))
  }, [weekly.days, selectedMuscles, selectedEquipment, selectedMechanics, hasFilters])

  const totalExercises = weekly.days.reduce((acc, d) => acc + d.exercises.length, 0)
  const trainingDays = weekly.days.filter(d => d.exercises.length > 0).length
  const weeklyPct = totalExercises > 0 ? Math.round((initialCompletions.weeklyCount / totalExercises) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{trainingDays}</p>
              <p className="text-[11px] text-gray-400">Séances/sem</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{totalExercises}</p>
              <p className="text-[11px] text-gray-400">Exercices</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <svg className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{weekly.plan.duration_weeks} sem</p>
              <p className="text-[11px] text-gray-400">Programme</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
              <ProgressRing pct={weeklyPct} size={22} stroke={3} color="text-violet-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{initialCompletions.weeklyCount}</p>
              <p className="text-[11px] text-gray-400">Faits cette sem</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression hebdomadaire */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Progression hebdomadaire</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">{initialCompletions.weeklyCount}/{totalExercises}</span>
          </div>
          <span className="text-xs font-medium text-primary-600">{weeklyPct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1000 ease-out"
            style={{ width: `${weeklyPct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400">
          <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
        </div>
      </div>

      {/* Filtres */}
      <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Filtrer les exercices</p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => { setSelectedMuscles([]); setSelectedEquipment([]); setSelectedMechanics("") }}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_MUSCLES.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMuscle(m)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedMuscles.includes(m)
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_EQUIPMENT.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => toggleEquipment(e)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedEquipment.includes(e)
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {EQUIPMENT_LABELS[e] ?? e}
            </button>
          ))}
          {["COMPOUND", "ISOLATION"].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMechanics(prev => prev === m ? "" : m)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedMechanics === m
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {m === "COMPOUND" ? "Polyarticulaire" : "Isolement"}
            </button>
          ))}
        </div>
      </div>

      {/* Planning jours */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDays.map((d) => {
          const isToday = d.day === currentDay
          const colorIdx = (d.day - 1) % dayColors.length
          const accent = dayAccentColors[colorIdx]
          const hasExercises = d.exercises.length > 0

          return (
            <div
              key={d.day}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${
                isToday ? "ring-2 ring-primary-500" : "border-gray-100"
              }`}
            >
              <div className={`h-1 ${isToday ? "bg-primary-500" : dayColors[colorIdx].split(' ')[0]}`} />

              <div className="p-5">
                {/* En-tête */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`text-sm font-semibold ${isToday ? "text-gray-900" : "text-gray-700"}`}>
                      {d.dayName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isToday && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
                          Aujourd&apos;hui
                        </span>
                      )}
                      {hasExercises && (
                        <span className="text-[10px] text-gray-400">
                          {d.exercises.reduce((acc: number, ex: any) => acc + ex.sets, 0)} séries
                        </span>
                      )}
                    </div>
                  </div>
                  {hasExercises && (
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      dayColors[colorIdx].split(' ')[0] + ' ' + dayColors[colorIdx].split(' ')[1].replace('border-', 'text-')
                    }`}>
                      {d.exercises.length}
                    </div>
                  )}
                </div>

                {/* Infos rapides */}
                {hasExercises ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-600">{getWarmUpTypeLabel(d.label)}</span>
                      <span>·</span>
                      <span>~{Math.round(d.exercises.reduce((acc: number, ex: any) => acc + ex.rest_seconds * ex.sets, 0) / 60)} min</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(d.exercises.map((ex: any) => ex.exercise.primary_muscle || ex.exercise.muscle_group))).slice(0, 4).map((m: string) => (
                        <span key={m} className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500">{m}</span>
                      ))}
                      {Array.from(new Set(d.exercises.map((ex: any) => ex.exercise.primary_muscle || ex.exercise.muscle_group))).length > 4 && (
                        <span className="text-[10px] text-gray-400">+</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-center">
                    <p className="text-xs text-gray-300">Repos</p>
                  </div>
                )}

                {/* Bouton Voir */}
                {hasExercises && (
                  <Link
                    href={`/workout/${d.day}`}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all"
                  >
                    Voir la séance
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
