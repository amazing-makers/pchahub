export default function EpisodeDetailLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-4 w-36 rounded bg-gray-100" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            {/* video player */}
            <div className="aspect-video rounded-2xl bg-gray-200" />
            {/* content */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="h-6 w-24 rounded bg-gray-200" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`h-4 rounded bg-gray-100 ${i % 4 === 3 ? 'w-1/2' : 'w-full'}`} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
              <div className="h-5 w-20 rounded bg-gray-200" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-gray-50 flex gap-3 p-3">
                  <div className="h-14 w-20 shrink-0 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-full rounded bg-gray-200" />
                    <div className="h-3 w-2/3 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
