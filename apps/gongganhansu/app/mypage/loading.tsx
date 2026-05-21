export default function MyPageLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-7 w-36 rounded bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-100" />
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-7 w-24 rounded-full bg-gray-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse space-y-4">
        <div className="flex gap-1 border-b border-gray-200 pb-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-lg bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
