export default function GeneralLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-36 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-60 rounded bg-gray-100" />
          {/* sort chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-7 w-16 rounded-full bg-gray-100" />
            ))}
          </div>
          {/* search */}
          <div className="mt-3 flex max-w-md gap-2">
            <div className="h-10 flex-1 rounded-lg bg-gray-100" />
            <div className="h-10 w-16 rounded-lg bg-gray-200" />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* sidebar */}
          <div className="space-y-2 hidden lg:block">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-full rounded bg-gray-100" />
            ))}
          </div>
          {/* posts */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white p-4 shadow-sm space-y-2">
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="flex justify-between">
                  <div className="h-3 w-24 rounded bg-gray-100" />
                  <div className="h-3 w-20 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
