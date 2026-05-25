import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('bestplace', {
  title: '실시간 랭킹',
  description: '방문객·평점·리뷰 수 기준 전국 프랜차이즈 매장 실시간 랭킹.',
  path: '/rankings',
})

import { ArrowRight, BookOpen, MapPin, Trophy, Wrench } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { RankingList } from '@/components/ranking-list'
import { AwardCard } from '@/components/award-card'
import {
  BRANDS,
  CATEGORIES,
  newestStores,
  STORES,
  topStoresByRating,
  topStoresByVisitors,
  brandById,
  awardsByYear,
} from '@/lib/mock-data'

const STORE_REGIONS = Array.from(new Set(STORES.map((s) => s.region))).sort()

interface RankingsPageProps {
  searchParams: { category?: string; region?: string }
}

export default function RankingsPage({ searchParams }: RankingsPageProps) {
  const selectedCategory = searchParams.category ?? ''
  const selectedRegion = searchParams.region ?? ''
  const currentYear = new Date().getFullYear()

  // Global stats (always over full STORES set)
  const avgRating = (STORES.reduce((s, st) => s + st.rating, 0) / STORES.length).toFixed(1)
  const totalReviews = STORES.reduce((s, st) => s + st.reviewCount, 0)
  const totalVisitors = STORES.reduce((s, st) => s + st.monthlyVisitors, 0)
  const regionCount = new Set(STORES.map((s) => s.region)).size

  // Category + region filtered base
  let filteredBase = selectedCategory
    ? STORES.filter((s) => {
        const brand = BRANDS.find((b) => b.id === s.brandId)
        return brand?.category === selectedCategory
      })
    : [...STORES]
  if (selectedRegion) filteredBase = filteredBase.filter((s) => s.region === selectedRegion)

  const topRated = [...filteredBase].sort((a, b) => b.rating - a.rating).slice(0, 10)
  const topVisitors = [...filteredBase].sort((a, b) => b.monthlyVisitors - a.monthlyVisitors).slice(0, 10)
  const newOpen = [...filteredBase].sort((a, b) => b.openedYear - a.openedYear).slice(0, 10)
  const topReviewed = [...filteredBase].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 10)
  // Show rank-1 winners from the current year as award highlights (filtered by category if set)
  const allAwards = awardsByYear(currentYear).filter((a) => a.rank === 1)
  const topAwards = selectedCategory
    ? allAwards.filter((a) => a.category === selectedCategory)
    : allAwards

  // #1 store by rating for Hall of Fame callout
  const hallOfFameStore = topRated[0]
  const hallOfFameBrand = hallOfFameStore ? brandById(hallOfFameStore.brandId) : undefined

  const listJsonLd = buildItemListJsonLd({
    url: 'https://bestplace.amakers.co.kr/rankings',
    items: topRated.map((s) => ({ name: s.name, url: `https://bestplace.amakers.co.kr/stores/${s.id}` })),
  })

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '베스트플레이스', url: 'https://bestplace.amakers.co.kr' },
      { name: '실시간 랭킹', url: 'https://bestplace.amakers.co.kr/rankings' },
    ],
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">실시간 매장 랭킹</h1>
          <p className="mt-1 text-sm text-gray-500">
            평점·방문객·리뷰·신규 오픈 4가지 축으로 매주 업데이트되는 랭킹.
          </p>
          {/* Category filter tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[{ key: '', label: '전체 업종' }, ...CATEGORIES.map((c) => ({ key: c.key, label: c.label }))].map((cat) => {
              const isActive = cat.key === '' ? !selectedCategory : selectedCategory === cat.key
              const href = cat.key === ''
                ? `/rankings${selectedRegion ? `?region=${selectedRegion}` : ''}`
                : `/rankings?${new URLSearchParams({ category: cat.key, ...(selectedRegion ? { region: selectedRegion } : {}) }).toString()}`
              return (
                <a
                  key={cat.key || 'all'}
                  href={href}
                  className={'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' + (isActive ? 'text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')}
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {cat.label}
                </a>
              )
            })}
          </div>
          {/* Region filter */}
          <div className="mt-2 flex flex-wrap gap-2">
            {[{ key: '', label: '전국' }, ...STORE_REGIONS.map((r) => ({ key: r, label: r }))].map((reg) => {
              const isActive = reg.key === '' ? !selectedRegion : selectedRegion === reg.key
              const href = reg.key === ''
                ? `/rankings${selectedCategory ? `?category=${selectedCategory}` : ''}`
                : `/rankings?${new URLSearchParams({ region: reg.key, ...(selectedCategory ? { category: selectedCategory } : {}) }).toString()}`
              return (
                <a
                  key={reg.key || 'all'}
                  href={href}
                  className={'rounded-full px-3 py-1 text-xs font-medium transition-colors ' + (isActive ? 'text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}
                  style={isActive ? { background: 'var(--brand-primary)' } : undefined}
                >
                  {reg.label}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {!selectedCategory && (
        <div className="border-b border-gray-100 bg-white">
          <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: formatNumber(STORES.length), label: '전체 매장 수' },
              { value: `⭐ ${avgRating}`, label: '평균 평점' },
              { value: formatNumber(totalVisitors), label: '월 방문객 합계' },
              { value: formatNumber(totalReviews), label: '누적 리뷰 수' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto py-8">
        {hallOfFameStore && (
          <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 shadow-md">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <div className="text-4xl">🏆</div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-900">
                  명예의 전당 · 이번 주 종합 1위
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">{hallOfFameStore.name}</h2>
                <p className="mt-0.5 text-sm text-amber-100">
                  {hallOfFameBrand?.categoryLabel} · {hallOfFameStore.region} {hallOfFameStore.district}
                  &nbsp;·&nbsp;평점 ⭐ {hallOfFameStore.rating}
                  &nbsp;·&nbsp;리뷰 {hallOfFameStore.reviewCount.toLocaleString()}건
                </p>
              </div>
              <a
                href={`/stores/${hallOfFameStore.id}`}
                className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 shadow-sm transition-colors hover:bg-amber-50"
              >
                매장 보기 →
              </a>
            </div>
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RankingList stores={topRated} metric="rating" title="평점 Top 10" />
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RankingList stores={topVisitors} metric="visitors" title="월 방문객 Top 10" />
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RankingList stores={topReviewed} metric="rating" title="리뷰 많은 매장 Top 10" />
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RankingList stores={newOpen} metric="visitors" title="신규 오픈 매장 Top 10" />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardContent className="p-5 text-sm">
            <div className="font-semibold text-amber-900">랭킹 산정 방식</div>
            <p className="mt-1 text-amber-800">
              실시간 랭킹은 매장의 평점·리뷰 수·방문객·운영 안정성을 가중 합산해 매주 갱신됩니다.
              어워드는 연 1회 amakers 선정위원회가 별도 기준으로 시상합니다.
            </p>
          </CardContent>
        </Card>

        {/* 베스트 어워드 — 카테고리별 대상 */}
        {topAwards.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="text-h4 font-bold text-gray-900">{currentYear} 베스트 어워드 — 대상</h2>
              </div>
              <a
                href={`/awards/${currentYear}`}
                className="text-sm font-medium text-amber-700 hover:underline"
              >
                전체 어워드 보기 →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topAwards.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://gongganhansu.amakers.co.kr/quote" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5 text-rose-500" />매장 시공 견적</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themanual.amakers.co.kr/courses" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-amber-500" />창업 운영 강의</span>
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">매장 랭킹 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">월별 랭킹 변동·우수 매장 인터뷰·지역별 top매장 소식을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
