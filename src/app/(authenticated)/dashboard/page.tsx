import { StatsCard, MacroProgress, CalorieRing, WeekOverview, WorkoutDay, MealSuggestions, WaterTracker } from "@/components/dashboard"
import { Card } from "@/components/ui"
import { getCurrentProfile, getTodaysWorkout, getWeeklyWorkout, getDailyMeals } from "@/lib/actions"
import { calculateBMI } from "@/lib/calculations"
import type { Database } from "@/lib/database.types"

type Profile = Database["public"]["Tables"]["fit_user_profiles"]["Row"]

const today = new Date()
const jours = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"]
const mois = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"]

const GOAL_LABELS: Record<string, string> = {
  LOSE_FAT: "Perte de poids",
  GAIN_MUSCLE: "Prise de muscle",
  MAINTENANCE: "Remise en forme",
}

export default async function DashboardPage() {
  const profile: Profile | null = await getCurrentProfile()
  const todayWorkout = await getTodaysWorkout()
  const weekly = await getWeeklyWorkout()
  const dailyMeals = await getDailyMeals()

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Bonjour {profile ? "👋" : "et bienvenue !"}
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            {jours[today.getDay()]} {today.getDate()} {mois[today.getMonth()]} {today.getFullYear()}
          </p>
        </div>
        {profile && (
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-default select-none">
            <span className="text-sm leading-none animate-pulse">🔥</span>
            <span className="text-[10px] font-extrabold leading-none mt-0.5">0</span>
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatsCard
          label="Calories / jour"
          value={profile ? `${profile.target_calories}` : "--"}
          unit="kcal"
          icon="🔥"
          color="blue"
        />
        <StatsCard
          label="Protéines"
          value={profile ? `${profile.target_protein_g}` : "--"}
          unit="g"
          icon="🥩"
          color="rose"
        />
        <StatsCard
          label="Séances / semaine"
          value={weekly ? `${weekly.days.length}` : "0"}
          unit={`/ 7`}
          icon="💪"
          color="green"
        />
        <StatsCard
          label="Poids"
          value={profile ? `${profile.current_weight_kg}` : "--"}
          unit="kg"
          icon="⚖️"
          color="purple"
        />
        <StatsCard
          label="IMC"
          value={profile ? `${calculateBMI(profile.current_weight_kg, profile.height_cm).bmi}` : "--"}
          unit={profile ? calculateBMI(profile.current_weight_kg, profile.height_cm).category : ""}
          icon="📊"
          color="blue"
        />
      </div>

      {/* AUJOURD'HUI : Workout + Meals */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Séance du jour */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Séance du jour</h2>
            {profile && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {GOAL_LABELS[profile.goal] ?? "Programme"}
              </span>
            )}
          </div>
          {profile ? (
            <WorkoutDay workout={todayWorkout ? { ...todayWorkout, exercises: todayWorkout.exercises as any } : null} />
          ) : (
            <p className="text-sm text-gray-500">Complétez le questionnaire pour générer votre séance.</p>
          )}
        </Card>

        {/* Suggestions repas IA */}
        {profile && <MealSuggestions />}

        {/* Repas du jour */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Repas du jour</h2>
            {profile && (
              <span className="text-xs text-gray-400">
                {dailyMeals.totals.calories} / {profile.target_calories} kcal
              </span>
            )}
          </div>
          {profile ? (
            <div className="space-y-3">
              {dailyMeals.meals.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun repas enregistré aujourd&apos;hui.</p>
              ) : (
                (() => {
                  const grouped: Record<number, typeof dailyMeals.meals> = {}
                  dailyMeals.meals.forEach((m: any) => {
                    if (!grouped[m.meal_number]) grouped[m.meal_number] = []
                    grouped[m.meal_number].push(m)
                  })
                  return Object.entries(grouped).slice(0, 4).map(([num, items]) => (
                    <div key={num} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Repas {num}</p>
                      {items.map((m: any) => (
                        <div key={m.id} className="flex justify-between text-sm text-gray-700 py-0.5">
                          <span>{m.food_item.name} ({m.quantity_g}g)</span>
                          <span className="text-gray-400">{Math.round((m.food_item.calories_per_100g * m.quantity_g) / 100)} kcal</span>
                        </div>
                      ))}
                    </div>
                  ))
                })()
              )}
              <a
                href="/nutrition"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Ajouter un repas →
              </a>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Vos repas apparaîtront ici.</p>
          )}
        </Card>
      </div>

      {/* MACROS RING + CTA */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progression nutrition</h2>
          {profile ? (
            <div className="grid gap-2 grid-cols-3 sm:gap-4">
              <MacroStatBox label="Protéines" current={dailyMeals.totals.protein} target={profile.target_protein_g} color="bg-blue-500" />
              <MacroStatBox label="Glucides" current={dailyMeals.totals.carbs} target={profile.target_carbs_g} color="bg-amber-500" />
              <MacroStatBox label="Lipides" current={dailyMeals.totals.fat} target={profile.target_fat_g} color="bg-rose-500" />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Complétez d&apos;abord le questionnaire.</p>
          )}
          {profile && (
            <div className="mt-4 flex gap-2">
              <a
                href="/onboarding"
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary-600 px-2 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-primary-700 sm:px-4 sm:text-sm"
              >
                Modifier mon programme
              </a>
              <a
                href="/nutrition"
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-2 text-center text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm"
              >
                Journal alimentaire
              </a>
            </div>
          )}
        </Card>

        {/* Calories Ring */}
        <Card className="md:col-span-1 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Calories</h2>
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <CalorieRing current={dailyMeals.totals.calories} target={profile?.target_calories ?? 0} />
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            {profile
              ? `Il reste ${Math.max((profile.target_calories ?? 0) - dailyMeals.totals.calories, 0)} kcal aujourd'hui`
              : "Objectif non défini"}
          </div>
        </Card>

        {/* Eau */}
        {profile && (
          <div className="md:col-span-1 lg:col-span-1">
            <WaterTracker />
          </div>
        )}
      </div>

      {/* SEMAINE */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Cette semaine</h2>
          {weekly && (
            <a href="/workout" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Tout voir →
            </a>
          )}
        </div>
        <WeekOverview weekDays={weekly?.days.map(d => ({ ...d, exercises: d.exercises.map((e: any) => ({ name: e.exercise?.name ?? "" })) }))} />
      </Card>
    </div>
  )
}

function MacroStatBox({ label, current, target, color }: { label: string; current: number; target: number | null; color: string }) {
  const pct = target && target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
  return (
    <div className="rounded-lg border border-gray-100 p-2 text-center sm:p-4">
      <p className="text-[10px] text-gray-500 sm:text-xs truncate">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5 sm:text-lg sm:mt-1">{current}g</p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 sm:mt-2 sm:h-2">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[9px] text-gray-400 mt-1 sm:text-xs truncate">
        {pct}% · <span className="hidden sm:inline">objectif </span>{target}g
      </p>
    </div>
  )
}
