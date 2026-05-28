"use client"

import { useState } from "react"
import { regenerateWorkoutPlan } from "@/lib/actions"

export function RegenerateProgramButton({ compact }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setErr(null)
    try {
      await regenerateWorkoutPlan()
      setDone(true)
      window.location.reload()
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading || done}
          className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-all"
          title="Régénérer le programme"
        >
          {loading ? (
            <>Génération...</>
          ) : done ? (
            <>✓ Régénéré</>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
              </svg>
              Régénérer
            </>
          )}
        </button>
        {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
      </>
    )
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || done}
        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 transition-all"
      >
        {loading ? (
          <>Génération en cours...</>
        ) : done ? (
          <>Programme régénéré ✓</>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
            </svg>
            Régénérer le programme
          </>
        )}
      </button>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </div>
  )
}
