export default function RankingsLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="h-8 w-40 rounded bg-gray-200" />
          </div>
          <div className="mt-2 h-4 w-72 rounded bg-gray-100" />
          {/* category chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse space-y-8">
        {/* Hall of fame skeleton */}
        <div className="h-28 w-full rounded-2xl bg-gray-200" />

        {/* 2 ranking sections */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <div className="h-7 w-40 rounded bg-gray-200" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                  <div className="h-6 w-16 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
