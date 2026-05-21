export default function CampaignsLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6 animate-pulse">
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="mt-3 h-7 w-32 rounded bg-gray-200" />
          <div className="mt-1 h-4 w-56 rounded bg-gray-100" />
        </div>
      </section>
      <div className="container mx-auto max-w-2xl py-8 animate-pulse space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white p-4 shadow-sm space-y-3">
            <div className="flex justify-between">
              <div className="h-5 w-1/2 rounded bg-gray-200" />
              <div className="h-5 w-16 rounded-full bg-gray-100" />
            </div>
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-2 w-full rounded-full bg-gray-100" />
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-gray-100" />
              <div className="h-3 w-16 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
