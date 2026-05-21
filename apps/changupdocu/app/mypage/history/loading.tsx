export default function HistoryLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6 animate-pulse">
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="mt-3 h-7 w-32 rounded bg-gray-200" />
          <div className="mt-1 h-4 w-56 rounded bg-gray-100" />
        </div>
      </section>
      <div className="container mx-auto max-w-2xl py-8 animate-pulse space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm flex gap-4 p-4">
            <div className="h-16 w-24 shrink-0 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
