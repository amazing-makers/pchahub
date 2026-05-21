import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('themyungdang', {
  title: '상권 분석',
  description: '전국 주요 상권 위치·유동인구·임대료·업종 비중을 지도에서 직접 확인하세요. 창업 입지 선정에 필수적인 상권 데이터.',
  path: '/areas',
})

import { ArrowRight, BookOpen, MapPin, Star, Store } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { AREAS } from '@/lib/mock-data'
import AreasPageClient from '@/components/areas-page-client'

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더명당', url: 'https://themyungdang.amakers.co.kr' },
    { name: '상권 분석', url: 'https://themyungdang.amakers.co.kr/areas' },
  ],
})

const listJsonLd = buildItemListJsonLd({
  url: 'https://themyungdang.amakers.co.kr/areas',
  items: AREAS.map((a) => ({ name: `${a.region} ${a.name}`, url: `https://themyungdang.amakers.co.kr/areas/${a.key}` })),
})

export default function AreasPage() {
  const uniqueRegions = Array.from(new Set(AREAS.map((a) => a.region))).length
  const avgFootTraffic = AREAS.length
    ? Math.round(AREAS.reduce((s, a) => s + a.footTraffic, 0) / AREAS.length)
    : 0
  const maxArea = [...AREAS].sort((a, b) => b.footTraffic - a.footTraffic)[0]

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
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

      {/* 통계 스트립 */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            { value: `${AREAS.length}개`, label: '분석 상권' },
            { value: `${uniqueRegions}개`, label: '커버 지역' },
            { value: formatNumber(avgFootTraffic), label: '평균 유동인구' },
            { value: maxArea?.name ?? '-', label: '최대 유동인구 상권' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-4">
              <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 필터 + 지도 + 카드 그리드 (client) ─────────────────── */}
      <AreasPageClient />

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themanual.amakers.co.kr/courses" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-rose-500" />창업 운영 강의</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />점주 커뮤니티</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">상권 분석 리포트를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">지역별 유동인구 동향·공실률·권리금 시세를 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
