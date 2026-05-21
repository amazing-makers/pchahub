export default function BookLoading() {
  return (
    <main className="bg-gray-50 animate-pulse">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6 space-y-2">
          <div className="h-4 w-36 rounded bg-gray-100" />
          <div className="h-7 w-40 rounded bg-gray-200" />
          <div className="h-4 w-56 rounded bg-gray-100" />
        </div>
      </div>

      <div className="container mx-auto py-8 max-w-xl space-y-5">
        {/* mentor info */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-100" />
          </div>
          <div className="h-5 w-16 rounded bg-gray-100" />
        </div>
        {/* form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-10 w-full rounded-lg bg-gray-100" />
            </div>
          ))}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-24 w-full rounded-lg bg-gray-100" />
          </div>
          <div className="h-11 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
