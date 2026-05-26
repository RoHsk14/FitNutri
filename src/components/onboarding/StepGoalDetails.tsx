"use client"

import { useState, useRef } from "react"
import { uploadImage } from "@/lib/actions"
import type { OnboardingData } from "@/lib"

interface Props {
  data: OnboardingData
  update: (partial: Partial<OnboardingData>) => void
}

export function StepGoalDetails({ data, update }: Props) {
  const [uploading, setUploading] = useState<"goal" | "physique" | null>(null)
  const lastFile = useRef<Record<string, { name: string; size: number }>>({})

  const handleFile = async (field: "goalImageUrl" | "currentPhysiqueImageUrl", file: File) => {
    if (!file) return

    // Déduplication basique : même nom + même taille = même image
    const key = field
    const prev = lastFile.current[key]
    if (prev && prev.name === file.name && prev.size === file.size) {
      return // même fichier, on ignore
    }

    setUploading(field === "goalImageUrl" ? "goal" : "physique")
    try {
      const fd = new FormData()
      fd.append("file", file)
      const url = await uploadImage(fd)
      update({ [field]: url })
      lastFile.current[key] = { name: file.name, size: file.size }
    } catch (e) {
      console.error("Upload failed", e)
    } finally {
      setUploading(null)
    }
  }

  const isBodyChange = data.goal === "LOSE_FAT" || data.goal === "GAIN_MUSCLE"
  const goalVerb = data.goal === "LOSE_FAT" ? "perdre" : data.goal === "GAIN_MUSCLE" ? "prendre" : "maintenir"

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Décrivez votre objectif</h3>
        <p className="mt-1 text-sm text-gray-500">
          Donnez plus de contexte sur ce que vous souhaitez accomplir.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description de votre objectif
        </label>
        <textarea
          value={data.goalDescription ?? ""}
          onChange={(e) => update({ goalDescription: e.target.value })}
          rows={3}
          maxLength={500}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none resize-none"
          placeholder={`Je souhaite ${goalVerb} du poids, notamment au niveau du ventre et des cuisses...`}
        />
        <p className="mt-1 text-xs text-gray-400">
          {(data.goalDescription ?? "").length}/500 caractères
        </p>
      </div>

      {/* Poids cible */}
      {isBodyChange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Poids cible (kg) <span className="text-gray-400 font-normal">— optionnel</span>
          </label>
          <input
            type="number"
            step="0.1"
            value={data.targetWeightKg ?? ""}
            onChange={(e) => update({ targetWeightKg: e.target.value ? parseFloat(e.target.value) : null })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            placeholder={data.goal === "LOSE_FAT" ? "ex. 65" : "ex. 75"}
          />
          <p className="mt-1 text-xs text-gray-400">
            Si renseigné, nous estimerons la durée nécessaire pour atteindre ce poids.
          </p>
        </div>
      )}

      {/* Body goal image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo d'inspiration (body goal)
        </label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            {uploading === "goal" ? "Upload..." : "Choisir une image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile("goalImageUrl", e.target.files[0])}
            />
          </label>
          {data.goalImageUrl && (
            <div className="relative">
              <img src={data.goalImageUrl} alt="Body goal" className="h-16 w-16 rounded-lg object-cover" />
              <button
                onClick={() => update({ goalImageUrl: "" })}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Téléchargez une photo du physique que vous souhaitez atteindre.
        </p>
      </div>

      {/* Current physique image (optionnelle) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Votre photo actuelle <span className="text-gray-400 font-normal">— optionnelle</span>
        </label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            {uploading === "physique" ? "Upload..." : "Choisir une image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile("currentPhysiqueImageUrl", e.target.files[0])}
            />
          </label>
          {data.currentPhysiqueImageUrl && (
            <div className="relative">
              <img src={data.currentPhysiqueImageUrl} alt="Mon physique" className="h-16 w-16 rounded-lg object-cover" />
              <button
                onClick={() => update({ currentPhysiqueImageUrl: "" })}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Pour suivre votre évolution visuelle au fil du temps.
        </p>
      </div>
    </div>
  )
}
