"use client"

import { useState } from "react"
import { Button, Card, CardHeader, CardTitle } from "@/components/ui"
import { logWeight, updateProfile } from "@/lib/actions"
import { useRouter } from "next/navigation"

const GOAL_OPTIONS = [
  { value: "LOSE_FAT", label: "Perte de poids" },
  { value: "GAIN_MUSCLE", label: "Prise de muscle" },
  { value: "MAINTENANCE", label: "Remise en forme" },
]
const ACTIVITY_OPTIONS = [
  { value: "SEDENTARY", label: "Sédentaire" },
  { value: "LIGHT", label: "Léger" },
  { value: "MODERATE", label: "Modéré" },
  { value: "ACTIVE", label: "Actif" },
  { value: "VERY_ACTIVE", label: "Très actif" },
]

export function ProfileEditor({ profile }: { profile: any }) {
  const router = useRouter()
  const [weight, setWeight] = useState("")
  const [saving, setSaving] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [goal, setGoal] = useState(profile.goal)
  const [activity, setActivity] = useState(profile.activity_level)
  const [message, setMessage] = useState("")

  const handleWeight = async () => {
    const kg = parseFloat(weight)
    if (isNaN(kg) || kg <= 0) return
    setSaving(true)
    await logWeight(kg)
    setWeight("")
    setSaving(false)
    setMessage("Poids enregistré")
    setTimeout(() => setMessage(""), 2000)
    router.refresh()
  }

  const handleUpdate = async () => {
    setUpdating(true)
    await updateProfile({ goal, activity_level: activity })
    setUpdating(false)
    setMessage("Profil mis à jour")
    setTimeout(() => setMessage(""), 2000)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier le profil</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {message && (
          <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{message}</div>
        )}

        {/* Poids */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau poids (kg)</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
              placeholder="ex. 72.5"
            />
            <Button size="sm" onClick={handleWeight} disabled={saving}>
              {saving ? "..." : "Enregistrer"}
            </Button>
          </div>
        </div>

        {/* Objectif */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objectif</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
          >
            {GOAL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Niveau activité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'activité</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
          >
            {ACTIVITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <Button className="w-full" onClick={handleUpdate} disabled={updating}>
          {updating ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </Card>
  )
}
