import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, MapPin } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import {
  buildArticleJsonLd,
  buildBreadcrumbsJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { CaseCard } from '@/components/case-card'
import { caseById, PORTFOLIO } from '@/lib/mock-data'
import { SaveCaseButton } from './save-case-button'

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
      <JsonLd data={workJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Hero image */}
      <div
        className="relative h-56 w-full sm:h-72"
        style={{
          background: `linear-gradient(135deg, ${c.imageColors[0]}, ${c.imageColors[1] ?? c.imageColors[0]})`,
        }}
        aria-hidden
      />

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
        <Card className="border-gray-200 bg-indigo-50">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold text-gray-900">
              이 캠페인의 클라이언트 — {c.client}
            </h2>
            <p className="mt-1 text-sm text-gray-700">
              {c.client}에 대해 amakers 다른 플랫폼에서 더 알아보세요.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <a
                href={`https://pchahub.amakers.co.kr/brands?q=${encodeURIComponent(c.client)}`}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-300"
              >
                → 가맹 정보 (프차허브)
              </a>
              <a
                href={`https://bestplace.amakers.co.kr/stores?q=${encodeURIComponent(c.client)}`}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-300"
              >
                → 매장 보기 (베스트플레이스)
              </a>
              <a
                href={`https://changupdocu.amakers.co.kr/episodes?brand=${encodeURIComponent(c.client)}`}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-300"
              >
                → 브랜드 다큐 (창업다큐)
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
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
