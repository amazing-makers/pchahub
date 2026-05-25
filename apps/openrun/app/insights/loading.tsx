export default function InsightsLoading() {
  return (
    <main className="animate-pulse">
      <div className="bg-gray-900 py-section">
        <div className="container mx-auto space-y-3">
          <div className="h-4 w-28 rounded bg-gray-700" />
          <div className="h-8 w-72 rounded bg-gray-700" />
          <div className="h-4 w-96 rounded bg-gray-700" />
          <div className="mt-6 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </main>
  )
}
