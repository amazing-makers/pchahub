import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronRight, MapPin, Newspaper, Star, Store } from 'lucide-react'
import { Badge, Button, Card, CardContent, MobileCTA } from '@amakers/ui'
import {
  buildArticleJsonLd,
  buildBreadcrumbsJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { CaseCard } from '@/components/case-card'
import { caseById, PORTFOLIO } from '@/lib/mock-data'
import { SaveCaseButton } from './save-case-button'
import { ShareCaseButton } from './share-case-button'
import { CaseViewTracker } from './case-view-tracker'

export function generateStaticParams() {
  return PORTFOLIO.map((c) => ({ id: c.id }))
}

interface CaseDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: CaseDetailProps): Metadata {
  const c = caseById(params.id)
  if (!c) return {}
  return buildPageMetadata('openrun', {
    title: `${c.title} — ${c.client}`,
    description: `${c.hook} · ${c.industry} · ${c.region} · ${c.duration} 캠페인.`,
    path: `/portfolio/${c.id}`,
    openGraphType: 'article',
    publishedTime: c.startedAt,
    authors: [c.client],
  })
}

export default function CaseDetailPage({ params }: CaseDetailProps) {
  const c = caseById(params.id)
  if (!c) notFound()
  const related = PORTFOLIO.filter((x) => x.id !== c.id && x.service === c.service).slice(0, 3)

  const caseUrl = `https://openrun.amakers.co.kr/portfolio/${c.id}`
  const workJsonLd = buildArticleJsonLd({
    headline: c.title,
    description: c.hook,
    url: caseUrl,
    image: c.coverImage,
    publishedAt: c.startedAt,
    authorName: c.client,
    authorRole: c.industry,
    publisher: { name: '오픈런', url: 'https://openrun.amakers.co.kr' },
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '사례', url: 'https://openrun.amakers.co.kr/portfolio' },
      { name: c.serviceLabel, url: `https://openrun.amakers.co.kr/services/${c.service}` },
      { name: c.title, url: caseUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <CaseViewTracker caseId={c.id} />
      <JsonLd data={workJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Hero image */}
      <div
        className="relative h-56 w-full overflow-hidden sm:h-72"
        style={{
          background: `linear-gradient(135deg, ${c.imageColors[0]}, ${c.imageColors[1] ?? c.imageColors[0]})`,
        }}
      >
        {c.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.coverImage}
            alt={c.title}
            className="h-full w-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50" />
        <div className="absolute bottom-6 left-0 right-0 container mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: c.brandColor }}
          >
            <span className="text-xs font-bold text-white">{c.client}</span>
          </div>
        </div>
      </div>

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/portfolio" className="hover:text-gray-900">사례</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">{c.client}</span>
          </nav>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{c.serviceLabel}</Badge>
              <Badge variant="default">{c.industry}</Badge>
              {c.featured && <Badge variant="warning">대표 사례</Badge>}
            </div>
            <h1 className="mt-3 text-h2 font-bold text-gray-900">{c.title}</h1>
            <p className="mt-3 max-w-3xl text-lg text-gray-700">{c.hook}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <span
                  className="h-4 w-4 rounded-md"
                  style={{ background: c.brandColor }}
                  aria-hidden
                />
                {c.client}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {c.region}
              </span>
              <span>진행 기간 {c.duration}</span>
              <span>시작 {c.startedAt}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {c.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="text-xs text-gray-500">{m.label}</div>
                <div className="mt-1 text-h4 font-bold text-gray-900">{m.value}</div>
                {m.delta && <div className="mt-0.5 text-xs text-emerald-600">{m.delta}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-h4 font-semibold text-gray-900">캠페인 진행 내역</h2>
            <article className="mt-4 space-y-4 text-base leading-relaxed text-gray-800">
              {c.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
            {c.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {related.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="mb-4 text-h4 font-semibold text-gray-900">같은 서비스 다른 사례</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {related.map((rc) => (
                  <CaseCard key={rc.id} case={rc} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* amakers ecosystem — 캠페인 클라이언트 브랜드 cross-link */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              amakers에서 더 알아보기
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {c.client}에 대한 추가 정보를 amakers 다른 플랫폼에서 확인하세요.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href={`https://pchahub.amakers.co.kr/brands?q=${encodeURIComponent(c.client)}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-indigo-500" />
                  가맹 정보 (프차허브)
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href={`https://bestplace.amakers.co.kr/stores?q=${encodeURIComponent(c.client)}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  매장 보기 (베스트플레이스)
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href={`https://changupdocu.amakers.co.kr/episodes?brand=${encodeURIComponent(c.client)}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Newspaper className="h-3.5 w-3.5 text-rose-500" />
                  브랜드 다큐 (창업다큐)
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://gongganhansu.amakers.co.kr/quote"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  매장 인테리어 견적
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-h3 font-bold">비슷한 캠페인을 시작하고 싶으시면</h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-300">
              간단한 폼을 채워주시면 영업일 24시간 이내 기획안과 견적을 보내드립니다.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a href="/contact" className="inline-block">
                <Button size="lg">캠페인 의뢰</Button>
              </a>
              <SaveCaseButton caseId={c.id} />
              <ShareCaseButton caseTitle={c.title} />
            </div>
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
            <h2 className="mt-3 text-h4 font-bold text-gray-900">그랜드오픈 마케팅 사례를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">성공 캠페인 분석·오픈런 전략·브랜드 마케팅 인사이트를 격주로 보내드립니다.</p>
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

      <MobileCTA label="이런 캠페인 의뢰하기" href="/contact" />
    </main>
  )
}
