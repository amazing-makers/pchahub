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
        {/* category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-gray-200" />
          ))}
        </div>
        {/* course cards — 2-col */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 h-56" />
          ))}
        </div>
      </div>
    </div>
  )
}
