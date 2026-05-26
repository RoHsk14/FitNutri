import { Card, CardHeader, CardTitle } from "@/components/ui"

export default function HistoriquePage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
          <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Aucun historique</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Vos séances terminées apparaîtront ici une fois que vous aurez commencé votre programme.
        </p>
      </div>
    </div>
  )
}
