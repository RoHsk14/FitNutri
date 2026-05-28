"use client"

import { useEffect, useState } from "react"
import { getStreakData, dailyCheckIn } from "@/lib/actions"

export function StreakCard() {
  const [data, setData] = useState<{
    streak: number
    weeklyDone: number
    weeklyTarget: number
    checkedInToday: boolean
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const res = await getStreakData()
    setData(res)
    setLoading(false)
  }

  const handleCheckIn = async () => {
    setChecking(true)
    try {
      await dailyCheckIn()
      await load()
    } catch { /* ignore */ } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 p-6 text-center">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-gray-100" />
        <div className="mx-auto mt-3 h-4 w-24 animate-pulse rounded bg-gray-100" />
      </div>
    )
  }

  const pct = data ? Math.min(Math.round((data.weeklyDone / data.weeklyTarget) * 100), 100) : 0

  return (
    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-amber-50/70 to-orange-50/70 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20">
            <span className="text-2xl">🔥</span>
            {data && data.streak > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                {data.streak}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {data && data.streak > 0
                ? `${data.streak} jours consécutifs`
                : "Commencez votre série"}
            </p>
            <p className="text-xs text-gray-500">
              {data && data.streak > 0
                ? data.streak === 1 ? "Hier · premier jour" : `Depuis ${data.streak} jours`
                : "Aucune séance encore enregistrée"}
            </p>
          </div>
        </div>

        {data && !data.checkedInToday && (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={checking}
            className="shrink-0 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {checking ? "..." : "Check-in"}
          </button>
        )}
        {data?.checkedInToday && (
          <span className="shrink-0 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700">
            ✓ Check-in fait
          </span>
        )}
      </div>

      {/* Weekly progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-700">Progression hebdo</span>
          <span className="text-xs text-gray-500">{data?.weeklyDone ?? 0}/{data?.weeklyTarget ?? 3} séances</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        {data && data.weeklyDone >= data.weeklyTarget && data.weeklyTarget > 0 && (
          <p className="mt-1 text-[11px] font-medium text-emerald-600">🎯 Objectif hebdo atteint !</p>
        )}
      </div>

      {/* Reste de la semaine */}
      {data && data.weeklyDone < data.weeklyTarget && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          {data.weeklyTarget - data.weeklyDone} séance{data.weeklyTarget - data.weeklyDone > 1 ? "s" : ""} restante{data.weeklyTarget - data.weeklyDone > 1 ? "s" : ""} cette semaine
        </div>
      )}
    </div>
  )
}
