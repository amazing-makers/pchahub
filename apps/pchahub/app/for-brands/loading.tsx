export default function ForBrandsLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      {/* Hero */}
      <div className="bg-white py-16">
        <div className="container mx-auto space-y-4 text-center">
          <div className="mx-auto h-10 w-72 rounded bg-gray-200" />
          <div className="mx-auto h-5 w-80 rounded bg-gray-100" />
          <div className="mx-auto mt-6 flex justify-center gap-3">
            <div className="h-11 w-36 rounded-xl bg-gray-200" />
            <div className="h-11 w-32 rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="container mx-auto py-12 space-y-4">
        <div className="mx-auto h-7 w-48 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-xl bg-gray-200" />
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-2/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="border-t border-gray-100 bg-white py-12">
        <div className="container mx-auto space-y-6">
          <div className="mx-auto h-7 w-32 rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-6 space-y-3">
                <div className="h-5 w-20 rounded bg-gray-200" />
                <div className="h-8 w-24 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
                <div className="h-10 w-full rounded-xl bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
