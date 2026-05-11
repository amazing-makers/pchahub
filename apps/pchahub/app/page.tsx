import { ArrowRight, Building2, Calculator, CheckCircle2, Flame, MapPin, Sparkles, Users } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { platformColors, type PlatformKey } from '@amakers/design-system'
import { SearchBar } from '@/components/search-bar'
import { BrandCard } from '@/components/brand-card'
import { CategoryChip } from '@/components/category-chip'
import { ListingCard } from '@/components/listing-card'
import { CATEGORIES, FEATURED_BRANDS, RECRUITING_BRANDS, TRENDING_BRANDS } from '@/lib/mock-data'
import { LISTINGS } from '@/lib/mock-listings'

const otherPlatforms = (
  Object.entries(platformColors) as Array<[PlatformKey, (typeof platformColors)[PlatformKey]]>
).filter(([key]) => key !== 'pchahub')

export default function HomePage() {
  return (
    <main>
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
              본사와 바로 연결되는 가맹 중개 플랫폼
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
                매칭 기반 가맹 중개
              </span>
            </div>
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
        <div className="mb-6">
          <h2 className="text-h3 font-semibold text-gray-900">업종별 찾기</h2>
          <p className="mt-1 text-sm text-gray-500">관심 업종의 협회 등록 브랜드만 모아 보세요</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
          {TRENDING_BRANDS.map((b) => (
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
          {RECRUITING_BRANDS.slice(0, 6).map((b) => (
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

      {/* Listings preview */}
      {LISTINGS.length > 0 && (
        <section className="container mx-auto pt-section">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="inline-flex items-center gap-2 text-h3 font-semibold text-gray-900">
                <MapPin className="h-6 w-6 text-gray-600" />
                추천 입지 매물
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                전국 양도·신규임대 매물 {formatNumber(LISTINGS.length)}건 중 신규 등록 6건
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
            {LISTINGS.slice(0, 6).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

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

      {/* Other amakers platforms — small auxiliary section */}
      <section className="container mx-auto py-section">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-h4 font-semibold text-gray-900">amakers의 다른 플랫폼</h2>
            <p className="mt-1 text-sm text-gray-500">
              매물 · 강의 · 인테리어 · 투자 — 가맹점 운영의 모든 단계를 전문 사이트가 담당합니다
            </p>
          </div>
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
