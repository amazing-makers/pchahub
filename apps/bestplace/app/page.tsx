import type { Metadata } from 'next'
import { buildFaqPageJsonLd, buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('bestplace', {
  title: '베스트플레이스 — 올해의 베스트 매장·브랜드 어워드',
  description: '어디가 진짜 잘되는 매장일까? 평점·방문객·리뷰로 검증된 전국 매장 실시간 랭킹과 올해의 베스트 어워드, Top 10을 확인하세요.',
  path: '/',
})

import { ArrowRight, Award, CalendarDays, Flame, Sparkles, Trophy } from 'lucide-react'
import { Card, CardContent, NewsletterForm } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { AwardCard } from '@/components/award-card'
import { StoreCard } from '@/components/store-card'
import { RankingList } from '@/components/ranking-list'
import { CampaignCard } from '@/components/campaign-card'
import { RecentlyViewedStores } from '@/components/recently-viewed-stores'
import { SavedStoresSection } from '@/components/saved-stores-section'
import {
  awardsByYear,
  newestStores,
  STORES,
  topStoresByRating,
  topStoresByVisitors,
} from '@/lib/mock-data'
import { openCampaigns } from '@/lib/mock-experiences'
import { CURRENT_MONTHLY_BEST, MONTH_LABEL } from '@/lib/mock-monthly-best'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'bestplace')

const FAQS = [
  {
    q: '베스트 매장은 어떤 기준으로 선정되나요?',
    a: '평점, 방문객 수, 리뷰 수와 신뢰도를 종합해 산정합니다. 어워드는 매년 카테고리별로 선정되며, 매장 랭킹은 실시간 지표를 반영해 지속적으로 업데이트됩니다.',
  },
  {
    q: '랭킹은 얼마나 자주 갱신되나요?',
    a: '매장 평점·방문객·리뷰 지표를 주기적으로 집계해 랭킹에 반영합니다. 카테고리별·지역별 Top 10을 언제든 최신 기준으로 확인할 수 있습니다.',
  },
  {
    q: '우리 매장을 등록하거나 정보를 수정하려면 어떻게 하나요?',
    a: '매장 등록 신청을 통해 매장 정보를 추가할 수 있으며, 등록 후에는 영업 정보·사진·메뉴 등을 직접 관리할 수 있습니다. 잘못된 정보는 매장 페이지에서 수정 요청이 가능합니다.',
  },
  {
    q: '리뷰와 평점은 신뢰할 수 있나요?',
    a: '실제 방문 기록을 기반으로 한 리뷰에 가중치를 두고, 어뷰징·허위 리뷰는 모니터링을 통해 걸러냅니다. 그래서 랭킹과 평점이 실제 매장 경험을 더 정확하게 반영합니다.',
  },
]

export default function HomePage() {
  const currentYear = new Date().getFullYear()
  const yearAwards = awardsByYear(currentYear)
  const firstPlaceAwards = yearAwards.filter((a) => a.rank === 1).slice(0, 4)
  const topRated = topStoresByRating(5)
  const topVisitors = topStoresByVisitors(5)
  const newStores = newestStores(4)
  const openCampaignList = openCampaigns(3)
  const { month, entries: monthlyEntries } = CURRENT_MONTHLY_BEST
  const monthlyTop = monthlyEntries.filter((e) => e.rank === 1).slice(0, 3)

  const orgJsonLd = buildOrganizationJsonLd({
    name: '베스트플레이스',
    url: 'https://bestplace.amakers.co.kr',
    description: '매년 amakers가 선정하는 프랜차이즈 베스트 어워드와 전국 매장 실시간 랭킹.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '베스트플레이스',
    url: 'https://bestplace.amakers.co.kr',
    searchUrlTemplate: 'https://bestplace.amakers.co.kr/search?q={search_term_string}',
  })
  const faqJsonLd = buildFaqPageJsonLd({
    url: 'https://bestplace.amakers.co.kr',
    items: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd} />
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
              진짜 잘되는 매장은
              <br />
              따로 있습니다
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              평점·방문객·리뷰로 검증된 전국 매장 랭킹과 올해의 베스트 어워드.
              <br className="hidden sm:inline" />
              지금 가장 잘나가는 매장이 어디인지 확인하세요.
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

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: formatNumber(STORES.length), label: '등록 매장' },
              { value: `${firstPlaceAwards.length}개`, label: '올해 대상' },
              { value: formatNumber(STORES.reduce((s, st) => s + st.reviewCount, 0)), label: '누적 리뷰' },
              { value: (STORES.reduce((s, st) => s + st.rating, 0) / STORES.length).toFixed(1), label: '평균 별점' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 본 매장 — localStorage 기반, hydration 후 렌더 */}
      <RecentlyViewedStores />

      {/* 저장한 매장 — 클라이언트 전용, localStorage 기반 */}
      <SavedStoresSection />

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

      {/* 이달의 베스트 */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
              <CalendarDays className="h-6 w-6 text-amber-500" />
              {MONTH_LABEL[month]} 이달의 베스트
            </h2>
            <p className="mt-1 text-sm text-gray-500">방문객 증가·신규 리뷰·SNS 버즈 종합 선정</p>
          </div>
          <a
            href="/monthly-best"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {monthlyTop.map((entry) => (
            <a
              key={entry.storeId}
              href={`/stores/${entry.storeId}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <div
                className="flex h-16 items-end px-4 pb-3"
                style={{
                  background: `linear-gradient(135deg, ${entry.thumbnailColor}cc, ${entry.thumbnailColor}44)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-[11px] font-bold text-white">
                    1위
                  </span>
                  <span className="text-xs font-semibold text-white">{entry.categoryLabel}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-[11px] text-gray-400">{entry.brandName}</div>
                <div className="mt-0.5 text-sm font-bold text-gray-900 group-hover:text-[var(--brand-primary)] transition-colors">
                  {entry.storeName}
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-500">{entry.reason}</p>
                <div className="mt-2 flex gap-3">
                  {entry.metrics.slice(0, 2).map((m) => (
                    <div key={m.label}>
                      <div className="text-xs font-bold text-gray-900">{m.value}</div>
                      <div className="text-[10px] text-gray-400">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
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

      {/* 체험단·기자단 모집중 */}
      {openCampaignList.length > 0 && (
        <section className="container mx-auto pt-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
                <Sparkles className="h-6 w-6 text-violet-500" />
                모집중인 체험단·기자단
              </h2>
              <p className="mt-1 text-sm text-gray-500">베스트 매장 방문하고 혜택 받기</p>
            </div>
            <a
              href="/experiences"
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              전체 캠페인 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openCampaignList.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </section>
      )}

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

      {/* 자주 묻는 질문 */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-h3 font-bold text-gray-900">자주 묻는 질문</h2>
            <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {FAQS.map((f, i) => (
                <details key={i} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-gray-900 marker:content-['']">
                    {f.q}
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">베스트플레이스 뉴스레터</h2>
            <p className="mt-2 text-sm text-gray-500">매주 Top 매장 랭킹·어워드 소식·업종 트렌드를 받아보세요.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
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
