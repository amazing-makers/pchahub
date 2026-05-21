import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { CHANNELS, POSTS } from '@/lib/mock-data'
import { PostCard } from '@/components/post-card'
import { LocalPostsFeed } from '@/app/local-posts-feed'

const ITEMS_PER_PAGE = 20

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '전체 글',
  description: '장사노트 커뮤니티의 모든 게시글 — 최신 순.',
  path: '/posts',
})

const SORT_OPTIONS = [
  { key: 'recent', label: '최신 순' },
  { key: 'likes', label: '인기 순' },
  { key: 'comments', label: '댓글 많은 순' },
  { key: 'views', label: '조회 많은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

export default function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; sort?: string }
}) {
  const { q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''
  const pageNum = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const all = [...POSTS].sort((a, b) => {
    switch (activeSort) {
      case 'likes': return b.likes - a.likes
      case 'comments': return b.commentCount - a.commentCount
      case 'views': return b.views - a.views
      default: return b.createdAt.localeCompare(a.createdAt)
    }
  })
  const sorted = all
  const searched = needle
    ? sorted.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.excerpt.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle)),
      )
    : sorted
  const totalPages = Math.max(1, Math.ceil(searched.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(pageNum, totalPages)
  const paged = searched.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.amakers.co.kr/posts',
    items: paged.map((p) => ({ name: p.title, url: `https://jangsanote.amakers.co.kr/posts/${p.id}` })),
  })

  const totalViews = POSTS.reduce((s, p) => s + p.views, 0)
  const totalLikes = POSTS.reduce((s, p) => s + p.likes, 0)
  const channelCount = CHANNELS.length

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">전체 글</h1>
          <p className="mt-1 text-sm text-gray-500">
            장사노트 커뮤니티에 등록된 모든 게시글. 총 {formatNumber(sorted.length)}건
          </p>
          {/* Sort chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/posts?sort=${o.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
          <form method="GET" action="/posts" className="mt-4 flex max-w-md gap-2">
            {activeSort !== 'recent' && <input type="hidden" name="sort" value={activeSort} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="제목, 내용, 태그 검색…"
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
                href={activeSort !== 'recent' ? `/posts?sort=${activeSort}` : '/posts'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>
        </div>
      </section>

      {/* 통계 스트립 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{POSTS.length}건</span>
              <span className="text-[11px] font-semibold text-gray-700">전체 게시글</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalViews)}</span>
              <span className="text-[11px] font-semibold text-gray-700">누적 조회수</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalLikes)}</span>
              <span className="text-[11px] font-semibold text-gray-700">누적 좋아요</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{channelCount}개</span>
              <span className="text-[11px] font-semibold text-gray-700">커뮤니티 채널</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {/* 내가 쓴 글 (localStorage) */}
        <div className="mb-4">
          <LocalPostsFeed />
        </div>

        {paged.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-gray-500">
              아직 등록된 글이 없습니다.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {paged.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-1" aria-label="페이지 탐색">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={(() => {
                  const params = new URLSearchParams()
                  if (activeSort !== 'recent') params.set('sort', activeSort)
                  if (q) params.set('q', q)
                  if (p > 1) params.set('page', String(p))
                  const qs = params.toString()
                  return qs ? `/posts?${qs}` : '/posts'
                })()}
                aria-current={p === currentPage ? 'page' : undefined}
                className={
                  'flex h-8 w-8 items-center justify-center rounded-md border text-sm ' +
                  (p === currentPage
                    ? 'border-gray-900 bg-gray-900 font-medium text-white'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50')
                }
              >
                {p}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">점주 커뮤니티 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">인기 게시글·지역 모임·상권 분석 인사이트를 격주로 보내드립니다.</p>
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
