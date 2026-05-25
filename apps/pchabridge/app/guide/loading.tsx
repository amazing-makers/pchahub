export default function GuideLoading() {
  return (
    <main className="animate-pulse">
      <div className="bg-gradient-to-br from-violet-950 to-gray-900 py-section">
        <div className="container mx-auto space-y-3">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="h-4 w-80 rounded bg-white/5" />
        </div>
      </div>
      <div className="container mx-auto py-section">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="mt-8 space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-5">
              <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-3/4 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50 py-section">
        <div className="container mx-auto">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-white" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
