export default function FestivalNewLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="h-8 w-52 rounded bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-100" />
        </div>
      </div>

      <div className="container mx-auto py-8 max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm space-y-6">
          {/* type selector */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 w-24 rounded-lg bg-gray-100" />
              ))}
            </div>
          </div>
          {/* text fields */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 w-full rounded-xl bg-gray-100" />
            </div>
          ))}
          {/* date range */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 rounded-xl bg-gray-100" />
              <div className="h-10 flex-1 rounded-xl bg-gray-100" />
            </div>
          </div>
          <div className="h-11 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
