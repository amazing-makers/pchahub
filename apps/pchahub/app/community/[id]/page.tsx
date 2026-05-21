import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, ChevronRight, Eye, MapPin, MessageSquare, Store, ThumbsUp } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildDiscussionJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { DISCUSSIONS, type MockDiscussion } from '@/lib/mock-community'
import { BRANDS } from '@/lib/mock-data'
import { ShareDiscussionButton } from './share-discussion-button'
import { DiscussionViewTracker } from './discussion-view-tracker'

export function generateStaticParams() {
  return DISCUSSIONS.map((d) => ({ id: d.id }))
}

interface DiscussionDetailProps {
  params: { id: string }
}

export function generateMetadata({ params }: DiscussionDetailProps): Metadata {
  const d = DISCUSSIONS.find((d) => d.id === params.id)
  if (!d) return {}
  return buildPageMetadata('pchahub', {
    title: `${d.title} — 프차허브 커뮤니티`,
    description: d.excerpt,
    path: `/community/${d.id}`,
  })
}

export default function DiscussionDetailPage({ params }: DiscussionDetailProps) {
  const d = DISCUSSIONS.find((item) => item.id === params.id)
  if (!d) notFound()

  const brand = d.brandId ? BRANDS.find((b) => b.id === d.brandId) : undefined
  const related = DISCUSSIONS.filter((item) => item.id !== d.id && item.category === d.category).slice(0, 3)

  const postUrl = `https://pchahub.amakers.co.kr/community/${d.id}`
  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '커뮤니티', url: 'https://pchahub.amakers.co.kr/community' },
      { name: d.categoryLabel, url: `https://pchahub.amakers.co.kr/community?tab=discussions` },
      { name: d.title, url: postUrl },
    ],
  })
  const discussionJsonLd = buildDiscussionJsonLd({
    headline: d.title,
    url: postUrl,
    commentCount: d.comments,
  })

  const CATEGORY_BADGE: Record<MockDiscussion['category'], 'primary' | 'success' | 'warning' | 'default'> = {
    experience: 'success',
    question: 'primary',
    tip: 'warning',
    news: 'default',
  }

  return (
    <main className="bg-gray-50">
      <DiscussionViewTracker
        discussionId={d.id}
        discussionTitle={d.title}
        discussionCategory={d.categoryLabel}
      />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={discussionJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/community" className="hover:text-gray-900">커뮤니티</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a
              href={`/community?tab=discussions`}
              className="hover:text-gray-900"
            >
              {d.categoryLabel}
            </a>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant={CATEGORY_BADGE[d.category]}>{d.categoryLabel}</Badge>
            {brand && (
              <a
                href={`/brands/${brand.id}`}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
              >
                {brand.name}
              </a>
            )}
          </div>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">{d.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>{d.author}</span>
            <span>{d.createdAt}</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" /> {d.views.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> {d.comments}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-base leading-relaxed text-gray-800">{d.excerpt}</p>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <div className="text-sm text-gray-500">
                이 글이 도움이 됐나요?
              </div>
              <div className="flex items-center gap-2">
                <ShareDiscussionButton title={d.title} />
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <ThumbsUp className="h-4 w-4" />
                  도움됨
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
              <div className="text-sm text-gray-500">댓글 {d.comments}개</div>
              <p className="mt-2 text-sm text-gray-400">
                댓글 기능은 로그인 후 이용하실 수 있습니다.
              </p>
              <a
                href="/auth/signin"
                className="mt-3 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                로그인
              </a>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {brand && (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">관련 브랜드</div>
                  <a
                    href={`/brands/${brand.id}`}
                    className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ background: brand.logoColor }}
                    >
                      {brand.name.charAt(0)}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{brand.name}</div>
                      <div className="text-xs text-gray-500">{brand.categoryLabel}</div>
                    </div>
                  </a>
                  <a
                    href={`/brands/${brand.id}`}
                    className="mt-2 block text-center text-xs text-gray-500 underline-offset-2 hover:underline"
                  >
                    브랜드 상세 정보 보기 →
                  </a>
                </CardContent>
              </Card>
            )}

            {related.length > 0 && (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">같은 카테고리</div>
                  <div className="mt-3 space-y-2">
                    {related.map((r) => (
                      <a
                        key={r.id}
                        href={`/community/${r.id}`}
                        className="block rounded-lg border border-gray-100 p-3 text-sm transition-colors hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900 line-clamp-2">{r.title}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <span>{r.author}</span>
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {r.views.toLocaleString()}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">커뮤니티</div>
                <p className="mt-3 text-sm text-gray-600">
                  창업 경험을 공유하거나 질문을 남겨보세요.
                </p>
                <a
                  href="/community/write"
                  className="mt-3 block rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                >
                  글쓰기
                </a>
                <a
                  href="/community"
                  className="mt-2 block text-center text-xs text-gray-500 underline-offset-2 hover:underline"
                >
                  커뮤니티 목록으로
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* amakers 생태계 크로스링크 */}
      <section className="container mx-auto py-8">
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              amakers에서 더 알아보기
            </div>
            <p className="mt-1 text-sm text-gray-600">
              이 토론과 관련된 창업 정보를 한 곳에서 확인하세요.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {brand && (
                <a
                  href={`/brands/${brand.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-indigo-500" />
                    {brand.name} 가맹 정보
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </a>
              )}
              <a
                href="https://jangsanote.amakers.co.kr"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  점주 커뮤니티 (장사노트)
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://themanual.amakers.co.kr/courses"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                  창업 운영 강의
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="https://themyungdang.amakers.co.kr/listings"
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
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
      </section>

      {/* 뉴스레터 CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h4 font-bold text-gray-900">가맹 커뮤니티 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">인기 토론·본사 공지·업종별 핫이슈를 격주로 보내드립니다.</p>
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
