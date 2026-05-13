import dynamic from 'next/dynamic'
import { AreaChip } from '@/components/area-chip'
import { AREAS, listingsByArea } from '@/lib/mock-data'

const AreasMap = dynamic(() => import('@/components/areas-map'), { ssr: false })

export default function AreasPage() {
  return (
    <main className="bg-gray-50">
      {/* ── 헤더 ────────────────────────────────────────────────── */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">상권 분석</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            전국 주요 상권의 위치·유동인구·임대료·업종 비중을 지도에서 직접 확인하세요.
            원 크기는 반경, 색상은 유동인구 규모를 나타냅니다.
          </p>
        </div>
      </section>

      {/* ── 전국 상권 지도 ───────────────────────────────────────── */}
      <section className="container mx-auto py-6">
        <AreasMap areas={AREAS} height={520} />
        <p className="mt-2 text-center text-xs text-gray-400">
          원을 클릭하면 해당 상권의 주요 지표와 상세 분석 링크를 볼 수 있습니다.
        </p>
      </section>

      {/* ── 상권 카드 그리드 ─────────────────────────────────────── */}
      <section className="container mx-auto pb-12">
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">전체 상권 목록</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <AreaChip key={a.key} area={a} listingCount={listingsByArea(a.key).length} />
          ))}
        </div>
      </section>
    </main>
  )
}
