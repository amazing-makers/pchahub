export default function PostDetailLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 space-y-3">
          <div className="h-4 w-36 rounded bg-gray-100" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 max-w-3xl space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`h-4 rounded bg-gray-100 ${i % 5 === 4 ? 'w-1/2' : 'w-full'}`} />
          ))}
        </div>
        {/* tags */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 w-16 rounded-full bg-gray-100" />
          ))}
        </div>
        {/* actions */}
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-20 rounded-xl bg-gray-100" />
          ))}
        </div>
        {/* comments */}
        <div className="space-y-3">
          <div className="h-5 w-20 rounded bg-gray-200" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-100" />
              </div>
              <div className="h-3 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
