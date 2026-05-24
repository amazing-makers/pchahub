export default function SeriesLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section space-y-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-8 w-80 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-100" />
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </main>
  )
}
