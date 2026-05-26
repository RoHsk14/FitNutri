import { ReactNode } from "react"
import clsx from "clsx"

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx("rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={clsx("mb-4", className)}>{children}</div>
}

export function CardTitle({ children, className }: CardProps) {
  return <h3 className={clsx("text-lg font-semibold text-gray-900", className)}>{children}</h3>
}
