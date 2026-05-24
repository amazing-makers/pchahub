export default function AdminReviewLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="h-4 w-56 rounded bg-gray-100" />
        </div>
      </div>

      <div className="container mx-auto py-8 space-y-4">
        {/* filter bar */}
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-lg bg-gray-100" />
          ))}
        </div>

        {/* table */}
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-6 w-16 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                </div>
                <div className="h-4 w-20 rounded bg-gray-100" />
                <div className="flex gap-2">
                  <div className="h-8 w-16 rounded-lg bg-gray-100" />
                  <div className="h-8 w-16 rounded-lg bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
