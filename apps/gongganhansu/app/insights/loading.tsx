export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-7 w-40 rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-72 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="container mx-auto py-8">
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
