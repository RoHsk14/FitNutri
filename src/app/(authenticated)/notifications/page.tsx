"use client"

import { useEffect, useState } from "react"
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/actions"
import { Card } from "@/components/ui"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "À l'instant"
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Hier"
  return `Il y a ${days} jours`
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const data = await getNotifications()
    setNotifs(data)
    setLoading(false)
  }

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const unread = notifs.filter(n => !n.is_read).length

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unread > 0 && (
            <p className="text-sm text-gray-500">{unread} non lue{unread > 1 ? "s" : ""}</p>
          )}
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : notifs.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Aucune notification</h2>
          <p className="text-sm text-gray-500">Les notifications apparaîtront ici dès que votre programme sera actif.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => {
            const content = (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 transition-all cursor-pointer ${
                  n.is_read
                    ? "border-gray-100 bg-white"
                    : "border-primary-100 bg-primary-50/40"
                }`}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
              >
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  n.is_read ? "bg-transparent" : "bg-primary-500"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${n.is_read ? "text-gray-600" : "font-semibold text-gray-900"}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{n.body}</p>
                  )}
                  <p className="mt-1 text-[10px] text-gray-400">{timeAgo(n.created_at)}</p>
                </div>
                {n.link && (
                  <Link
                    href={n.link}
                    onClick={e => e.stopPropagation()}
                    className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Voir
                  </Link>
                )}
              </div>
            )

            return n.link ? (
              <Link key={n.id} href={n.link} className="block">
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}
