export default function RoadmapLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-4 w-24 animate-pulse rounded-full bg-gray-200" />
            <div className="mx-auto mt-4 h-12 w-3/4 animate-pulse rounded-xl bg-gray-200" />
            <div className="mx-auto mt-3 h-6 w-1/2 animate-pulse rounded-xl bg-gray-100" />
            <div className="mx-auto mt-4 h-4 w-2/3 animate-pulse rounded-full bg-gray-100" />
            {/* Stats skeleton */}
            <div className="mt-10 grid grid-cols-3 gap-3 rounded-2xl border border-gray-100 bg-white p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className={i === 2 ? 'border-x border-gray-100' : ''}>
                  <div className="mx-auto h-8 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="mx-auto mt-2 h-3 w-14 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stage cards skeleton */}
      <section className="container mx-auto py-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-100">
              <div className="p-6 space-y-4">
                {/* Badge + title */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-36 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
                {/* Duration pill */}
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                {/* Skills */}
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div key={j} className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  ))}
                </div>
                {/* Milestone box */}
                <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
                {/* Resource tags */}
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-5 w-24 animate-pulse rounded-full bg-gray-100" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA skeleton */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <div className="mx-auto h-8 w-48 animate-pulse rounded-xl bg-gray-200" />
            <div className="mx-auto h-4 w-2/3 animate-pulse rounded-full bg-gray-100" />
            <div className="flex justify-center gap-3 pt-4">
              <div className="h-12 w-40 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-12 w-36 animate-pulse rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
