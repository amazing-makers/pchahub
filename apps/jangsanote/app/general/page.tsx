import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '자유게시판',
  description: '업종·지역 구분 없이 자유롭게 이야기하는 장사노트 자유게시판.',
  path: '/general',
})

import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { ChannelList } from '@/components/channel-list'
import { PostCard } from '@/components/post-card'
import { POSTS } from '@/lib/mock-data'
import { LocalPostsFeed } from '@/app/local-posts-feed'

const SORT_OPTIONS = [
  { key: 'recent', label: '최신 순' },
  { key: 'likes', label: '인기 순' },
  { key: 'comments', label: '댓글 많은 순' },
  { key: 'views', label: '조회 많은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface GeneralPageProps {
  searchParams: { q?: string; sort?: string }
}

export default function GeneralPage({ searchParams }: GeneralPageProps) {
  const { q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''
  let allPosts = POSTS.filter((p) => p.channelType === 'general')
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
      case 'views': return b.views - a.views
      default: return b.createdAt.localeCompare(a.createdAt)
    }
  })

  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.amakers.co.kr/general',
    items: posts.slice(0, 20).map((p) => ({ name: p.title, url: `https://jangsanote.amakers.co.kr/posts/${p.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">자유게시판</h1>
          <p className="mt-1 text-sm text-gray-500">업종·지역 구분 없이 자유롭게 이야기하는 곳</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/general?sort=${o.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
                placeholder="자유게시판 검색…"
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
                href={activeSort !== 'recent' ? `/general?sort=${activeSort}` : '/general'}
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
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <ChannelList activeChannel={{ type: 'general', key: 'general' }} />
          </aside>
          <div className="space-y-3">
            <LocalPostsFeed channelType="general" />
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
            <h2 className="mt-3 text-h3 font-bold text-gray-900">점주 커뮤니티 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">자유채널 인기 게시글·점주 경험담·운영 팁을 격주로 보내드립니다.</p>
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
