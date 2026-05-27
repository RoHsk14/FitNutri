"use client"

import { useState } from "react"
import { Modal } from "@/components/ui"

export function ProgressPhotos({
  currentPhysiqueUrl,
  goalImageUrl,
}: {
  currentPhysiqueUrl?: string | null
  goalImageUrl?: string | null
}) {
  const [zoom, setZoom] = useState<string | null>(null)

  const photos = []
  if (currentPhysiqueUrl) photos.push({ url: currentPhysiqueUrl, label: "Mon physique actuel", badge: "📸 Maintenant" })
  if (goalImageUrl) photos.push({ url: goalImageUrl, label: "Objectif visé", badge: "🎯 Objectif" })

  if (photos.length === 0) return null

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo) => (
          <button
            key={photo.url}
            type="button"
            onClick={() => setZoom(photo.url)}
            className="group relative overflow-hidden rounded-lg bg-gray-100 text-left transition-all hover:ring-2 hover:ring-primary-400"
          >
            <img
              src={photo.url}
              alt={photo.label}
              className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm">
                {photo.badge}
              </span>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!zoom} onClose={() => setZoom(null)} title="Photo">
        {zoom && (
          <div className="flex items-center justify-center">
            <img src={zoom} alt="Photo" className="max-h-[70vh] w-full rounded-lg object-contain" />
          </div>
        )}
      </Modal>
    </>
  )
}
