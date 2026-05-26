"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

interface Tab {
  href: string
  label: string
}

export function SectionTabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname()

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/")
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
