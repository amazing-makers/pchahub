export default function TrendsLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10 space-y-3">
          <div className="h-4 w-36 rounded bg-gray-100" />
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-5 space-y-2">
              <div className="h-3 w-20 rounded bg-gray-100" />
              <div className="h-8 w-28 rounded bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto space-y-12 py-10">
        {/* insight cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm space-y-2">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* bar chart */}
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50">
              <div className="h-5 w-5 rounded bg-gray-200 shrink-0" />
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="flex-1 h-2.5 rounded-full bg-gray-100" />
              <div className="h-4 w-12 rounded bg-gray-100" />
            </div>
          ))}
        </div>

        {/* cost cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded bg-gray-200" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-3 w-16 rounded bg-gray-100" />
                </div>
                <div className="h-6 w-16 rounded bg-gray-200" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
