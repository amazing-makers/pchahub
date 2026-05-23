import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Eye,
  MapPin,
  MessageSquare,
  Star,
  Store,
  Trophy,
} from 'lucide-react'
import { Badge, Card, CardContent, NewsletterForm } from '@amakers/ui'
import {
  buildBreadcrumbsJsonLd,
  buildDiscussionJsonLd,
  buildPageMetadata,
  JsonLd,
} from '@amakers/design-system'
import { formatNumber, formatRelativeTime } from '@amakers/utils'
import {
  CATEGORY_LABEL,
  channelLabel,
  POSTS,
  postsByChannel,
  userById,
} from '@/lib/mock-data'
import { UserChip } from '@/components/user-chip'
import { PostCard } from '@/components/post-card'
import { CommentForm } from './comment-form'
import { ChannelSubscribeButton, PostActions, ReportButton } from './post-actions'
import { PostSaveButton } from './post-save-button'
import { PostViewTracker } from './post-view-tracker'
import { CommentLikeButton } from './comment-like-button'

export function generateStaticParams() {
  return POSTS.map((p) => ({ id: p.id }))
}

interface PostPageProps {
  params: { id: string }
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = POSTS.find((p) => p.id === params.id)
  if (!post) return {}
  const channelName = channelLabel(post.channelType, post.channelKey)
  return buildPageMetadata('jangsanote', {
    title: `${post.title} — ${channelName}`,
    description: `${post.excerpt} · ${CATEGORY_LABEL[post.category]} · 추천 ${post.likes} · 댓글 ${post.commentCount}.`,
    path: `/posts/${post.id}`,
    openGraphType: 'article',
    publishedTime: post.createdAt,
  })
}

