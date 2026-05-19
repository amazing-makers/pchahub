import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Search } from 'lucide-react'
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

interface CategoryPageProps {
  params: { type: string }
  searchParams: { q?: string }
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
  const { q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''
  const allPosts = postsByChannel('category', channel.key)
  const posts = needle
    ? allPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.excerpt.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle)),
      )
    : allPosts

  const channelUrl = `https://jangsanote.kr/categories/${channel.key}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '커뮤니티', url: 'https://jangsanote.kr/categories' },
      { name: channel.label, url: channelUrl },
    ],
  })
  const listJsonLd = buildItemListJsonLd({
    url: channelUrl,
    items: posts.slice(0, 20).map((p) => ({ name: p.title, url: `https://jangsanote.kr/posts/${p.id}` })),
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
          <form method="GET" className="mt-4 flex max-w-md gap-2">
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
                href={`/categories/${params.type}`}
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
            <ChannelList activeChannel={{ type: 'category', key: channel.key }} />
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
    </main>
  )
}
