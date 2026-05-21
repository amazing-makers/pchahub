export default function NotificationsLoading() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-24 rounded bg-gray-200" />
              <div className="h-4 w-56 rounded bg-gray-100" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-gray-100" />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-6 animate-pulse space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
            </div>
            <div className="h-3 w-12 shrink-0 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </main>
  )
}
