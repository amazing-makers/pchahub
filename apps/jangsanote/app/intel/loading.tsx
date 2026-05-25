export default function IntelLoading() {
  return (
    <main className="animate-pulse bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-2">
          <div className="h-7 w-32 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
        </div>
      </div>
      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="hidden space-y-4 lg:block">
            <div className="h-4 w-16 rounded bg-gray-200" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 rounded-md bg-gray-100" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
