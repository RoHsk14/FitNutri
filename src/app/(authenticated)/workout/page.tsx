import { WorkoutFilters } from "@/components/workout"
import { getCurrentProfile, getWeeklyWorkout, getWeeklyCompletions } from "@/lib/actions"

export default async function WorkoutPage() {
  const [profile, weekly, completions] = await Promise.all([
    getCurrentProfile(),
    getWeeklyWorkout(),
    getWeeklyCompletions(),
  ])

  const today = new Date().getDay()
  const currentDay = today === 0 ? 7 : today

  return (
    <>
      {profile && weekly ? (
        <div className="space-y-6">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 sm:p-8 shadow-xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">{weekly.plan.title}</h1>
                  <p className="text-sm text-gray-300 max-w-xl">{weekly.plan.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm border border-white/10">
                  {weekly.plan.duration_weeks} semaines
                </span>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <WorkoutFilters weekly={weekly} currentDay={currentDay} initialCompletions={completions} />
        </div>
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
              <svg className="h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aucun programme actif</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Finalisez le questionnaire d&apos;onboarding pour générer votre
              programme d&apos;entraînement personnalisé avec exercices, séries et répétitions adaptés à vos objectifs.
            </p>
            <a
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-all"
            >
              Commencer l&apos;onboarding
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </>
  )
}
