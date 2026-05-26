interface WeekDay {
  day: number
  dayName: string
  exercises: { name: string }[] | null
}

export function WeekOverview({ weekDays }: { weekDays?: WeekDay[] }) {
  const defaultDays = weekDays?.length
    ? weekDays
    : [
        { day: 1, dayName: "Lun", exercises: null },
        { day: 2, dayName: "Mar", exercises: null },
        { day: 3, dayName: "Mer", exercises: null },
        { day: 4, dayName: "Jeu", exercises: null },
        { day: 5, dayName: "Ven", exercises: null },
        { day: 6, dayName: "Sam", exercises: null },
        { day: 7, dayName: "Dim", exercises: null },
      ]

  const today = new Date().getDay()
  const currentDay = today === 0 ? 7 : today

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
      {defaultDays.map((d) => {
        const hasSession = d.exercises && d.exercises.length > 0
        const isRest = !hasSession
        const isToday = d.day === currentDay

        return (
          <div
            key={d.day}
            className={`flex flex-col items-center rounded-xl border p-3 text-center transition-colors ${
              isToday ? "ring-2 ring-primary-500" : ""
            } ${
              isRest
                ? "border-gray-100 bg-gray-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <span className="text-xs font-semibold text-gray-500">{d.dayName}</span>
            <span className="mt-2 text-lg">{isRest ? "🛌" : "💪"}</span>
            <span className="mt-1 text-[10px] font-medium text-gray-600 leading-tight">
              {hasSession ? `${d.exercises!.length} exos` : "Repos"}
            </span>
          </div>
        )
      })}
    </div>
  )
}
