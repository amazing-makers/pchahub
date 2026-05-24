export default function SeriesDetailLoading() {
  return (
    <main className="animate-pulse bg-gray-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-section space-y-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-gray-200" />
            <div className="h-6 w-20 rounded bg-gray-100" />
          </div>
          <div className="h-8 w-96 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
          <div className="h-16 w-full max-w-2xl rounded bg-gray-100" />
        </div>
      </div>
      <div className="container mx-auto py-section space-y-4">
        <div className="h-7 w-40 rounded bg-gray-200" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="h-40 flex-1 rounded-2xl bg-gray-100" />
          </div>
        ))}
      </div>
    </main>
  )
}
