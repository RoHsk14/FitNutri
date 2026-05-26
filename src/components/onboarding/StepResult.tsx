import { estimateDuration } from "@/lib/calculations"
import { getSessionsPerWeek } from "@/lib/workout-splits"
import type { OnboardingData, MacroResult } from "@/lib"

interface Props {
  data: OnboardingData
  result: MacroResult
}

const GOAL_LABELS: Record<string, string> = {
  LOSE_FAT: "Perte de poids",
  GAIN_MUSCLE: "Prise de muscle",
  MAINTENANCE: "Remise en forme",
}

export function StepResult({ data, result }: Props) {
  const sessions = getSessionsPerWeek(data.activityLevel, data.gender)
  const duration = estimateDuration({
    gender: data.gender,
    goal: data.goal,
    currentWeightKg: data.weightKg,
    heightCm: data.heightCm,
    age: data.age,
    targetWeightKg: data.targetWeightKg,
    activityLevel: data.activityLevel,
    workoutSessionsPerWeek: sessions,
    mealsPerDay: data.mealsPerDay,
    dietaryRestrictions: data.dietaryRestrictions,
    goalDescription: data.goalDescription,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Votre plan personnalisé
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Objectif : {GOAL_LABELS[data.goal]}
          {data.gender === "FEMALE" ? " 🏋️‍♀️" : " 🏋️"}
        </p>
      </div>

      {/* Résumé objectif */}
      {data.goalDescription && (
        <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
          <p className="text-sm text-gray-700 italic">
            &ldquo;{data.goalDescription}&rdquo;
          </p>
        </div>
      )}

      {/* Photos */}
      {(data.goalImageUrl || data.currentPhysiqueImageUrl) && (
        <div className="flex gap-3">
          {data.goalImageUrl && (
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">🎯 Body goal</p>
              <img src={data.goalImageUrl} alt="Body goal" className="h-32 w-full rounded-lg object-cover" />
            </div>
          )}
          {data.currentPhysiqueImageUrl && (
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">📸 Mon physique</p>
              <img src={data.currentPhysiqueImageUrl} alt="Mon physique" className="h-32 w-full rounded-lg object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Durée estimée */}
      {duration.weeks > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-sm text-emerald-700 font-medium">
            Durée estimée pour atteindre votre objectif
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{duration.label}</p>
          <p className="text-xs text-emerald-500 mt-1">{duration.detail}</p>
          <div className="mt-2 flex justify-center gap-2 text-[10px] text-emerald-400 flex-wrap">
            <span>{sessions} séances/sem</span>
            <span>·</span>
            <span>{data.mealsPerDay} repas/j</span>
            <span>·</span>
            <span>{data.activityLevel === "SEDENTARY" ? "Sédentaire" : data.activityLevel === "VERY_ACTIVE" ? "Très actif" : data.activityLevel}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox label="BMR" value={`${result.bmr}`} unit="kcal" />
        <StatBox label="TDEE" value={`${result.tdee}`} unit="kcal" />
        <StatBox
          label="Calories cibles"
          value={`${result.targetCalories}`}
          unit="kcal/j"
          highlight
        />
        <StatBox label="Repas" value={`${data.mealsPerDay}`} unit="/ jour" />
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Répartition des macronutriments
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <MacroBar
            label="Protéines"
            value={`${result.proteinG}g`}
            color="bg-blue-500"
            percentage={Math.round(
              ((result.proteinG * 4) / result.targetCalories) * 100
            )}
          />
          <MacroBar
            label="Glucides"
            value={`${result.carbsG}g`}
            color="bg-amber-500"
            percentage={Math.round(
              ((result.carbsG * 4) / result.targetCalories) * 100
            )}
          />
          <MacroBar
            label="Lipides"
            value={`${result.fatG}g`}
            color="bg-rose-500"
            percentage={Math.round(
              ((result.fatG * 9) / result.targetCalories) * 100
            )}
          />
        </div>
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  unit,
  highlight,
}: {
  label: string
  value: string
  unit: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${
        highlight ? "border-primary-500 bg-primary-50" : "border-gray-200"
      }`}
    >
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`text-xl font-bold ${
          highlight ? "text-primary-700" : "text-gray-900"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-400">{unit}</div>
    </div>
  )
}

function MacroBar({
  label,
  value,
  color,
  percentage,
}: {
  label: string
  value: string
  color: string
  percentage: number
}) {
  return (
    <div className="text-center">
      <div className="text-sm font-medium text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-0.5 text-xs text-gray-400">{percentage}%</div>
    </div>
  )
}
