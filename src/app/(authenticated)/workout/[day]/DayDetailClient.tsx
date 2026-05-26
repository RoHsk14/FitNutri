"use client"

import { useState } from "react"
import { getWarmUp, getWarmUpType, type WarmUpExercise } from "@/lib/warmup"
import { toggleExerciseCompletion } from "@/lib/actions"
import { Modal } from "@/components/ui"

interface Props {
  dayData: {
    day: number
    dayName: string
    label: string | null
    exercises: any[]
  }
  dayNum: number
  plan: { title: string; description: string; duration_weeks: number; level?: string; goal_type?: string }
  dateStr: string
  initialCompletions: string[]
}

const EQUIP_LABELS: Record<string, string> = { BARBELL: "Barre", DUMBBELL: "Haltères", BODYWEIGHT: "Poids du corps", CABLE: "Poulie", MACHINE: "Machine" }
const EQUIP_ICONS: Record<string, string> = { BARBELL: "🏋️", DUMBBELL: "💪", BODYWEIGHT: "🧘", CABLE: "⚙️", MACHINE: "🦾" }
const LEVEL_FR: Record<string, string> = { BEGINNER: "Débutant", INTERMEDIATE: "Intermédiaire", ADVANCED: "Avancé" }
const WARMUP_LABELS: Record<string, string> = { PUSH: "Échauffement Poussée", PULL: "Échauffement Tirage", LEGS: "Échauffement Jambes", FULL_BODY: "Échauffement Général", SHOULDERS: "Échauffement Épaules", GLUTES: "Échauffement Fessiers", CORE: "Échauffement Gainage" }
const DAY_NAMES: Record<number, string> = { 1: "Lundi", 2: "Mardi", 3: "Mercredi", 4: "Jeudi", 5: "Vendredi", 6: "Samedi", 7: "Dimanche" }

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function ExerciseImage({ ex, size = "md" }: { ex: any; size?: "sm" | "md" | "lg" }) {
  const videoId = ex.exercise.video_url ? getYouTubeId(ex.exercise.video_url) : null
  const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : ex.exercise.image_url ?? null
  const dims = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-full w-full" : "h-14 w-20"
  return (
    <div className={`${dims} shrink-0 overflow-hidden rounded-lg bg-gray-100`}>
      {thumbUrl ? (
        <img src={thumbUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-300">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
      )}
    </div>
  )
}

function getWarmUpTypeLabel(label: string | null): string {
  return WARMUP_LABELS[getWarmUpType(label ?? "")] ?? "Échauffement"
}

export function DayDetailClient({ dayData, dayNum, plan, dateStr, initialCompletions }: Props) {
  const [completed, setCompleted] = useState<string[]>(initialCompletions)
  const [selectedEx, setSelectedEx] = useState<any>(null)
  const d = dayData
  const hasExercises = d.exercises.length > 0
  const estTimeMin = Math.round(d.exercises.reduce((acc: number, ex: any) => acc + ex.rest_seconds * ex.sets, 0) / 60)
  const uniqueEquipment = Array.from(new Set(d.exercises.map((ex: any) => ex.exercise.equipment).filter(Boolean))) as string[]
  const allMuscles = Array.from(new Set(d.exercises.map((ex: any) => ex.exercise.primary_muscle || ex.exercise.muscle_group)))
  const firstEx = d.exercises[0]
  const levelFr = LEVEL_FR[plan.level ?? ""] ?? "Intermédiaire"
  const totalSets = d.exercises.reduce((acc: number, ex: any) => acc + ex.sets, 0)

  const handleToggle = async (sessionId: string, isDone: boolean) => {
    setCompleted(prev => isDone ? prev.filter(id => id !== sessionId) : [...prev, sessionId])
    await toggleExerciseCompletion(sessionId, !isDone)
  }

  const dayColors = ["bg-rose-50", "bg-orange-50", "bg-amber-50", "bg-lime-50", "bg-emerald-50", "bg-sky-50", "bg-violet-50"]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ─── VUE D'ENSEMBLE ─── */}
      <div className="space-y-5">
        {/* Image d'en-tête */}
        <div className="relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900">
          {firstEx?.exercise?.image_url || firstEx?.exercise?.video_url ? (
            <img
              src={
                firstEx.exercise.video_url && getYouTubeId(firstEx.exercise.video_url)
                  ? `https://img.youtube.com/vi/${getYouTubeId(firstEx.exercise.video_url)}/hqdefault.jpg`
                  : firstEx.exercise.image_url
              }
              alt=""
              className="h-full w-full object-cover opacity-70"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="h-20 w-20 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-xl font-bold text-white">{DAY_NAMES[dayNum]}</p>
            {d.label && (
              <span className="inline-block mt-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {getWarmUpTypeLabel(d.label)}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">À propos de cette séance</h4>
          <p className="text-sm leading-relaxed text-gray-600">
            {plan.description || "Séance ciblée pour développer votre force et votre endurance. Suivez le programme pour des résultats optimaux."}
          </p>
        </div>

        {/* Badges stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <span className="text-2xl">⏱️</span>
            <p className="mt-1.5 text-base font-bold text-amber-700">{estTimeMin} min</p>
            <p className="text-[10px] text-amber-500">Temps estimé</p>
          </div>
          <div className="rounded-xl bg-orange-50 p-4 text-center">
            <span className="text-2xl">{"🔥"}</span>
            <p className="mt-1.5 text-base font-bold text-orange-700">{totalSets}</p>
            <p className="text-[10px] text-orange-500">Séries totales</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-4 text-center">
            <span className="text-2xl">⚡</span>
            <p className="mt-1.5 text-base font-bold text-violet-700">{levelFr}</p>
            <p className="text-[10px] text-violet-500">Niveau</p>
          </div>
        </div>

        {/* Équipement */}
        {uniqueEquipment.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Équipement nécessaire</h4>
              <span className="text-[11px] text-gray-400">{uniqueEquipment.length} élément{uniqueEquipment.length > 1 ? "s" : ""}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {uniqueEquipment.map(eq => (
                <div key={eq} className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <span className="text-2xl">{EQUIP_ICONS[eq] ?? "🏋️"}</span>
                  <span className="text-xs font-medium text-gray-600">{EQUIP_LABELS[eq] ?? eq}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Muscles travaillés */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Muscles ciblés</h4>
          <div className="flex flex-wrap gap-2">
            {allMuscles.map(m => (
              <span key={m} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── LISTE DES EXERCICES ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Exercices</h2>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
            {d.exercises.length} exercice{d.exercises.length > 1 ? "s" : ""} · {completed.length}/{d.exercises.length} fait{completed.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Warm-up */}
        {d.label && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-semibold text-amber-600 flex items-center gap-1.5">
                <span>🔥</span> {getWarmUpTypeLabel(d.label)}
              </h5>
              <span className="text-[10px] text-gray-400">{getWarmUp(d.label).length} exercices · 2 min</span>
            </div>
            <div className="space-y-2">
              {getWarmUp(d.label).map((wu: WarmUpExercise, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-white p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-lg">
                    {["🙆", "🤸", "🧘"][i % 3]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{wu.name}</p>
                    <p className="text-[11px] text-amber-500">{wu.duration}</p>
                  </div>
                  <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-[10px] text-amber-400 hover:bg-amber-100 transition-colors">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repos intercalé */}
        {d.label && (
          <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-mono text-sm font-bold shadow-sm">
              00:30
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-700">Repos</p>
              <p className="text-[11px] text-emerald-500">Récupérez entre l&apos;échauffement et la séance</p>
            </div>
            <span className="text-xs font-medium text-emerald-600">0:30</span>
          </div>
        )}

        {/* Workout */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <span>💪</span> Séance principale
            </h5>
            <span className="text-[10px] text-gray-400">{d.exercises.length} exercices · ~{estTimeMin} min</span>
          </div>
          <div className="space-y-2">
            {d.exercises.map((ex: any, i: number) => {
              const isDone = completed.includes(ex.id)
              return (
                <div
                  key={ex.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    isDone
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggle(ex.id, isDone)}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                      isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-gray-300 bg-white hover:border-primary-400"
                    }`}
                  >
                    {isDone && (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>

                  {/* Miniature + infos (clic → modal) */}
                  <button
                    type="button"
                    onClick={() => setSelectedEx(ex)}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <ExerciseImage ex={ex} size="sm" />
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-500">
                          {i + 1}
                        </span>
                        <p className={`truncate text-sm font-medium ${isDone ? "text-gray-400 line-through" : "text-gray-900"}`}>
                          {ex.exercise.name}
                        </p>
                        {isDone && (
                          <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600">Fait</span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                        <span>{ex.sets}×{ex.reps}</span>
                        <span>·</span>
                        <span>{ex.exercise.muscle_group}</span>
                        {ex.exercise.equipment && <><span>·</span><span>{ex.exercise.equipment}</span></>}
                      </div>
                    </div>
                  </button>

                  {/* Détails */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{ex.rest_seconds}s</span>
                    <svg className="h-3.5 w-3.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal détails exercice */}
      <Modal open={!!selectedEx} onClose={() => setSelectedEx(null)} title={selectedEx?.exercise?.name ?? ""}>
        {selectedEx && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{selectedEx.exercise.muscle_group}</span>
              {selectedEx.exercise.primary_muscle && selectedEx.exercise.primary_muscle !== selectedEx.exercise.muscle_group && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600">Cible : {selectedEx.exercise.primary_muscle}</span>
              )}
              {selectedEx.exercise.mechanics && (
                <span className={`rounded-full px-2.5 py-1 ${selectedEx.exercise.mechanics === 'COMPOUND' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  {selectedEx.exercise.mechanics === 'COMPOUND' ? 'Polyarticulaire' : 'Isolement'}
                </span>
              )}
              {selectedEx.exercise.equipment && (
                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-purple-600">
                  {EQUIP_LABELS[selectedEx.exercise.equipment] ?? selectedEx.exercise.equipment}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600">{selectedEx.sets} séries × {selectedEx.reps} reps</span>
              <span className="rounded-full bg-gray-50 px-3 py-1 text-gray-500">{selectedEx.rest_seconds}s de repos</span>
            </div>

            {selectedEx.exercise.synergist_muscles && selectedEx.exercise.synergist_muscles.length > 0 && (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Muscles secondaires</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEx.exercise.synergist_muscles.map((m: string) => (
                    <span key={m} className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const videoId = selectedEx.exercise.video_url ? getYouTubeId(selectedEx.exercise.video_url) : null
              const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : selectedEx.exercise.image_url ?? null
              return (
                <>
                  {videoId && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={selectedEx.exercise.name}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {!videoId && thumbUrl && (
                    <div className="overflow-hidden rounded-lg bg-gray-100">
                      <img src={thumbUrl} alt={selectedEx.exercise.name} className="w-full object-cover" loading="lazy" />
                    </div>
                  )}
                  {!videoId && !thumbUrl && (
                    <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
                      <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                  )}
                </>
              )
            })()}

            {selectedEx.exercise.ms_video_url && (
              <a
                href={selectedEx.exercise.ms_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Voir la démonstration sur Muscle &amp; Strength
              </a>
            )}

            {selectedEx.exercise.description && (
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Exécution</h4>
                <p className="text-sm leading-relaxed text-gray-600">{selectedEx.exercise.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
