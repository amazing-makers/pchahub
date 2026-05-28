import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin, Store } from 'lucide-react'
import { Card, CardContent, Button } from '@amakers/ui'
import { buildPageMetadata } from '@amakers/design-system'
import { SUCCESS_STORIES } from '@/lib/stories-data'

interface StoryDetailPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return SUCCESS_STORIES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: StoryDetailPageProps): Promise<Metadata> {
  const story = SUCCESS_STORIES.find((s) => s.slug === params.slug)
  if (!story) return {}
  return buildPageMetadata('openrun', {
    title: story.title,
    description: story.excerpt,
    path: `/stories/${story.slug}`,
  })
}

const INDUSTRY_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  카페: { bg: 'bg-amber-100', text: 'text-amber-800', accent: 'bg-amber-500' },
  치킨: { bg: 'bg-orange-100', text: 'text-orange-800', accent: 'bg-orange-500' },
  한식: { bg: 'bg-red-100', text: 'text-red-800', accent: 'bg-red-500' },
  일식: { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'bg-blue-500' },
  분식: { bg: 'bg-yellow-100', text: 'text-yellow-800', accent: 'bg-yellow-500' },
  디저트: { bg: 'bg-pink-100', text: 'text-pink-800', accent: 'bg-pink-500' },
  주점: { bg: 'bg-purple-100', text: 'text-purple-800', accent: 'bg-purple-500' },
}

const METRIC_COLORS = [
  { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600', value: 'text-orange-900' },
  { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', value: 'text-blue-900' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', value: 'text-emerald-900' },
  { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-600', value: 'text-violet-900' },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  const story = SUCCESS_STORIES.find((s) => s.slug === params.slug)
  if (!story) notFound()

  const industryStyle = INDUSTRY_COLORS[story.industry] ?? {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    accent: 'bg-gray-500',
  }

  const relatedStories = SUCCESS_STORIES.filter(
    (s) => s.industry === story.industry && s.slug !== story.slug,
  ).slice(0, 3)

  return (
    <main>
      {/* Full-width cover hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-gray-900">
        <img
          src={story.coverImage}
          alt={story.title}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto pb-10">
            <a
              href="/stories"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> 성공 스토리 목록
            </a>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${industryStyle.bg} ${industryStyle.text}`}
              >
                {story.industry}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/90">
                {story.category}
              </span>
            </div>
            <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl">
              {story.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Owner profile bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-5">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${industryStyle.accent}`}
              >
                {story.ownerName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900">{story.ownerName}</div>
                <div className="text-xs text-gray-500">스토리 기고자</div>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-gray-600">
              <Store className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{story.brandName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              {story.ownerRegion}
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              {formatDate(story.openedAt)} 오픈
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-section">
        <div className="mx-auto max-w-3xl">
          {/* Excerpt lead */}
          <p className="text-xl font-medium leading-relaxed text-gray-700">{story.excerpt}</p>

          {/* Metrics 2x2 grid */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {story.metrics.map((metric, i) => {
              const color = METRIC_COLORS[i % METRIC_COLORS.length]!
              return (
                <div
                  key={metric.label}
                  className={`rounded-2xl border p-5 ${color.bg} ${color.border}`}
                >
                  <div className={`text-xs font-semibold uppercase tracking-wide ${color.text}`}>
                    {metric.label}
                  </div>
                  <div className={`mt-2 text-3xl font-black leading-none ${color.value}`}>
                    {metric.value}
                  </div>
                  {metric.period && (
                    <div className="mt-1.5 text-xs text-gray-500">{metric.period}</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Body paragraphs */}
          <div className="mt-12 space-y-6">
            {story.body.map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-gray-700">
                {para}
              </p>
            ))}
          </div>

          {/* 업주 핵심 팁 callout */}
          <div className="mt-12 rounded-2xl border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5 p-6">
            <div className="flex items-center gap-2">
              <div
                className="h-1 w-6 rounded-full"
                style={{ background: 'var(--brand-primary)' }}
              />
              <h2
                className="text-base font-bold"
                style={{ color: 'var(--brand-primary)' }}
              >
                {story.ownerName}의 핵심 팁
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {story.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: 'var(--brand-primary)' }}
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gray-900 p-8 text-white">
            <h2 className="text-xl font-bold">나도 오픈런과 함께하기</h2>
            <p className="mt-2 text-sm text-gray-400">
              {story.ownerName}처럼 준비된 오픈으로 시작하세요.
              오픈런이 전략부터 실행까지 함께합니다.
            </p>
            <div className="mt-5">
              <a href="/contact">
                <Button size="lg" className="gap-1.5">
                  캠페인 의뢰 시작하기 <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related stories */}
      {relatedStories.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="container mx-auto py-section">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-h3 font-bold text-gray-900">같은 업종 스토리</h2>
                <p className="mt-1 text-sm text-gray-500">{story.industry} 업주들의 다른 이야기</p>
              </div>
              <a
                href={`/stories?industry=${encodeURIComponent(story.industry)}`}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                더 보기 <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedStories.map((related) => {
                const topMetric = related.metrics[0] ?? null
                return (
                  <a key={related.slug} href={`/stories/${related.slug}`} className="group">
                    <Card className="overflow-hidden transition-shadow hover:shadow-md">
                      <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${industryStyle.bg} ${industryStyle.text}`}
                        >
                          {related.industry}
                        </span>
                        <h3 className="mt-2 text-sm font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                          {related.title}
                        </h3>
                        <div className="mt-2 text-xs text-gray-500">
                          {related.ownerName} · {related.ownerRegion}
                        </div>
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                          <span className="text-xs text-gray-500">{topMetric?.label}</span>
                          <span className="text-sm font-black text-gray-900">{topMetric?.value}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
