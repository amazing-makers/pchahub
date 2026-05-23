import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Star,
  Store,
  Users,
  Wrench,
} from 'lucide-react'
import { Badge, BrandLogo, Button, Card, CardContent, NewsletterForm } from '@amakers/ui'
import {
  buildBreadcrumbsJsonLd,
  buildLocalBusinessJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import {
  awardsForStore,
  brandById,
  RANK_COLOR,
  RANK_LABEL,
  STORES,
  storesByBrand,
  storesByRegion,
} from '@/lib/mock-data'
import { StoreCard } from '@/components/store-card'
import { SaveStoreButton } from './save-store-button'
import { StoreViewTracker } from './store-view-tracker'
import { StoreReviewForm } from './store-review-form'
import { ShareStoreButton } from './share-store-button'

export function generateStaticParams() {
  return STORES.map((s) => ({ id: s.id }))
}

interface StoreDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: StoreDetailProps): Metadata {
  const store = STORES.find((s) => s.id === params.id)
  if (!store) return {}
  const brand = brandById(store.brandId)
  return buildPageMetadata('bestplace', {
    title: `${store.name}${brand ? ` — ${brand.categoryLabel}` : ''}`,
    description: `${store.region} ${store.district} · ${store.area}평 · 평점 ${store.rating} (${formatNumber(store.reviewCount)}개 리뷰) · 월 방문 ${formatNumber(store.monthlyVisitors)}명${store.awards.length > 0 ? ` · ${store.awards[0]}` : ''}.`,
    path: `/stores/${store.id}`,
  })
}

