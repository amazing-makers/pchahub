export default function HomeLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      {/* Hero */}
      <div className="bg-white py-16">
        <div className="container mx-auto space-y-4 text-center">
          <div className="mx-auto h-10 w-64 rounded bg-gray-200" />
          <div className="mx-auto h-5 w-80 rounded bg-gray-100" />
          <div className="mx-auto mt-6 flex justify-center gap-3">
            <div className="h-11 w-32 rounded-xl bg-gray-200" />
            <div className="h-11 w-32 rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-y border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-5 space-y-2">
              <div className="h-7 w-16 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured brands */}
      <div className="container mx-auto py-12 space-y-4">
        <div className="h-7 w-40 rounded bg-gray-200" />
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
