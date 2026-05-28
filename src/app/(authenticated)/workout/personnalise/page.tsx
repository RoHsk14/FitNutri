"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, Modal } from "@/components/ui"
import { ExerciseCard } from "@/components/workout"
import { RestTimer } from "@/components/workout/RestTimer"
import { generateWorkoutFromMuscles, searchExercises, saveCustomSession } from "@/lib/actions"

const MUSCLE_GROUPS = [
  "Pectoraux", "Dos", "Quadriceps", "Fessiers", "Hamstrings",
  "Shoulders", "Biceps", "Triceps", "Abdominaux", "Calves",
  "Cardio",
]

type Exercise = any

export default function CustomWorkoutPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"auto" | "manual">("auto")

  // Mode auto
  const [selected, setSelected] = useState<string[]>([])
  const [autoSets, setAutoSets] = useState(3)
  const [autoReps, setAutoReps] = useState(12)
  const [autoRest, setAutoRest] = useState(60)
  const [autoResult, setAutoResult] = useState<Exercise[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Mode manuel
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Exercise[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [pickSets, setPickSets] = useState(3)
  const [pickReps, setPickReps] = useState(12)
  const [pickRest, setPickRest] = useState(60)
  const searchRef = useRef<HTMLDivElement>(null)

  // Workout player
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([])
  const [completed, setCompleted] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null)

  // Debounced search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setSearchResults([]); setShowResults(false); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchExercises(q)
        setSearchResults(results)
        setShowResults(true)
      } catch {} finally { setSearching(false) }
    }, 300)
  }, [])

  const pickExercise = (ex: Exercise) => {
    setExercises(prev => [...prev, { ...ex, sets: pickSets, reps: pickReps, restSeconds: pickRest }])
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
  }

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  const toggleMuscle = (m: string) => {
    setSelected(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  const handleGenerate = async () => {
    if (selected.length === 0) return
    setLoading(true)
    setError("")
    setAutoResult(null)
    try {
      const { exercises } = await generateWorkoutFromMuscles(selected, {
        sets: autoSets, reps: autoReps, restSeconds: autoRest,
      })
      if (exercises.length === 0) {
        setError("Aucun exercice trouvé pour ces muscles")
      } else {
        setAutoResult(exercises)
      }
    } catch { setError("Erreur lors de la génération") }
    setLoading(false)
  }

  const startWorkout = async (exs: Exercise[]) => {
    setWorkoutExercises(exs)
    setWorkoutStarted(true)
  }

  const handleToggle = async (id: string, isDone: boolean) => {
    setCompleted(prev => isDone ? prev.filter(x => x !== id) : [...prev, id])
  }

  const finishWorkout = async () => {
    setSaving(true)
    try {
      await saveCustomSession(workoutExercises.map(ex => ({
        name: ex.name,
        muscle_group: ex.muscle_group || ex.muscleGroup || null,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.restSeconds || ex.rest_seconds || 60,
      })))
      setSaved(true)
      router.refresh()
    } catch {
      setError("Erreur lors de la sauvegarde de la séance")
    } finally { setSaving(false) }
  }

  // ─── WORKOUT PLAYER ───
  if (workoutStarted) {
    const exKey = (i: number) => `ex-${i}`
    const allDone = workoutExercises.every((_, i) => completed.includes(exKey(i)))
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Séance personnalisée</h1>
            <p className="text-sm text-gray-500">
              {completed.length}/{workoutExercises.length} exercices faits
            </p>
          </div>
          {!saved && allDone && (
            <button
              type="button"
              onClick={finishWorkout}
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Sauvegarde..." : "Terminer la séance"}
            </button>
          )}
          {saved && (
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              ✅ Séance terminée
            </span>
          )}
        </div>

        <RestTimer defaultSeconds={workoutExercises[0]?.restSeconds || 60} />

        <div className="space-y-3">
          {workoutExercises.map((ex, i) => {
            const key = exKey(i)
            const isDone = completed.includes(key)
            return (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                  isDone ? "border-emerald-200 bg-emerald-50/50" : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(key, isDone)}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                    isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-300 bg-white hover:border-primary-400"
                  }`}
                >
                  {isDone && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEx(ex)}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {ex.image_url || ex.video_url ? (
                      <img
                        src={ex.video_url
                          ? `https://img.youtube.com/vi/${ex.video_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1] || ""}/mqdefault.jpg`
                          : ex.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-300">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-500">
                        {i + 1}
                      </span>
                      <p className={`truncate text-sm font-medium ${isDone ? "text-gray-400 line-through" : "text-gray-900"}`}>
                        {ex.name}
                      </p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {ex.sets}×{ex.reps} · {ex.muscle_group || ex.muscleGroup}
                    </p>
                  </div>
                </button>

                <span className="shrink-0 text-xs text-gray-400">{ex.restSeconds || 60}s</span>
              </div>
            )
          })}
        </div>

        <Modal open={!!selectedEx} onClose={() => setSelectedEx(null)} title={selectedEx?.name ?? ""}>
          {selectedEx && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                  {selectedEx.muscle_group || selectedEx.muscleGroup}
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {selectedEx.sets}×{selectedEx.reps}
                </span>
                <span className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-500">
                  {selectedEx.restSeconds}s repos
                </span>
              </div>
              {(() => {
                const videoId = selectedEx.video_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1]
                const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : selectedEx.image_url
                return videoId ? (
                  <div className="aspect-video overflow-hidden rounded-lg bg-black">
                    <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} className="h-full w-full" allow="autoplay" allowFullScreen />
                  </div>
                ) : thumbUrl ? (
                  <div className="overflow-hidden rounded-lg bg-gray-100">
                    <img src={thumbUrl} alt="" className="w-full object-cover" />
                  </div>
                ) : null
              })()}
              {selectedEx.description && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Exécution</h4>
                  <p className="text-sm leading-relaxed text-gray-600">{selectedEx.description}</p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    )
  }

  // ─── CONFIGURATION ───
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Séance personnalisée</h1>
        <p className="text-sm text-gray-500">Crée ta séance sur mesure.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            mode === "auto" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Automatique
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            mode === "manual" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Manuel
        </button>
      </div>

      {/* MODE AUTO */}
      {mode === "auto" && (
        <div className="space-y-4">
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres des exercices</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Séries</label>
                <input type="number" min={1} max={10} value={autoSets} onChange={(e) => setAutoSets(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Répétitions</label>
                <input type="number" min={1} max={50} value={autoReps} onChange={(e) => setAutoReps(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Repos (s)</label>
                <input type="number" min={0} max={300} step={15} value={autoRest} onChange={(e) => setAutoRest(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={selected.length === 0 || loading}
              className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Recherche..." : `Générer la séance (${selected.length} muscle${selected.length > 1 ? "s" : ""})`}
            </button>
          </Card>

          {autoResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Séance générée ({autoResult.length} exercices)</h2>
                {!saving && (
                  <button
                    type="button"
                    onClick={() => startWorkout(autoResult)}
                    className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-700 transition-colors"
                  >
                    Commencer l&apos;entraînement
                  </button>
                )}
                {saving && (
                  <span className="text-sm text-gray-400">Création de la séance...</span>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {autoResult.map((ex: Exercise) => (
                  <ExerciseCard key={ex.sortOrder} exercise={ex} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE MANUEL */}
      {mode === "manual" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rechercher un exercice</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher un exercice (ex: développé couché)..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                />
                {searching && (
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">Recherche...</span>
                )}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {searchResults.map(ex => {
                      const thumbUrl = ex.video_url
                        ? `https://img.youtube.com/vi/${ex.video_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1] || ""}/mqdefault.jpg`
                        : ex.image_url
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => pickExercise(ex)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {thumbUrl ? (
                              <img src={thumbUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-gray-300">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{ex.name}</p>
                            <p className="text-xs text-gray-400">{ex.muscle_group}</p>
                          </div>
                          <svg className="h-4 w-4 shrink-0 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      )
                    })}
                  </div>
                )}
                {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !searching && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 text-center shadow-lg">
                    <p className="text-sm text-gray-400">Aucun exercice trouvé</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Séries</label>
                  <input type="number" min={1} max={10} value={pickSets} onChange={(e) => setPickSets(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Répétitions</label>
                  <input type="number" min={1} max={50} value={pickReps} onChange={(e) => setPickReps(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Repos (s)</label>
                  <input type="number" min={0} max={300} step={15} value={pickRest} onChange={(e) => setPickRest(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" />
                </div>
              </div>
            </div>
          </Card>

          {exercises.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Ma séance ({exercises.length} exercice{exercises.length > 1 ? "s" : ""})</h2>
                {!saving && (
                  <button
                    type="button"
                    onClick={() => startWorkout(exercises)}
                    className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-700 transition-colors"
                  >
                    Commencer l&apos;entraînement
                  </button>
                )}
                {saving && (
                  <span className="text-sm text-gray-400">Création de la séance...</span>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exercises.map((ex, i) => (
                  <div key={ex.id + i} className="group relative">
                    <button
                      type="button"
                      onClick={() => removeExercise(ex.id)}
                      className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-400 shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                    <ExerciseCard exercise={ex} />
                    <div className="mt-1.5 flex items-center justify-between px-1">
                      <span className="text-xs text-gray-400">
                        {ex.sets}×{ex.reps} · {ex.restSeconds}s repos
                      </span>
                      <span className="text-[10px] text-gray-300">#{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {exercises.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-400">Recherche et ajoute des exercices depuis la base de données pour construire ta séance.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