export default function StoreDetailPage({ params }: StoreDetailProps) {
  const store = STORES.find((s) => s.id === params.id)
  if (!store) notFound()
  const brand = brandById(store.brandId)
  const awards = awardsForStore(store.id)
  const sameBrand = storesByBrand(store.brandId).filter((s) => s.id !== store.id).slice(0, 3)
  const sameRegion = storesByRegion(store.region).filter((s) => s.id !== store.id).slice(0, 3)

  const storeUrl = `https://bestplace.amakers.co.kr/stores/${store.id}`
  const businessJsonLd = buildLocalBusinessJsonLd({
    name: store.name,
    description: store.highlights.join(' · '),
    url: storeUrl,
    image: store.heroImage,
    region: store.region,
    district: store.district,
    fullAddress: store.address,
    rating: store.rating,
    reviewCount: store.reviewCount,
    openedYear: store.openedYear,
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '매장 디렉토리', url: 'https://bestplace.amakers.co.kr/stores' },
      ...(brand
        ? [{ name: brand.name, url: `https://bestplace.amakers.co.kr/stores?brand=${brand.name}` }]
        : []),
      { name: store.name, url: storeUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <StoreViewTracker storeId={store.id} />
      <JsonLd data={businessJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Hero image */}
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={store.heroImage} alt={store.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
      </div>

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          {/* 브레드크럼 */}
          <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href="/stores" className="hover:text-gray-900">매장 디렉토리</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-gray-900">{store.name}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {brand && (
                  <Badge variant="primary">{brand.categoryLabel}</Badge>
                )}
                {store.verified && (
                  <Badge variant="success" className="gap-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                    인증 매장
                  </Badge>
                )}
                {awards.length > 0 && (
                  <Badge variant="warning" className="gap-0.5">
                    <Award className="h-3 w-3" />
                    {awards.length}회 수상
                  </Badge>
                )}
              </div>
              <h1 className="mt-3 text-h2 font-bold text-gray-900">{store.name}</h1>
              {brand && (
                <div className="mt-1 flex items-center gap-2">
                  <BrandLogo brand={brand} size="sm" />
                  <a
                    href={`https://pchahub.amakers.co.kr/brands/${brand.id}`}
                    className="inline-flex items-center gap-1 text-sm text-gray-700 hover:underline"
                  >
                    {brand.name} (프차허브에서 브랜드 정보)
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              )}
              <div className="mt-2 inline-flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                {store.address}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <SaveStoreButton storeId={store.id} />
              <ShareStoreButton storeName={store.name} />
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBlock
              icon={Star}
              label="평점"
              value={`${store.rating}`}
              sub={`${formatNumber(store.reviewCount)}개 리뷰`}
            />
            <StatBlock
              icon={Users}
              label="월 방문객"
              value={`${formatNumber(store.monthlyVisitors)}`}
              sub="명"
            />
            <StatBlock
              icon={Calendar}
              label="오픈"
              value={`${store.openedYear}년`}
              sub={`${new Date().getFullYear() - store.openedYear}년차`}
            />
            <StatBlock
              icon={MapPin}
              label="매장 면적"
              value={`${store.area}평`}
              sub={`일 유동 ${formatNumber(store.footTraffic)}명`}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 min-w-0">
            {/* Store photos */}
            {store.gallery.length > 0 && (
              <SectionCard title="매장 사진">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {store.gallery.slice(0, 8).map((src, i) => (
                    <div
                      key={i}
                      className={
                        'relative overflow-hidden rounded-xl bg-gray-100 ' +
                        (i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square')
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${store.name} ${i + 1}`}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Awards */}
            {awards.length > 0 && (
              <SectionCard title="수상 내역">
                <div className="space-y-3">
                  {awards.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ background: RANK_COLOR[a.rank] }}
                      >
                        <Award className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {a.year} 베스트 {a.categoryLabel} · {RANK_LABEL[a.rank]}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{a.citation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            <SectionCard title="이 매장 강점">
              <ul className="space-y-2">
                {store.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {store.recentReview && (
              <SectionCard title="최근 리뷰">
                <div className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={
                            'h-4 w-4 ' +
                            (n <= store.recentReview!.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300')
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {store.recentReview.author}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{store.recentReview.text}</p>
                </div>
                <div className="mt-3 text-center text-xs text-gray-500">
                  <a
                    href="https://jangsanote.amakers.co.kr"
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                  >
                    장사노트에서 점주 후기 더 보기 →
                  </a>
                </div>
              </SectionCard>
            )}

            {/* Rating distribution */}
            <SectionCard title="평점 분포">
              {(() => {
                // Simulate a plausible star distribution anchored to store.rating
                const r = store.rating
                const pcts: [number, number, number, number, number] =
                  r >= 4.5
                    ? [60, 25, 10, 3, 2]
                    : r >= 4.0
                      ? [45, 30, 15, 7, 3]
                      : r >= 3.5
                        ? [30, 35, 20, 10, 5]
                        : [15, 20, 25, 25, 15]

                return (
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 text-center">
                      <div className="text-4xl font-black text-gray-900">{r}</div>
                      <div className="mt-1 flex justify-center">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={
                              'h-3.5 w-3.5 ' +
                              (n <= Math.round(r) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')
                            }
                          />
                        ))}
                      </div>
                      <div className="mt-1.5 text-xs text-gray-400">
                        {formatNumber(store.reviewCount)}개 리뷰
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {([5, 4, 3, 2, 1] as const).map((star, i) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-5 shrink-0 text-right text-xs font-medium text-gray-600">
                            {star}★
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-amber-400 transition-all"
                              style={{ width: `${pcts[i]}%` }}
                            />
                          </div>
                          <span className="w-8 shrink-0 text-xs text-gray-400">{pcts[i]}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </SectionCard>

            {/* Review form */}
            <StoreReviewForm storeId={store.id} storeName={store.name} />

            {/* Same brand stores */}
            {sameBrand.length > 0 && brand && (
              <SectionCard title={`다른 ${brand.name} 매장`}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {sameBrand.map((s) => (
                    <StoreCard key={s.id} store={s} />
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Same region stores */}
            {sameRegion.length > 0 && (
              <SectionCard title={`${store.region} 지역의 다른 매장`}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {sameRegion.map((s) => (
                    <StoreCard key={s.id} store={s} />
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div>
                  <div className="text-xs text-gray-500">amakers 통합 정보</div>
                  <div className="mt-1 text-sm text-gray-700">
                    이 매장의 브랜드 · 매물 · 운영 · 커뮤니티 정보가 amakers 안에서 함께 제공됩니다.
                  </div>
                </div>
                {brand && (
                  <a href={`https://pchahub.amakers.co.kr/brands/${brand.id}`} className="block">
                    <Button size="md" variant="outline" className="w-full justify-between gap-1">
                      <span>{brand.name} 브랜드 정보</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                )}
                <a href="https://themyungdang.amakers.co.kr/listings" className="block">
                  <Button size="md" variant="outline" className="w-full justify-between gap-1">
                    <span>{store.region} 매물 보기</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
                <a href="https://jangsanote.amakers.co.kr" className="block">
                  <Button size="md" variant="outline" className="w-full justify-between gap-1">
                    <span>점주 커뮤니티 (장사노트)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
                <a href={`https://themanual.amakers.co.kr/courses?category=${brand?.category}`} className="block">
                  <Button size="md" variant="outline" className="w-full justify-between gap-1">
                    <span>{brand?.categoryLabel} 운영 강의</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
                <a href={`https://gongganhansu.amakers.co.kr/contractors?specialty=${brand?.category ?? ''}`} className="block">
                  <Button size="md" variant="outline" className="w-full justify-between gap-1">
                    <span>매장 시공사 찾기 (공간의한수)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

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

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">우수 매장 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">신규 인증 매장·평점 TOP 변동·지역별 우수 매장 소식을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <h2 className="mb-4 text-h4 font-semibold text-gray-900">{title}</h2>
        {children}
      </CardContent>
    </Card>
  )
}

function StatBlock({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Star
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <Icon className="h-4 w-4 text-gray-400" />
      <div className="mt-2 text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-h4 font-bold text-gray-900">{value}</div>
      <div className="mt-0.5 text-xs text-gray-500">{sub}</div>
    </div>
  )
}
