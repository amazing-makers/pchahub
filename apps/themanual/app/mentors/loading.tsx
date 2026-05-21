export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-7 w-36 rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-72 rounded-full bg-gray-200" />
          <div className="mt-4 flex gap-6">
            <div className="h-10 w-20 rounded-lg bg-gray-200" />
            <div className="h-10 w-20 rounded-lg bg-gray-200" />
            <div className="h-10 w-24 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-7 rounded-md bg-gray-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
