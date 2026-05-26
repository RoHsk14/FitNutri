import { OnboardingForm } from "@/components/onboarding"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Configurez votre programme
          </h1>
          <p className="mt-1 text-gray-500">
            En 3 étapes, obtenez un plan sur mesure.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  )
}
