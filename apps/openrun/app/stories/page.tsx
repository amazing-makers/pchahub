import type { Metadata } from 'next'
import { ArrowRight, BookOpen, MapPin, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildPageMetadata } from '@amakers/design-system'
import { SUCCESS_STORIES, STORY_CATEGORIES, STORY_INDUSTRIES } from '@/lib/stories-data'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '성공 스토리',
  description: '실제 업주들이 직접 전하는 오픈 성공 이야기와 마케팅 노하우.',
  path: '/stories',
})

const SORT_OPTIONS = [
  { key: 'featured', label: '추천순' },
  { key: 'recent', label: '최신순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface StoriesPageProps {
  searchParams: { industry?: string; category?: string; sort?: string }
}

const INDUSTRY_COLORS: Record<string, string> = {
  카페: 'bg-amber-100 text-amber-800',
  치킨: 'bg-orange-100 text-orange-800',
  한식: 'bg-red-100 text-red-800',
  일식: 'bg-blue-100 text-blue-800',
  분식: 'bg-yellow-100 text-yellow-800',
  디저트: 'bg-pink-100 text-pink-800',
  주점: 'bg-purple-100 text-purple-800',
}

const CATEGORY_COLORS: Record<string, string> = {
  '오픈 전략': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'SNS 마케팅': 'bg-sky-50 text-sky-700 border-sky-200',
  '배달 플랫폼': 'bg-orange-50 text-orange-700 border-orange-200',
  '단골 확보': 'bg-violet-50 text-violet-700 border-violet-200',
  '메뉴 기획': 'bg-rose-50 text-rose-700 border-rose-200',
  '인테리어 활용': 'bg-teal-50 text-teal-700 border-teal-200',
}

export default function StoriesPage({ searchParams }: StoriesPageProps) {
  const { industry, category, sort = 'featured' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'featured') as SortKey

  let stories = industry
    ? SUCCESS_STORIES.filter((s) => s.industry === industry)
    : SUCCESS_STORIES

  if (category) {
    stories = stories.filter((s) => s.category === category)
  }

  stories = [...stories].sort((a, b) => {
    if (activeSort === 'recent') return b.openedAt.localeCompare(a.openedAt)
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  })

  const totalIndustries = new Set(SUCCESS_STORIES.map((s) => s.industry)).size

  function buildUrl(params: Record<string, string | undefined>) {
    const merged = { industry, category, sort, ...params }
    const qs = Object.entries(merged)
      .filter(([, v]) => v && v !== 'featured')
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join('&')
    return `/stories${qs ? `?${qs}` : ''}`
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            성공 스토리
          </p>
          <h1 className="mt-4 text-hero font-bold">
            업주들이 직접 전하는
            <br />
            오픈 성공 이야기
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            화려한 광고 문구가 아닙니다. 실제로 오픈한 사장님들이 겪은 고민, 돌파구,
            그리고 숫자로 증명된 결과를 솔직하게 전합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[var(--brand-primary)]" />
              {SUCCESS_STORIES.length}개 스토리
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[var(--brand-primary)]" />
              {totalIndustries}개 업종
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[var(--brand-primary)]" />
              실제 업주 직접 기고
            </span>
          </div>
        </div>
      </section>

      {/* Filters + Sort */}
      <section className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="container mx-auto py-4">
          {/* Industry chips */}
          <div className="flex flex-wrap gap-2">
            <a
              href={buildUrl({ industry: undefined, category: undefined })}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                !industry
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              전체
            </a>
            {STORY_INDUSTRIES.map((ind) => (
              <a
                key={ind}
                href={buildUrl({ industry: industry === ind ? undefined : ind, category: undefined })}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                  industry === ind
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {ind}
              </a>
            ))}
          </div>

          {/* Category chips + Sort */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex flex-1 flex-wrap gap-2">
              {STORY_CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={buildUrl({ category: category === cat ? undefined : cat })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    category === cat
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </a>
              ))}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              {SORT_OPTIONS.map((opt) => (
                <a
                  key={opt.key}
                  href={buildUrl({ sort: opt.key === 'featured' ? undefined : opt.key })}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    activeSort === opt.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Cards */}
      <section className="container mx-auto py-section">
        {stories.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <p className="text-lg">해당 조건의 스토리가 없습니다.</p>
            <a href="/stories" className="mt-4 inline-block text-sm underline">
              전체 스토리 보기
            </a>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500">
              총 <strong className="text-gray-900">{stories.length}개</strong>의 스토리
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => {
                const topMetric = story.metrics[0] ?? null
                const industryColor =
                  INDUSTRY_COLORS[story.industry] ?? 'bg-gray-100 text-gray-700'
                const categoryColor =
                  CATEGORY_COLORS[story.category] ?? 'bg-gray-50 text-gray-600 border-gray-200'

                return (
                  <a key={story.slug} href={`/stories/${story.slug}`} className="group block">
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                      {/* Cover image */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Industry badge */}
                        <span
                          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold ${industryColor}`}
                        >
                          {story.industry}
                        </span>
                        {story.featured && (
                          <span className="absolute right-3 top-3 rounded-full bg-[var(--brand-primary)] px-2.5 py-0.5 text-xs font-bold text-white">
                            추천
                          </span>
                        )}
                      </div>

                      <CardContent className="p-5">
                        {/* Category chip */}
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColor}`}
                        >
                          {story.category}
                        </span>

                        {/* Title */}
                        <h2 className="mt-2.5 text-base font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                          {story.title}
                        </h2>

                        {/* Owner info */}
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="font-medium text-gray-700">{story.ownerName}</span>
                          <span>·</span>
                          <span>{story.ownerRegion}</span>
                        </div>

                        {/* Excerpt */}
                        <p className="mt-2.5 text-sm text-gray-600 line-clamp-2">{story.excerpt}</p>

                        {/* Standout metric */}
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                          <span className="text-xs text-gray-500">{topMetric?.label}</span>
                          <span className="text-base font-black text-gray-900">
                            {topMetric?.value}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)]">
                          스토리 읽기 <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h3 font-bold text-gray-900">나도 성공 스토리의 주인공이 되고 싶다면</h2>
            <p className="mt-3 text-gray-600">
              오픈런과 함께한 업주들의 이야기가 여기 있습니다.
              다음 스토리의 주인공이 되어보세요.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                캠페인 의뢰하기 <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-gray-400"
              >
                캠페인 사례 보기
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
