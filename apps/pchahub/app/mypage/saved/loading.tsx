export default function SavedLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6 animate-pulse">
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="mt-3 h-7 w-28 rounded bg-gray-200" />
          <div className="mt-1 h-4 w-56 rounded bg-gray-100" />
        </div>
      </section>
      <div className="container mx-auto py-8 animate-pulse">
        <div className="flex gap-1 border-b border-gray-200 pb-3 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-lg bg-gray-100" />
          ))}
        </div>
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
