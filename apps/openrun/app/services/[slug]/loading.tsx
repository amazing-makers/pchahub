export default function ServiceDetailLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-12 space-y-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gray-200" />
          <div className="mx-auto h-8 w-48 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-72 rounded bg-gray-100" />
          <div className="mx-auto h-4 w-64 rounded bg-gray-100" />
          <div className="mx-auto flex justify-center gap-3">
            <div className="h-11 w-32 rounded-xl bg-gray-200" />
            <div className="h-11 w-32 rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 space-y-8">
        {/* features */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-2/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
        {/* cases */}
        <div className="space-y-3">
          <div className="h-6 w-32 rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
