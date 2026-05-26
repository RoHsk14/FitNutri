import type { OnboardingData } from "@/lib"

interface Props {
  data: OnboardingData
  update: (partial: Partial<OnboardingData>) => void
}

const GOALS = [
  { value: "LOSE_FAT", label: "Perte de poids", desc: "Réduire la masse grasse" },
  { value: "GAIN_MUSCLE", label: "Prise de muscle", desc: "Développer la masse musculaire" },
  { value: "MAINTENANCE", label: "Remise en forme", desc: "Améliorer sa condition générale" },
] as const

const LEVELS = [
  { value: "SEDENTARY", label: "Sédentaire", desc: "Peu ou pas d'exercice" },
  { value: "LIGHT", label: "Léger", desc: "1-3 séances / semaine" },
  { value: "MODERATE", label: "Modéré", desc: "3-5 séances / semaine" },
  { value: "ACTIVE", label: "Actif", desc: "6-7 séances / semaine" },
  { value: "VERY_ACTIVE", label: "Très actif", desc: "2 entraînements / jour" },
] as const

function RadioCard<T extends string>({
  value,
  label,
  desc,
  checked,
  onChange,
}: {
  value: T
  label: string
  desc: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-full rounded-lg border p-4 text-left transition-colors ${
        checked
          ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="font-medium text-gray-900">{label}</div>
      <div className="mt-0.5 text-sm text-gray-500">{desc}</div>
    </button>
  )
}

export function StepGoalLevel({ data, update }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Votre objectif</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choisissez l&apos;objectif principal de votre programme.
        </p>
        <div className="mt-4 grid gap-3">
          {GOALS.map((g) => (
            <RadioCard
              key={g.value}
              value={g.value}
              label={g.label}
              desc={g.desc}
              checked={data.goal === g.value}
              onChange={() => update({ goal: g.value as OnboardingData["goal"] })}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900">Niveau d&apos;activité</h2>
        <p className="mt-1 text-sm text-gray-500">
          Votre niveau sportif actuel (hors travail).
        </p>
        <div className="mt-4 grid gap-3">
          {LEVELS.map((l) => (
            <RadioCard
              key={l.value}
              value={l.value}
              label={l.label}
              desc={l.desc}
              checked={data.activityLevel === l.value}
              onChange={() =>
                update({ activityLevel: l.value as OnboardingData["activityLevel"] })
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