export default function PostPage({ params }: PostPageProps) {
  const post = POSTS.find((p) => p.id === params.id)
  if (!post) notFound()

  const author = userById(post.authorId)
  const channelName = channelLabel(post.channelType, post.channelKey)
  const channelHref =
    post.channelType === 'general'
      ? '/general'
      : post.channelType === 'category'
        ? `/categories/${post.channelKey}`
        : `/regions/${post.channelKey}`

  const related = postsByChannel(post.channelType, post.channelKey)
    .filter((p) => p.id !== post.id)
    .slice(0, 3)

  const postUrl = `https://jangsanote.amakers.co.kr/posts/${post.id}`
  const postJsonLd = buildDiscussionJsonLd({
    headline: post.title,
    url: postUrl,
    upvoteCount: post.likes,
    commentCount: post.commentCount,
  })
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '장사노트', url: 'https://jangsanote.amakers.co.kr' },
      { name: channelName, url: `https://jangsanote.amakers.co.kr${channelHref}` },
      { name: post.title, url: postUrl },
    ],
  })

  return (
    <main className="bg-gray-50">
      <PostViewTracker postId={post.id} />
      <JsonLd data={postJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          {/* 브레드크럼 */}
          <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">홈</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href={channelHref} className="hover:text-gray-900">{channelName}</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-gray-900">{post.title}</span>
          </nav>

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{channelName}</Badge>
              <Badge variant="default">{CATEGORY_LABEL[post.category]}</Badge>
              {post.pinned && <Badge variant="warning">고정</Badge>}
              {post.hot && <Badge variant="error">HOT</Badge>}
            </div>
            <h1 className="mt-3 text-h2 font-bold text-gray-900">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <UserChip user={author} anonymous={post.anonymous} />
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{formatRelativeTime(post.createdAt)}</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatNumber(post.views)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6 min-w-0">
            {/* Body */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <article className="space-y-4 text-base leading-relaxed text-gray-800">
                  {post.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </article>

                {post.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <PostActions
                      postId={post.id}
                      likes={post.likes}
                      channelType={post.channelType}
                      channelKey={post.channelKey}
                      channelName={channelName}
                      shareTitle={post.title}
                      shareUrl={postUrl}
                    />
                    <PostSaveButton postId={post.id} />
                  </div>
                  <ReportButton postId={post.id} />
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-h4 font-semibold text-gray-900">
                  댓글 {post.commentCount}개
                </h2>

                {post.comments.length === 0 ? (
                  <p className="mt-4 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
                    첫 댓글을 남겨보세요.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {post.comments.map((c) => {
                      const cAuthor = userById(c.authorId)
                      return (
                        <div
                          key={c.id}
                          className="rounded-xl border border-gray-100 bg-white p-4"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <UserChip user={cAuthor} size="sm" />
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(c.createdAt)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700">{c.content}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                            <CommentLikeButton commentId={c.id} baseLikes={c.likes} />
                            <span className="text-gray-400">답글</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 댓글 입력 폼 (localStorage 기반) */}
                <div className="mt-4">
                  <CommentForm postId={post.id} />
                </div>
              </CardContent>
            </Card>

            {/* Related */}
            {related.length > 0 && (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-h4 font-semibold text-gray-900">
                    {channelName}의 다른 글
                  </h2>
                  <div className="mt-4 space-y-2">
                    {related.map((p) => (
                      <PostCard key={p.id} post={p} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 모바일 채널 정보 — lg에서 숨김 */}
          <div className="lg:hidden">
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">채널 정보</div>
                <a
                  href={channelHref}
                  className="mt-2 block text-base font-bold text-gray-900 hover:text-[var(--brand-primary)]"
                >
                  {channelName}
                </a>
                <ChannelSubscribeButton
                  channelType={post.channelType}
                  channelKey={post.channelKey}
                  channelName={channelName}
                />
                {post.channelType === 'category' && (
                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                    <a href={`https://pchahub.amakers.co.kr/categories/${post.channelKey}`} className="block text-gray-700 hover:text-gray-900">
                      → 가맹 브랜드 (프차허브)
                    </a>
                    <a href={`https://themyungdang.amakers.co.kr/listings?category=${post.channelKey}`} className="block text-gray-700 hover:text-gray-900">
                      → 입점 매물 (더명당)
                    </a>
                    <a href={`https://themanual.amakers.co.kr/courses?category=${post.channelKey}`} className="block text-gray-700 hover:text-gray-900">
                      → 운영 강의 (더메뉴얼)
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start">
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  채널 정보
                </div>
                <a
                  href={channelHref}
                  className="mt-2 block text-base font-bold text-gray-900 hover:text-[var(--brand-primary)]"
                >
                  {channelName}
                </a>
                <ChannelSubscribeButton
                  channelType={post.channelType}
                  channelKey={post.channelKey}
                  channelName={channelName}
                />
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-gray-500">
                  <MessageSquare className="h-3 w-3" />
                  운영 규칙 보기
                </p>
              </CardContent>
            </Card>

            {/* amakers ecosystem — category 채널이면 관련 브랜드/매물/강의 link */}
            {post.channelType === 'category' && (
              <Card className="mt-4 border-amber-200 bg-amber-50">
                <CardContent className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                    {channelName} 더 알아보기
                  </div>
                  <div className="mt-3 space-y-2">
                    <a
                      href={`https://pchahub.amakers.co.kr/categories/${post.channelKey}`}
                      className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-amber-300 hover:text-gray-900"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Store className="h-3.5 w-3.5 text-indigo-500" />
                        가맹 브랜드 (프차허브)
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                    </a>
                    <a
                      href={`https://themyungdang.amakers.co.kr/listings?category=${post.channelKey}`}
                      className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-amber-300 hover:text-gray-900"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                        입점 매물 (더명당)
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                    </a>
                    <a
                      href={`https://themanual.amakers.co.kr/courses?category=${post.channelKey}`}
                      className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-amber-300 hover:text-gray-900"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                        운영 강의 (더메뉴얼)
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                    </a>
                    <a
                      href={`https://bestplace.amakers.co.kr/stores?category=${post.channelKey}`}
                      className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-amber-300 hover:text-gray-900"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                        매장 보기 (베스트플레이스)
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>

      {/* amakers 생태계 크로스링크 */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">amakers에서 더 알아보기</div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <a href="https://pchahub.amakers.co.kr/brands" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-indigo-500" />가맹 브랜드 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themyungdang.amakers.co.kr/listings" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" />창업 매물 찾기</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://bestplace.amakers.co.kr/stores" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500" />우수 매장 탐색</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
                <a href="https://themanual.amakers.co.kr/courses" className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-rose-500" />창업 운영 강의</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">점주 커뮤니티 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">인기 게시글·운영 팁·점주 경험담을 격주로 보내드립니다.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
