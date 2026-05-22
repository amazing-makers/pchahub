import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle2, ChevronRight, MapPin, MessageSquare, Star, Store } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import {
  buildBreadcrumbsJsonLd,
  buildLocalBusinessJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import {
  CATEGORIES,
  CONTRACTORS,
  contractorById,
  portfolioByContractor,
} from '@/lib/mock-data'
import { PortfolioCard } from '@/components/portfolio-card'
import { SaveContractorButton } from './save-contractor-button'
import { ContractorViewTracker } from './contractor-view-tracker'
import { ShareContractorButton } from './share-contractor-button'

export function generateStaticParams() {
  return CONTRACTORS.map((c) => ({ id: c.id }))
}

interface ContractorDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: ContractorDetailProps): Metadata {
  const c = contractorById(params.id)
  if (!c) return {}
  return buildPageMetadata('gongganhansu', {
    title: `${c.name} — F&B 매장 시공사`,
    description: `${c.tagline} · ${c.region} · 시공 ${c.projectCount}건 · 평점 ${c.rating} · 전문 분야: ${c.specialties.slice(0, 3).join(', ')}.`,
    path: `/contractors/${c.id}`,
  })
}

export default function ContractorDetailPage({ params }: ContractorDetailProps) {
  const c = contractorById(params.id)
  if (!c) notFound()
  const portfolio = portfolioByContractor(c.id)
  const others = CONTRACTORS.filter((x) => x.id !== c.id).slice(0, 3)

  const contractorUrl = `https://gongganhansu.amakers.co.kr/contractors/${c.id}`
  const businessJsonLd = buildLocalBusinessJsonLd({
    name: c.name,
    description: c.tagline,
    url: contractorUrl,
    image: c.heroImage,
    region: c.region,
    district: c.region,
    openedYear: c.foundedYear,
    rating: c.rating,
    reviewCount: c.reviewCount,
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '시공사', url: 'https://gongganhansu.amakers.co.kr/contractors' },
      { name: c.name, url: contractorUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <ContractorViewTracker contractorId={c.id} />
      <JsonLd data={businessJsonLd} />
      <JsonLd data={breadcrumbs} />
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.heroImage}
          alt={`${c.name} 시공 스튜디오`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/40" />
      </div>

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/contractors" className="hover:text-gray-900">시공사</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{c.name}</span>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="-mt-20 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white text-2xl font-bold text-white shadow-md"
                  style={{ background: c.brandColor }}
                >
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-h2 font-bold text-gray-900">{c.name}</h1>
                    {c.verified && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-label="인증" />
                    )}
                    {c.featured && <Badge variant="warning">추천</Badge>}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{c.tagline}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>
                  {c.region} · {c.foundedYear}년 설립 · {c.projectCount}건 시공
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900">{c.rating}</span>
                  <span className="text-gray-400">({c.reviewCount})</span>
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.specialties.map((s) => {
                  const cat = CATEGORIES.find((x) => x.key === s)
                  return (
                    <span
                      key={s}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                    >
                      {cat?.label ?? s}
                    </span>
                  )
                })}
              </div>
            </div>

            <aside>
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="space-y-3 p-5">
                  <div>
                    <div className="text-xs text-gray-500">평균 평당 단가</div>
                    <div className="mt-1 text-h3 font-bold text-gray-900">
                      {c.avgPricePerPyeong}
                      <span className="text-base font-medium text-gray-500"> 만원</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">예산 범위 {c.budgetRange}</div>
                  </div>
                  <a href={`/quote?contractor=${c.id}`} className="block">
                    <Button size="lg" className="w-full">
                      이 시공사 견적 받기
                    </Button>
                  </a>
                  <a href={`/quote?contractor=${c.id}&type=visit`} className="block">
                    <Button size="lg" variant="outline" className="w-full">
                      매장 방문 상담
                    </Button>
                  </a>
                  <div className="flex justify-center">
                    <SaveContractorButton contractorId={c.id} />
                  </div>
                  <ShareContractorButton contractorName={c.name} />
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-h4 font-semibold text-gray-900">시공사 소개</h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-gray-700">
              {c.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-h4 font-semibold text-gray-900">강점</h2>
            <ul className="mt-4 space-y-2">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {h}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-h4 font-semibold text-gray-900">포함되는 작업</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {c.includes.map((inc) => (
                <div
                  key={inc}
                  className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  {inc}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {portfolio.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-h4 font-semibold text-gray-900">{c.name} 시공 사례</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.map((p) => (
                  <PortfolioCard key={p.id} item={p} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* amakers 생태계 크로스링크 */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              amakers에서 더 알아보기
            </div>
            <p className="mt-1 text-sm text-gray-600">
              시공사 찾기 전·후에 필요한 정보를 한 곳에서 확인하세요.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <a
                href={`https://pchahub.amakers.co.kr/brands?category=${c.specialties[0] ?? ''}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-indigo-500" />
                  관련 브랜드 가맹 정보
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://themyungdang.amakers.co.kr/listings"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  입지 매물 찾기
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href={`https://bestplace.amakers.co.kr/stores?region=${encodeURIComponent(c.region)}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-amber-500" />
                  {c.region} 우수 매장
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://jangsanote.amakers.co.kr"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  점주 커뮤니티 (장사노트)
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-h3 font-bold">{c.name} 외 시공사도 함께 비교</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-300">
              한 시공사만 보지 마시고 3~5곳 견적을 비교하세요. 무료 견적은 영업일 48시간 이내 도착.
            </p>
            <a href="/quote" className="mt-5 inline-block">
              <Button size="lg">3~5곳 견적 받기</Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">인테리어 시공 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">검증된 시공사 소개·평당 단가 시세·F&B 시공 트렌드를 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                aria-label="이메일 주소"
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
    </main>
  )
}
