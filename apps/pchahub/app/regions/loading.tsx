export default function RegionsLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10">
          <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-100" />
        </div>
      </section>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(17)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      </div>
    </main>
  )
}
