export default function InvestmentDetailLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-4 w-48 rounded bg-gray-100 mb-4" />
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-7 w-56 rounded bg-gray-200" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 rounded-full bg-gray-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            {/* progress */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-6 w-20 rounded bg-gray-200" />
                    <div className="h-3 w-16 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200" />
            </div>
            {/* content */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
                <div className="h-6 w-28 rounded bg-gray-200" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className={`h-4 rounded bg-gray-100 ${j % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
                ))}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-5 w-20 rounded bg-gray-200" />
              <div className="h-7 w-28 rounded bg-gray-200" />
              <div className="h-11 w-full rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
