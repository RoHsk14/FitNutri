export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-gray-200" />
      <div className="h-4 w-48 rounded bg-gray-100" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-64 rounded-xl bg-gray-100" />
        <div className="h-64 rounded-xl bg-gray-100" />
      </div>
      <div className="h-32 rounded-xl bg-gray-100" />
    </div>
  )
}
