import { Card, CardHeader, CardTitle } from "@/components/ui"
import { isAdmin, getAdminStats } from "@/lib/actions"
import { redirect } from "next/navigation"

const GOAL_LABELS: Record<string, string> = {
  LOSE_FAT: "Perte de poids",
  GAIN_MUSCLE: "Prise de muscle",
  MAINTENANCE: "Remise en forme",
}

const GENDER_LABELS: Record<string, string> = {
  MALE: "Homme",
  FEMALE: "Femme",
}

export default async function AdminPage() {
  const admin = await isAdmin()
  if (!admin) redirect("/dashboard")

  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-sm text-gray-500">Vue d&apos;ensemble des données de l&apos;application</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">Admin</span>
      </div>

      {/* Stats clés */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard label="Utilisateurs" value={stats.totalUsers} icon="👥" color="bg-blue-500" />
        <StatCard label="Avec programme" value={stats.usersWithPlan} icon="📋" color="bg-emerald-500" />
        <StatCard label="Séances créées" value={stats.totalWorkoutSessions} icon="💪" color="bg-violet-500" />
        <StatCard label="Exercices complétés" value={stats.totalCompletions} icon="✅" color="bg-amber-500" />
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard label="Repas logués" value={stats.totalDailyMeals} icon="🍽️" color="bg-rose-500" />
        <StatCard label="Entrées poids" value={stats.totalWeightLogs} icon="⚖️" color="bg-cyan-500" />
        <StatCard label="Plans nutrition" value={stats.totalWorkoutPlans} icon="📊" color="bg-indigo-500" />
      </div>

      {/* Répartition par objectif */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des objectifs</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {Object.entries(stats.goalBreakdown).map(([goal, count]) => {
            const pct = stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0
            const colors: Record<string, string> = {
              GAIN_MUSCLE: "bg-blue-500",
              LOSE_FAT: "bg-rose-500",
              MAINTENANCE: "bg-emerald-500",
            }
            return (
              <div key={goal}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{GOAL_LABELS[goal] ?? goal}</span>
                  <span className="text-gray-400 text-xs">{count} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${colors[goal] ?? "bg-gray-400"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Derniers utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Derniers inscrits</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">Genre</th>
                <th className="pb-2 font-medium">Âge</th>
                <th className="pb-2 font-medium">Poids</th>
                <th className="pb-2 font-medium">Objectif</th>
                <th className="pb-2 font-medium">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentUsers.map((u: any) => (
                <tr key={u.id} className="text-gray-600">
                  <td className="py-2 font-mono text-xs text-gray-400 max-w-[100px] truncate">{u.id}</td>
                  <td className="py-2">{GENDER_LABELS[u.gender] ?? u.gender}</td>
                  <td className="py-2">{u.age}</td>
                  <td className="py-2">{u.current_weight_kg} kg</td>
                  <td className="py-2">{GOAL_LABELS[u.goal] ?? u.goal}</td>
                  <td className="py-2 text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
