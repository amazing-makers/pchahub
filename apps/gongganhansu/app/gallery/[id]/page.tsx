import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, Calendar, ChevronRight, MapPin, Star, Store, XCircle, CheckCircle2 as CheckCircleIcon } from 'lucide-react'
import { Badge, Button, Card, CardContent, NewsletterForm } from '@amakers/ui'
import {
  buildArticleJsonLd,
  buildBreadcrumbsJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import {
  CATEGORIES,
  contractorById,
  PORTFOLIO,
  portfolioById,
} from '@/lib/mock-data'
import { PortfolioCard } from '@/components/portfolio-card'
import { SavePortfolioButton } from './save-portfolio-button'
import { SharePortfolioButton } from './share-portfolio-button'
import { GalleryViewTracker } from './gallery-view-tracker'

export function generateStaticParams() {
  return PORTFOLIO.map((p) => ({ id: p.id }))
}

interface GalleryDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: GalleryDetailProps): Metadata {
  const item = portfolioById(params.id)
  if (!item) return {}
  const cat = CATEGORIES.find((c) => c.key === item.category)
  return buildPageMetadata('gongganhansu', {
    title: `${item.title} — ${cat?.label ?? item.category} 시공 사례`,
    description: `${item.excerpt} · ${item.region} ${item.district} · ${item.area}평 · 예산 ${formatNumber(item.budget)}만 · ${item.durationDays}일 시공.`,
    path: `/gallery/${item.id}`,
    openGraphType: 'article',
    publishedTime: item.completedAt,
  })
}

export default function GalleryDetailPage({ params }: GalleryDetailProps) {
  const item = portfolioById(params.id)
  if (!item) notFound()
  const contractor = contractorById(item.contractorId)
  const cat = CATEGORIES.find((c) => c.key === item.category)
  const related = PORTFOLIO.filter((p) => p.id !== item.id && p.category === item.category).slice(0, 3)

  const itemUrl = `https://gongganhansu.amakers.co.kr/gallery/${item.id}`
  const workJsonLd = buildArticleJsonLd({
    headline: item.title,
    description: item.excerpt,
    url: itemUrl,
    image: item.heroImage,
    publishedAt: item.completedAt,
    authorName: contractor?.name ?? '공간의한수',
    authorRole: '시공사',
    publisher: { name: '공간의한수', url: 'https://gongganhansu.amakers.co.kr' },
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '갤러리', url: 'https://gongganhansu.amakers.co.kr/gallery' },
      ...(cat
        ? [{ name: cat.label, url: `https://gongganhansu.amakers.co.kr/gallery?category=${cat.key}` }]
        : []),
      { name: item.title, url: itemUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <GalleryViewTracker
        portfolioId={item.id}
        portfolioTitle={item.title}
        portfolioCategory={item.category}
        portfolioRegion={item.region}
      />
      <JsonLd data={workJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Hero image */}
      <div className="relative h-72 w-full overflow-hidden sm:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.heroImage}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
      </div>

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/gallery" className="hover:text-gray-900">갤러리</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700 line-clamp-1">{item.title}</span>
          </nav>

          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {cat && <Badge variant="primary">{cat.label}</Badge>}
                {item.featured && <Badge variant="warning">대표 사례</Badge>}
              </div>
              <h1 className="mt-3 text-h2 font-bold text-gray-900">{item.title}</h1>
              <p className="mt-3 text-base text-gray-700">{item.excerpt}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Spec label="면적" value={`${item.area}평`} />
                <Spec label="예산" value={`${formatNumber(item.budget)}만`} />
                <Spec label="시공 일수" value={`${item.durationDays}일`} />
                <Spec label="평당 단가" value={`${Math.round(item.budget / item.area)}만`} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.region} {item.district}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  완공 {item.completedAt}
                </span>
              </div>
            </div>

            {contractor && (
              <aside>
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-5">
                    <div className="text-xs text-gray-500">시공사</div>
                    <a
                      href={`/contractors/${contractor.id}`}
                      className="mt-2 flex items-center gap-3 hover:underline"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                        style={{ background: contractor.brandColor }}
                      >
                        {contractor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{contractor.name}</div>
                        <div className="text-xs text-gray-500">
                          평당 {contractor.avgPricePerPyeong}만 · {contractor.region}
                        </div>
                      </div>
                    </a>
                    <a href="/quote" className="mt-4 block">
                      <Button size="md" className="w-full">
                        이 시공사 견적 받기
                      </Button>
                    </a>
                    <div className="mt-2 space-y-2">
                      <SavePortfolioButton itemId={item.id} />
                      <SharePortfolioButton itemTitle={item.title} />
                    </div>

                    <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        amakers에서 더 보기
                      </div>
                      <a
                        href={`https://pchahub.amakers.co.kr/brands?q=${encodeURIComponent(item.title.split(' ')[0] ?? item.title)}`}
                        className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Store className="h-3.5 w-3.5 text-indigo-500" />
                          이 브랜드 가맹 정보
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                      </a>
                      <a
                        href={`https://bestplace.amakers.co.kr/stores?q=${encodeURIComponent(item.title)}`}
                        className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Store className="h-3.5 w-3.5 text-amber-500" />
                          이 매장 베스트플레이스
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                      </a>
                      <a
                        href={`https://themyungdang.amakers.co.kr/listings?region=${encodeURIComponent(item.region)}`}
                        className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                          {item.region} 매물 보기
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-h4 font-semibold text-gray-900">시공 사진</h2>
            <p className="mt-1 text-sm text-gray-500">
              총 {item.imageCount}장의 실제 시공 사진 중 {item.gallery.length}장
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {item.gallery.map((src, i) => (
                <div
                  key={i}
                  className={
                    'relative overflow-hidden rounded-xl bg-gray-100 ' +
                    (i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square')
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${item.title} ${i + 1}`}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-h4 font-semibold text-gray-900">시공 후기</h2>
            <article className="mt-4 space-y-4 text-base leading-relaxed text-gray-800">
              {item.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          </CardContent>
        </Card>

        {item.challenges.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-h4 font-semibold text-gray-900">설계 도전 + 해결</h2>
              <div className="mt-4 space-y-4">
                {item.challenges.map((ch, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-start gap-3 border-b border-gray-100 bg-rose-50 p-4">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">설계 문제</div>
                        <div className="mt-1 text-sm font-medium text-rose-900">{ch.problem}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">해결 방법</div>
                        <div className="mt-1 text-sm text-gray-700">{ch.solution}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                #{t}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-h4 font-semibold text-gray-900">같은 카테고리 사례</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <PortfolioCard key={r.id} item={r} />
                ))}
              </div>
            </CardContent>
          </Card>
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

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">F&B 시공 사례를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">카페·베이커리·한식당 시공 사례·인테리어 트렌드를 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-base font-bold text-gray-900">{value}</div>
    </div>
  )
}
