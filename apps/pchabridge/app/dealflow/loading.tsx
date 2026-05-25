export default function DealflowLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white py-section">
        <div className="container mx-auto space-y-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
        </div>
      </div>
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 px-6 py-5">
              <div className="h-7 w-16 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="grid gap-8 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-36 rounded bg-gray-200" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-16 rounded-xl bg-gray-100" />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-10 space-y-3">
          <div className="h-5 w-56 rounded bg-gray-200" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
