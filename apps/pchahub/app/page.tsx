import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd, platformColors, type PlatformKey } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '프차허브 — 프랜차이즈 브랜드 정보 비교',
  description: '공정거래위원회 가맹정보 기반 브랜드 비교 플랫폼. 창업비·매출·성장률·가맹비를 한눈에 비교하고 나에게 맞는 브랜드를 찾으세요.',
  path: '/',
})

import { ArrowRight, Building2, Calculator, CheckCircle2, Flame, Handshake, MapPin, Sparkles, Users } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { SearchBar } from '@/components/search-bar'
import { RecentlyViewedBrands } from '@/components/recently-viewed-brands'
import { RecentlyViewedListings } from '@/components/recently-viewed-listings'
import { RecentlyViewedDiscussions } from '@/components/recently-viewed-discussions'
import { SavedBrandsSection } from '@/components/saved-brands-section'
import { BrandCard } from '@/components/brand-card'
import { CategoryChip } from '@/components/category-chip'
import { ListingCard } from '@/components/listing-card'
import { CATEGORIES, FEATURED_BRANDS, compareBrandsRecommended, hasRealPhoto } from '@/lib/mock-data'
import { LISTINGS } from '@/lib/mock-listings'
import { getBrands } from '@/lib/kftc/source'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'pchahub')

// 협찬 기업 — 프차허브 메인 화면 하단 노출
const SPONSORS = [
  {
    name: '브랜드메이킹 어메이커스',
    role: '프랜차이즈 브랜드 메이킹·컨설팅',
    initial: '어',
    color: '#7C3AED',
  },
  {
    name: '더베스트',
    role: '고기집 전문 창업 인큐베이팅',
    initial: '더',
    color: '#DC2626',
  },
] as const

// 협력 협회·기관 — 산업 단체와의 협력 표시 (작은 칩)
const ASSOCIATIONS = [
  { name: '한국프랜차이즈산업협회', color: '#0891B2' },
  { name: '한국외식업중앙회', color: '#16A34A' },
  { name: '한국식육협회', color: '#B91C1C' },
] as const

export const revalidate = 3600 // 1시간 캐시

