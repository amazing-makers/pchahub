export default function PortfolioLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 rounded bg-gray-100" />
          {/* inline stats */}
          <div className="mt-4 flex gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-20 rounded bg-gray-100" />
            ))}
          </div>
          {/* Search */}
          <div className="mt-5 flex max-w-md gap-2">
            <div className="h-10 flex-1 rounded-lg bg-gray-100" />
            <div className="h-10 w-16 rounded-lg bg-gray-200" />
          </div>
          {/* filter chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-24 rounded bg-gray-100" />
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
