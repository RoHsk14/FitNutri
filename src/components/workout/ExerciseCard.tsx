"use client"

import { useState } from "react"
import { Modal } from "@/components/ui"

interface ExerciseCardData {
  id: string
  name: string
  muscle_group: string
  description: string | null
  image_url: string | null
  video_url: string | null
  ms_video_url: string | null
  primary_muscle: string | null
  synergist_muscles: string[] | null
  mechanics: string | null
  equipment: string | null
}

interface Props {
  exercise: ExerciseCardData
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

export function ExerciseCard({ exercise: ex }: Props) {
  const [open, setOpen] = useState(false)

  const videoId = ex.video_url ? getYouTubeId(ex.video_url) : null
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : ex.image_url ?? null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group w-full overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm transition-all hover:shadow-md hover:border-gray-200"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          )}
          {videoId && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 transition-transform group-hover:scale-110">
                <svg className="ml-0.5 h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-3.5">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{ex.name}</h3>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-600">
              {ex.muscle_group}
            </span>
            {ex.mechanics && (
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                ex.mechanics === "COMPOUND"
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
              }`}>
                {ex.mechanics === "COMPOUND" ? "Polyarticulaire" : "Isolement"}
              </span>
            )}
            {ex.equipment && (
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-600">
                {ex.equipment}
              </span>
            )}
          </div>

          {ex.primary_muscle && ex.primary_muscle !== ex.muscle_group && (
            <p className="mt-1.5 text-[11px] text-gray-400">
              Cible : <span className="font-medium text-gray-500">{ex.primary_muscle}</span>
            </p>
          )}

          {ex.description && (
            <p className="mt-1.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {ex.description}
            </p>
          )}
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={ex.name}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{ex.muscle_group}</span>
            {ex.primary_muscle && ex.primary_muscle !== ex.muscle_group && (
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600">Cible : {ex.primary_muscle}</span>
            )}
            {ex.mechanics && (
              <span className={`rounded-full px-2.5 py-1 ${ex.mechanics === 'COMPOUND' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {ex.mechanics === 'COMPOUND' ? 'Polyarticulaire' : 'Isolement'}
              </span>
            )}
            {ex.equipment && (
              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-purple-600">{ex.equipment}</span>
            )}
          </div>

          {ex.synergist_muscles && ex.synergist_muscles.length > 0 && (
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Muscles secondaires</h4>
              <div className="flex flex-wrap gap-1.5">
                {ex.synergist_muscles.map((m: string) => (
                  <span key={m} className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500">{m}</span>
                ))}
              </div>
            </div>
          )}

          {videoId && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={ex.name}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {!videoId && thumbnailUrl && (
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <img src={thumbnailUrl} alt={ex.name} className="w-full object-cover" loading="lazy" />
            </div>
          )}

          {!videoId && !thumbnailUrl && (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
              <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          )}

          {ex.ms_video_url && (
            <a
              href={ex.ms_video_url}
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

          {ex.description && (
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Exécution</h4>
              <p className="text-sm leading-relaxed text-gray-600">{ex.description}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
