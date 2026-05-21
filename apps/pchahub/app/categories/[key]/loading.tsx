export default function CategoryLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-4 w-20 rounded bg-gray-100" />
            <div className="h-3 w-3 rounded bg-gray-100" />
            <div className="h-4 w-28 rounded bg-gray-100" />
          </div>
          <div className="mt-3 h-8 w-48 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-72 rounded bg-gray-100" />
          {/* stats */}
          <div className="mt-4 grid grid-cols-3 gap-3 max-w-sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-6 w-16 rounded bg-gray-200" />
                <div className="h-3 w-12 rounded bg-gray-100" />
              </div>
            ))}
          </div>
          {/* sort + search */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-gray-100" />
            ))}
          </div>
          <div className="mt-3 flex max-w-md gap-2">
            <div className="h-10 flex-1 rounded-lg bg-gray-100" />
            <div className="h-10 w-16 rounded-lg bg-gray-200" />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="aspect-video bg-gray-200" />
              <div className="p-3 space-y-1">
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
