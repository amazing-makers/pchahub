import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, BookOpen, ChevronRight, Clock, Flame, MessageSquare, Tag } from 'lucide-react'
import { Badge, Button, Card, CardContent, NewsletterForm } from '@amakers/ui'
import {
  GUIDE_ARTICLES,
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_COUNTS,
  type GuideCategory,
  type GuideArticle,
} from '@/lib/guide-data'
import { FEATURED_QAS } from '@/lib/franchisee-qa-data'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '창업 가이드 허브 — 단계별 프랜차이즈 창업 가이드',
  description: '창업 준비부터 계약, 운영, 수익 계산까지. 공정위 데이터 기반 실전 창업 가이드를 한곳에서.',
  path: '/guide',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '창업 가이드', url: 'https://pchahub.amakers.co.kr/guide' },
  ],
})

const listJsonLd = buildItemListJsonLd({
  url: 'https://pchahub.amakers.co.kr/guide',
  items: GUIDE_ARTICLES.map((a) => ({
    name: a.title,
    url: `https://pchahub.amakers.co.kr/guide/${a.slug}`,
  })),
})

const FEATURED_SLUGS = ['contract-checklist', 'startup-cost-breakdown', 'roi-calculation', 'franchise-vs-independent']

interface GuidePageProps {
  searchParams: { cat?: string }
}

