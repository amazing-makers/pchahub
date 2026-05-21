export default function SearchLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-16 rounded bg-gray-200" />
          <div className="mt-4 flex max-w-lg gap-2">
            <div className="h-10 flex-1 rounded-lg bg-gray-100" />
            <div className="h-10 w-20 rounded-lg bg-gray-200" />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse space-y-8">
        {/* funding rounds */}
        <div>
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="h-2 w-full bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-28 rounded bg-gray-200" />
                      <div className="h-3 w-16 rounded bg-gray-100" />
                    </div>
                  </div>
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-2 w-full rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
