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
        {/* style filter */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-20 rounded-full bg-gray-200" />
          ))}
        </div>
        {/* masonry-like 2-col grid with varied heights */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 break-inside-avoid rounded-2xl bg-gray-100"
              style={{ height: `${i % 3 === 0 ? 280 : i % 3 === 1 ? 200 : 240}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
