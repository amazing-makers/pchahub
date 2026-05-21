export default function BrandDetailLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-4 w-48 rounded bg-gray-100 mb-4" />
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-56 rounded bg-gray-200" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 rounded-full bg-gray-100" />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-6 w-16 rounded bg-gray-200" />
                    <div className="h-3 w-20 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="container mx-auto py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                <div className="h-6 w-32 rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                  <div className="h-4 w-5/6 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-11 w-full rounded-xl bg-gray-200" />
              <div className="h-11 w-full rounded-xl bg-gray-100" />
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
