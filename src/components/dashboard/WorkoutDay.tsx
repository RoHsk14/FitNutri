"use client"

import { Button } from "@/components/ui"
import { ExerciseDetail } from "@/components/workout"

interface Exercise {
  id: string
  sets: number
  reps: number
  rest_seconds: number
  sort_order: number
  exercise: { name: string; muscle_group: string; description: string | null; image_url?: string | null; video_url?: string | null }
}

interface Props {
  workout: {
    title: string
    dayLabel: string
    exercises: Exercise[]
  } | null
}

export function WorkoutDay({ workout }: Props) {
  if (!workout || workout.exercises.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
          <svg className="h-6 w-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-400">Jour de repos</p>
        <p className="mt-0.5 text-xs text-gray-300">Profitez-en pour récupérer !</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{workout.title}</p>
          <h3 className="text-base font-bold text-gray-900 mt-0.5">{workout.dayLabel}</h3>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">
          {workout.exercises.length}
        </div>
      </div>
      <div className="space-y-2.5">
        {workout.exercises.map((ex, i) => (
          <ExerciseDetail key={ex.id} exercise={ex} index={i} showCheckbox />
        ))}
      </div>
    </div>
  )
}
