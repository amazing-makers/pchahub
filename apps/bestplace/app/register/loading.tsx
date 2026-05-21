export default function RegisterLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-72 rounded bg-gray-100" />
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        <div className="max-w-2xl space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-10 w-full rounded-lg bg-gray-100" />
            </div>
          ))}
          <div className="h-11 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
