export default function StoriesLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section className="bg-gray-900">
        <div className="container mx-auto py-section">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-700" />
          <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-gray-700" />
          <div className="mt-2 h-10 w-1/2 animate-pulse rounded bg-gray-700" />
          <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-gray-700" />
          <div className="mt-8 flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-24 animate-pulse rounded bg-gray-700" />
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar skeleton */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-7 w-14 animate-pulse rounded-full bg-gray-100"
                style={{ width: `${48 + i * 8}px` }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-6 w-20 animate-pulse rounded-full bg-gray-100"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="container mx-auto py-section">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-100" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
              {/* Cover image */}
              <div className="aspect-[16/9] animate-pulse bg-gray-100" />
              {/* Content */}
              <div className="p-5">
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
                <div className="mt-2.5 h-5 w-full animate-pulse rounded bg-gray-100" />
                <div className="mt-1.5 h-5 w-4/5 animate-pulse rounded bg-gray-100" />
                <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-100" />
                <div className="mt-2.5 h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="mt-1 h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                <div className="mt-4 h-14 w-full animate-pulse rounded-xl bg-gray-100" />
                <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
