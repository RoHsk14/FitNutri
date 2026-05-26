export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-pulse">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto h-8 w-64 rounded bg-gray-200" />
          <div className="mx-auto mt-2 h-4 w-48 rounded bg-gray-100" />
        </div>
        <div className="h-96 rounded-xl bg-gray-100" />
        <div className="mt-6 flex justify-between">
          <div className="h-10 w-24 rounded-lg bg-gray-100" />
          <div className="h-10 w-48 rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  )
}
