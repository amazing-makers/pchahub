import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Clock, Eye } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { KNOWHOW_ARTICLES } from '@/lib/knowhow-data'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return KNOWHOW_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = KNOWHOW_ARTICLES.find((a) => a.slug === params.slug)
  if (!article) return {}
  return buildPageMetadata('gongganhansu', {
    title: article.title,
    description: article.excerpt,
    path: `/knowhow/${article.slug}`,
  })
}

export default function KnowhowDetailPage({ params }: PageProps) {
  const article = KNOWHOW_ARTICLES.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '공간의한수', url: 'https://gongganhansu.amakers.co.kr' },
      { name: '시공 노하우', url: 'https://gongganhansu.amakers.co.kr/knowhow' },
      {
        name: article.title,
        url: `https://gongganhansu.amakers.co.kr/knowhow/${article.slug}`,
      },
    ],
  })

  // Related articles: same category, different slug, max 3
  const related = KNOWHOW_ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== article.slug,
  ).slice(0, 3)

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />

      {/* 커버 이미지 */}
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.coverImage}
          alt={article.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="container mx-auto py-8">
        <div className="mx-auto max-w-3xl">
          {/* 뒤로가기 */}
          <a
            href="/knowhow"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            노하우 목록으로
          </a>

          {/* 카테고리 배지 */}
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: 'var(--brand-primary)' }}
          >
            {article.category}
          </span>

          {/* 제목 */}
          <h1 className="mt-3 text-h2 font-bold text-gray-900">{article.title}</h1>

          {/* 발췌 */}
          <p className="mt-3 text-base text-gray-600">{article.excerpt}</p>

          {/* 저자 + 메타 */}
          <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-5">
            <div>
              <span className="text-sm font-bold text-gray-800">{article.authorName}</span>
              <span className="ml-1.5 text-sm text-gray-500">{article.authorTitle}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{article.publishedAt}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readMinutes}분 읽기
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {article.views.toLocaleString('ko-KR')}회
              </span>
            </div>
          </div>

          {/* 태그 */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 본문 */}
          <div className="mt-8 space-y-5">
            {article.body.map((paragraph, idx) => (
              <p key={idx} className="text-sm leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>

          {/* 핵심 팁 callout */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-amber-800">
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
              핵심 팁
            </h2>
            <ul className="mt-4 space-y-3">
              {article.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span className="text-sm font-medium text-amber-900">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 무료 견적 CTA */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-bold text-gray-900">
              이 내용을 바탕으로 전문 시공사의 견적을 받아보세요
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">
              공간의한수의 검증된 시공사와 무료로 매칭됩니다. 48시간 내에 견적 3~5개를 비교할 수
              있습니다.
            </p>
            <a
              href="/quote"
              className="mt-4 inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              무료 견적 요청하기
            </a>
          </div>
        </div>
      </div>

      {/* 관련 아티클 */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-white">
          <div className="container mx-auto py-8">
            <h2 className="text-h4 font-bold text-gray-900">같은 카테고리 노하우</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <a
                  key={rel.slug}
                  href={`/knowhow/${rel.slug}`}
                  className="group block"
                >
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-4">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                        style={{ background: 'var(--brand-primary)' }}
                      >
                        {rel.category}
                      </span>
                      <h3 className="mt-2 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[var(--brand-primary)]">
                        {rel.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-400">
                        <span className="font-semibold text-gray-600">{rel.authorName}</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {rel.readMinutes}분
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Eye className="h-3 w-3" />
                          {rel.views.toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
