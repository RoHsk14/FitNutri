import type { OnboardingData, DietaryRestriction } from "@/lib"

interface Props {
  data: OnboardingData
  update: (partial: Partial<OnboardingData>) => void
}

const RESTRICTIONS: { value: DietaryRestriction; label: string }[] = [
  { value: "VEGAN", label: "Végan" },
  { value: "VEGETARIAN", label: "Végétarien" },
  { value: "GLUTEN_FREE", label: "Sans gluten" },
  { value: "LACTOSE_FREE", label: "Sans lactose" },
]

export function StepNutrition({ data, update }: Props) {
  const toggleRestriction = (value: DietaryRestriction) => {
    const current = data.dietaryRestrictions
    const next = current.includes(value)
      ? current.filter((r) => r !== value)
      : [...current, value]
    update({ dietaryRestrictions: next })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Nutrition</h2>
        <p className="mt-1 text-sm text-gray-500">
          Adaptez votre plan aux contraintes alimentaires.
        </p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Repas par jour
        </label>
        <input
          type="range"
          min={1}
          max={6}
          value={data.mealsPerDay}
          onChange={(e) => update({ mealsPerDay: Number(e.target.value) })}
          className="w-full accent-primary-600"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>1 repas</span>
          <span className="font-semibold text-primary-600">{data.mealsPerDay} repas</span>
          <span>6 repas</span>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Restrictions alimentaires
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {RESTRICTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => toggleRestriction(r.value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                data.dietaryRestrictions.includes(r.value)
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
