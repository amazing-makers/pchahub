import type { Metadata } from 'next'
import { ArrowLeft, Eye, MapPin, ThumbsUp, TrendingDown, TrendingUp } from 'lucide-react'
import {
  buildBreadcrumbsJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import {
  FOOT_TRAFFIC_LABEL,
  INTEL_CATEGORY_LABEL,
  RENT_LEVEL_LABEL,
  TREND_LABEL,
  intelAuthor,
  intelById,
  INTELS,
} from '@/lib/mock-intel'
import { notFound } from 'next/navigation'

interface Params { params: { id: string } }

export function generateStaticParams() {
  return INTELS.map((i) => ({ id: i.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const intel = intelById(params.id)
  if (!intel) return {}
  return buildPageMetadata('jangsanote', {
    title: intel.title,
    description: intel.summary,
    path: `/intel/${intel.id}`,
  })
}

const TREND_COLOR: Record<string, string> = {
  up: 'text-emerald-600 bg-emerald-50',
  stable: 'text-blue-600 bg-blue-50',
  down: 'text-rose-600 bg-rose-50',
}

export default function IntelDetailPage({ params }: Params) {
  const intel = intelById(params.id)
  if (!intel) notFound()

  const author = intelAuthor(intel.authorId)

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '장사노트', url: 'https://jangsanote.amakers.co.kr' },
      { name: '상권 인텔', url: 'https://jangsanote.amakers.co.kr/intel' },
      { name: intel.title, url: `https://jangsanote.amakers.co.kr/intel/${intel.id}` },
    ],
  })

  const related = INTELS.filter(
    (i) => i.id !== intel.id && (i.region === intel.region || i.category === intel.category),
  ).slice(0, 3)

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />

      <div className="container mx-auto py-8">
        <a
          href="/intel"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> 상권 인텔 목록
        </a>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                {INTEL_CATEGORY_LABEL[intel.category]}
              </span>
              <span
                className={
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ' +
                  TREND_COLOR[intel.trend]
                }
              >
                {intel.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : intel.trend === 'down' ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                {TREND_LABEL[intel.trend]}
              </span>
            </div>

            <h1 className="mt-3 text-h3 font-bold text-gray-900">{intel.title}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {intel.district}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {intel.views.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" /> {intel.likes}
              </span>
              <span>{intel.createdAt}</span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-gray-700">{intel.summary}</p>

            {/* Key points */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">핵심 포인트</h2>
              <ul className="mt-3 space-y-2">
                {intel.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--brand-primary)' }}
                    />
                    {kp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Body paragraphs */}
            <div className="mt-6 space-y-4">
              {intel.body.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-gray-700">
                  {para}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {intel.tags.map((t) => (
                <a
                  key={t}
                  href={`/intel?q=${encodeURIComponent(t)}`}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
                >
                  #{t}
                </a>
              ))}
            </div>

            {/* Author */}
            {author && (
              <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: author.avatarColor }}
                >
                  {author.handle.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{author.handle}</div>
                  <div className="text-xs text-gray-500">{author.role}</div>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Quick metrics */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">상권 지표</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">지역</dt>
                  <dd className="font-semibold text-gray-900">{intel.district}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">업종</dt>
                  <dd className="font-semibold text-gray-900">{INTEL_CATEGORY_LABEL[intel.category]}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">유동인구</dt>
                  <dd className="font-semibold text-gray-900">{FOOT_TRAFFIC_LABEL[intel.footTraffic]}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">임대료</dt>
                  <dd className="font-semibold text-gray-900">{RENT_LEVEL_LABEL[intel.rentLevel]}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">상권 흐름</dt>
                  <dd
                    className={
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ' +
                      TREND_COLOR[intel.trend]
                    }
                  >
                    {TREND_LABEL[intel.trend]}
                  </dd>
                </div>
              </dl>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">내 상권 정보도 공유하세요</h3>
              <p className="mt-1 text-xs text-gray-500">
                직접 발로 뛴 상권 분석을 공유하면 다른 점주들에게 큰 도움이 됩니다.
              </p>
              <a
                href="/intel/new"
                className="mt-3 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                상권 리포트 작성하기
              </a>
            </div>

            {/* Related intel */}
            {related.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">관련 리포트</h3>
                <ul className="mt-3 space-y-3">
                  {related.map((r) => (
                    <li key={r.id}>
                      <a
                        href={`/intel/${r.id}`}
                        className="text-sm font-medium text-gray-800 hover:text-[var(--brand-primary)]"
                      >
                        {r.title}
                      </a>
                      <div className="mt-0.5 text-xs text-gray-400">{r.district}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
