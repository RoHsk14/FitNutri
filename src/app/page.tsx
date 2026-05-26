import Link from "next/link"
import { Button } from "@/components/ui"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-primary-600">FitNutri</span>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Connexion
            </Link>
            <Link href="/onboarding">
              <Button size="sm">Commencer</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Votre programme fitness
            <span className="text-primary-600"> personnalisé</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Répondez à notre questionnaire intelligent et recevez un plan
            d&apos;entraînement ainsi qu&apos;un plan nutritionnel adaptés à votre corps,
            votre objectif et votre mode de vie.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">Commencer le questionnaire</Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                J&apos;ai déjà un compte
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
