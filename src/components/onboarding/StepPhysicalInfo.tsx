import { Input } from "@/components/ui"
import type { OnboardingData } from "@/lib"

interface Props {
  data: OnboardingData
  update: (partial: Partial<OnboardingData>) => void
}

export function StepPhysicalInfo({ data, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Informations physiques
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ces données nous permettent de calculer vos besoins énergétiques de base.
        </p>
      </div>

      <Input
        id="name"
        label="Prénom"
        type="text"
        placeholder="Ex: Thomas"
        value={data.name}
        onChange={(e) => update({ name: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="age"
          label="Âge"
          type="number"
          min={12}
          max={120}
          value={data.age}
          onChange={(e) => update({ age: Number(e.target.value) })}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Genre</label>
          <select
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
            value={data.gender}
            onChange={(e) => update({ gender: e.target.value as "MALE" | "FEMALE" })}
          >
            <option value="MALE">Homme</option>
            <option value="FEMALE">Femme</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="weight"
          label="Poids (kg)"
          type="number"
          step={0.1}
          min={20}
          max={400}
          value={data.weightKg}
          onChange={(e) => update({ weightKg: Number(e.target.value) })}
        />
        <Input
          id="height"
          label="Taille (cm)"
          type="number"
          step={0.5}
          min={80}
          max={250}
          value={data.heightCm}
          onChange={(e) => update({ heightCm: Number(e.target.value) })}
        />
      </div>
    </div>
  )
}
