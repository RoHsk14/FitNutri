import { Card, CardHeader, CardTitle } from "@/components/ui"
import { WeightChart } from "@/components/dashboard"
import { getCurrentProfile, getWeightHistory, getDailyMeals } from "@/lib/actions"

export default async function NutritionProgresPage() {
  const [profile, weightHistory] = await Promise.all([
    getCurrentProfile(),
    getWeightHistory(60),
  ])

  return (
    <div className="space-y-6">
      {profile ? (
        <>
          {/* Cartes résumé */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Calories / jour"
              value={`${profile.target_calories}`}
              unit="kcal"
              icon="🔥"
            />
            <StatCard
              label="Protéines"
              value={`${profile.target_protein_g}`}
              unit="g"
              icon="🥩"
            />
            <StatCard
              label="Poids actuel"
              value={`${profile.current_weight_kg}`}
              unit="kg"
              icon="⚖️"
            />
          </div>

          {/* Évolution du poids */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution du poids</CardTitle>
            </CardHeader>
            <WeightChart data={weightHistory} />
          </Card>

          {/* Stats macros */}
          <Card>
            <CardHeader>
              <CardTitle>Objectifs quotidiens</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <MacroBar label="Calories" current={profile.target_calories} target={profile.target_calories} unit="kcal" color="bg-blue-500" />
              <MacroBar label="Protéines" current={profile.target_protein_g} target={profile.target_protein_g} unit="g" color="bg-rose-500" />
              <MacroBar label="Glucides" current={profile.target_carbs_g} target={profile.target_carbs_g} unit="g" color="bg-amber-500" />
              <MacroBar label="Lipides" current={profile.target_fat_g} target={profile.target_fat_g} unit="g" color="bg-purple-500" />
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucune donnée</CardTitle>
          </CardHeader>
          <p className="text-gray-500">
            Complétez le questionnaire d&apos;onboarding pour voir votre progression nutritionnelle.
          </p>
        </Card>
      )}
    </div>
  )
}

function StatCard({ label, value, unit, icon }: { label: string; value: string; unit: string; icon: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
        </div>
      </div>
    </div>
  )
}

function MacroBar({ label, current, target, unit, color }: { label: string; current: number; target: number; unit: string; color: string }) {
  const pct = Math.min(Math.round((current / target) * 100), 100)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{current}{unit}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
