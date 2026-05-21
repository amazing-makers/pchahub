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
        {/* listings */}
        <div>
          <div className="h-5 w-20 rounded bg-gray-200" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="flex justify-between pt-1">
                    <div className="h-3 w-20 rounded bg-gray-100" />
                    <div className="h-3 w-16 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
