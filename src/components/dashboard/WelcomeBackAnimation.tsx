"use client"

import { useEffect, useState, useRef } from "react"

const WELCOME_STORAGE_KEY = "fa_last_visit"
const INACTIVITY_MS = 24 * 60 * 60 * 1000

const QUOTES = [
  "Le corps accomplit ce que l'esprit croit.",
  "Chaque répétition vous rapproche de votre objectif.",
  "Vous êtes plus fort que vous ne le pensez.",
  "Le meilleur projet, c'est vous-même.",
  "La discipline est le pont entre vos goals et leur accomplissement.",
]

export function WelcomeBackAnimation({ name }: { name?: string | null }) {
  const [show, setShow] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const quote = useRef(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  const done = useRef(false)

  const dismiss = () => {
    if (done.current) return
    done.current = true
    localStorage.setItem(WELCOME_STORAGE_KEY, String(Date.now()))
    setFadeOut(true)
    setTimeout(() => setShow(false), 400)
  }

  useEffect(() => {
    const last = localStorage.getItem(WELCOME_STORAGE_KEY)
    const now = Date.now()
    const shouldWelcome = !last || (now - Number(last)) > INACTIVITY_MS

    if (shouldWelcome) {
      setShow(true)
      const timer = setTimeout(dismiss, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ${
        fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      onClick={dismiss}
    >
      {/* Fond avec dégradé animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
        {/* Orbes lumineuses */}
        <div className="absolute left-1/4 top-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 translate-x-1/2 animate-pulse rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 h-64 w-64 -translate-x-1/2 animate-pulse rounded-full bg-sky-500/10 blur-3xl" />

        {/* Particules */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 animate-pulse rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 mx-4 max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/40">
              <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            </div>
            <div className="absolute -inset-2 animate-ping rounded-full bg-emerald-400/20" />
          </div>
        </div>

        <h1 className="mb-2 bg-gradient-to-r from-emerald-200 via-white to-amber-200 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          {name ? `Bon retour, ${name} !` : "Bon retour !"}
        </h1>

        <p className="mx-auto max-w-sm text-base leading-relaxed text-gray-400/90">
          &ldquo;{quote.current}&rdquo;
        </p>

        <div className="mt-8 flex items-center justify-center gap-1 text-xs text-gray-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Prêt pour votre séance
        </div>
      </div>
    </div>
  )
}
