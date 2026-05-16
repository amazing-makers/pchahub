/** Post page loading skeleton — shown while auth session resolves */
export default function PostLoading() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="skeleton h-8 w-32 rounded-lg" />
          <div className="mt-2 skeleton h-4 w-96 max-w-full rounded-md" />
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
              >
                <div className="skeleton h-5 w-28 rounded-lg" />
                <div className="skeleton h-10 w-full rounded-xl" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="skeleton h-10 w-full rounded-xl" />
                  <div className="skeleton h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div className="skeleton h-4 w-20 rounded-md" />
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton h-4 w-full rounded-md" />
                ))}
              </div>
              <div className="skeleton h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
