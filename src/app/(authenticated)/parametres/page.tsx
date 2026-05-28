"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui"
import { getCurrentProfile, updateProfile } from "@/lib/actions"

interface Profile {
  id: string
  name: string | null
  age: number
  gender: "MALE" | "FEMALE"
  goal: string
  activity_level: string
  dietary_restrictions: string[] | null
  meals_per_day: number
  target_calories: number
  target_protein_g: number
  target_carbs_g: number
  target_fat_g: number
  current_weight_kg: number | null
  height_cm: number | null
  goal_description: string | null
}

const GOAL_LABELS: Record<string, string> = {
  LOSE_FAT: "Perte de poids",
  GAIN_MUSCLE: "Prise de masse",
  MAINTENANCE: "Maintien",
}

const ACTIVITY_LABELS: Record<string, string> = {
  SEDENTARY: "Sédentaire",
  LIGHT: "Léger",
  MODERATE: "Modéré",
  ACTIVE: "Actif",
  VERY_ACTIVE: "Très actif",
}

function Avatar({ gender }: { gender: "MALE" | "FEMALE" }) {
  return (
    <div className={`flex h-20 w-20 items-center justify-center rounded-full ${
      gender === "MALE" ? "bg-blue-100" : "bg-pink-100"
    }`}>
      {gender === "MALE" ? (
        <svg className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ) : (
        <svg className="h-10 w-10 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [goal, setGoal] = useState("")
  const [activity, setActivity] = useState("")
  const [meals, setMeals] = useState(3)

  useEffect(() => {
    async function load() {
      try {
        const p = await getCurrentProfile()
        if (p) {
          const data = p as unknown as Profile
          setProfile(data)
          setName(data.name ?? "")
          setWeight(data.current_weight_kg?.toString() ?? "")
          setGoal(data.goal)
          setActivity(data.activity_level)
          setMeals(data.meals_per_day)
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      await updateProfile({
        name: name || undefined,
        current_weight_kg: weight ? Number(weight) : undefined,
        goal,
        activity_level: activity,
        meals_per_day: meals,
      })
      setMessage({ type: "success", text: "Profil mis à jour" })
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Erreur" })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card><div className="p-6 text-sm text-gray-500">Aucun profil trouvé.</div></Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center gap-5 p-6">
          <Avatar gender={profile.gender} />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{profile.name ?? "Paramètres"}</h1>
            <p className="text-sm text-gray-500">
              {profile.gender === "MALE" ? "Homme" : "Femme"} · {profile.age} ans · {GOAL_LABELS[profile.goal] ?? profile.goal}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card><div className="p-4 text-center"><p className="text-2xl font-bold text-gray-900">{profile.target_calories}</p><p className="text-xs text-gray-500">Calories/j</p></div></Card>
        <Card><div className="p-4 text-center"><p className="text-2xl font-bold text-primary-600">{profile.target_protein_g}g</p><p className="text-xs text-gray-500">Protéines</p></div></Card>
        <Card><div className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{profile.target_carbs_g}g</p><p className="text-xs text-gray-500">Glucides</p></div></Card>
        <Card><div className="p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{profile.target_fat_g}g</p><p className="text-xs text-gray-500">Lipides</p></div></Card>
      </div>

      {/* Edit */}
      <Card>
        <CardHeader><CardTitle>Modifier le profil</CardTitle></CardHeader>
        <div className="space-y-4 p-6 pt-0">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prénom</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" placeholder="Ex: Thomas" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Poids (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" placeholder="Ex: 75" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Taille (cm)</label>
              <input type="number" value={profile.height_cm ?? ""} disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Objectif</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
            >
              {Object.entries(GOAL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Niveau d'activité</label>
            <select value={activity} onChange={(e) => setActivity(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
            >
              {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Repas par jour</label>
            <div className="flex gap-2 flex-wrap">
              {[3, 4, 5, 6].map((n) => (
                <button key={n} type="button" onClick={() => setMeals(n)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    meals === n ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className={`rounded-lg p-3 text-sm ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </div>
          )}

          <button type="button" onClick={handleSave} disabled={saving}
            className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </Card>

      {/* Infos */}
      <Card>
        <CardHeader><CardTitle>Restrictions alimentaires</CardTitle></CardHeader>
        <div className="p-6 pt-0">
          {profile.dietary_restrictions?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.dietary_restrictions.map((r) => (
                <span key={r} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{r}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Aucune restriction</p>
          )}
        </div>
      </Card>
    </div>
  )
}
