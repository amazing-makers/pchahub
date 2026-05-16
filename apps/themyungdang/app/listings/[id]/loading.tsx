/** Listing detail loading skeleton — shown while dynamic client islands resolve */
export default function ListingDetailLoading() {
  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          {/* Back link */}
          <div className="skeleton h-4 w-20 rounded-md" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2 pt-1">
              {/* badges */}
              <div className="flex gap-2">
                <div className="skeleton h-5 w-12 rounded-full" />
                <div className="skeleton h-5 w-20 rounded-full" />
              </div>
              <div className="skeleton h-9 w-3/4 max-w-2xl rounded-xl" />
              <div className="skeleton h-4 w-64 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main */}
          <div className="space-y-6 min-w-0">
            {/* Image gallery — matches ListingImageGallery: h-80 3-col grid */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="grid h-80 grid-cols-3 gap-1">
                {/* Hero cell: spans 2 cols, 2 rows */}
                <div className="skeleton col-span-3 rounded-none sm:col-span-2 sm:row-span-2" />
                {/* Side thumbnails visible on sm+ */}
                <div className="skeleton hidden rounded-none sm:block" />
                <div className="skeleton hidden rounded-none sm:block" />
              </div>
            </div>

            {/* Specs card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <div className="skeleton h-5 w-24 rounded-lg" />
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2">
                    <div className="skeleton h-4 w-4 rounded-md" />
                    <div className="flex-1 flex gap-3">
                      <div className="skeleton h-4 w-16 rounded-md" />
                      <div className="skeleton h-4 w-24 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
              <div className="skeleton h-5 w-16 rounded-lg" />
              <div className="skeleton h-64 w-full rounded-xl" />
            </div>

            {/* Tags / categories */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <div className="skeleton h-5 w-20 rounded-lg" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-7 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="space-y-4">
              {/* Price + actions card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <div className="skeleton h-3 w-16 rounded-md" />
                  <div className="skeleton h-8 w-40 rounded-lg" />
                </div>
                <div className="skeleton h-11 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="skeleton h-10 w-full rounded-xl" />
                  <div className="skeleton h-10 w-full rounded-xl" />
                </div>
              </div>
              {/* Owner card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
                <div className="skeleton h-3 w-12 rounded-md" />
                <div className="skeleton h-4 w-32 rounded-md" />
                <div className="skeleton h-4 w-24 rounded-md" />
                <div className="skeleton h-16 w-full rounded-lg" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
