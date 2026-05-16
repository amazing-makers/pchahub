/** Listings page loading skeleton — shown while searchParams resolve */
export default function ListingsLoading() {
  return (
    <main className="bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-2">
          <div className="skeleton h-8 w-40 rounded-lg" />
          <div className="skeleton h-4 w-24 rounded-md" />
          <div className="skeleton mt-4 h-10 w-80 max-w-full rounded-xl" />
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-5">
            {[48, 64, 80].map((h, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-3 w-20 rounded-md" />
                <div className={`skeleton h-${Math.floor(h / 4)} w-full rounded-xl`} style={{ height: h }} />
              </div>
            ))}
          </aside>

          {/* Grid */}
          <div>
            <div className="skeleton mb-3 h-5 w-16 rounded-md" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="skeleton h-44 w-full rounded-none" />
                  <div className="space-y-2.5 p-4">
                    <div className="skeleton h-3.5 w-1/3 rounded-md" />
                    <div className="skeleton h-5 w-3/4 rounded-md" />
                    <div className="skeleton h-4 w-1/2 rounded-md" />
                    <div className="flex gap-2 pt-1">
                      <div className="skeleton h-3.5 w-16 rounded-md" />
                      <div className="skeleton h-3.5 w-12 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
