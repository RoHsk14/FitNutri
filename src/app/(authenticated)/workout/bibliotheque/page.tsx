import { ExerciseCard } from "@/components/workout"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

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

  const grouped: Record<string, typeof exercises> = {}
  for (const ex of exercises) {
    const group = ex.muscle_group ?? "Autres"
    if (!grouped[group]) grouped[group] = []
    grouped[group].push(ex)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {exercises.length} exercices — cliquez sur une carte pour voir la démonstration.
        </p>
      </div>

      {/* Nav rapide par muscle */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(grouped).sort().map((group) => (
          <a
            key={group}
            href={`#${group}`}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
          >
            {group} ({grouped[group].length})
          </a>
        ))}
      </div>

      {/* Exercices par groupe */}
      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([group, exs]) => (
        <section key={group} id={group}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            {group}
            <span className="text-sm font-normal text-gray-400">({exs.length})</span>
          </h2>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {exs.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={{
                  id: ex.id,
                  name: ex.name,
                  muscle_group: ex.muscle_group,
                  description: ex.description,
                  image_url: ex.image_url,
                  video_url: ex.video_url,
                  ms_video_url: ex.ms_video_url,
                  primary_muscle: ex.primary_muscle,
                  synergist_muscles: ex.synergist_muscles,
                  mechanics: ex.mechanics,
                  equipment: ex.equipment,
                }}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
