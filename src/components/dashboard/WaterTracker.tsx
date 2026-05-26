"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui"
import { logWater, getWaterIntake } from "@/lib/actions"
import { useRouter } from "next/navigation"

const QUICK_AMOUNTS = [200, 250, 330, 500]

export function WaterTracker() {
  const router = useRouter()
  const [total, setTotal] = useState(0)
  const [goal, setGoal] = useState(2000)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getWaterIntake().then((r: any) => {
      setTotal(r.total)
      setGoal(r.goal)
    })
  }, [])

  const add = async (ml: number) => {
    setLoading(true)
    await logWater(ml)
    setTotal((prev) => prev + ml)
    setLoading(false)
    router.refresh()
  }

  const pct = Math.min(Math.round((total / goal) * 100), 100)
  const remaining = Math.max(goal - total, 0)

  return (
    <Card className="!p-4 border-dashed border-sky-200 bg-sky-50/30">
      <h3 className="text-sm font-semibold text-sky-700 flex items-center gap-1.5 mb-2">
        <span>💧</span> Hydratation
      </h3>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{total} ml</span>
          <span>Objectif {goal} ml</span>
        </div>
        <div className="h-3 rounded-full bg-sky-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-sky-400 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        {total >= goal ? (
          <p className="text-xs text-green-600 mt-1">✓ Objectif atteint !</p>
        ) : (
          <p className="text-xs text-sky-600 mt-1">Encore {remaining} ml</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((ml) => (
          <button
            key={ml}
            onClick={() => add(ml)}
            disabled={loading}
            className="rounded-lg border border-sky-200 bg-white px-3 py-1.5 text-xs font-medium text-sky-600 hover:bg-sky-50 disabled:opacity-50 transition-colors"
          >
            +{ml} ml
          </button>
        ))}
      </div>
    </Card>
  )
}
