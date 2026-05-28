import { WorkoutFilters } from "@/components/workout"
import { Card } from "@/components/ui"
import { RegenerateProgramButton } from "@/components/dashboard"
import { getWorkoutPageData, getCustomWorkoutHistory } from "@/lib/actions"
import Link from "next/link"

export default async function WorkoutPage() {
  const { profile, weekly, completions } = await getWorkoutPageData()
  const today = new Date().getDay()
  const currentDay = today === 0 ? 7 : today
  const customHistory = await getCustomWorkoutHistory(7)

  return (
    <div className="space-y-10">
      {/* Programme automatique */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Programme d&apos;entraînement</h2>
            {profile && weekly && (
              <p className="text-sm text-gray-500 mt-0.5">{weekly.plan.title}</p>
            )}
          </div>
          {profile && weekly && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                Semaine {weekly.plan.duration_weeks}
              </span>
              <RegenerateProgramButton compact />
            </div>
          )}
        </div>

        {profile && weekly ? (
          <WorkoutFilters weekly={weekly} currentDay={currentDay} initialCompletions={completions} />
        ) : profile ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-7 w-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Aucun programme actif</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Le programme automatique n&apos;a pas pu être généré. Tu peux réessayer ou utiliser les séances personnalisées ci-dessous.
            </p>
            <div className="mt-5">
              <RegenerateProgramButton />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-14 text-center">
            <h3 className="text-base font-semibold text-gray-900">Programme non disponible</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Finalise d&apos;abord ton onboarding pour générer un programme personnalisé.
            </p>
            <Link
              href="/onboarding"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-all"
            >
              Commencer l&apos;onboarding
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Séances personnalisées */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Séances personnalisées</h2>
            <p className="text-sm text-gray-500 mt-0.5">Crée tes propres séances exercice par exercice</p>
          </div>
          <Link
            href="/workout/personnalise"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouvelle séance
          </Link>
        </div>

        {customHistory.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customHistory.map((session: { date: string; count: number; exercises: string[] }) => (
              <Link key={session.date} href="/workout/personnalise" className="group">
                <Card>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {new Date(session.date + "T12:00:00").toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {session.exercises.join(" · ")}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-medium text-primary-700">
                        {session.count} séries
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-gray-600">
                        {session.exercises.length} exercices
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-7 w-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Aucune séance personnalisée</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Lance-toi en créant ta première séance sur mesure, avec les exercices de ton choix.
            </p>
            <Link
              href="/workout/personnalise"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-all"
            >
              Créer une séance
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
