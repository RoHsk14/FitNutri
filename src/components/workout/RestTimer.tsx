"use client"

import { useState, useEffect, useRef } from "react"

export function RestTimer({ defaultSeconds = 60 }: { defaultSeconds?: number }) {
  const [seconds, setSeconds] = useState(defaultSeconds)
  const [running, setRunning] = useState(false)
  const [show, setShow] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAC")
  }, [])

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s - 1)
      }, 1000)
    }
    if (running && seconds === 0) {
      setRunning(false)
      audioRef.current?.play().catch(() => {})
      if (navigator.vibrate) navigator.vibrate(500)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, seconds])

  const start = (secs?: number) => {
    if (secs) setSeconds(secs)
    else setSeconds(defaultSeconds)
    setRunning(true)
  }

  const stop = () => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const reset = () => {
    stop()
    setSeconds(defaultSeconds)
  }

  const circumference = 2 * Math.PI * 40
  const progress = 1 - seconds / defaultSeconds
  const offset = circumference * progress

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 text-left hover:from-emerald-100 hover:to-emerald-200/50 transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Chronomètre de repos</p>
          <p className="text-xs text-gray-500">{formatTime(defaultSeconds)} — appuyez pour lancer</p>
        </div>
      </button>
    )
  }

  return (
    <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-5">
      <div className="flex flex-col items-center gap-4">
        {/* Cercle de progression */}
        <div className="relative flex items-center justify-center">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle
              cx="48" cy="48" r="40" fill="none" stroke={seconds === 0 ? "#10b981" : "#10b981"}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className={`absolute text-2xl font-bold font-mono ${seconds === 0 ? "text-emerald-600" : "text-gray-900"}`}>
            {seconds === 0 ? "GO!" : formatTime(seconds)}
          </span>
        </div>

        {/* Contrôles */}
        <div className="flex items-center gap-3">
          {!running && seconds > 0 && (
            <button
              type="button"
              onClick={() => start()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <svg className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </button>
          )}
          {running && (
            <button
              type="button"
              onClick={stop}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400 hover:bg-gray-300 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex gap-2">
          {[30, 60, 90, 120].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => start(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                defaultSeconds === s ? "bg-emerald-500 text-white" : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              {formatTime(s)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
