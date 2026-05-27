import { Card, CardHeader, CardTitle } from "@/components/ui"
import { WeightChart, WaterTracker } from "@/components/dashboard"
import { getCurrentProfile, getWeightHistory, getDailyMeals, getNutritionPlan } from "@/lib/actions"
import { calculateBMI, getWaterRecommendation } from "@/lib/calculations"
import { ProgressPhotos } from "@/components/dashboard/ProgressPhotos"

export default async function DashboardProgresPage() {
  const [profile, weightHistory] = await Promise.all([
    getCurrentProfile(),
    getWeightHistory(60),
  ])

  return (
    <div className="space-y-6">
      {profile ? (
        <>
          {/* Cartes clés */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Poids actuel"
              value={`${profile.current_weight_kg}`}
              unit="kg"
              icon="⚖️"
            />
            <StatCard
              label="IMC"
              value={calculateBMI(profile.current_weight_kg, profile.height_cm).bmi.toFixed(1)}
              unit={calculateBMI(profile.current_weight_kg, profile.height_cm).category}
              icon="📊"
            />
            <StatCard
              label="Calories cibles"
              value={`${profile.target_calories}`}
              unit="kcal"
              icon="🔥"
            />
            <StatCard
              label="Durée estimée"
              value={`${profile.estimated_duration_weeks ?? "--"}`}
              unit="semaines"
              icon="⏱️"
            />
          </div>

          {/* Évolution du poids */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution du poids</CardTitle>
            </CardHeader>
            <WeightChart data={weightHistory} />
          </Card>

          {/* Progression photos */}
          {(profile.current_physique_image_url || profile.goal_image_url) && (
            <Card>
              <CardHeader>
                <CardTitle>Mes photos de progression</CardTitle>
              </CardHeader>
              <ProgressPhotos
                currentPhysiqueUrl={profile.current_physique_image_url}
                goalImageUrl={profile.goal_image_url}
              />
            </Card>
          )}

          {/* Eau */}
          <Card>
            <CardHeader>
              <CardTitle>Consommation d'eau</CardTitle>
            </CardHeader>
            <WaterTracker />
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucune donnée</CardTitle>
          </CardHeader>
          <p className="text-gray-500">
            Complétez le questionnaire d&apos;onboarding pour voir votre progression.
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
