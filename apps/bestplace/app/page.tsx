import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('bestplace', {
  title: '베스트플레이스 — 올해의 베스트 매장·브랜드 어워드',
  description: '매년 amakers가 선정하는 프랜차이즈 베스트 어워드와 전국 매장 실시간 랭킹. 평점·방문객·리뷰 기준 Top 10을 확인하세요.',
  path: '/',
})

import { ArrowRight, Award, Flame, Trophy } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { AwardCard } from '@/components/award-card'
import { StoreCard } from '@/components/store-card'
import { RankingList } from '@/components/ranking-list'
import {
  awardsByYear,
  newestStores,
  STORES,
  topStoresByRating,
  topStoresByVisitors,
} from '@/lib/mock-data'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'bestplace')

export default function HomePage() {
  const currentYear = 2026
  const yearAwards = awardsByYear(currentYear)
  // 카테고리별 1위만 추출
  const firstPlaceAwards = yearAwards.filter((a) => a.rank === 1).slice(0, 4)
  const topRated = topStoresByRating(5)
  const topVisitors = topStoresByVisitors(5)
  const newStores = newestStores(4)

  const orgJsonLd = buildOrganizationJsonLd({
    name: '베스트플레이스',
    url: 'https://bestplace.kr',
    description: '매년 amakers가 선정하는 프랜차이즈 베스트 어워드와 전국 매장 실시간 랭킹.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '베스트플레이스',
    url: 'https://bestplace.kr',
    searchUrlTemplate: 'https://bestplace.kr/search?q={search_term_string}',
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      {/* Hero — gold gradient */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-amber-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              베스트플레이스 · bestplace.kr
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              올해의 베스트 매장
              <br />
              올해의 베스트 브랜드
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              매년 amakers가 선정하는 베스트 어워드와 전국 프랜차이즈 매장 디렉토리.
              <br className="hidden sm:inline" />
              실시간 랭킹으로 지금 가장 잘하고 있는 매장을 확인하세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`/awards/${currentYear}`}
                className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                {currentYear} 어워드 보기 <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/stores"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                전국 매장 둘러보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Awards — 카테고리별 1위 4개 */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
              <Trophy className="h-6 w-6 text-amber-500" />
              {currentYear} 베스트 어워드
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              매장 운영·점주 만족도·매출 안정성 기반 amakers 선정
            </p>
          </div>
          <a
            href={`/awards/${currentYear}`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            카테고리별 전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {firstPlaceAwards.map((a) => (
            <AwardCard key={a.id} award={a} />
          ))}
        </div>
      </section>

      {/* Rankings */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
              <Flame className="h-6 w-6 text-orange-500" />
              실시간 매장 랭킹
            </h2>
            <p className="mt-1 text-sm text-gray-500">평점·월 방문객 기준 — 매주 업데이트</p>
          </div>
          <a
            href="/rankings"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 랭킹 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <RankingList stores={topRated} metric="rating" title="평점 Top 5" />
          <RankingList stores={topVisitors} metric="visitors" title="월 방문객 Top 5" />
        </div>
      </section>

      {/* New stores */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">신규 오픈 매장</h2>
            <p className="mt-1 text-sm text-gray-500">최근 오픈한 인증 매장 (입소문 빠른 곳 위주)</p>
          </div>
          <a
            href="/stores?sort=newest"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 신규 매장 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newStores.map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      </section>

      {/* Past awards reference */}
      <section className="container mx-auto pt-section">
        <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardContent className="p-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  <Award className="h-4 w-4" /> 역대 어워드
                </p>
                <h2 className="mt-3 text-h2 font-bold">2024 · 2025 베스트 매장도 확인</h2>
                <p className="mt-3 max-w-2xl text-gray-300">
                  매년 수상한 브랜드의 다음 해 성장 추이를 비교해보세요. 어워드를 받은 브랜드의
                  실제 매장 수 변화와 만족도를 한 화면에서 볼 수 있습니다.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <a
                  href="/awards/2025"
                  className="rounded-md bg-white/10 px-4 py-2 text-center text-sm font-medium text-white hover:bg-white/20"
                >
                  2025 어워드
                </a>
                <a
                  href="/awards/2024"
                  className="rounded-md bg-white/10 px-4 py-2 text-center text-sm font-medium text-white hover:bg-white/20"
                >
                  2024 어워드
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Other platforms */}
      <section className="container mx-auto py-section">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold text-gray-900">amakers의 다른 플랫폼</h2>
          <p className="mt-1 text-sm text-gray-500">
            가맹 정보·매물·교육·커뮤니티 — 가맹점 운영 단계별 전문 플랫폼
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {otherPlatforms.map(([key, p]) => (
            <a key={key} href={`https://${p.domain}`} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-7 w-7 shrink-0 rounded-md"
                      style={{ background: p.primary }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {p.name}
                      </div>
                      <div className="truncate text-xs text-gray-500">{p.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