export default async function HomePage() {
  const allBrands = await getBrands()
  // 메인 화면은 진짜 매장 사진 있는 브랜드만 노출 — 잘못된 stock 사진을
  // 카드 hero에 깔지 않도록.
  const photoBrands = allBrands.filter(hasRealPhoto)
  const trendingBrands = [...photoBrands].sort(compareBrandsRecommended).slice(0, 6)
  const recruitingBrands = [...photoBrands]
    .sort((a, b) => b.storeCount - a.storeCount)
    .slice(0, 6)
  const orgJsonLd = buildOrganizationJsonLd({
    name: '프차허브',
    url: 'https://pchahub.amakers.co.kr',
    description: '공정거래위원회 가맹정보 기반 브랜드 비교 플랫폼. 창업비·매출·성장률·가맹비를 한눈에 비교하고 나에게 맞는 브랜드를 찾으세요.',
  })
  const siteJsonLd = buildWebSiteJsonLd({
    name: '프차허브',
    url: 'https://pchahub.amakers.co.kr',
    searchUrlTemplate: 'https://pchahub.amakers.co.kr/search?q={search_term_string}',
  })
  return (
    <main>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />
      {/* Hero — search-led, matchmaking framing */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              프차허브 · pchahub.kr
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              한국 프랜차이즈 가맹의
              <br />
              새로운 기준
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              협회 공식 정보공개서를 바탕으로 내게 맞는 브랜드를 찾고
              <br className="hidden sm:inline" />
              본사와 바로 연결되는 가맹 정보 플랫폼
            </p>
            <div className="mt-10">
              <SearchBar />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                협회 등록 정보공개서 연동
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-500" />
                본사 직접 등록·관리
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
                본사 직접 연결
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 최근 본 브랜드 — 클라이언트 전용, localStorage 기반 */}
      <RecentlyViewedBrands />

      {/* 최근 본 매물 — 클라이언트 전용, localStorage 기반 */}
      <RecentlyViewedListings />

      {/* 최근 본 커뮤니티 글 — 클라이언트 전용, localStorage 기반 */}
      <RecentlyViewedDiscussions />

      {/* 저장한 브랜드 — 클라이언트 전용, localStorage 기반 */}
      <SavedBrandsSection />

      {/* 지금 뜨는 검색어 */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto py-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <Flame className="h-4 w-4 text-orange-500" />
              지금 뜨는 검색어
            </span>
            {[
              '치킨 창업', '카페 가맹', '한식 브랜드', '저비용 창업', '1인 창업',
              '분식 가맹', '편의점 창업', '수익률 높은', '서울 상권', '초보 창업자',
            ].map((kw) => (
              <a
                key={kw}
                href={`/brands?q=${encodeURIComponent(kw)}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100"
              >
                {kw}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured (paid) placements */}
      {FEATURED_BRANDS.length > 0 && (
        <section className="container mx-auto pt-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-h3 font-semibold text-gray-900">주목받는 가맹 브랜드</h2>
              <p className="mt-1 text-sm text-gray-500">광고 · 본사가 상단 노출 신청한 브랜드</p>
            </div>
            <a
              href="/brands"
              className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex"
            >
              전체 보기 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_BRANDS.map((b) => (
              <BrandCard key={b.id} brand={b} featured />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">업종별 브랜드 찾기</h2>
            <p className="mt-1 text-sm text-gray-500">원하는 업종을 선택하면 해당 브랜드 목록과 창업 정보를 바로 볼 수 있습니다</p>
          </div>
          <a href="/brands" className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex">
            전체 브랜드 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {CATEGORIES.map((c) => (
            <CategoryChip key={c.key} category={c} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
              <Flame className="h-6 w-6 text-orange-500" />
              지금 뜨고 있는 브랜드
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              최근 매장 성장률과 검색량 기준 · 지난 7일
            </p>
          </div>
          <a
            href="/brands?sort=growth-desc"
            className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex"
          >
            성장률 높은 순 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingBrands.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </section>

      {/* Recruiting brands */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">가맹 모집 중</h2>
            <p className="mt-1 text-sm text-gray-500">지금 가맹 신청을 받고 있는 브랜드</p>
          </div>
          <a
            href="/brands"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recruitingBrands.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </section>

      {/* Tools — scanner + calculator + listings */}
      <section className="container mx-auto pt-section">
        <div className="mb-6">
          <h2 className="text-h3 font-semibold text-gray-900">창업 의사결정 도구</h2>
          <p className="mt-1 text-sm text-gray-500">
            브랜드만 보지 마시고, 본인 조건에 맞춰 시뮬레이션해보세요.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <a href="/scanner" className="group">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900">창업 스캐너</h3>
                <p className="mt-1 text-sm text-gray-600">
                  7개 질문에 답하면 자본·운영 조건에 맞는 브랜드 Top 3를 추천해드립니다.
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  스캐너 시작 <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="/calculator" className="group">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900">수익 계산기</h3>
                <p className="mt-1 text-sm text-gray-600">
                  매장 조건을 입력하면 예상 매출·비용·영업이익·회수 기간을 실시간으로 계산합니다.
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  계산 시작 <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="/themes" className="group">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900">테마별 보기</h3>
                <p className="mt-1 text-sm text-gray-600">
                  소자본·1인운영·SNS 강세 등 라이프스타일·조건별로 묶인 브랜드 탐색.
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  테마 보기 <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>

      {/* Listings preview — 사진 있는 매물만 메인에 노출 */}
      {(() => {
        const photoListings = LISTINGS.filter((l) => l.images.length > 0)
        if (photoListings.length === 0) return null
        const preview = photoListings.slice(0, 6)
        return (
          <section className="container mx-auto pt-section">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
                  <MapPin className="h-6 w-6 text-gray-600" />
                  추천 입지 매물
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  전국 양도·신규임대 매물 {formatNumber(LISTINGS.length)}건 중 사진 등록 {formatNumber(photoListings.length)}건
                </p>
              </div>
              <a
                href="/listings"
                className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex"
              >
                전체 매물 보기 <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )
      })()}

      {/* HQ CTA */}
      <section className="container mx-auto pt-section">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-900 px-8 py-12 text-white">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: 'var(--brand-primary)' }}
              >
                For HQ · 본사 회원
              </p>
              <h2 className="mt-3 text-h2 font-bold">프랜차이즈 본사이신가요?</h2>
              <p className="mt-3 max-w-xl text-gray-300">
                협회 공시 정보 위에 본사 자체 콘텐츠를 더하고, 상단 노출 광고로
                예비 가맹점주에게 더 가깝게 닿으세요. 가맹 문의는 본사 대시보드로 바로 들어옵니다.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <a href="/for-brands">
                <Button size="lg" className="w-full">
                  본사 등록 안내
                </Button>
              </a>
              <a href="/for-brands/ads">
                <Button size="lg" variant="ghost" className="w-full text-white hover:bg-white/10">
                  광고 상품 보기
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors + associations — 메인 하단, 9-site 그리드(푸터)는 별도로 사이트 소개와 중복돼 제거 */}
      <section className="container mx-auto py-section">
        <div className="mb-6">
          <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
            <Handshake className="h-6 w-6 text-gray-600" />
            협찬 · 협력 파트너
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            프차허브와 함께 한국 프랜차이즈 생태계를 만드는 기업과 협회
          </p>
        </div>

        {/* 협찬 기업 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SPONSORS.map((s) => (
            <Card key={s.name} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
                    style={{ background: s.color }}
                    aria-hidden
                  >
                    {s.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate text-base font-bold text-gray-900">{s.name}</span>
                      <Badge variant="primary">협찬</Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-gray-600">{s.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 협력 협회·기관 */}
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="text-sm font-semibold text-gray-700">협력 협회 · 기관</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ASSOCIATIONS.map((a) => (
              <span
                key={a.name}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: a.color }}
                  aria-hidden
                />
                <span className="text-sm font-medium text-gray-800">{a.name}</span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            협회·기관과의 데이터 협력 및 산업 동향 공유 협의 중 — 협회 회원사 우대 혜택 준비
          </p>
        </div>
      </section>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">창업 인사이트 뉴스레터</h2>
            <p className="mt-2 text-sm text-gray-500">매주 브랜드 동향·창업 팁·가맹 정보를 받아보세요.</p>
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

      {/* Other platforms */}
      <section className="container mx-auto py-section">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold text-gray-900">amakers의 다른 플랫폼</h2>
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
                      <div className="truncate text-sm font-semibold text-gray-900">{p.name}</div>
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
