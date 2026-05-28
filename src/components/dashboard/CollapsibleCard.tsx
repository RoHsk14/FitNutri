"use client"

import { useRef, useState, useEffect } from "react"

export function CollapsibleCard({
  children,
  href,
  label = "Voir plus",
  maxHeight = 280,
}: {
  children: React.ReactNode
  href: string
  label?: string
  maxHeight?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    if (ref.current) {
      setOverflows(ref.current.scrollHeight > maxHeight)
    }
  }, [maxHeight])

  return (
    <div className="relative">
      <div ref={ref} className="overflow-hidden" style={{ maxHeight: overflows ? maxHeight : undefined }}>
        {children}
        {overflows && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {overflows && (
        <a
          href={href}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {label}
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  )
}
