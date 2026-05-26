import { Card, CardHeader, CardTitle } from "@/components/ui"
import { getWorkoutHistory } from "@/lib/actions"

const WEEKDAY_LABELS: Record<string, string> = {
  "1": "Lun", "2": "Mar", "3": "Mer", "4": "Jeu", "5": "Ven", "6": "Sam", "7": "Dim",
}

const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  const day = d.getDate()
  const month = MONTH_LABELS[d.getMonth()]
  const year = d.getFullYear()
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000)
  const label = diffDays === 0 ? "Aujourd'hui" : diffDays === 1 ? "Hier" : null

  return label
    ? `${label} — ${day} ${month}`
    : `${day} ${month} ${year}`
}

export default async function HistoriquePage() {
  const history = await getWorkoutHistory(90)

  if (history.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Aucun historique</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Vos séances terminées apparaîtront ici une fois que vous aurez commencé votre programme.
          </p>
        </div>
      </div>
    )
  }

  const totalSessions = history.reduce((s, d) => s + d.count, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
          <p className="text-sm text-gray-500">{history.length} jours · {totalSessions} exercices complétés</p>
        </div>
      </div>

      <div className="space-y-3">
        {history.map((day) => (
          <Card key={day.date}>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center min-w-[48px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                </div>
                <div className="mt-1 h-full w-px bg-gray-100" />
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-semibold text-gray-900">{formatDate(day.date)}</p>
                <p className="text-xs text-gray-400 mb-2">{day.exercises.length} exercices · {day.count} séries</p>
                <div className="flex flex-wrap gap-1.5">
                  {day.exercises.map((name) => (
                    <span key={name} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
