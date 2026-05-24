export default function HqInquiriesLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-4 w-36 rounded bg-gray-100" />
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="h-4 w-60 rounded bg-gray-100" />
        </div>
      </div>

      <div className="container mx-auto py-8 space-y-4">
        {/* filter/sort bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-lg bg-gray-100" />
            ))}
          </div>
          <div className="h-8 w-28 rounded-lg bg-gray-100" />
        </div>

        {/* inquiry cards */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="h-5 w-28 rounded bg-gray-200" />
                  <div className="flex gap-2">
                    <div className="h-4 w-16 rounded bg-gray-100" />
                    <div className="h-4 w-20 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-gray-100" />
              </div>
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="flex items-center justify-between">
                <div className="h-3 w-32 rounded bg-gray-100" />
                <div className="h-8 w-20 rounded-lg bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
