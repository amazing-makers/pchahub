import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@amakers/design-system'
import {
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  GraduationCap,
  Hammer,
  Heart,
  MapPin,
  Megaphone,
  Newspaper,
  Phone,
  Shield,
  Sparkles,
  Star,
  Store,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge, BrandLogo, Button, Card, CardContent } from '@amakers/ui'
import {
  buildBrandJsonLd,
  buildBreadcrumbsJsonLd,
  buildFaqPageJsonLd,
  JsonLd,
} from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { BrandActions } from '@/components/brand-actions'
import { BrandHeroSlider } from '@/components/brand-hero-slider'
import { BRANDS, hasRealPhoto, type MockBrand } from '@/lib/mock-data'
import {
  getBrandDetail,
  totalStartupCost,
  type BrandDetail,
  type BrandReview,
  type BrandFAQ,
  type BrandServiceItem,
} from '@/lib/mock-brand-detail'
import { BrandCard } from '@/components/brand-card'
import { getBrandById, getBrands } from '@/lib/kftc/source'
import { BrandViewTracker } from './brand-view-tracker'

// ========================================================================
// 카테고리 분류 — 음식 vs 비음식
// ========================================================================

/** 음식 카테고리 — 메뉴 섹션 표시, 서비스 섹션 숨김 */
const FOOD_CATEGORIES = new Set([
  'chicken', 'cafe', 'korean', 'japanese', 'snack', 'dessert',
  'beverage', 'bar', 'pizza', 'bakery', 'fastfood',
])

interface BrandDetailPageProps {
  params: { id: string }
}

// mock IDs만 빌드 타임 정적 생성; kftc-* 는 런타임 on-demand
export function generateStaticParams() {
  return BRANDS.map((b) => ({ id: b.id }))
}
export const dynamicParams = true
export const revalidate = 3600

