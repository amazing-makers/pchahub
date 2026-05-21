export default function AwardsLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="h-8 w-48 rounded bg-gray-200" />
          </div>
          <div className="mt-2 h-4 w-72 rounded bg-gray-100" />
          {/* year tabs */}
          <div className="mt-5 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-16 rounded-full bg-gray-100" />
            ))}
          </div>
          {/* category chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse space-y-8">
        {/* Hall of fame */}
        <div className="h-32 w-full rounded-2xl bg-gray-200" />

        {/* Award cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                </div>
                <div className="h-6 w-12 rounded-full bg-gray-100" />
              </div>
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <div className="h-3 w-20 rounded bg-gray-100" />
                <div className="h-3 w-16 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
