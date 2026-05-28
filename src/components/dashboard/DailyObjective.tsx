"use client"

import { useEffect, useState } from "react"
import { getCoachingMessage } from "@/lib/actions"

const CACHE_KEY = "fa_daily_objective"

const FALLBACKS = [
  "Rappelez-vous pourquoi vous avez commencé. Chaque effort compte.",
  "Un pas à la fois. La régularité bat l'intensité.",
  "Aujourd'hui est une nouvelle chance de progresser.",
  "Votre corps vous remerciera demain pour l'effort d'aujourd'hui.",
  "La seule mauvaise séance est celle qui n'a pas eu lieu.",
  "Soyez meilleur qu'hier, pas meilleur que les autres.",
  "Respirez, poussez, répétez. La magie opère dans la constance.",
  "Vous n'avez pas à être extrême, juste consistent.",
]

export function DailyObjective() {
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed.date === today) {
          setMsg(parsed.message)
          setLoading(false)
          return
        }
      } catch { /* ignore */ }
    }

    const fallback = FALLBACKS[new Date().getDate() % FALLBACKS.length]

    getCoachingMessage()
      .then((res) => {
        const text = res?.todayAdjustment || fallback
        setMsg(text)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, message: text }))
      })
      .catch(() => {
        setMsg(fallback)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 p-5 text-center">
        <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-emerald-700/60 uppercase tracking-wider">Objectif du jour</p>
          <p className="mt-0.5 text-sm font-medium text-gray-900 leading-snug">
            {msg}
          </p>
        </div>
      </div>
    </div>
  )
}
