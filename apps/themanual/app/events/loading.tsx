export default function EventsLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white py-section">
        <div className="container mx-auto space-y-3">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-8 w-44 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-16 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <div className="h-1.5 bg-gray-200" />
              <div className="space-y-3 p-5">
                <div className="flex gap-2">
                  <div className="h-5 w-14 rounded-full bg-gray-200" />
                  <div className="h-5 w-16 rounded-full bg-gray-100" />
                </div>
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-3 w-3/4 rounded bg-gray-100" />
                <div className="space-y-1.5">
                  <div className="h-3 w-36 rounded bg-gray-100" />
                  <div className="h-3 w-24 rounded bg-gray-100" />
                </div>
                <div className="h-8 rounded-xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
