"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui"
import { StepPhysicalInfo } from "./StepPhysicalInfo"
import { StepGoalLevel } from "./StepGoalLevel"
import { StepGoalDetails } from "./StepGoalDetails"
import { StepNutrition } from "./StepNutrition"
import { StepResult } from "./StepResult"
import { submitOnboarding } from "@/lib/actions"
import { calculateNutrition } from "@/lib"
import type { OnboardingData, MacroResult } from "@/lib"

const STEPS = ["Physique", "Objectif", "Détails", "Nutrition", "Résultat"]

export function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [pending, startTransition] = useTransition()
  const [data, setData] = useState<OnboardingData>({
    age: 25,
    gender: "MALE",
    weightKg: 70,
    heightCm: 175,
    goal: "MAINTENANCE",
    activityLevel: "MODERATE",
    mealsPerDay: 3,
    dietaryRestrictions: [],
    goalDescription: "",
    goalImageUrl: "",
    currentPhysiqueImageUrl: "",
    targetWeightKg: null,
  })
  const [result, setResult] = useState<MacroResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const update = (partial: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...partial }))

  const handleNext = () => {
    if (step === STEPS.length - 2) {
      setResult(calculateNutrition(data))
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = () => {
    setError(null)
    startTransition(async () => {
      try {
        await submitOnboarding(data)
        router.push("/dashboard")
      } catch (e) {
        setError(e instanceof Error ? e.message : "Une erreur est survenue")
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <nav className="mb-8 flex items-center justify-center gap-1 overflow-x-auto px-2 sm:gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium sm:h-8 sm:w-8 sm:text-sm ${
                i <= step
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`hidden text-sm sm:block ${
                i <= step ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-4 sm:w-8 ${
                  i < step ? "bg-primary-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </nav>

      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        {step === 0 && <StepPhysicalInfo data={data} update={update} />}
        {step === 1 && <StepGoalLevel data={data} update={update} />}
        {step === 2 && <StepGoalDetails data={data} update={update} />}
        {step === 3 && <StepNutrition data={data} update={update} />}
        {step === 4 && result && <StepResult data={data} result={result} />}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
          Retour
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext}>
            {step === STEPS.length - 2 ? "Calculer mon programme" : "Suivant"}
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? "Enregistrement..." : "Accéder au tableau de bord"}
          </Button>
        )}
      </div>
    </div>
  )
}
