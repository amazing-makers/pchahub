export default function TimelineLoading() {
  return (
    <main className="animate-pulse">
      <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white py-section">
        <div className="container mx-auto space-y-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-8 w-72 rounded bg-gray-200" />
          <div className="h-4 w-96 rounded bg-gray-100" />
          <div className="mt-4 h-10 w-64 rounded-xl bg-gray-200" />
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="mx-auto max-w-3xl space-y-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
                {i < 3 && <div className="mt-2 h-32 w-px bg-gray-200" />}
              </div>
              <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 w-40 rounded bg-gray-200" />
                  <div className="h-5 w-16 rounded-full bg-gray-200" />
                </div>
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-3.5 w-full rounded bg-gray-100" />
                ))}
                <div className="h-12 rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
