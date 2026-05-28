import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { getSupabaseReadonlyClient } from "@/lib/supabase-server"
import { getCurrentProfile } from "@/lib/actions"
import { redirect } from "next/navigation"

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseReadonlyClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getCurrentProfile()

  if (!profile) {
    redirect("/onboarding")
  }

  return (
    <Sidebar>
      <Header />
      <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
    </Sidebar>
  )
}
