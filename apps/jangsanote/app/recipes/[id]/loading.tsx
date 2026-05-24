export default function RecipeDetailLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 max-w-3xl space-y-6">
        {/* cover image */}
        <div className="h-64 w-full rounded-2xl bg-gray-200" />

        {/* meta chips */}
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-gray-100" />
          ))}
        </div>

        {/* ingredients */}
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-gray-100" />
            ))}
          </div>
        </div>

        {/* steps */}
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-20 rounded bg-gray-200" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-3/4 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-20 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    </main>
  )
}
