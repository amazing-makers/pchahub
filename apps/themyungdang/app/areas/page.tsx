import { AreaChip } from '@/components/area-chip'
import { AREAS, listingsByArea } from '@/lib/mock-data'

export default function AreasPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">상권 분석</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            주요 상권의 유동인구·임대료·업종 비중을 비교해 보세요. 각 상권은 매물 목록과 함께
            연결됩니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <AreaChip key={a.key} area={a} listingCount={listingsByArea(a.key).length} />
          ))}
        </div>
      </div>
    </main>
  )
}
