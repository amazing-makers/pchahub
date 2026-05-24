export default function RegionDetailLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-5 w-full max-w-lg animate-pulse rounded bg-gray-100" />
        </div>
      </section>
      <div className="container mx-auto py-10 space-y-10">
        <div className="h-40 animate-pulse rounded-2xl bg-white shadow-sm" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    </main>
  )
}
