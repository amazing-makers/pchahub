import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, MapPin, Search, Star } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { buildBreadcrumbsJsonLd, buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ChannelList } from '@/components/channel-list'
import { PostCard } from '@/components/post-card'
import { CHANNELS, postsByChannel } from '@/lib/mock-data'
import { LocalPostsFeed } from '@/app/local-posts-feed'

export function generateStaticParams() {
  return CHANNELS.filter((c) => c.type === 'category').map((c) => ({ type: c.key }))
}

const SORT_OPTIONS = [
  { key: 'recent', label: '최신 순' },
  { key: 'likes', label: '인기 순' },
  { key: 'comments', label: '댓글 많은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface CategoryPageProps {
  params: { type: string }
  searchParams: { q?: string; sort?: string }
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const channel = CHANNELS.find((c) => c.type === 'category' && c.key === params.type)
  if (!channel) return {}
  return buildPageMetadata('jangsanote', {
    title: `${channel.label} — 장사노트`,
    description: channel.description ?? `${channel.label} 게시판. 회원 ${channel.memberCount.toLocaleString()}명과 함께 이야기하세요.`,
    path: `/categories/${channel.key}`,
  })
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const channel = CHANNELS.find((c) => c.type === 'category' && c.key === params.type)
  if (!channel) notFound()
  const { q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''
  let allPosts = postsByChannel('category', channel.key)
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

  const channelUrl = `https://jangsanote.amakers.co.kr/categories/${channel.key}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '커뮤니티', url: 'https://jangsanote.amakers.co.kr/categories' },
      { name: channel.label, url: channelUrl },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: channelUrl,
    items: posts.slice(0, 20).map((p) => ({ name: p.title, url: `https://jangsanote.amakers.co.kr/posts/${p.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">{channel.label}</h1>
          <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
          <div className="mt-2 text-xs text-gray-500">
            회원 {formatNumber(channel.memberCount)}명 · 글 {formatNumber(channel.postCount)}개
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/categories/${params.type}?sort=${o.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
                href={activeSort !== 'recent' ? `/categories/${params.type}?sort=${activeSort}` : `/categories/${params.type}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <ChannelList activeChannel={{ type: 'category', key: channel.key }} />
            {/* amakers 더 알아보기 */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  amakers에서 더 알아보기
                </div>
                <div className="space-y-2">
                  <a
                    href="https://pchahub.amakers.co.kr/brands"
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-200 hover:bg-white"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-indigo-500" />
                      가맹 브랜드 탐색
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://themanual.amakers.co.kr/courses"
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-200 hover:bg-white"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                      창업·운영 강의
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                  <a
                    href="https://themyungdang.amakers.co.kr/listings"
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-colors hover:border-gray-200 hover:bg-white"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      창업 매물 찾기
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </aside>
          <div className="space-y-3">
            <LocalPostsFeed channelType="category" channelKey={channel.key} />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">업종별 점주 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">이 업종 인기 게시글·운영 팁·업종 트렌드를 격주로 보내드립니다.</p>
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
