export default function NewReviewLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6 space-y-3">
          <div className="h-4 w-48 rounded bg-gray-100" />
          <div className="h-7 w-32 rounded bg-gray-200" />
        </div>
      </div>
      <div className="container mx-auto py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200" />
                <div className="h-4 w-40 rounded bg-gray-200" />
              </div>
              <div className={`w-full rounded-xl bg-gray-100 ${i === 1 ? 'h-24' : 'h-10'}`} />
            </div>
          ))}
          <div className="h-12 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
