export default function StoriesLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-amber-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-amber-200" />
            <div className="mx-auto mt-4 h-12 w-2/3 animate-pulse rounded-xl bg-gray-200" />
            <div className="mx-auto mt-3 h-4 w-1/2 animate-pulse rounded-full bg-gray-200" />
            <div className="mt-8 flex justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-28 animate-pulse rounded-full bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter chips skeleton */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-3">
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="container mx-auto py-section">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100">
              <div className="h-48 animate-pulse bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-4/6 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="flex gap-4 border-t border-gray-100 pt-3">
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-100" />
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
