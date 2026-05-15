import type { Metadata } from 'next'
import { Card, CardContent } from '@amakers/ui'
import { buildPageMetadata } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { POSTS } from '@/lib/mock-data'
import { PostCard } from '@/components/post-card'

const ITEMS_PER_PAGE = 20

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '전체 글',
  description: '장사노트 커뮤니티의 모든 게시글 — 최신 순.',
  path: '/posts',
})

export default function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const pageNum = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const sorted = [...POSTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(pageNum, totalPages)
  const paged = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">전체 글</h1>
          <p className="mt-1 text-sm text-gray-500">
            장사노트 커뮤니티에 등록된 모든 게시글 — 최신 순. 총 {formatNumber(sorted.length)}건
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
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
                href={p === 1 ? '/posts' : `/posts?page=${p}`}
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
