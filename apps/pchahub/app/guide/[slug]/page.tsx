import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildBreadcrumbsJsonLd, buildFaqPageJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckSquare,
  ChevronRight,
  Clock,
  Info,
  Lightbulb,
  Tag,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import {
  GUIDE_ARTICLES,
  GUIDE_CATEGORIES,
  getGuideBySlug,
  getRelatedGuides,
  type GuideArticle,
  type GuideSection,
} from '@/lib/guide-data'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return GUIDE_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getGuideBySlug(params.slug)
  if (!article) return {}
  return buildPageMetadata('pchahub', {
    title: `${article.title} — 창업 가이드`,
    description: article.summary,
    path: `/guide/${article.slug}`,
  })
}

export default function GuideArticlePage({ params }: Props) {
  const article = getGuideBySlug(params.slug)
  if (!article) notFound()

  const cat = GUIDE_CATEGORIES.find((c) => c.key === article.category)
  const related = getRelatedGuides(article.slug)

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd({
    items: [
      { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
      { name: '창업 가이드', url: 'https://pchahub.amakers.co.kr/guide' },
      { name: cat?.label ?? '가이드', url: `https://pchahub.amakers.co.kr/guide?category=${article.category}` },
      { name: article.title, url: `https://pchahub.amakers.co.kr/guide/${article.slug}` },
    ],
  })

  // checklist 섹션은 FAQ-like 구조로 JSON-LD 구성
  const checklistSections = article.sections.filter((s) => s.type === 'checklist' && s.heading && s.items?.length)
  const faqJsonLd =
    checklistSections.length > 0
      ? buildFaqPageJsonLd({
          url: `https://pchahub.amakers.co.kr/guide/${article.slug}`,
          items: checklistSections.map((s) => ({
            question: s.heading!,
            answer: s.items!.join(', '),
          })),
        })
      : null

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbsJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      {/* Article header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href="/guide" className="hover:text-gray-900">창업 가이드</a>
            <ChevronRight className="h-3.5 w-3.5" />
            {cat && (
              <>
                <a href={`/guide?category=${cat.key}`} className="hover:text-gray-900">{cat.label}</a>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="truncate text-gray-700">{article.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {cat && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                style={{ background: cat.color + '18', color: cat.color }}
              >
                <span aria-hidden>{cat.emoji}</span>
                {cat.label}
              </span>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              {article.readMinutes}분 읽기
            </div>
            <span className="text-sm text-gray-400">{article.publishedAt}</span>
          </div>

          <h1 className="mt-4 text-h2 font-bold text-gray-900 lg:max-w-3xl">{article.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-gray-600">{article.summary}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Article body */}
          <article className="min-w-0">
            <div className="space-y-5">
              {article.sections.map((section, i) => (
                <ArticleSection key={i} section={section} />
              ))}
            </div>

            {/* Back + forward nav */}
            <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-6">
              <a
                href="/guide"
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                가이드 목록
              </a>
              <a
                href="/brands"
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                브랜드 탐색하러 가기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* CTA cards */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-900">가이드를 읽었다면</div>
                <p className="text-xs text-gray-500">
                  7개 질문으로 내 조건에 맞는 브랜드를 추천받거나, 수익 시뮬레이션을 직접 돌려보세요.
                </p>
                <div className="space-y-2">
                  <a href="/scanner" className="block">
                    <Button size="md" className="w-full">창업 스캐너</Button>
                  </a>
                  <a href="/calculator" className="block">
                    <Button size="md" variant="outline" className="w-full">수익 계산기</Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Related articles */}
            {related.length > 0 && (
              <Card className="border-gray-200">
                <CardContent className="p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    관련 가이드
                  </div>
                  <div className="space-y-3">
                    {related.map((r) => {
                      const rCat = GUIDE_CATEGORIES.find((c) => c.key === r.category)
                      return (
                        <a
                          key={r.slug}
                          href={`/guide/${r.slug}`}
                          className="group flex items-start gap-2"
                        >
                          <span className="mt-0.5 text-sm" aria-hidden>{rCat?.emoji ?? '📄'}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium leading-snug text-gray-800 group-hover:underline">
                              {r.title}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock className="h-2.5 w-2.5" />
                              {r.readMinutes}분
                            </div>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Brand search CTA */}
            <Card className="border-indigo-200 bg-indigo-50">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-indigo-900">브랜드 탐색</div>
                <p className="mt-1 text-sm text-indigo-800">
                  공정위 정보공개서 기반 {`2,000+`} 브랜드를 직접 비교해보세요.
                </p>
                <a href="/brands" className="mt-3 block">
                  <Button size="md" variant="outline" className="w-full">브랜드 검색 →</Button>
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

// ─── Article section renderer ────────────────────────────────

function ArticleSection({ section }: { section: GuideSection }) {
  const type = section.type ?? 'default'

  if (type === 'checklist') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {section.heading && (
          <div className="mb-4 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 shrink-0 text-emerald-500" />
            <h2 className="text-base font-semibold text-gray-900">{section.heading}</h2>
          </div>
        )}
        {section.body && <p className="mb-4 text-sm text-gray-600">{section.body}</p>}
        <ul className="space-y-2">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-emerald-300 bg-emerald-50"
                aria-hidden
              >
                <span className="h-2 w-2 rounded-sm bg-emerald-500" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (type === 'tip') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 shrink-0 text-amber-600" />
          <span className="text-sm font-semibold text-amber-900">
            {section.heading ?? '실전 팁'}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-amber-800">{section.body}</p>
        {section.items && (
          <ul className="mt-3 space-y-1.5">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (type === 'warning') {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
          <span className="text-sm font-semibold text-rose-900">
            {section.heading ?? '주의사항'}
          </span>
        </div>
        {section.body && <p className="text-sm leading-relaxed text-rose-800">{section.body}</p>}
        {section.items && (
          <ul className="mt-3 space-y-1.5">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-rose-800">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  // default
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {section.heading && (
        <h2 className="mb-3 text-base font-semibold text-gray-900">{section.heading}</h2>
      )}
      {section.body && (
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{section.body}</p>
      )}
      {section.items && (
        <ul className="mt-3 space-y-1.5">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
