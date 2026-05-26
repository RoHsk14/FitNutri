"use client"

import { useState } from "react"
import { Modal } from "@/components/ui"

interface ExerciseData {
  id: string
  sets: number
  reps: number
  rest_seconds: number
  sort_order: number
  exercise: {
    name: string
    muscle_group: string
    description: string | null
    image_url?: string | null
    video_url?: string | null
    ms_video_url?: string | null
    primary_muscle?: string | null
    synergist_muscles?: string[] | null
    mechanics?: string | null
    equipment?: string | null
  }
}

interface Props {
  exercise: ExerciseData
  index?: number
  showCheckbox?: boolean
  completed?: boolean
  animating?: boolean
  onToggle?: () => void
}

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

const EQUIP_FR: Record<string, string> = {
  BARBELL: "à la barre", DUMBBELL: "aux haltères", BODYWEIGHT: "au poids du corps", CABLE: "à la poulie", MACHINE: "à la machine",
}

function getDescFr(ex: ExerciseData["exercise"]): string {
  const mech = ex.mechanics === "COMPOUND" ? "polyarticulaire" : "d'isolation"
  const equip = ex.equipment ? EQUIP_FR[ex.equipment] : null
  const muscle = (ex.primary_muscle ?? ex.muscle_group)
  if (mech && equip) return `Exercice ${mech} pour ${muscle.toLowerCase()} ${equip}`
  if (mech) return `Exercice ${mech} pour ${muscle.toLowerCase()}`
  if (equip) return `Exercice pour ${muscle.toLowerCase()} ${equip}`
  return `Exercice pour ${muscle.toLowerCase()}`
}

export function ExerciseDetail({ exercise: ex, index, showCheckbox, completed, animating, onToggle }: Props) {
  const [open, setOpen] = useState(false)

  const videoId = ex.exercise.video_url ? getYouTubeId(ex.exercise.video_url) : null
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : ex.exercise.image_url ?? null

  return (
    <>
      <div
        className={`exercise-list-item group relative flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300 ${
          completed
            ? "border-emerald-200 bg-emerald-50/60 shadow-sm shadow-emerald-100"
            : "border-gray-100 bg-white hover:bg-gray-50/80 hover:border-gray-200 hover:shadow-md"
        } ${animating ? "scale-[1.02] shadow-lg ring-2 ring-emerald-400/30" : ""}`}
      >
        {/* Checkbox */}
        {showCheckbox && onToggle && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle() }}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              completed
                ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-300"
                : "border-gray-200 bg-white hover:border-teal-400 hover:shadow-sm"
            }`}
          >
            {completed && (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </button>
        )}

        {/* Thumbnail */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm"
        >
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="" className={`h-full w-full object-cover transition-all duration-300 ${completed ? "opacity-50 grayscale" : "group-hover:scale-110"}`} loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-300">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          )}
          {videoId && !completed && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                <svg className="ml-0.5 h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </button>

        {/* Content */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-w-0 flex-1 items-center justify-between gap-2"
        >
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-semibold leading-snug transition-all ${completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
              {ex.exercise.name}
            </p>
            <p className={`mt-0.5 text-xs transition-all ${completed ? "text-gray-300" : "text-gray-400"}`}>
              X{ex.reps} · {ex.sets} séries
            </p>
          </div>

          {/* Info icon */}
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
            completed 
              ? "bg-emerald-100 text-emerald-500" 
              : "bg-gray-50 text-gray-300 group-hover:bg-teal-50 group-hover:text-teal-500"
          }`}>
            {completed ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            )}
          </div>
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={ex.exercise.name}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{ex.exercise.muscle_group}</span>
            {ex.exercise.primary_muscle && ex.exercise.primary_muscle !== ex.exercise.muscle_group && (
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600">Cible : {ex.exercise.primary_muscle}</span>
            )}
            {ex.exercise.mechanics && (
              <span className={`rounded-full px-2.5 py-1 ${ex.exercise.mechanics === 'COMPOUND' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {ex.exercise.mechanics === 'COMPOUND' ? 'Polyarticulaire' : 'Isolement'}
              </span>
            )}
            {ex.exercise.equipment && (
              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-purple-600">{ex.exercise.equipment}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600">{ex.sets} séries × {ex.reps} reps</span>
            <span className="rounded-full bg-gray-50 px-3 py-1 text-gray-500">{ex.rest_seconds}s de repos</span>
          </div>

          {ex.exercise.synergist_muscles && ex.exercise.synergist_muscles.length > 0 && (
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Muscles secondaires</h4>
              <div className="flex flex-wrap gap-1.5">
                {ex.exercise.synergist_muscles.map((m: string) => (
                  <span key={m} className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500">{m}</span>
                ))}
              </div>
            </div>
          )}

          {videoId && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={ex.exercise.name}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {!videoId && thumbnailUrl && (
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <img src={thumbnailUrl} alt={ex.exercise.name} className="w-full object-cover" loading="lazy" />
            </div>
          )}

          {!videoId && !thumbnailUrl && (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
              <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          )}

          {ex.exercise.ms_video_url && (
            <a
              href={ex.exercise.ms_video_url}
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

          {ex.exercise.description && (
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Exécution</h4>
              <p className="text-sm leading-relaxed text-gray-600">{ex.exercise.description}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
