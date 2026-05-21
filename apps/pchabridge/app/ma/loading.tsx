export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-7 w-36 rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-64 rounded-full bg-gray-200" />
          <div className="mt-4 flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  )
}
