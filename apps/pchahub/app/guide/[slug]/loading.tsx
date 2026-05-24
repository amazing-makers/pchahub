export default function GuideSlugLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-8 w-full max-w-xl animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-5 w-full max-w-lg animate-pulse rounded bg-gray-100" />
        </div>
      </section>
      <div className="container mx-auto py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-52 animate-pulse rounded-2xl bg-white shadow-sm" />
            <div className="h-40 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </main>
  )
}
