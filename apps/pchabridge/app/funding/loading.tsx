export default function FundingLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-72 rounded bg-gray-100" />
          {/* filter chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-gray-100" />
            ))}
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="h-40 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
                <div className="mt-4 flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-16 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