export default function GuidePage({ searchParams }: GuidePageProps) {
  const activeCat = searchParams.cat
  const featured = FEATURED_SLUGS.map((s) => GUIDE_ARTICLES.find((a) => a.slug === s)).filter(Boolean) as GuideArticle[]
  const totalMinutes = GUIDE_ARTICLES.reduce((s, a) => s + a.readMinutes, 0)
  const filteredCategories = activeCat
    ? GUIDE_CATEGORIES.filter((c) => c.key === activeCat)
    : GUIDE_CATEGORIES

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-10">
          <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">창업 가이드</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2">
                <BookOpen className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                <h1 className="text-h2 font-bold text-gray-900">창업 가이드 허브</h1>
              </div>
              <p className="mt-2 max-w-2xl text-gray-600">
                감이 아닌 데이터로 창업 결정을 내리세요. 공정위 정보공개서 분석부터 계약서 체크리스트,
                수익 계산법까지 — 실패를 줄이는 창업 지식을 모았습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            { value: `${GUIDE_ARTICLES.length}편`, label: '전체 가이드' },
            { value: `${GUIDE_CATEGORIES.length}개`, label: '카테고리' },
            { value: `${totalMinutes}분`, label: '총 읽기 시간' },
            { value: '무료', label: '이용 비용' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-4">
              <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 카테고리 퀵 필터 탭 */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <a
              href="/guide"
              className={
                'flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
                (!activeCat
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'text-gray-600 hover:bg-gray-100')
              }
            >
              전체
            </a>
            {GUIDE_CATEGORIES.map((cat) => (
              <a
                key={cat.key}
                href={`/guide?cat=${cat.key}`}
                className={
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
                  (activeCat === cat.key
                    ? 'bg-[var(--brand-primary)] text-white'
                    : 'text-gray-600 hover:bg-gray-100')
                }
              >
                <span aria-hidden>{cat.emoji}</span>
                {cat.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    activeCat === cat.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {GUIDE_CATEGORY_COUNTS[cat.key] ?? 0}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-12 py-10">

        {/* 단계별 창업 경로 — 전체 탭일 때만 표시 */}
        {!activeCat && (
          <section>
            <div className="mb-5">
              <h2 className="text-h4 font-semibold text-gray-900">단계별 창업 경로</h2>
              <p className="mt-1 text-sm text-gray-500">준비 → 계약 → 운영 → 수익, 순서대로 읽으면 실수가 줄어듭니다</p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {GUIDE_CATEGORIES.map((cat, idx) => (
                <a key={cat.key} href={`/guide?cat=${cat.key}`} className="group relative">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
                    <div className="absolute right-4 top-3 text-[10px] font-bold text-gray-300">
                      STEP {idx + 1}
                    </div>
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                      style={{ background: cat.color + '18' }}
                    >
                      {cat.emoji}
                    </div>
                    <h3 className="mt-3 font-semibold text-gray-900">{cat.label}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{cat.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-gray-700">
                      {GUIDE_CATEGORY_COUNTS[cat.key]}편 보기 <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 추천 가이드 — 전체 탭일 때만 표시 */}
        {!activeCat && (
          <section>
            <div className="mb-5 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-h4 font-semibold text-gray-900">지금 꼭 읽어야 할 가이드</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((article) => (
                <FeaturedCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* 카테고리별 */}
        {filteredCategories.map((cat) => {
          const articles = GUIDE_ARTICLES.filter((a) => a.category === cat.key)
          return (
            <section key={cat.key}>
              <CategoryHeader cat={cat} count={GUIDE_CATEGORY_COUNTS[cat.key] ?? 0} />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )
        })}

        {/* 가맹점주 Q&A 연결 */}
        {!activeCat && (
          <section className="rounded-3xl border border-gray-100 bg-gray-50 px-8 py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <MessageSquare className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div>
                  <h2 className="text-h4 font-semibold text-gray-900">가맹점주 실전 Q&A</h2>
                  <p className="mt-0.5 text-sm text-gray-500">이론으로 해결 안 되는 부분은 현직 점주의 답변에서 확인하세요</p>
                </div>
              </div>
              <a href="/franchisee-qa" className="shrink-0 text-sm font-medium text-gray-700 hover:text-gray-900">
                전체 보기 →
              </a>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {FEATURED_QAS.map((qa) => (
                <a
                  key={qa.id}
                  href={`/franchisee-qa/${qa.id}`}
                  className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{qa.category}</div>
                  <p className="mt-1.5 text-sm font-medium leading-snug text-gray-900 line-clamp-2 group-hover:text-indigo-700">
                    {qa.question}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span className="truncate">{qa.answererProfile.split('(')[0]?.trim()}</span>
                    <span className="shrink-0">👍 {qa.helpful}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA — scanner + calculator */}
        <section className="rounded-3xl border border-gray-200 bg-white px-8 py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
                가이드를 읽었다면 다음 단계로
              </p>
              <h2 className="mt-2 text-h3 font-bold text-gray-900">직접 계산해보세요</h2>
              <p className="mt-2 text-gray-600">
                이론으로 익힌 내용을 내 조건에 맞게 적용해보세요. 창업 스캐너와 수익 계산기가
                당신의 상황에 맞는 브랜드를 추려드립니다.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href="/scanner" className="flex-1">
                <Button size="lg" className="w-full">창업 스캐너 시작</Button>
              </a>
              <a href="/calculator" className="flex-1">
                <Button size="lg" variant="outline" className="w-full">수익 계산기</Button>
              </a>
            </div>
          </div>
        </section>

        {/* 뉴스레터 */}
        <section className="rounded-3xl border border-gray-100 bg-gray-50 px-8 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Newsletter
          </p>
          <h2 className="mt-2 text-h4 font-bold text-gray-900">새 가이드가 올라오면 알려드려요</h2>
          <p className="mt-1 text-sm text-gray-500">매주 창업 팁·가맹 동향·브랜드 분석을 받아보세요.</p>
          <NewsletterForm />
          <p className="mt-2 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
        </section>
      </div>
    </main>
  )
}

// ─── sub-components ───────────────────────────────────────────

function FeaturedCard({ article }: { article: GuideArticle }) {
  const cat = GUIDE_CATEGORIES.find((c) => c.key === article.category)
  const accentColor = cat?.color ?? '#6B7280'
  return (
    <a href={`/guide/${article.slug}`} className="group">
      <Card className="h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
        <div
          className="flex h-24 items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}45)` }}
        >
          <span className="text-5xl" aria-hidden>{cat?.emoji ?? '📌'}</span>
        </div>
        <CardContent className="flex flex-col p-5">
          <span className="text-xs text-gray-500">{cat?.label}</span>
          <h3 className="mt-1.5 flex-1 text-sm font-semibold leading-snug text-gray-900 group-hover:underline">
            {article.title}
          </h3>
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {article.readMinutes}분
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

function CategoryHeader({ cat, count }: { cat: GuideCategory; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ background: cat.color + '18' }}
        aria-hidden
      >
        {cat.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-h4 font-semibold text-gray-900">{cat.label}</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{count}편</span>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">{cat.description}</p>
      </div>
    </div>
  )
}

function ArticleCard({ article }: { article: GuideArticle }) {
  const cat = GUIDE_CATEGORIES.find((c) => c.key === article.category)
  const accentColor = cat?.color ?? '#6B7280'
  return (
    <a href={`/guide/${article.slug}`} className="group">
      <Card className="h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
        <div
          className="flex h-20 items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}38)` }}
        >
          <span className="text-4xl" aria-hidden>{cat?.emoji ?? '📌'}</span>
        </div>
        <CardContent className="flex flex-col p-5">
          <h3 className="flex-1 text-sm font-semibold leading-snug text-gray-900 group-hover:underline">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs text-gray-500">{article.summary}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {article.readMinutes}분
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
