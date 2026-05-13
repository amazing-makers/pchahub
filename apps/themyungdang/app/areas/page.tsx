import AreasPageClient from '@/components/areas-page-client'

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

      {/* ── 필터 + 지도 + 카드 그리드 (client) ─────────────────── */}
      <AreasPageClient />
    </main>
  )
}
