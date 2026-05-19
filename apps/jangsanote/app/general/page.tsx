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

interface GeneralPageProps {
  searchParams: { q?: string }
}

export default function GeneralPage({ searchParams }: GeneralPageProps) {
  const { q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''
  const allPosts = POSTS.filter((p) => p.channelType === 'general').sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )
  const posts = needle
    ? allPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.excerpt.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle)),
      )
    : allPosts

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
          <form method="GET" className="mt-4 flex max-w-md gap-2">
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
                href="/general"
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
    </main>
  )
}
