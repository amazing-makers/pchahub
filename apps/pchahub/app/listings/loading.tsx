export default function ListingsLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="h-8 w-44 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-80 rounded bg-gray-100" />
            </div>
            <div className="h-9 w-24 shrink-0 rounded-lg bg-gray-200" />
          </div>
        </div>
      </section>

      {/* stats strip skeleton */}
      <section className="border-b border-gray-100 bg-white animate-pulse">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 px-4 py-2">
                <div className="h-6 w-16 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        {/* search bar */}
        <div className="mb-5 flex max-w-lg gap-2">
          <div className="h-10 flex-1 rounded-lg bg-gray-100" />
          <div className="h-10 w-16 rounded-lg bg-gray-200" />
        </div>
        {/* filter chips */}
        <div className="mb-3 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-gray-100" />
          ))}
        </div>
        {/* listings grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="h-44 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-20 rounded bg-gray-100" />
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="mt-3 flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-16 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
