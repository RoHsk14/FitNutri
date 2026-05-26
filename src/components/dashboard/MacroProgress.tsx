interface MacroItem {
  label: string
  current: number
  target: number
  unit: string
  color: string
}

export function MacroProgress({ items }: { items: MacroItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((m) => {
        const pct = Math.min(Math.round((m.current / m.target) * 100), 100)
        return (
          <div key={m.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{m.label}</span>
              <span className="text-gray-500">
                {m.current}
                {m.unit} / {m.target}
                {m.unit}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${m.color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function CalorieRing({ current, target }: { current: number; target: number }) {
  const pct = Math.min(Math.round((current / target) * 100), 100)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="70" cy="70" r="54"
          fill="none" stroke="#3b82f6" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute mt-9 flex flex-col items-center">
        <span className="text-2xl font-bold text-gray-900">{current}</span>
        <span className="text-xs text-gray-400">/ {target} kcal</span>
      </div>
    </div>
  )
}
