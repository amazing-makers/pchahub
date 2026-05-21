import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, MapPin, Search, Star, Wrench } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ChannelList } from '@/components/channel-list'
import { PostCard } from '@/components/post-card'
import { CHANNELS, postsByChannel } from '@/lib/mock-data'
import { LocalPostsFeed } from '@/app/local-posts-feed'

export function generateStaticParams() {
  return CHANNELS.filter((c) => c.type === 'region').map((c) => ({ region: c.key }))
}

const SORT_OPTIONS = [
  { key: 'recent', label: '최신 순' },
  { key: 'likes', label: '인기 순' },
  { key: 'comments', label: '댓글 많은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface RegionPageProps {
  params: { region: string }
  searchParams: { q?: string; sort?: string }
}

export function generateMetadata({ params }: RegionPageProps): Metadata {
  const channel = CHANNELS.find((c) => c.type === 'region' && c.key === params.region)
  if (!channel) return {}
  return buildPageMetadata('jangsanote', {
    title: `${channel.label} — 장사노트`,
    description: channel.description ?? `${channel.label} 지역 자영업·가맹점주 게시판. 회원 ${channel.memberCount.toLocaleString()}명과 지역 정보를 나누세요.`,
    path: `/regions/${channel.key}`,
  })
}

export default function RegionPage({ params, searchParams }: RegionPageProps) {
  const channel = CHANNELS.find((c) => c.type === 'region' && c.key === params.region)
  if (!channel) notFound()
  const { q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''
  let allPosts = postsByChannel('region', channel.key)
  if (needle) {
    allPosts = allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.excerpt.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  const posts = [...allPosts].sort((a, b) => {
    switch (activeSort) {
      case 'likes': return b.likes - a.likes
      case 'comments': return b.commentCount - a.commentCount
      default: return b.createdAt.localeCompare(a.createdAt)
    }
  })

  const regionUrl = `https://jangsanote.amakers.co.kr/regions/${channel.key}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '지역방', url: 'https://jangsanote.amakers.co.kr/regions' },
      { name: channel.label, url: regionUrl },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: regionUrl,
    items: posts.slice(0, 20).map((p) => ({ name: p.title, url: `https://jangsanote.amakers.co.kr/posts/${p.id}` })),
  })

  const totalViews = allPosts.reduce((s, p) => s + p.views, 0)
  const totalLikes = allPosts.reduce((s, p) => s + p.likes, 0)

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-h3 font-bold text-gray-900">{channel.label}</h1>
              <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
            </div>
            <a
              href="/write"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <span className="text-base leading-none">+</span>
              글 작성
            </a>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/regions/${params.region}?sort=${o.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                  (activeSort === o.key
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300')
                }
              >
                {o.label}
              </a>
            ))}
          </div>
          <form method="GET" className="mt-3 flex max-w-md gap-2">
            {activeSort !== 'recent' && <input type="hidden" name="sort" value={activeSort} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="이 방에서 검색…"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              검색
            </button>
            {q && (
              <a
                href={activeSort !== 'recent' ? `/regions/${params.region}?sort=${activeSort}` : `/regions/${params.region}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>
        </div>
      </section>

      {/* 통계 스트립 */}
      {!q && (
        <div className="border-b border-gray-100 bg-white">
          <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            {[
              { value: formatNumber(channel.memberCount), label: '채널 회원' },
              { value: `${formatNumber(channel.postCount)}개`, label: '전체 게시글' },
              { value: formatNumber(totalViews), label: '누적 조회' },
              { value: formatNumber(totalLikes), label: '누적 좋아요' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <ChannelList activeChannel={{ type: 'region', key: channel.key }} />
            {/* 이 지역 더 알아보기 */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {channel.label} 더 알아보기
                </div>
                <div className="space-y-2">
                  <a
                    href={`https://themyungdang.amakers.co.kr/listings?region=${encodeURIComponent(channel.label)}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-200 hover:bg-white"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                      {channel.label} 창업 매물
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href={`https://bestplace.amakers.co.kr/stores?region=${encodeURIComponent(channel.label)}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-200 hover:bg-white"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      {channel.label} 우수 매장
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://themanual.amakers.co.kr/courses"
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-200 hover:bg-white"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                      가맹 운영 강의
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://gongganhansu.amakers.co.kr/quote"
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-200 hover:bg-white"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-rose-500" />
                      매장 시공 견적
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </aside>
          <div className="space-y-3">
            <LocalPostsFeed channelType="region" channelKey={channel.key} />
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-gray-500">
                  {q ? `"${q}" 검색 결과가 없습니다.` : '아직 작성된 글이 없습니다. 첫 글을 남겨보세요.'}
                </CardContent>
              </Card>
            ) : (
              posts.map((p) => <PostCard key={p.id} post={p} />)
            )}
          </div>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">지역 점주 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">지역별 상권 동향·모임 소식·지역 점주 인사이트를 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
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
    </main>
  )
}
