export default function MeetingDetailLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-4 w-36 rounded bg-gray-100" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <div className="h-6 w-24 rounded bg-gray-200" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between border-b border-gray-100 pb-3">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-28 rounded bg-gray-200" />
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="h-6 w-20 rounded bg-gray-200" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`h-4 rounded bg-gray-100 ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
            {/* attendees */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="h-6 w-28 rounded bg-gray-200" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gray-200" />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-5 w-20 rounded bg-gray-200" />
              <div className="h-11 w-full rounded-xl bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
