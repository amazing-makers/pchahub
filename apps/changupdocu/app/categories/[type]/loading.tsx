export default function CategoryPageLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-4 w-20 rounded bg-gray-100" />
            <div className="h-3 w-3 rounded bg-gray-100" />
            <div className="h-4 w-24 rounded bg-gray-100" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-3 w-full max-w-md rounded-full bg-gray-200" />
          </div>
          <div className="mt-3 h-8 w-40 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 rounded bg-gray-100" />
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="flex justify-between">
                  <div className="h-3 w-20 rounded bg-gray-100" />
                  <div className="h-3 w-16 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
