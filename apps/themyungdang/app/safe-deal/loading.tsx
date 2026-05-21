export default function SafeDealLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-12 animate-pulse text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-200" />
          <div className="mx-auto mt-4 h-8 w-48 rounded bg-gray-200" />
          <div className="mx-auto mt-2 h-4 w-72 rounded bg-gray-100" />
          <div className="mt-6 flex justify-center gap-3">
            <div className="h-10 w-28 rounded-xl bg-gray-200" />
            <div className="h-10 w-28 rounded-xl bg-gray-100" />
          </div>
        </div>
      </section>

      {/* steps */}
      <div className="container mx-auto py-12 animate-pulse">
        <div className="mx-auto h-6 w-40 rounded bg-gray-200 mb-8" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-xl bg-gray-200" />
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-2/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      {/* stats */}
      <div className="border-y border-gray-100 bg-white">
        <div className="container mx-auto animate-pulse grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-5 space-y-2">
              <div className="h-7 w-16 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
