export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-7 w-32 rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-64 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="container mx-auto py-8">
        {/* filter bar */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-20 rounded-full bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 h-48" />
          ))}
        </div>
      </div>
    </div>
  )
}
