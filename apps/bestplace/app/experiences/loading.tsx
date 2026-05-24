export default function ExperiencesLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section space-y-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-8 w-96 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-28 rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 w-16 rounded-full bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </main>
  )
}
