export default function CalculatorLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 rounded bg-gray-100" />
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* input panel */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-10 w-full rounded-lg bg-gray-100" />
              </div>
            ))}
            <div className="h-11 w-full rounded-xl bg-gray-200" />
          </div>
          {/* result panel */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <div className="h-6 w-32 rounded bg-gray-200" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between border-b border-gray-100 pb-3">
                <div className="h-4 w-28 rounded bg-gray-100" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-5 w-28 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
