export default function SimulatorLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section className="bg-gray-900">
        <div className="container mx-auto py-section">
          <div className="h-4 w-40 animate-pulse rounded-full bg-gray-700" />
          <div className="mt-4 h-14 w-3/4 animate-pulse rounded-2xl bg-gray-700" />
          <div className="mt-2 h-14 w-1/2 animate-pulse rounded-2xl bg-gray-700" />
          <div className="mt-5 h-5 w-96 animate-pulse rounded-full bg-gray-700" />
        </div>
      </section>

      {/* Simulator skeleton */}
      <section className="container mx-auto py-section">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
            {/* Inputs side */}
            <div className="border-b border-gray-100 p-6 lg:border-b-0 lg:border-r">
              <div className="mb-5 h-5 w-32 animate-pulse rounded-full bg-gray-200" />
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <div className="mb-2 flex justify-between">
                      <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                      <div className="h-4 w-16 animate-pulse rounded-full bg-gray-200" />
                    </div>
                    <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Results side */}
            <div className="p-6">
              <div className="mb-5 h-5 w-32 animate-pulse rounded-full bg-gray-200" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 p-4">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-gray-200" />
                    <div className="mt-2 h-6 w-28 animate-pulse rounded-full bg-gray-200" />
                    <div className="mt-1 h-3 w-24 animate-pulse rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-3">
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      </section>
    </main>
  )
}
