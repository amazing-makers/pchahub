export default function MonthlyBestLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section space-y-4">
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-8 w-80 rounded bg-gray-200" />
          <div className="h-4 w-96 rounded bg-gray-100" />
        </div>
      </div>
      <div className="container mx-auto pt-section">
        <div className="mb-6 h-7 w-48 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
      <div className="container mx-auto pt-section space-y-3">
        <div className="mb-6 h-7 w-48 rounded bg-gray-200" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100" />
        ))}
      </div>
    </main>
  )
}
