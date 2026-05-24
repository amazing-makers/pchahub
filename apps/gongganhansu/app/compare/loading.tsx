export default function CompareLoading() {
  return (
    <main className="animate-pulse bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-2">
          <div className="h-7 w-40 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-100" />
        </div>
      </div>
      <div className="container mx-auto py-8">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-gray-50 px-6 py-4">
              <div className="w-32 shrink-0">
                <div className="h-4 rounded bg-gray-100" />
              </div>
              <div className="h-4 flex-1 rounded bg-gray-100" />
              <div className="h-4 flex-1 rounded bg-gray-100" />
              <div className="h-4 flex-1 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
