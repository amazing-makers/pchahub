export default function QuoteLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-36 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-96 rounded bg-gray-100" />
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        {/* step indicator */}
        <div className="mb-8 flex items-center justify-between max-w-xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              {i < 3 && <div className="h-1 w-8 rounded bg-gray-100" />}
            </div>
          ))}
        </div>
        {/* form card */}
        <div className="max-w-xl space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 w-full rounded-lg bg-gray-100" />
            </div>
          ))}
          <div className="h-11 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
