export default function ThemesLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8 animate-pulse">
          <div className="h-8 w-32 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 rounded bg-gray-100" />
        </div>
      </section>

      <div className="container mx-auto py-8 animate-pulse">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-28 rounded bg-gray-200" />
                    <div className="h-5 w-10 rounded-full bg-gray-100" />
                  </div>
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
              <div className="h-4 w-28 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
