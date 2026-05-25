export default function InsightDetailLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50 py-section">
        <div className="container mx-auto space-y-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-5 w-20 rounded-full bg-gray-200" />
            <div className="h-5 w-16 rounded-full bg-gray-100" />
          </div>
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-100" />
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <div className="h-16 rounded-xl bg-gray-100" />
            <div className="h-24 rounded-xl bg-gray-100" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-gray-100" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
