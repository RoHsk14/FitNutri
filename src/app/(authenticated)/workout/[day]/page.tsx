import { getWorkoutPageData } from "@/lib/actions"
import { getWarmUp, getWarmUpType, type WarmUpExercise } from "@/lib/warmup"
import Link from "next/link"
import { DayDetailClient } from "./DayDetailClient"

const DAY_NAMES: Record<number, string> = { 1: "Lundi", 2: "Mardi", 3: "Mercredi", 4: "Jeudi", 5: "Vendredi", 6: "Samedi", 7: "Dimanche" }
const DAY_SHORT: Record<number, string> = { 1: "Lun", 2: "Mar", 3: "Mer", 4: "Jeu", 5: "Ven", 6: "Sam", 7: "Dim" }
const DAY_COLORS = ["bg-rose-50 border-rose-200", "bg-orange-50 border-orange-200", "bg-amber-50 border-amber-200", "bg-lime-50 border-lime-200", "bg-emerald-50 border-emerald-200", "bg-sky-50 border-sky-200", "bg-violet-50 border-violet-200"]

const LEVEL_FR: Record<string, string> = { BEGINNER: "Débutant", INTERMEDIATE: "Intermédiaire", ADVANCED: "Avancé" }
const EQUIP_LABELS: Record<string, string> = { BARBELL: "Barre", DUMBBELL: "Haltères", BODYWEIGHT: "Poids du corps", CABLE: "Poulie", MACHINE: "Machine" }
const EQUIP_ICONS: Record<string, string> = { BARBELL: "🏋️", DUMBBELL: "💪", BODYWEIGHT: "🧘", CABLE: "⚙️", MACHINE: "🦾" }
const WARMUP_LABELS: Record<string, string> = { PUSH: "Échauffement Poussée", PULL: "Échauffement Tirage", LEGS: "Échauffement Jambes", FULL_BODY: "Échauffement Général", SHOULDERS: "Échauffement Épaules", GLUTES: "Échauffement Fessiers", CORE: "Échauffement Gainage" }
const LEVEL_ICONS: Record<string, string> = { BEGINNER: "🌱", INTERMEDIATE: "💪", ADVANCED: "🔥" }

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

function getWarmUpTypeLabel(label: string | null): string {
  return WARMUP_LABELS[getWarmUpType(label ?? "")] ?? "Échauffement"
}

export default async function DayDetailPage({ params }: { params: { day: string } }) {
  const dayNum = parseInt(params.day)
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 7) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-400">Jour invalide</p>
      </div>
    )
  }

  const { profile, weekly, completions } = await getWorkoutPageData()

  if (!profile || !weekly) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <p className="text-gray-500">Aucun programme actif</p>
          <Link href="/onboarding" className="mt-4 inline-flex rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white">
            Commencer l&apos;onboarding
          </Link>
        </div>
      </div>
    )
  }

  const dayData = weekly.days.find(d => d.day === dayNum)
  if (!dayData || dayData.exercises.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-400">Jour de repos — profitez-en pour récupérer !</p>
      </div>
    )
  }

  const today = new Date().getDay()
  const currentDay = today === 0 ? 7 : today
  const dayOffset = dayNum - currentDay
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + dayOffset)
  const dateStr = targetDate.toISOString().split("T")[0]

  return (
    <div>
      {/* Header avec retour */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/workout"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{DAY_NAMES[dayNum]}</h1>
          <p className="text-sm text-gray-400">{weekly.plan.title}</p>
        </div>
      </div>

      <DayDetailClient
        dayData={dayData}
        dayNum={dayNum}
        plan={weekly.plan}
        dateStr={dateStr}
        initialCompletions={completions.daily[dateStr] ?? []}
      />
    </div>
  )
}
