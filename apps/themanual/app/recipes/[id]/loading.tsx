export default function RecipeDetailLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-4 w-36 rounded bg-gray-100" />
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            {/* image */}
            <div className="aspect-video w-full rounded-2xl bg-gray-200" />
            {/* ingredients */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="h-6 w-20 rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 w-full rounded bg-gray-100" />
                ))}
              </div>
            </div>
            {/* steps */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <div className="h-6 w-20 rounded bg-gray-200" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-5 w-20 rounded bg-gray-200" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-gray-100" />
                  <div className="h-4 w-16 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
