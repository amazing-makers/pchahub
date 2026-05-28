export default function KnowhowLoading() {
  return (
    <main className="bg-gray-50">
      {/* 히어로 스켈레톤 */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-7 w-3/5 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
          {/* 통계 스켈레톤 */}
          <div className="mt-5 flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-24 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
          {/* 검색 스켈레톤 */}
          <div className="mt-5 h-9 max-w-md animate-pulse rounded-lg bg-gray-200" />
          {/* 필터 칩 스켈레톤 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </section>

      {/* 카드 그리드 스켈레톤 */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {/* 커버 이미지 스켈레톤 */}
              <div className="aspect-video w-full animate-pulse bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-gray-100" />
                <div className="mt-3 flex justify-between">
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
