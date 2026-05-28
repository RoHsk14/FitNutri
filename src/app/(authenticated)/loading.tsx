export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-56 rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-36 rounded bg-gray-100" />
        </div>
        <div className="h-12 w-12 rounded-full bg-gray-100" />
      </div>
      {/* Coaching skeleton */}
      <div className="h-20 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100" />
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
      {/* Main content */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-gray-100" />
        ))}
      </div>
      {/* Bottom */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-2 h-48 rounded-xl bg-gray-100" />
        <div className="h-48 rounded-xl bg-gray-100" />
        <div className="h-48 rounded-xl bg-gray-100" />
      </div>
      {/* Week */}
      <div className="h-40 rounded-xl bg-gray-100" />
    </div>
  )
}
