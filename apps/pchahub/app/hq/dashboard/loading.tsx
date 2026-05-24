export default function HqDashboardLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-100" />
        </div>
      </div>

      <div className="container mx-auto py-8 space-y-8">
        {/* metrics grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm space-y-2">
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-8 w-16 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
          ))}
        </div>

        {/* inquiry table */}
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="h-5 w-32 rounded bg-gray-200" />
          </div>
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-6 w-10 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                </div>
                <div className="h-4 w-24 rounded bg-gray-100" />
                <div className="h-8 w-16 rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        </div>

        {/* quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-8 w-8 rounded-xl bg-gray-200" />
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-9 w-full rounded-xl bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
