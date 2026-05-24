import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, Building2, ChevronRight, MapPin, Store, TrendingUp } from 'lucide-react'
import { Badge, Button, Card, CardContent, NewsletterForm } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { KOREAN_REGIONS } from '@/lib/regions-data'
import { LISTINGS } from '@/lib/mock-listings'
import { getBrands, getBrandById } from '@/lib/kftc/source'
import { BrandCard } from '@/components/brand-card'
import { ListingCard } from '@/components/listing-card'

interface Props {
  params: { region: string }
}

export function generateStaticParams() {
  return KOREAN_REGIONS.map((r) => ({ region: encodeURIComponent(r.key) }))
}

export const dynamicParams = true
export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = decodeURIComponent(params.region)
  const info = KOREAN_REGIONS.find((r) => r.key === region)
  if (!info) return {}
  return buildPageMetadata('pchahub', {
    title: `${info.shortLabel} 프랜차이즈 창업 — 브랜드·매물 현황`,
    description: `${info.label} 기반 프랜차이즈 브랜드 목록, 평균 창업비, 인기 업종, 창업 매물을 한눈에 확인하세요. ${info.description}`,
    path: `/regions/${params.region}`,
  })
}

export default async function RegionDetailPage({ params }: Props) {
  const regionKey = decodeURIComponent(params.region)
  const regionInfo = KOREAN_REGIONS.find((r) => r.key === regionKey)
  if (!regionInfo) notFound()

  const allBrands = await getBrands()
  const regionBrands = allBrands.filter((b) => b.hqRegion === regionKey)
  const otherRegionBrands = allBrands
    .filter((b) => b.hqRegion !== regionKey)
    .sort((a, b) => b.storeCount - a.storeCount)
    .slice(0, 6)

  // 지역 관련 매물 (region 필드 기반 — MockListing.region은 시도 단위)
  const regionListings = LISTINGS.filter(
    (l) => l.region === regionKey || l.region?.startsWith(regionKey),
  ).slice(0, 6)

  // 카테고리별 브랜드 수
  const catCounts: Record<string, { label: string; count: number }> = {}
  for (const b of regionBrands) {
    if (!catCounts[b.category]) catCounts[b.category] = { label: b.categoryLabel, count: 0 }
    catCounts[b.category]!.count++
  }
  const sortedCats = Object.entries(catCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  const avgStartupCost =
    regionBrands.length > 0
      ? Math.round(regionBrands.reduce((s, b) => s + (b.startupCost ?? 0), 0) / regionBrands.length)
      : 0

  const topCategory = sortedCats[0]

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd({
    items: [
      { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
      { name: '지역별 탐색', url: 'https://pchahub.amakers.co.kr/regions' },
      { name: regionInfo.shortLabel, url: `https://pchahub.amakers.co.kr/regions/${params.region}` },
    ],
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbsJsonLd} />

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href="/regions" className="hover:text-gray-900">지역별 탐색</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{regionInfo.shortLabel}</span>
          </nav>

          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
            <h1 className="text-h2 font-bold text-gray-900">{regionInfo.label} 창업 현황</h1>
          </div>
          <p className="mt-2 max-w-2xl text-gray-600">{regionInfo.description}</p>

          {/* 주요 상권 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-gray-500">주요 상권</span>
            {regionInfo.hotspots.map((h) => (
              <span
                key={h}
                className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs text-gray-700"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            { value: `${regionBrands.length}개`, label: '본사 소재 브랜드' },
            {
              value: avgStartupCost > 0 ? `${formatNumber(avgStartupCost)}만` : '-',
              label: '평균 창업비',
            },
            { value: topCategory ? topCategory[1].label : '-', label: '인기 업종 1위' },
            { value: `${regionListings.length}건`, label: '지역 매물' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-4">
              <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-10 space-y-12">

        {/* 업종별 분포 */}
        {sortedCats.length > 0 && (
          <section>
            <h2 className="mb-5 text-h4 font-semibold text-gray-900">
              {regionInfo.shortLabel} 업종별 브랜드 분포
            </h2>
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {sortedCats.map(([key, { label, count }]) => {
                    const maxCount = sortedCats[0]?.[1].count ?? 1
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <a
                          href={`/brands?category=${key}&region=${regionKey}`}
                          className="w-20 shrink-0 text-sm font-medium text-gray-700 hover:underline"
                        >
                          {label}
                        </a>
                        <div className="relative flex-1 h-7 overflow-hidden rounded-lg bg-gray-100">
                          <div
                            className="h-full rounded-lg transition-all"
                            style={{
                              width: `${(count / maxCount) * 100}%`,
                              background: 'var(--brand-primary)',
                              opacity: 0.85,
                            }}
                          />
                        </div>
                        <div className="w-14 shrink-0 text-right text-sm font-semibold text-gray-900">
                          {count}개
                        </div>
                        <a
                          href={`/brands?category=${key}&region=${regionKey}`}
                          className="text-xs text-gray-500 hover:text-gray-900"
                        >
                          보기 →
                        </a>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 이 지역 브랜드 목록 */}
        {regionBrands.length > 0 ? (
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-h4 font-semibold text-gray-900">
                  {regionInfo.shortLabel} 본사 브랜드 {regionBrands.length}개
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {regionInfo.shortLabel}에 본사를 둔 프랜차이즈 브랜드
                </p>
              </div>
              <a
                href={`/brands?region=${regionKey}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                전체 보기 →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regionBrands.slice(0, 9).map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </div>
            {regionBrands.length > 9 && (
              <div className="mt-5 text-center">
                <a href={`/brands?region=${regionKey}`}>
                  <Button variant="outline" size="md">
                    {regionInfo.shortLabel} 브랜드 전체 보기 ({regionBrands.length}개)
                  </Button>
                </a>
              </div>
            )}
          </section>
        ) : (
          <section>
            <h2 className="mb-3 text-h4 font-semibold text-gray-900">
              {regionInfo.shortLabel} 등록 브랜드
            </h2>
            <Card className="border-dashed border-gray-200">
              <CardContent className="p-10 text-center">
                <Building2 className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">
                  현재 {regionInfo.shortLabel}에 본사를 둔 등록 브랜드가 없습니다.
                </p>
                <p className="mt-1 text-xs text-gray-400">전국 브랜드 검색으로 이동해 탐색해보세요.</p>
                <a href="/brands" className="mt-5 inline-block">
                  <Button variant="outline" size="md">전체 브랜드 보기</Button>
                </a>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 지역 매물 */}
        {regionListings.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-h4 font-semibold text-gray-900">
                  {regionInfo.shortLabel} 창업 매물
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {regionInfo.shortLabel} 지역 양도·신규임대 매물
                </p>
              </div>
              <a href="/listings" className="text-sm text-gray-600 hover:text-gray-900">
                전체 매물 →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regionListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}

        {/* 다른 지역 인기 브랜드 */}
        <section>
          <div className="mb-5">
            <h2 className="text-h4 font-semibold text-gray-900">전국 인기 브랜드도 살펴보세요</h2>
            <p className="mt-1 text-sm text-gray-500">
              본사 소재지와 관계없이 전국에서 운영 중인 브랜드
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherRegionBrands.map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        </section>

        {/* 다른 지역 이동 */}
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">다른 지역 보기</h2>
          <div className="flex flex-wrap gap-2">
            {KOREAN_REGIONS.filter((r) => r.key !== regionKey).map((r) => (
              <a
                key={r.key}
                href={`/regions/${encodeURIComponent(r.key)}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                {r.shortLabel}
              </a>
            ))}
          </div>
        </section>

        {/* 뉴스레터 */}
        <section className="rounded-3xl border border-gray-100 bg-gray-50 px-8 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Newsletter
          </p>
          <h2 className="mt-2 text-h4 font-bold text-gray-900">
            {regionInfo.shortLabel} 창업 소식을 받아보세요
          </h2>
          <p className="mt-1 text-sm text-gray-500">신규 매물, 브랜드 동향, 창업비 변동 정보를 격주로 받아보세요.</p>
          <NewsletterForm />
          <p className="mt-2 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
        </section>
      </div>
    </main>
  )
}
