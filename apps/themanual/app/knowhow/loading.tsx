export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-7 w-44 rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-80 rounded-full bg-gray-200" />
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-20 rounded-full bg-gray-200" />
            <div className="h-7 w-28 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 rounded-md bg-gray-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
