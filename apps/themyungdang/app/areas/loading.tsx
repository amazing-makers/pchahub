/** Areas page loading skeleton — shown while AreasPageClient hydrates */
export default function AreasLoading() {
  return (
    <main className="bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="skeleton h-8 w-40 rounded-lg" />
          <div className="mt-2 skeleton h-4 w-80 max-w-full rounded-md" />
        </div>
      </section>

      {/* Filter bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-3">
          <div className="flex items-center gap-3">
            <div className="skeleton h-8 w-20 rounded-xl" />
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6">
        {/* Map placeholder */}
        <div className="skeleton h-[520px] w-full rounded-2xl" />
        <div className="mt-2 skeleton mx-auto h-3 w-80 max-w-full rounded-md" />

        {/* Card grid */}
        <div className="mt-8">
          <div className="mb-4 skeleton h-5 w-32 rounded-lg" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="skeleton h-10 w-10 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-4 w-3/4 rounded-md" />
                    <div className="skeleton h-3 w-1/2 rounded-md" />
                  </div>
                </div>
                <div className="skeleton h-3 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
