import { getSupabaseAdmin } from "@/lib/supabase-admin"
import BibliothequePageClient from "./BibliothequePageClient"

export const dynamic = "force-dynamic"

export default async function BibliothequePage() {
  const supabase = getSupabaseAdmin()
  const { data: exercises } = await supabase
    .from("fit_exercises")
    .select("*")
    .order("name")

  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun exercice trouvé. Les migrations doivent être exécutées dans Supabase.</p>
      </div>
    )
  }

  return <BibliothequePageClient exercises={exercises} />
}
