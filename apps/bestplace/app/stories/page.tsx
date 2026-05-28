import { buildPageMetadata } from '@amakers/design-system'
import { ArrowRight, BookOpen, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { BRAND_STORIES } from '@/lib/brand-stories-data'

export const metadata = buildPageMetadata('bestplace', {
  title: '브랜드 창업 스토리',
  description: '대한민국 대표 프랜차이즈 브랜드들의 창업 여정과 성공 이야기.',
  path: '/stories',
})

const CATEGORIES = ['전체', '카페', '치킨', '한식', '분식', '디저트', '주점']

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

const LOGO_TEXT_MAP: Record<string, string> = {
  amber: 'text-amber-700',
  blue: 'text-blue-700',
  red: 'text-red-700',
  green: 'text-green-700',
  pink: 'text-pink-700',
  orange: 'text-orange-700',
  indigo: 'text-indigo-700',
  emerald: 'text-emerald-700',
  yellow: 'text-yellow-700',
  sky: 'text-sky-700',
}

const LOGO_BG_MAP: Record<string, string> = {
  amber: 'bg-amber-50',
  blue: 'bg-blue-50',
  red: 'bg-red-50',
  green: 'bg-green-50',
  pink: 'bg-pink-50',
  orange: 'bg-orange-50',
  indigo: 'bg-indigo-50',
  emerald: 'bg-emerald-50',
  yellow: 'bg-yellow-50',
  sky: 'bg-sky-50',
}

export default function StoriesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-amber-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              브랜드 창업 스토리
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              대표 프랜차이즈 브랜드들의
              <br />
              창업 이야기
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              작은 노점, 골목 분식집, 주말 팝업에서 시작해 전국 수백·수천 개 매장으로 성장한
              <br className="hidden sm:inline" />
              브랜드들의 진짜 창업 여정을 만나보세요.
            </p>
            {/* Stats */}
            <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-amber-100 bg-white px-8 py-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4 text-amber-500" />
                <span><strong className="text-gray-900">{BRAND_STORIES.length}개</strong> 브랜드 스토리</span>
              </div>
              <div className="hidden h-4 w-px bg-gray-200 sm:block" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span>창업부터 현재까지</span>
              </div>
              <div className="hidden h-4 w-px bg-gray-200 sm:block" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-amber-500" />
                <span>실제 창업자 여정</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter chips */}
      <section className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={cat === '전체' ? '/stories' : `/stories?category=${cat}`}
                className="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] first:border-[var(--brand-primary)] first:bg-amber-50 first:text-[var(--brand-primary)]"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Story cards grid */}
      <section className="container mx-auto py-section">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_STORIES.map((story) => (
            <a key={story.slug} href={`/stories/${story.slug}`} className="group block">
              <Card className="h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-lg">
                {/* Cover image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={story.coverImage}
                    alt={story.brandName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Category badge */}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-gray-700 backdrop-blur-sm">
                    {story.category}
                  </span>
                  {story.featured && (
                    <span
                      className="absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                      style={{ background: 'var(--brand-primary)' }}
                    >
                      Featured
                    </span>
                  )}
                  {/* Brand name overlay */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${LOGO_COLOR_MAP[story.logoColor] ?? 'bg-gray-500'}`}
                    >
                      {story.brandName.charAt(0)}
                    </span>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Brand name & founder */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-[var(--brand-primary)] transition-colors">
                      {story.brandName}
                    </h2>
                    <span className="shrink-0 text-[11px] text-gray-400">{story.foundedYear}년 창업</span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">창업자 {story.founder}</p>

                  {/* Excerpt */}
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">{story.excerpt}</p>

                  {/* Stats */}
                  <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
                    <div>
                      <div className="text-sm font-black text-gray-900">{story.storeCount.toLocaleString()}개</div>
                      <div className="text-[10px] text-gray-400">현재 매장 수</div>
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900">+{story.revenueGrowthPct}%</div>
                      <div className="text-[10px] text-gray-400">매출 성장률</div>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--brand-primary)]">
                        스토리 보기 <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
