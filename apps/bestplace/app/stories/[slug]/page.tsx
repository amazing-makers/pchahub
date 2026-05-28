import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@amakers/design-system'
import { ArrowRight, Building2, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { BRAND_STORIES } from '@/lib/brand-stories-data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BRAND_STORIES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const story = BRAND_STORIES.find((s) => s.slug === slug)
  if (!story) return {}
  return buildPageMetadata('bestplace', {
    title: `${story.brandName} 창업 스토리 — ${story.tagline}`,
    description: story.excerpt,
    path: `/stories/${slug}`,
  })
}

const LOGO_COLOR_MAP: Record<string, string> = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
  pink: 'bg-pink-500',
  orange: 'bg-orange-500',
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  yellow: 'bg-yellow-500',
  sky: 'bg-sky-500',
}

const TIMELINE_COLOR_MAP: Record<string, string> = {
  amber: 'bg-amber-500 text-white border-amber-500',
  blue: 'bg-blue-500 text-white border-blue-500',
  red: 'bg-red-500 text-white border-red-500',
  green: 'bg-green-500 text-white border-green-500',
  pink: 'bg-pink-500 text-white border-pink-500',
  orange: 'bg-orange-500 text-white border-orange-500',
  indigo: 'bg-indigo-500 text-white border-indigo-500',
  emerald: 'bg-emerald-500 text-white border-emerald-500',
  yellow: 'bg-yellow-500 text-white border-yellow-500',
  sky: 'bg-sky-500 text-white border-sky-500',
}

const TIMELINE_LINE_MAP: Record<string, string> = {
  amber: 'bg-amber-200',
  blue: 'bg-blue-200',
  red: 'bg-red-200',
  green: 'bg-green-200',
  pink: 'bg-pink-200',
  orange: 'bg-orange-200',
  indigo: 'bg-indigo-200',
  emerald: 'bg-emerald-200',
  yellow: 'bg-yellow-200',
  sky: 'bg-sky-200',
}

const QUOTE_BG_MAP: Record<string, string> = {
  amber: 'bg-amber-50 border-amber-200',
  blue: 'bg-blue-50 border-blue-200',
  red: 'bg-red-50 border-red-200',
  green: 'bg-green-50 border-green-200',
  pink: 'bg-pink-50 border-pink-200',
  orange: 'bg-orange-50 border-orange-200',
  indigo: 'bg-indigo-50 border-indigo-200',
  emerald: 'bg-emerald-50 border-emerald-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  sky: 'bg-sky-50 border-sky-200',
}

