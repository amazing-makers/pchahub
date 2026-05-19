import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { POSTS } from '@/lib/mock-data'
import { PostCard } from '@/components/post-card'
import { LocalPostsFeed } from '@/app/local-posts-feed'

const ITEMS_PER_PAGE = 20

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '전체 글',
  description: '장사노트 커뮤니티의 모든 게시글 — 최신 순.',
  path: '/posts',
})

export default function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string }
}) {
  const { q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''
  const pageNum = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const sorted = [...POSTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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
    url: 'https://jangsanote.kr/posts',
    items: paged.map((p) => ({ name: p.title, url: `https://jangsanote.kr/posts/${p.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">전체 글</h1>
          <p className="mt-1 text-sm text-gray-500">
            장사노트 커뮤니티에 등록된 모든 게시글 — 최신 순. 총 {formatNumber(sorted.length)}건
          </p>
          <form method="GET" action="/posts" className="mt-5 flex max-w-md gap-2">
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
                href="/posts"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>
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
                href={
                  p === 1
                    ? q ? `/posts?q=${encodeURIComponent(q)}` : '/posts'
                    : q ? `/posts?q=${encodeURIComponent(q)}&page=${p}` : `/posts?page=${p}`
                }
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
    </main>
  )
}
