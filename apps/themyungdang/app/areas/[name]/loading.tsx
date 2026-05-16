/** Area detail loading skeleton — shown while dynamic client islands resolve */
export default function AreaDetailLoading() {
  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10">
          {/* Breadcrumb */}
          <div className="skeleton h-4 w-28 rounded-md" />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="skeleton h-9 w-72 max-w-full rounded-xl" />
              <div className="skeleton h-4 w-40 rounded-md" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-8 w-28 rounded-lg" />
              <div className="skeleton h-8 w-28 rounded-lg" />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-2">
            <div className="skeleton h-4 w-full max-w-2xl rounded-md" />
            <div className="skeleton h-4 w-3/4 max-w-xl rounded-md" />
          </div>

          {/* Stats grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                <div className="skeleton h-4 w-4 rounded-md" />
                <div className="skeleton h-3 w-20 rounded-md" />
                <div className="skeleton h-5 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-10 space-y-8">
        {/* Map card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <div className="skeleton h-5 w-40 rounded-lg" />
            <div className="skeleton h-3 w-64 rounded-md" />
          </div>
          <div className="skeleton h-[300px] w-full rounded-2xl" />
        </div>

        {/* Charts card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
          <div className="skeleton h-5 w-32 rounded-lg" />
          <div className="skeleton h-64 w-full rounded-xl" />
        </div>

        {/* Category share */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="skeleton h-5 w-24 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-4 w-16 rounded-md" />
              <div className="skeleton h-7 flex-1 rounded-md" />
              <div className="skeleton h-4 w-10 rounded-md" />
            </div>
          ))}
        </div>

        {/* Highlights / Cautions */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 space-y-3">
            <div className="skeleton h-4 w-12 rounded-md bg-emerald-200" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton h-4 w-full rounded-md bg-emerald-200" />
            ))}
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-3">
            <div className="skeleton h-4 w-16 rounded-md bg-amber-200" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton h-4 w-full rounded-md bg-amber-200" />
            ))}
          </div>
        </div>

        {/* Listings grid */}
        <div className="space-y-4">
          <div className="skeleton h-5 w-36 rounded-lg" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="skeleton h-44 w-full rounded-none" />
                <div className="space-y-2.5 p-4">
                  <div className="skeleton h-4 w-3/4 rounded-md" />
                  <div className="skeleton h-3 w-1/2 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