const QUOTE_TEXT_MAP: Record<string, string> = {
  amber: 'text-amber-800',
  blue: 'text-blue-800',
  red: 'text-red-800',
  green: 'text-green-800',
  pink: 'text-pink-800',
  orange: 'text-orange-800',
  indigo: 'text-indigo-800',
  emerald: 'text-emerald-800',
  yellow: 'text-yellow-800',
  sky: 'text-sky-800',
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params
  const story = BRAND_STORIES.find((s) => s.slug === slug)
  if (!story) notFound()

  const related = BRAND_STORIES.filter(
    (s) => s.slug !== story.slug && s.category === story.category
  ).slice(0, 3)

  const logoBg = LOGO_COLOR_MAP[story.logoColor] ?? 'bg-gray-500'
  const timelineColor = TIMELINE_COLOR_MAP[story.logoColor] ?? 'bg-gray-500 text-white border-gray-500'
  const timelineLine = TIMELINE_LINE_MAP[story.logoColor] ?? 'bg-gray-200'
  const quoteBg = QUOTE_BG_MAP[story.logoColor] ?? 'bg-gray-50 border-gray-200'
  const quoteText = QUOTE_TEXT_MAP[story.logoColor] ?? 'text-gray-800'

  return (
    <main>
      {/* Brand hero */}
      <section className="relative h-72 overflow-hidden bg-gray-900 sm:h-96">
        <img
          src={story.coverImage}
          alt={story.brandName}
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto pb-10">
            <div className="flex items-end gap-4">
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg ${logoBg}`}
              >
                {story.brandName.charAt(0)}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {story.category}
                  </span>
                  {story.featured && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                      style={{ background: 'var(--brand-primary)' }}
                    >
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">{story.brandName}</h1>
                <p className="mt-1 text-sm text-gray-200">
                  창업자 <strong className="text-white">{story.founder}</strong> · {story.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-section">
        <div className="mx-auto max-w-3xl">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">설립년도</span>
              </div>
              <div className="mt-1 text-2xl font-black text-gray-900">{story.foundedYear}</div>
              <div className="text-[11px] text-gray-400">년</div>
            </div>
            <div className="border-x border-gray-100 text-center">
              <div className="flex items-center justify-center gap-1.5 text-gray-400">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">현재 매장 수</span>
              </div>
              <div className="mt-1 text-2xl font-black text-gray-900">{story.storeCount.toLocaleString()}</div>
              <div className="text-[11px] text-gray-400">개</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-gray-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">매출 성장률</span>
              </div>
              <div className="mt-1 text-2xl font-black text-gray-900">+{story.revenueGrowthPct}%</div>
              <div className="text-[11px] text-gray-400">창업 이후</div>
            </div>
          </div>

          {/* Excerpt */}
          <p className="mt-8 text-base leading-relaxed text-gray-700">{story.excerpt}</p>

          {/* Timeline */}
          <div className="mt-12">
            <h2 className="text-h3 font-bold text-gray-900">창업 여정</h2>
            <p className="mt-1 text-sm text-gray-500">작은 시작에서 전국구 브랜드로</p>

            <div className="mt-8 space-y-0">
              {story.journey.map((milestone, idx) => (
                <div key={milestone.year} className="flex gap-4">
                  {/* Timeline stem */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black ${timelineColor}`}
                    >
                      {milestone.year}
                    </div>
                    {idx < story.journey.length - 1 && (
                      <div className={`my-1 w-0.5 flex-1 ${timelineLine}`} style={{ minHeight: '2rem' }} />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 ${idx === story.journey.length - 1 ? 'pb-0' : ''}`}>
                    <h3 className="mt-2 text-base font-bold text-gray-900">{milestone.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{milestone.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Founder quote */}
          <blockquote
            className={`mt-10 rounded-2xl border p-6 ${quoteBg}`}
          >
            <p className={`text-base font-medium leading-relaxed italic ${quoteText}`}>
              &ldquo;{story.founderQuote}&rdquo;
            </p>
            <footer className={`mt-3 text-sm font-semibold ${quoteText} opacity-70`}>
              — {story.founder}, {story.brandName} 창업자
            </footer>
          </blockquote>

          {/* Related stories */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between">
                <h2 className="text-h4 font-bold text-gray-900">같은 카테고리 스토리</h2>
                <a
                  href="/stories"
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
                >
                  전체 보기 <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((rel) => (
                  <a key={rel.slug} href={`/stories/${rel.slug}`} className="group block">
                    <Card className="overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
                      <div className="relative h-28 overflow-hidden bg-gray-100">
                        <img
                          src={rel.coverImage}
                          alt={rel.brandName}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span
                          className={`absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white ${LOGO_COLOR_MAP[rel.logoColor] ?? 'bg-gray-500'}`}
                        >
                          {rel.brandName.charAt(0)}
                        </span>
                      </div>
                      <CardContent className="p-3">
                        <div className="text-sm font-bold text-gray-900 group-hover:text-[var(--brand-primary)] transition-colors">
                          {rel.brandName}
                        </div>
                        <div className="mt-0.5 text-[11px] text-gray-400">{rel.foundedYear}년 · {rel.storeCount.toLocaleString()}호점</div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 text-center">
            <a
              href="/stories"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← 모든 창업 스토리 보기
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
