import type { Metadata } from 'next'
import { buildOrganizationJsonLd, buildPageMetadata, buildWebSiteJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '프차허브 — 프랜차이즈 브랜드 정보 비교',
  description: '감으로 고르는 창업은 이제 그만. 공정위 공식 가맹정보로 창업비·매출·성장률·가맹비를 한눈에 비교하고, 후회 없는 브랜드를 찾으세요.',
  path: '/',
})

import { ArrowRight, BookOpen, Building2, Calculator, CheckCircle2, Flame, Handshake, ListChecks, MapPin, Sparkles, Users } from 'lucide-react'
import { Badge, Button, Card, CardContent, NewsletterForm } from '@amakers/ui'
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
import { FEATURED_QAS } from '@/lib/franchisee-qa-data'


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
  const recruitingBrands = [...allBrands]
    .sort((a, b) => {
      const aHasPhoto = hasRealPhoto(a) ? 0 : 1
      const bHasPhoto = hasRealPhoto(b) ? 0 : 1
      if (aHasPhoto !== bHasPhoto) return aHasPhoto - bHasPhoto
      return b.storeCount - a.storeCount
    })
    .slice(0, 6)

  // 상단 노출 광고 슬롯은 항상 6개 — FEATURED_BRANDS가 부족하면 photoBrands 상위로 보충
  const AD_SLOTS = 6
  const featuredIds = new Set(FEATURED_BRANDS.map((b) => b.id))
  const featuredBrands = [
    ...FEATURED_BRANDS,
    ...photoBrands
      .filter((b) => !featuredIds.has(b.id))
      .sort(compareBrandsRecommended)
      .slice(0, Math.max(0, AD_SLOTS - FEATURED_BRANDS.length)),
  ].slice(0, AD_SLOTS)
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
              창업, 감이 아니라
              <br />
              데이터로 결정하세요
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              공정위 공식 가맹정보로 창업비·매출·성장률을 한눈에 비교하고,
              <br className="hidden sm:inline" />
              나에게 꼭 맞는 브랜드를 본사와 바로 연결해 드립니다
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

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: formatNumber(allBrands.length), label: '등록 브랜드' },
              { value: `${CATEGORIES.length}개`, label: '업종 카테고리' },
              { value: `${LISTINGS.length}개`, label: '창업 매물' },
              { value: formatNumber(allBrands.reduce((s, b) => s + (b.storeCount ?? 0), 0)), label: '총 가맹점 수' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
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

      {/* Featured (paid) placements — 항상 6개 슬롯 */}
      {featuredBrands.length > 0 && (
        <section className="container mx-auto pt-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-h3 font-semibold text-gray-900">주목받는 가맹 브랜드</h2>
                <span className="inline-flex items-center rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                  광고
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">본사가 상단 노출 신청한 브랜드 · 유료 광고 포함</p>
            </div>
            <a
              href="/brands"
              className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex"
            >
              전체 보기 <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBrands.map((b) => (
              <BrandCard key={b.id} brand={b} featured={featuredIds.has(b.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">관심 업종부터 골라보세요</h2>
            <p className="mt-1 text-sm text-gray-500">업종을 선택하면 창업비·수익성·가맹 조건까지 한 번에 비교됩니다</p>
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
            <h2 className="text-h3 font-semibold text-gray-900">지금 바로 시작할 수 있어요</h2>
            <p className="mt-1 text-sm text-gray-500">현재 가맹점주를 모집 중인 브랜드 — 문의하면 본사가 직접 답해드립니다</p>
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
          <h2 className="text-h3 font-semibold text-gray-900">계약 전에 꼭 따져보세요</h2>
          <p className="mt-1 text-sm text-gray-500">
            브랜드 정보만으로는 부족합니다. 내 예산·상권·목표 수익으로 직접 시뮬레이션해보세요.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <a href="/scanner?tab=calculator" className="group">
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
          <a href="/timeline" className="group">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                  <ListChecks className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900">창업 일정표</h3>
                <p className="mt-1 text-sm text-gray-600">
                  탐색→계약→인테리어→오픈. 7단계 전체 여정과 평균 소요 기간을 한눈에.
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  일정표 보기 <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>

      {/* 창업 가이드 허브 */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
              <BookOpen className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
              창업 가이드 허브
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              계약서 체크리스트, 수익 계산법, 정보공개서 읽는 법까지 — 실패를 줄이는 창업 지식
            </p>
          </div>
          <a href="/guide" className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex">
            전체 가이드 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: '/guide/contract-checklist', title: '계약서 서명 전\n체크리스트 20', emoji: '📄', color: '#0891B2' },
            { href: '/guide/startup-cost-breakdown', title: '창업비 항목별\n완전 분석', emoji: '💸', color: '#7C3AED' },
            { href: '/guide/roi-calculation', title: '투자 회수 기간\n계산법', emoji: '💰', color: '#D97706' },
            { href: '/guide/how-to-choose-brand', title: '정보공개서로\n브랜드 고르기', emoji: '🗂️', color: '#059669' },
          ].map((g) => (
            <a key={g.href} href={g.href} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                    style={{ background: g.color + '18' }}
                    aria-hidden
                  >
                    {g.emoji}
                  </span>
                  <h3 className="mt-3 whitespace-pre-line text-sm font-semibold leading-snug text-gray-900 group-hover:underline">
                    {g.title}
                  </h3>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
        <div className="mt-4 text-center sm:hidden">
          <a href="/guide" className="text-sm text-gray-600 hover:text-gray-900">
            전체 가이드 보기 →
          </a>
        </div>
      </section>

      {/* 지역별 탐색 */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
              <MapPin className="h-6 w-6 text-gray-600" />
              지역별 브랜드 탐색
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              내가 창업할 지역의 브랜드 현황·평균 창업비·인기 업종을 한눈에
            </p>
          </div>
          <a href="/brands?tab=regions" className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex">
            전국 지도 보기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map((region) => (
            <a
              key={region}
              href={`/brands?tab=regions&region=${encodeURIComponent(region)}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              {region}
            </a>
          ))}
          <a
            href="/brands?tab=regions"
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400"
          >
            전체 지도 →
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

      {/* 가맹점주 솔직 Q&A */}
      <section className="container mx-auto pt-section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-gray-900">가맹점주 솔직 Q&A</h2>
            <p className="mt-1 text-sm text-gray-500">
              현직 점주가 직접 답하는 계약·수익·운영·리스크 이야기
            </p>
          </div>
          <a href="/community?tab=franchisee-qa" className="hidden items-center gap-1 text-sm text-gray-600 hover:text-gray-900 sm:inline-flex">
            전체 Q&A <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_QAS.map((qa) => {
            const categoryColor: Record<string, string> = {
              '계약 조건': 'bg-blue-100 text-blue-700',
              '수익성': 'bg-green-100 text-green-700',
              '본사 지원': 'bg-purple-100 text-purple-700',
              '운영 실무': 'bg-orange-100 text-orange-700',
              '리스크': 'bg-red-100 text-red-700',
            }
            return (
              <a key={qa.id} href={`/community?tab=franchisee-qa`} className="group block">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColor[qa.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {qa.category}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        {qa.brandCategory}
                      </span>
                    </div>
                    <p className="mb-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-indigo-700 line-clamp-2">
                      Q. {qa.question}
                    </p>
                    <p className="flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
                      {qa.answer}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
                      <span className="truncate">{qa.answererProfile}</span>
                      <span className="ml-2 shrink-0 font-medium">👍 {qa.helpful}</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
        <div className="mt-4 text-center sm:hidden">
          <a href="/community?tab=franchisee-qa" className="text-sm text-gray-600 hover:text-gray-900">
            전체 Q&A 보기 →
          </a>
        </div>
      </section>

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

      {/* 자주 묻는 질문 */}
      <section className="bg-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-h3 font-bold text-gray-900">자주 묻는 질문</h2>
            <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {[
                { q: '프차허브는 어떤 서비스인가요?', a: '국내 프랜차이즈 브랜드 정보, 매물, 창업 가이드, 상권 인텔을 한 곳에서 제공하는 통합 창업 플랫폼입니다. 예비 창업자부터 본사까지 모든 참여자를 연결합니다.' },
                { q: '브랜드 정보는 어떻게 업데이트되나요?', a: '공정거래위원회(KFTC) 가맹사업 정보공개서 데이터를 기반으로 매일 자동 업데이트하며, 본사가 직접 정보를 수정·보완할 수 있습니다.' },
                { q: '창업 스캐너란 무엇인가요?', a: '관심 업종·지역·예산을 입력하면 매칭되는 브랜드와 매물을 자동으로 분석해 추천하는 AI 기반 도구입니다. 무료로 이용할 수 있습니다.' },
                { q: '매물은 어떻게 등록하나요?', a: '명당거래소에서 양도·임대 매물을 등록할 수 있습니다. 등록 후 프차허브 매물 탭에도 자동 노출됩니다.' },
                { q: '본사 광고·파트너십 문의는 어떻게 하나요?', a: '네비게이션 \'본사 솔루션\'에서 광고·데이터 분석·가맹 모집 서비스를 확인하고 문의할 수 있습니다.' },
              ].map((f, i) => (
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">창업 인사이트 뉴스레터</h2>
            <p className="mt-2 text-sm text-gray-500">매주 브랜드 동향·창업 팁·가맹 정보를 받아보세요.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>

    </main>
  )
}
