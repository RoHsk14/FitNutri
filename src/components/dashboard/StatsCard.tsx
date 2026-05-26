interface StatsCardProps {
  label: string
  value: string
  unit?: string
  icon: string
  trend?: { value: string; positive: boolean }
  color: "blue" | "green" | "amber" | "rose" | "purple"
}

const colorMap = {
  blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", text: "text-amber-600" },
  rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", text: "text-rose-600" },
  purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", text: "text-purple-600" },
}

export function StatsCard({ label, value, unit, icon, trend, color }: StatsCardProps) {
  const c = colorMap[color]
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={c.bg + " flex h-10 w-10 items-center justify-center rounded-lg"}>
          <span className="text-lg">{icon}</span>
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
              trend.positive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </p>
      </div>
    </div>
  )
}