export async function generateMetadata({ params }: BrandDetailPageProps): Promise<Metadata> {
  const result = await getBrandById(params.id)
  if (!result) return {}
  const { brand } = result
  return buildPageMetadata('pchahub', {
    title: `${brand.name} — ${brand.categoryLabel} 가맹 정보`,
    description: `${brand.description} · 매장 ${brand.storeCount}개 · 창업비 ${brand.startupCost}만원 · 본사 ${brand.hqRegion}. 공정거래위원회 가맹 정보 + 점주 후기.`,
    path: `/brands/${brand.id}`,
  })
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const result = await getBrandById(params.id)
  if (!result) notFound()
  const { brand, detail } = result
  const totalCost = totalStartupCost(detail.costs)
  // 관련 브랜드: 같은 카테고리에서 최대 3개 (실API or mock)
  const allBrands = await getBrands()
  const relatedBrands = allBrands.filter(
    (b) => b.category === brand.category && b.id !== brand.id,
  ).slice(0, 3)
  const avgRating =
    detail.reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(detail.reviews.length, 1)

  const brandUrl = `https://pchahub.amakers.co.kr/brands/${brand.id}`
  const brandJsonLd = buildBrandJsonLd({
    name: brand.name,
    description: brand.description,
    url: brandUrl,
    image: brand.heroImage,
    category: brand.categoryLabel,
    numberOfStores: brand.storeCount,
    aggregateRating:
      detail.reviews.length > 0
        ? { ratingValue: Number(avgRating.toFixed(1)), reviewCount: detail.reviews.length }
        : undefined,
  })
  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd({
    items: [
      { name: '브랜드 검색', url: 'https://pchahub.amakers.co.kr/brands' },
      { name: brand.categoryLabel, url: `https://pchahub.amakers.co.kr/categories/${brand.category}` },
      { name: brand.name, url: brandUrl },
    ],
  })
  const faqJsonLd =
    detail.faqs.length > 0
      ? buildFaqPageJsonLd({
          url: brandUrl,
          items: detail.faqs.map((f) => ({ question: f.q, answer: f.a })),
        })
      : null

  return (
    <main className="bg-gray-50">
      <BrandViewTracker brandId={brand.id} />
      <JsonLd data={brandJsonLd} />
      <JsonLd data={breadcrumbsJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <BrandHero brand={brand} detail={detail} totalCost={totalCost} avgRating={avgRating} />

      <div className="container mx-auto py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-8">
            {/* 사용자 노출 순서: 대표메뉴/서비스 → 인테리어 → 홍보영상 (myfranchise.kr 패턴) */}
            <ServicesSection detail={detail} brand={brand} />
            <MenuSection detail={detail} brand={brand} />
            <PhotoGallerySection detail={detail} brand={brand} />
            <BrandVideoSection brand={brand} />
            <HQSection detail={detail} />
            <CostsSection detail={detail} totalCost={totalCost} />
            <DisclosureExtrasSection detail={detail} />
            <OperationsSection detail={detail} brand={brand} />
            <RevenueSection detail={detail} />
            <RecentOpeningsSection detail={detail} brand={brand} />
            <StoreHistorySection detail={detail} />
            <ReviewsSection brand={brand} detail={detail} avgRating={avgRating} />
            <AmakersEcosystemSection brand={brand} />
            <FAQSection faqs={detail.faqs} />
            {relatedBrands.length > 0 && (
              <RelatedSection brands={relatedBrands} category={brand.categoryLabel} />
            )}
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <CTASidebar brand={brand} totalCost={totalCost} detail={detail} />
          </aside>
        </div>
      </div>
    </main>
  )
}

// ========================================================================
// Hero
// ========================================================================

function BrandHero({
  brand,
  detail,
  totalCost,
  avgRating,
}: {
  brand: MockBrand
  detail: BrandDetail
  totalCost: number
  avgRating: number
}) {
  // 가맹사업 연수 계산
  const jngYrs = brand.jngBizStartYear
    ? new Date().getFullYear() - brand.jngBizStartYear
    : 2026 - detail.hq.franchiseStartYear
  // 폐점률 계산 (closedCount / storeCount × 100)
  const closureRate = brand.closedCount && brand.storeCount > 0
    ? ((brand.closedCount / brand.storeCount) * 100).toFixed(1)
    : null
  // KFTC 실 API 평균매출 (있으면 우선 사용)
  const avgMonthlySales = brand.avgAnnualSales
    ? Math.round(brand.avgAnnualSales / 12)
    : detail.revenue.averageMonthly

  const stats = [
    {
      label: '매장 수',
      value: `${formatNumber(brand.storeCount)}개`,
      sub: brand.newOpenCount
        ? `이번 해 +${brand.newOpenCount}개 신규`
        : `+${brand.growthRate}% (전년 대비)`,
      subColor: 'text-emerald-600',
    },
    {
      label: '평균 월매출',
      value: avgMonthlySales > 0 ? `${formatNumber(avgMonthlySales)}만` : '정보 없음',
      sub: avgMonthlySales > 0
        ? `연 ${formatNumber(avgMonthlySales * 12)}만 (공정위 공시)`
        : '창업 상담 시 확인',
      subColor: avgMonthlySales > 0 ? 'text-gray-500' : 'text-gray-400',
    },
    {
      label: '총 창업비',
      value: totalCost > 0 ? `${formatNumber(totalCost)}만` : '상담 문의',
      sub: totalCost > 0 ? `권장 면적 ${detail.costs.recommendedArea}평` : '',
      subColor: 'text-gray-500',
    },
    {
      label: '월 로열티',
      value:
        detail.costs.royaltyType === 'none'
          ? '없음'
          : detail.costs.royaltyType === 'percentage'
            ? `${detail.costs.royaltyValue}%`
            : `${formatNumber(detail.costs.royaltyValue)}만`,
      sub: detail.costs.royaltyType === 'percentage' ? '매출 대비' : '고정',
      subColor: 'text-gray-500',
    },
    {
      label: '가맹사업',
      value: `${jngYrs}년차`,
      sub: `${brand.jngBizStartYear ?? detail.hq.franchiseStartYear}년 시작`,
      subColor: 'text-gray-500',
    },
    closureRate
      ? {
          label: '폐점률',
          value: `${closureRate}%`,
          sub: `폐점 ${brand.closedCount}개 / 전체 ${brand.storeCount}개`,
          subColor: parseFloat(closureRate) < 5 ? 'text-emerald-600' : parseFloat(closureRate) < 15 ? 'text-amber-600' : 'text-rose-500',
        }
      : {
          label: '점주 평가',
          value: `${avgRating.toFixed(1)} / 5`,
          sub: `${detail.reviews.length}개 후기`,
          subColor: 'text-gray-500',
        },
  ]

  // heroImage가 있으면 항상 표시 (카테고리 대표 Unsplash도 포함)
  const showHeroPhoto = !!brand.heroImage
  // 슬라이더에 보여줄 사진들 — hero(대표) + store(매장) 중복 제거
  const heroImages = showHeroPhoto
    ? Array.from(new Set([detail.photos.hero, ...detail.photos.store].filter(Boolean)))
    : []

  return (
    <section className="border-b border-gray-200 bg-white">
      {/* Hero photo area — 컨테이너 내부에 두고 모서리 둥글림. 사진 안 잘림 + 슬라이더. */}
      <div className="container mx-auto px-4 pt-6">
        <div className="overflow-hidden rounded-3xl shadow-sm ring-1 ring-gray-100">
          {showHeroPhoto ? (
            <BrandHeroSlider images={heroImages} alt={`${brand.name} 매장 사진`} />
          ) : (
            // 진짜 사진 없음 — 브랜드 컬러 블록 + 큰 모노그램만 가운데 (BrandHeroSlider와 같은 비율)
            <div
              className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden sm:aspect-[3/2] sm:max-h-[520px]"
              style={{ background: brand.logoColor }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/20" />
              <BrandLogo brand={brand} size="xl" bordered className="relative z-10" />
            </div>
          )}
        </div>
      </div>

      {/* Brand identity card — 사진 아래 별도 행 (overlay 안 함) */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-start gap-4">
          <BrandLogo brand={brand} size="xl" bordered />
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h2 font-bold text-gray-900">{brand.name}</h1>
              {brand.hqVerified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  <CheckCircle2 className="h-3 w-3" />
                  협회 등록
                </span>
              )}
              {brand.recruiting && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  가맹 모집중
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {brand.categoryLabel} · {detail.hq.companyName} · 본사 {brand.hqRegion}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <nav className="flex items-center gap-1 text-sm text-gray-500">
          <a href="/brands" className="hover:text-gray-900">
            브랜드 검색
          </a>
          <ChevronRight className="h-3.5 w-3.5" />
          <a href={`/categories/${brand.category}`} className="hover:text-gray-900">
            {brand.categoryLabel}
          </a>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-700">{brand.name}</span>
        </nav>

        <div className="mt-5 max-w-3xl">
          <p className="text-base text-gray-700">{brand.description}</p>
          <div className="mt-4">
            <BrandActions brandId={brand.id} brandName={brand.name} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="mt-1 text-h4 font-bold text-gray-900">{s.value}</div>
              <div className={`mt-1 text-xs ${s.subColor}`}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========================================================================
// HQ Section
// ========================================================================

function HQSection({ detail }: { detail: BrandDetail }) {
  const { hq } = detail
  const rows: Array<{ icon: typeof Building2; label: string; value: string | undefined }> = [
    { icon: Building2, label: '법인명', value: hq.companyName },
    { icon: Users, label: '대표자', value: hq.ceo },
    { icon: Calendar, label: '본사 설립', value: hq.foundedYear ? `${hq.foundedYear}년` : undefined },
    { icon: Calendar, label: '가맹사업 시작', value: `${hq.franchiseStartYear}년` },
    { icon: MapPin, label: '주소', value: hq.address },
    { icon: Phone, label: '연락처', value: hq.phone },
    { icon: Globe, label: '웹사이트', value: hq.website },
    { icon: Building2, label: '사업자등록번호', value: hq.bizNumber },
  ]
  // undefined/빈 값 행은 숨김 (실API 브랜드는 일부 정보 미제공)
  const visibleRows = rows.filter((r) => r.value)
  return (
    <SectionCard title="본사 정보" subtitle="공정거래위원회 가맹정보 기준">
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {visibleRows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-2.5 border-b border-gray-50 py-2 last:border-0">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0 flex-1 text-sm">
              <div className="text-gray-500">{label}</div>
              <div className="mt-0.5 truncate font-medium text-gray-900">{value}</div>
            </div>
          </div>
        ))}
      </div>
      {visibleRows.length === 0 && (
        <p className="text-sm text-gray-400">본사 상세 정보는 가맹 상담 신청 후 제공됩니다.</p>
      )}
    </SectionCard>
  )
}

// ========================================================================
// Costs Section
// ========================================================================

const COST_COLORS = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EC4899']

function CostsSection({ detail, totalCost }: { detail: BrandDetail; totalCost: number }) {
  const items = [
    { label: '가맹비', value: detail.costs.franchiseFee },
    { label: '보증금', value: detail.costs.deposit },
    { label: '인테리어', value: detail.costs.interiorFee },
    { label: '교육비', value: detail.costs.educationFee },
    { label: '기타', value: detail.costs.otherFees },
  ]

  return (
    <SectionCard
      title="가맹 조건"
      subtitle={`권장 매장 면적 ${detail.costs.recommendedArea}평 (최소 ${detail.costs.minArea}평) 기준`}
    >
      <div className="rounded-xl bg-gray-50 p-5">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500">총 창업비</span>
          <span className="text-h3 font-bold text-gray-900">
            {formatNumber(totalCost)}<span className="text-base font-medium text-gray-600"> 만원</span>
          </span>
        </div>
        <div className="mt-4 flex h-6 overflow-hidden rounded-full bg-white">
          {items.map((item, i) => {
            const pct = (item.value / totalCost) * 100
            if (pct < 1) return null
            return (
              <div
                key={item.label}
                className="h-full transition-all"
                style={{ width: `${pct}%`, background: COST_COLORS[i % COST_COLORS.length] }}
                title={`${item.label}: ${formatNumber(item.value)}만 (${pct.toFixed(1)}%)`}
              />
            )
          })}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {items.map((item, i) => (
            <div key={item.label}>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: COST_COLORS[i % COST_COLORS.length] }}
                />
                {item.label}
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {formatNumber(item.value)}만
              </div>
              <div className="text-xs text-gray-400">
                {((item.value / totalCost) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <RowKV
          label="월 로열티"
          value={
            detail.costs.royaltyType === 'none'
              ? '없음'
              : detail.costs.royaltyType === 'percentage'
                ? `매출의 ${detail.costs.royaltyValue}%`
                : `${formatNumber(detail.costs.royaltyValue)}만원 / 월 (고정)`
          }
        />
        <RowKV label="권장 매장 면적" value={`${detail.costs.recommendedArea}평`} />
        <RowKV label="최소 매장 면적" value={`${detail.costs.minArea}평`} />
        <RowKV
          label="인테리어 평당 단가"
          value={`약 ${Math.round(detail.costs.interiorFee / detail.costs.recommendedArea)}만원`}
        />
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Operations Section
// ========================================================================

function OperationsSection({ detail, brand }: { detail: BrandDetail; brand: MockBrand }) {
  const o = detail.operations
  // 비음식 카테고리에서는 "주력 채널" 대신 "운영 방식"으로 표기
  const isFood = FOOD_CATEGORIES.has(brand.category)
  return (
    <SectionCard title="매장 운영 정보">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBlock
          icon={Store}
          label="평균 면적"
          value={`${o.averageArea}평`}
        />
        <StatBlock
          icon={Users}
          label="평균 인력"
          value={`${o.averageStaff}명`}
        />
        <StatBlock
          icon={Clock}
          label="영업 시간"
          value={o.operatingHours}
        />
        <StatBlock
          icon={TrendingUp}
          label={isFood ? '주력 채널' : '운영 방식'}
          value={isFood ? o.primaryChannel : '현장 직접 운영'}
        />
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Revenue Section
// ========================================================================

function RevenueSection({ detail }: { detail: BrandDetail }) {
  const r = detail.revenue
  const maxYear = Math.max(...r.byYear.map((y) => y.avgMonthly))
  const maxRegion = Math.max(...r.byRegion.map((x) => x.share))
  return (
    <SectionCard
      title="매출 정보"
      subtitle="협회 공시 평균 매출 (매장당 월 기준, 만원)"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="text-sm font-medium text-gray-900">연도별 평균 월매출 추이</div>
          <div className="mt-3 space-y-2">
            {r.byYear.map((y) => (
              <div key={y.year} className="flex items-center gap-3">
                <div className="w-12 shrink-0 text-xs text-gray-500">{y.year}</div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-gray-100">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{
                      width: `${(y.avgMonthly / maxYear) * 100}%`,
                      background: 'var(--brand-primary)',
                    }}
                  />
                </div>
                <div className="w-20 shrink-0 text-right text-sm font-semibold text-gray-900">
                  {formatNumber(y.avgMonthly)}만
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">지역별 매출 비중</div>
          <div className="mt-3 space-y-2">
            {r.byRegion.map((x) => (
              <div key={x.region} className="flex items-center gap-3">
                <div className="w-20 shrink-0 text-xs text-gray-700">{x.region}</div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-gray-100">
                  <div
                    className="h-full rounded-md bg-gray-700 transition-all"
                    style={{ width: `${(x.share / maxRegion) * 100}%` }}
                  />
                </div>
                <div className="w-12 shrink-0 text-right text-sm font-semibold text-gray-900">
                  {x.share}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Store History Section
// ========================================================================

function StoreHistorySection({ detail }: { detail: BrandDetail }) {
  const max = Math.max(...detail.storeHistory.map((s) => s.totalStores))
  return (
    <SectionCard title="매장 수 변화" subtitle="최근 5년간 가맹점 운영 현황">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
              <th className="pb-2 font-medium">연도</th>
              <th className="pb-2 font-medium">총 매장</th>
              <th className="pb-2 font-medium">신규 오픈</th>
              <th className="pb-2 font-medium">폐점</th>
              <th className="pb-2 font-medium">증감</th>
              <th className="pb-2 font-medium">시각화</th>
            </tr>
          </thead>
          <tbody>
            {detail.storeHistory.map((h) => {
              const net = h.newStores - h.closedStores
              return (
                <tr key={h.year} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-medium text-gray-700">{h.year}</td>
                  <td className="py-3 font-semibold text-gray-900">{h.totalStores}</td>
                  <td className="py-3 text-emerald-600">+{h.newStores}</td>
                  <td className="py-3 text-rose-500">-{h.closedStores}</td>
                  <td
                    className={
                      'py-3 font-medium ' +
                      (net > 0 ? 'text-emerald-600' : net < 0 ? 'text-rose-500' : 'text-gray-500')
                    }
                  >
                    {net > 0 ? '+' : ''}
                    {net}
                  </td>
                  <td className="py-3 pr-2">
                    <div className="h-3 overflow-hidden rounded bg-gray-100">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${(h.totalStores / max) * 100}%`,
                          background: 'var(--brand-primary)',
                        }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Reviews Section
// ========================================================================

function ReviewsSection({
  brand,
  detail,
  avgRating,
}: {
  brand: MockBrand
  detail: BrandDetail
  avgRating: number
}) {
  const maxCount = Math.max(...detail.ratingDistribution.map((d) => d.count), 1)
  return (
    <SectionCard
      title="가맹점주 후기"
      subtitle={`${detail.reviews.length}개의 점주 후기 · 평균 ${avgRating.toFixed(1)}점`}
    >
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-h2 font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">/ 5</span>
          </div>
          <div className="mt-2 flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={
                  'h-4 w-4 ' +
                  (s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300')
                }
              />
            ))}
          </div>
          <div className="mt-4 space-y-1.5">
            {detail.ratingDistribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-gray-500">{d.stars}점</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded bg-gray-100">
                  <div
                    className="h-full rounded bg-amber-400"
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right font-medium text-gray-700">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {detail.reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

function ReviewCard({ review }: { review: BrandReview }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={
                'h-3.5 w-3.5 ' +
                (s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')
              }
            />
          ))}
        </div>
        <div className="text-xs text-gray-500">{review.createdAt}</div>
      </div>
      <div className="mt-2 text-sm font-semibold text-gray-900">{review.summary}</div>
      <p className="mt-1.5 text-sm text-gray-700">{review.detail}</p>
      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
        <span>
          {review.operatorRole} · {review.region}
        </span>
        <span>도움됨 {review.helpful}</span>
      </div>
    </div>
  )
}

// ========================================================================
// FAQ Section
// ========================================================================

function FAQSection({ faqs }: { faqs: BrandFAQ[] }) {
  return (
    <SectionCard title="자주 묻는 질문">
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="group rounded-lg border border-gray-100 bg-white open:border-gray-200 open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
              <div className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 text-sm font-bold"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Q
                </span>
                <span className="text-sm font-medium text-gray-900">{f.q}</span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
            </summary>
            <div className="border-t border-gray-100 px-4 py-3 pl-9 text-sm text-gray-700">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Amakers Ecosystem — cross-links to other 8 sites
// ========================================================================

function AmakersEcosystemSection({ brand }: { brand: MockBrand }) {
  const links: Array<{
    site: string
    href: string
    icon: typeof Store
    title: string
    sub: string
    accent: string
  }> = [
    {
      site: 'bestplace',
      href: `https://bestplace.amakers.co.kr/stores?brand=${brand.name}`,
      icon: Store,
      title: '이 브랜드 매장 보러가기',
      sub: '전국 인증 매장 + 어워드 수상 매장 (베스트플레이스)',
      accent: '#EAB308',
    },
    {
      site: 'themanual',
      href: `https://themanual.amakers.co.kr/courses?category=${brand.category}`,
      icon: GraduationCap,
      title: `${brand.categoryLabel} 운영 강의`,
      sub: '점주 양성 코스 · 본사 운영 매뉴얼 (더메뉴얼)',
      accent: '#3B82F6',
    },
    {
      site: 'gongganhansu',
      href: `https://gongganhansu.amakers.co.kr/contractors?specialty=${brand.category}`,
      icon: Hammer,
      title: `${brand.categoryLabel} 시공사`,
      sub: '본사 가이드라인 통과 검증된 인테리어 시공사 (공간의한수)',
      accent: '#64748B',
    },
    {
      site: 'themyungdang',
      href: `https://themyungdang.amakers.co.kr/listings?category=${brand.category}`,
      icon: MapPin,
      title: `${brand.categoryLabel} 입점 매물`,
      sub: '양도·신규임대 매물 + 상권 분석 (더명당)',
      accent: '#10B981',
    },
    {
      site: 'jangsanote',
      href: `https://jangsanote.amakers.co.kr/categories/${brand.category}`,
      icon: Heart,
      title: '점주 커뮤니티',
      sub: `${brand.categoryLabel}방 · 점주 후기 + 모임 + 노하우 (장사노트)`,
      accent: '#F59E0B',
    },
    {
      site: 'changupdocu',
      href: `https://changupdocu.amakers.co.kr/episodes?brand=${encodeURIComponent(brand.name)}`,
      icon: Newspaper,
      title: '미디어 · 매거진',
      sub: '브랜드 다큐멘터리 + 시장 분석 기사 (창업다큐)',
      accent: '#F43F5E',
    },
    {
      site: 'openrun',
      href: 'https://openrun.amakers.co.kr/services/grand-open',
      icon: Megaphone,
      title: '오픈 마케팅 캠페인',
      sub: '신규 오픈 30일 패키지 + SNS·인플루언서 (오픈런)',
      accent: '#F97316',
    },
    {
      site: 'pchabridge',
      href: 'https://pchabridge.amakers.co.kr',
      icon: TrendingUp,
      title: '투자 라운드 · M&A',
      sub: '본사 투자 라운드 + 매각 매물 (프차브릿지)',
      accent: '#8B5CF6',
    },
  ]

  return (
    <SectionCard
      title="amakers에서 이어가기"
      subtitle={`${brand.name}에 대한 정보·매장·운영·투자까지 amakers 전체 플랫폼에서`}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <a
            key={l.site}
            href={l.href}
            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ background: l.accent }}
            >
              <l.icon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                {l.title}
                <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-gray-700" />
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{l.sub}</p>
            </div>
          </a>
        ))}
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Related Brands
// ========================================================================

function RelatedSection({ brands, category }: { brands: MockBrand[]; category: string }) {
  return (
    <SectionCard title={`다른 ${category} 브랜드`}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <BrandCard key={b.id} brand={b} />
        ))}
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Sticky CTA Sidebar
// ========================================================================

function CTASidebar({
  brand,
  totalCost,
  detail,
}: {
  brand: MockBrand
  totalCost: number
  detail: BrandDetail
}) {
  return (
    <div className="space-y-4">
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div>
            <div className="text-xs text-gray-500">총 창업비</div>
            <div className="mt-0.5 text-h3 font-bold text-gray-900">
              {formatNumber(totalCost)}<span className="text-base font-medium text-gray-600"> 만원</span>
            </div>
            <div className="mt-0.5 text-xs text-gray-500">
              월 평균 매출 약 {formatNumber(detail.revenue.averageMonthly)}만 (영업이익 약 {formatNumber(detail.revenue.averageOperatingProfit)}만)
            </div>
          </div>

          <a href={`/inquiry?brand=${brand.id}`} className="block">
            <Button size="lg" className="w-full">
              가맹 상담 신청
            </Button>
          </a>
          <a href={`/calculator?brand=${brand.id}`} className="block">
            <Button size="lg" variant="outline" className="w-full">
              수익 계산해보기
            </Button>
          </a>
          <a
            href={`/brands/compare?ids=${brand.id}`}
            className="block text-center text-sm text-gray-600 hover:text-gray-900"
          >
            다른 브랜드와 비교하기 →
          </a>
          <a
            href={`/scanner?seedBrand=${brand.id}`}
            className="block text-center text-xs text-gray-500 hover:text-gray-700"
          >
            나에게 맞는 브랜드인지 확인 →
          </a>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-amber-50">
        <CardContent className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-900">
            점주이신가요?
          </div>
          <p className="mt-1.5 text-sm text-amber-900">
            실제 운영 경험을 공유해주시면 예비 가맹점주의 의사결정에 큰 도움이 됩니다.
          </p>
          <a href={`/mypage/reviews/new?brand=${brand.id}`} className="mt-3 block">
            <Button size="md" variant="outline" className="w-full">
              {brand.name} 후기 작성하기
            </Button>
          </a>
        </CardContent>
      </Card>

      {(detail.hq.phone || detail.hq.website) && (
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              본사 연락처
            </div>
            <div className="mt-2 space-y-2 text-sm">
              {detail.hq.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {detail.hq.phone}
                </div>
              )}
              {detail.hq.website && (
                <a
                  href={detail.hq.website}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{detail.hq.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ========================================================================
// Reusable bits
// ========================================================================

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6 sm:p-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-h4 font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

function RowKV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function StatBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <Icon className="h-4 w-4 text-gray-400" />
      <div className="mt-2 text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
    </div>
  )
}

// ========================================================================
// Photo Gallery Section — 매장 사진
// ========================================================================

function PhotoGallerySection({ detail, brand }: { detail: BrandDetail; brand: MockBrand }) {
  // 인테리어 섹션 — 매장 사진만 사용 (메뉴 사진은 MenuSection에서 따로).
  const photos = detail.photos.store
  if (photos.length === 0) return null
  // 슬라이더 아래에 노출할 3장 — 사진 2~4번 (총 4장 이상일 때 보임)
  const thumbnails = photos.slice(1, 4)
  return (
    <SectionCard
      title="인테리어"
      subtitle={`${brand.name} 매장 인테리어 · 외관 사진`}
    >
      <div className="space-y-3">
        <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100">
          <BrandHeroSlider images={photos} alt={`${brand.name} 인테리어 사진`} />
        </div>
        {thumbnails.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {thumbnails.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm ring-1 ring-gray-100 sm:aspect-[3/2]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${brand.name} 인테리어 ${i + 2}`}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Brand Video Section — 본사 등록 홍보 영상
// ========================================================================

function embeddableUrl(raw: string): string | null {
  try {
    const u = new URL(raw)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      if (u.pathname.startsWith('/embed/')) return raw
      return null
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    if (host === 'player.vimeo.com') return raw
    return null
  } catch {
    return null
  }
}

function BrandVideoSection({ brand }: { brand: MockBrand }) {
  if (!brand.videoUrl) return null
  const src = embeddableUrl(brand.videoUrl)
  if (!src) return null
  return (
    <SectionCard
      title="브랜드 영상"
      subtitle={`${brand.name} 본사가 등록한 홍보·매장 영상`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <iframe
          src={src}
          title={`${brand.name} 홍보 영상`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Services Section — 비음식 브랜드의 이용권·서비스 항목
// ========================================================================

const SERVICE_SECTION_META: Record<string, { title: string; subtitle: string }> = {
  pcbang:     { title: '이용 요금',     subtitle: 'PC·좌석 종류별 이용 요금 안내' },
  study:      { title: '이용권 안내',   subtitle: '시간권·월정액·스터디룸 이용 요금' },
  education:  { title: '수업 프로그램', subtitle: '과정별 수강료 및 수업 구성 안내' },
  laundry:    { title: '기기 이용 요금', subtitle: '세탁기·건조기 용량별 요금 안내' },
  life:       { title: '서비스 요금',   subtitle: '서비스 종류 및 요금 안내' },
  leisure:    { title: '이용권 안내',   subtitle: '시간권·정기권·그룹권 요금 안내' },
  convenience:{ title: '서비스 안내',   subtitle: '이용 가능한 서비스 및 요금' },
}

function ServicesSection({ detail, brand }: { detail: BrandDetail; brand: MockBrand }) {
  if (FOOD_CATEGORIES.has(brand.category)) return null
  if (detail.services.length === 0) return null

  const meta = SERVICE_SECTION_META[brand.category] ?? {
    title: '서비스 안내',
    subtitle: '이용 가능한 서비스 및 이용권 안내',
  }

  // 그룹별로 묶기
  const groups = detail.services.reduce<Record<string, BrandServiceItem[]>>((acc, item) => {
    const key = item.group ?? '기본'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <SectionCard title={meta.title} subtitle={meta.subtitle}>
      <div className="space-y-6">
        {Object.entries(groups).map(([groupName, items]) => (
          <div key={groupName}>
            <div className="mb-3 flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {groupName}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={
                    'relative flex items-start justify-between gap-3 rounded-xl border p-4 ' +
                    (item.popular
                      ? 'border-indigo-200 bg-indigo-50/60'
                      : 'border-gray-100 bg-white')
                  }
                >
                  {item.popular && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-0.5 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      <Sparkles className="h-2 w-2" />
                      인기
                    </span>
                  )}
                  <div className="min-w-0 flex-1 pr-8">
                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="mt-0.5 text-xs text-gray-500">{item.description}</div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {item.priceWon > 0 ? (
                      <>
                        <span className="text-base font-bold text-gray-900">
                          {item.priceWon.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">원</span>
                        {item.unit && (
                          <div className="mt-0.5 text-[10px] text-gray-400">{item.unit}</div>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-400">문의</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-gray-400">
        * 이용 요금은 지역·매장에 따라 다를 수 있습니다. 정확한 금액은 가맹 계약서를 확인하세요.
      </p>
    </SectionCard>
  )
}

// ========================================================================
// Menu Section — 메뉴 라인업
// ========================================================================

function MenuSection({ detail, brand }: { detail: BrandDetail; brand: MockBrand }) {
  // 비음식 카테고리는 ServicesSection이 담당 — 메뉴 섹션 미표시
  if (!FOOD_CATEGORIES.has(brand.category)) return null
  // 메뉴 사진이 없거나 실제 사진이 아닌 브랜드는 숨김
  if (!hasRealPhoto(brand)) return null
  if (detail.menu.length === 0) return null
  return (
    <SectionCard
      title="대표 메뉴"
      subtitle="시그니처 메뉴와 인기 메뉴 라인업"
    >
      {/* 사진은 크지 않게 — 더 작은 카드 + 한 줄에 더 많이 (3/4/6 컬럼) */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {detail.menu.map((m, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-gray-100 bg-white">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
              {m.signature && (
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold text-amber-900">
                  <Sparkles className="h-2 w-2" />
                  시그니처
                </span>
              )}
            </div>
            <div className="p-2">
              <div className="line-clamp-1 text-xs font-semibold text-gray-900">{m.name}</div>
              <div className="mt-1 text-xs font-bold text-gray-900">
                {formatNumber(m.priceWon)}<span className="text-[10px] font-medium text-gray-500">원</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Recent Openings — 최근 신규 오픈 매장
// ========================================================================

function RecentOpeningsSection({ detail, brand }: { detail: BrandDetail; brand: MockBrand }) {
  if (detail.recentOpenings.length === 0) return null
  const showPhoto = !!brand.heroImage
  return (
    <SectionCard
      title="최근 신규 오픈 매장"
      subtitle={`최근 ${detail.recentOpenings.length}개 매장의 오픈 정보`}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {detail.recentOpenings.map((o, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <div
              className="relative aspect-[16/10] overflow-hidden bg-gray-100"
              style={showPhoto ? undefined : { background: brand.logoColor }}
            >
              {showPhoto ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.image} alt={o.storeName} className="h-full w-full object-cover" loading="lazy" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/10 to-black/20">
                  <span className="text-2xl font-bold text-white/95 drop-shadow">{brand.name.charAt(0)}</span>
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                NEW OPEN
              </span>
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold text-gray-900">{o.storeName}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {o.region} {o.district}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {o.openedAt} 오픈
                </span>
                <span className="font-medium text-gray-700">{o.area}평</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ========================================================================
// Disclosure Extras — 정보공개서 추가 정보
// ========================================================================

function DisclosureExtrasSection({ detail }: { detail: BrandDetail }) {
  const d = detail.disclosure
  return (
    <SectionCard
      title="정보공개서 추가 정보"
      subtitle={`등록번호 ${d.registrationNumber} · ${d.disclosureUpdatedAt} 갱신`}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DisclosureRow
          icon={Megaphone}
          label="본사 광고비 부담"
          value={`${d.hqAdvertisingShare}%`}
          sub={
            d.storeAdvertisingShare === 0
              ? '점주 분담 없음'
              : `점주 분담 매출의 ${d.storeAdvertisingShare}%`
          }
        />
        <DisclosureRow
          icon={Calendar}
          label="계약 기간"
          value={`${d.contractYears}년`}
          sub="갱신 가능"
        />
        <DisclosureRow
          icon={Shield}
          label="영업지역 보호"
          value={d.territoryProtection}
          isLong
        />
        <DisclosureRow
          icon={FileText}
          label="계약 갱신 조건"
          value={d.renewalTerms}
          isLong
        />
        <DisclosureRow
          icon={Award}
          label="상표권 등록"
          value={d.trademarkRegistered ? '등록 완료' : '미등록'}
          sub={d.trademarkRegistered ? '본사 상표권 보호' : ''}
        />
        <DisclosureRow
          icon={FileText}
          label="가맹사업 등록번호"
          value={d.registrationNumber}
          sub={`${d.disclosureUpdatedAt} 최종 갱신`}
        />
      </div>
    </SectionCard>
  )
}

function DisclosureRow({
  icon: Icon,
  label,
  value,
  sub,
  isLong,
}: {
  icon: typeof Building2
  label: string
  value: string
  sub?: string
  isLong?: boolean
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div
          className={
            'mt-0.5 font-semibold text-gray-900 ' + (isLong ? 'text-sm leading-relaxed' : 'text-base')
          }
        >
          {value}
        </div>
        {sub && <div className="mt-0.5 text-xs text-gray-500">{sub}</div>}
      </div>
    </div>
  )
}
