"use client"

import { useState, useEffect } from "react"
import type { CoachingMessage } from "@/lib/gemini"

export function CoachingCard() {
  const [msg, setMsg] = useState<CoachingMessage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/coaching")
      .then((res) => (res.ok ? res.json() : null))
      .then(setMsg)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white animate-pulse">
        <div className="h-4 w-3/4 rounded bg-white/20" />
      </div>
    )
  }

  if (!msg) return null

  return (
    <div className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white shadow-lg shadow-primary-500/20">
      <p className="text-sm font-semibold">{msg.greeting}</p>
      {msg.obstacleInsight && (
        <p className="mt-2 text-xs text-white/80 leading-relaxed">
          🧠 {msg.obstacleInsight}
        </p>
      )}
      {msg.todayAdjustment && (
        <p className="mt-1.5 text-xs font-medium text-amber-200">
          🎯 {msg.todayAdjustment}
        </p>
      )}
    </div>
  )
}
