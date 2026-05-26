import { Card, CardHeader, CardTitle } from "@/components/ui"
import { clearSession } from "@/lib/actions"
import { redirect } from "next/navigation"

export default function LoginPage() {
  async function handleReset() {
    "use server"
    await clearSession()
    redirect("/onboarding")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Connexion</CardTitle>
        </CardHeader>
        <p className="text-center text-sm text-gray-500 mb-6">
          Page de connexion à intégrer avec votre fournisseur d&apos;auth
          (Clerk / Auth.js / Supabase Auth).
        </p>
        <form action={handleReset} className="text-center">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Recommencer l&apos;onboarding
          </button>
        </form>
      </Card>
    </div>
  )
}
