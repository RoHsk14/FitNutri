import { Card, CardHeader, CardTitle } from "@/components/ui"
import { WeightChart } from "@/components/dashboard"
import { getCurrentProfile, getWeightHistory } from "@/lib/actions"
import { calculateBMI, getWaterRecommendation } from "@/lib/calculations"
import { ProfileEditor } from "./ProfileEditor"

const GOAL_LABELS: Record<string, string> = {
  LOSE_FAT: "Perte de poids",
  GAIN_MUSCLE: "Prise de muscle",
  MAINTENANCE: "Remise en forme",
}
const ACTIVITY_LABELS: Record<string, string> = {
  SEDENTARY: "Sédentaire", LIGHT: "Léger", MODERATE: "Modéré", ACTIVE: "Actif", VERY_ACTIVE: "Très actif",
}
const GENDER_LABELS: Record<string, string> = { MALE: "Homme", FEMALE: "Femme" }

export default async function ProfilePage() {
  const profile = await getCurrentProfile()
  const weightHistory = await getWeightHistory()

  const bmiResult = profile ? calculateBMI(profile.current_weight_kg, profile.height_cm) : null
  const waterGoal = profile ? getWaterRecommendation(profile.gender) : null

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
          <p className="text-gray-500">Gérez vos informations personnelles.</p>
        </div>
        {profile && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
            ✓ Questionnaire complété
          </span>
        )}
      </div>

      {profile ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Infos actuelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations physiques</CardTitle>
            </CardHeader>
            <div className="divide-y divide-gray-100">
              <Field label="Âge" value={`${profile.age} ans`} />
              <Field label="Genre" value={GENDER_LABELS[profile.gender] ?? profile.gender} />
              <Field label="Poids" value={`${profile.current_weight_kg} kg`} />
              <Field label="Taille" value={`${profile.height_cm} cm`} />
              {bmiResult && (
                <Field label="IMC" value={`${bmiResult.bmi} — ${bmiResult.category}`} />
              )}
              <Field label="Objectif" value={GOAL_LABELS[profile.goal] ?? profile.goal} />
              <Field label="Niveau" value={ACTIVITY_LABELS[profile.activity_level] ?? profile.activity_level} />
              <Field label="Repas / jour" value={`${profile.meals_per_day}`} />
              <Field label="Calories cibles" value={`${profile.target_calories} kcal`} />
              <Field label="Protéines" value={`${profile.target_protein_g}g`} />
              <Field label="Glucides" value={`${profile.target_carbs_g}g`} />
              <Field label="Lipides" value={`${profile.target_fat_g}g`} />
              {waterGoal && <Field label="Eau recommandée" value={`${waterGoal} ml / jour`} />}
              {profile.estimated_duration_weeks && (
                <Field label="Durée estimée" value={`~${profile.estimated_duration_weeks} semaines`} />
              )}
            </div>

            {/* Description objectif */}
            {profile.goal_description && (
              <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50 p-3">
                <p className="text-xs text-primary-600 font-medium mb-1">Mon objectif</p>
                <p className="text-sm text-gray-700 italic">{profile.goal_description}</p>
              </div>
            )}

            {/* Photos objectif */}
            {(profile.goal_image_url || profile.current_physique_image_url) && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                {profile.goal_image_url && (
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">🎯 Body goal</p>
                    <img src={profile.goal_image_url} alt="Body goal" className="h-36 w-full rounded-lg object-cover" />
                  </div>
                )}
                {profile.current_physique_image_url && (
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">📸 Mon physique</p>
                    <img src={profile.current_physique_image_url} alt="Mon physique" className="h-36 w-full rounded-lg object-cover" />
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Éditeur + Poids */}
          <div className="space-y-6">
            <ProfileEditor profile={profile} />
            <Card>
              <CardHeader>
                <CardTitle>Évolution du poids</CardTitle>
              </CardHeader>
              <WeightChart data={weightHistory} />
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Commencer</CardTitle>
          </CardHeader>
          <p className="text-gray-500 mb-4">
            Remplissez le questionnaire pour générer votre programme personnalisé.
          </p>
          <a
            href="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Remplir le questionnaire
          </a>
        </Card>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
