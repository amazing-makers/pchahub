export default function PriceGuideLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white py-section">
        <div className="container mx-auto space-y-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="h-4 w-96 rounded bg-gray-100" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4">
                <div className="h-6 w-24 rounded bg-gray-200" />
                <div className="mt-1.5 h-3 w-20 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto py-section space-y-8">
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 w-14 rounded-full bg-gray-200" />
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-gray-50 px-4 py-3">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-4 w-36 rounded bg-gray-200" />
              <div className="h-4 w-28 rounded bg-gray-100" />
              <div className="ml-auto h-4 w-12 rounded bg-gray-100" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
              <div className="h-5 w-16 rounded-full bg-gray-200" />
              <div className="h-6 w-32 rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 rounded-lg bg-gray-100" />
                <div className="h-12 rounded-lg bg-gray-100" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-4/5 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
