export default function TimelineLoading() {
  return (
    <main className="bg-gray-50 pb-24">
      {/* Hero skeleton */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-12 text-center">
          <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mt-4 h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </section>

      {/* Phase cards skeleton */}
      <div className="container mx-auto py-12 space-y-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-300" />
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="md:ml-16 rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="h-16 animate-pulse bg-gray-100" />
              <div className="divide-y divide-gray-100 px-6">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="py-3">
                    <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
              <div className="h-20 animate-pulse bg-amber-50 border-t border-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
