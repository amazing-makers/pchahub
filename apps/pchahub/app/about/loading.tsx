export default function AboutLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      {/* Hero */}
      <div className="bg-white py-16 text-center">
        <div className="container mx-auto space-y-3">
          <div className="mx-auto h-5 w-24 rounded bg-gray-100" />
          <div className="mx-auto h-10 w-64 rounded bg-gray-200" />
          <div className="mx-auto h-5 w-80 rounded bg-gray-100" />
          <div className="mx-auto h-4 w-72 rounded bg-gray-100" />
        </div>
      </div>

      {/* Principles */}
      <div className="container mx-auto py-12 space-y-4">
        <div className="mx-auto h-7 w-40 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-2/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-5 space-y-2">
              <div className="h-7 w-16 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Platform grid */}
      <div className="container mx-auto py-12 space-y-4">
        <div className="mx-auto h-7 w-48 rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-sm space-y-2">
              <div className="h-8 w-8 rounded-lg bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
