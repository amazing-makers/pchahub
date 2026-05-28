export default function FranchiseeQALoading() {
  return (
    <main className="bg-gray-50 pb-24">
      {/* Hero skeleton */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10 text-center">
          <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mt-4 h-8 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mt-3 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        </div>
      </section>

      {/* Filter bar skeleton */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="container mx-auto py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
              </div>
              <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-3.5 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
