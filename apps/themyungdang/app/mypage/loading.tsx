/** Mypage loading skeleton — shown while getServerSession resolves */
export default function MyPageLoading() {
  return (
    <main className="bg-gray-50">
      {/* Profile header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start gap-4">
            <div className="skeleton h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="skeleton h-7 w-40 rounded-lg" />
              <div className="skeleton h-4 w-56 rounded-md" />
            </div>
            <div className="skeleton h-9 w-24 rounded-xl" />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        {/* Stat grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
              <div className="skeleton h-4 w-4 rounded-md" />
              <div className="skeleton h-3 w-16 rounded-md" />
              <div className="skeleton h-5 w-10 rounded-md" />
            </div>
          ))}
        </div>

        {/* Inquiries section */}
        <div className="space-y-3">
          <div className="skeleton h-5 w-28 rounded-lg" />
          {[0, 1].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="skeleton h-4 w-64 max-w-full rounded-md" />
                <div className="skeleton h-3 w-24 rounded-md" />
              </div>
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>

        {/* Favorites section */}
        <div className="space-y-4">
          <div className="skeleton h-5 w-20 rounded-lg" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="skeleton aspect-[4/3] w-full rounded-none" />
                <div className="space-y-2 p-4">
                  <div className="skeleton h-4 w-3/4 rounded-md" />
                  <div className="skeleton h-3 w-1/2 rounded-md" />
                  <div className="skeleton h-8 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
