import type { Metadata } from 'next'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '커뮤니티',
  description: '프랜차이즈 창업 예비 점주 커뮤니티. 가맹비·수익·브랜드 질문과 토론을 자유롭게 나누세요.',
  path: '/community',
})

import { ArrowRight, Eye, MessageSquare, Search, ThumbsUp } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { DISCUSSIONS, QUESTIONS } from '@/lib/mock-community'
import { LocalCommunityPosts } from './local-posts'

const CATEGORY_LABELS: Record<string, string> = {
  experience: '창업 후기',
  question: '질문',
  tip: '팁',
  news: '시장 동향',
}

interface CommunityPageProps {
  searchParams: { tab?: string; q?: string }
}

export default function CommunityPage({ searchParams }: CommunityPageProps) {
  const tab = searchParams.tab ?? 'discussions'
  const { q } = searchParams
  const needle = q?.toLowerCase().trim() ?? ''

  const filteredDiscussions = needle
    ? DISCUSSIONS.filter(
        (d) =>
          d.title.toLowerCase().includes(needle) ||
          d.excerpt.toLowerCase().includes(needle) ||
          d.author.toLowerCase().includes(needle),
      )
    : DISCUSSIONS

  const filteredQuestions = needle
    ? QUESTIONS.filter(
        (qItem) =>
          qItem.q.toLowerCase().includes(needle) ||
          qItem.a.toLowerCase().includes(needle) ||
          qItem.answeredBy.toLowerCase().includes(needle),
      )
    : QUESTIONS

  const listJsonLd = buildItemListJsonLd({
    url: 'https://pchahub.amakers.co.kr/community',
    items: filteredDiscussions.slice(0, 20).map((d) => ({ name: d.title, url: `https://pchahub.amakers.co.kr/community/${d.id}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">프랜차이즈 커뮤니티</h1>
          <p className="mt-1 text-sm text-gray-500">
            가맹점주·예비창업자·전문가가 모인 프랜차이즈 창업 커뮤니티입니다.
          </p>
          <form method="GET" action="/community" className="mt-5 flex max-w-lg gap-2">
            {tab !== 'discussions' && <input type="hidden" name="tab" value={tab} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="제목, 내용, 작성자 검색…"
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
                href={tab !== 'discussions' ? `/community?tab=${tab}` : '/community'}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                초기화
              </a>
            )}
          </form>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          <TabLink href={`/community?tab=discussions${q ? `&q=${encodeURIComponent(q)}` : ''}`} active={tab === 'discussions'}>
            토론 / 후기 ({filteredDiscussions.length})
          </TabLink>
          <TabLink href={`/community?tab=questions${q ? `&q=${encodeURIComponent(q)}` : ''}`} active={tab === 'questions'}>
            전문가 Q&A ({filteredQuestions.length})
          </TabLink>
        </div>

        {tab === 'questions' ? (
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">
                {q ? `"${q}" 검색 결과가 없습니다` : '등록된 Q&A가 없습니다'}
              </p>
            ) : filteredQuestions.map((qItem) => (
              <Card key={qItem.id} className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 shrink-0 text-base font-bold"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      Q
                    </span>
                    <h3 className="text-base font-semibold text-gray-900">{qItem.q}</h3>
                  </div>
                  <div className="mt-3 flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 text-base font-bold text-gray-400">A</span>
                    <p className="text-sm text-gray-700">{qItem.a}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <span>{qItem.answeredBy}</span>
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      도움됨 {qItem.helpful}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
          <LocalCommunityPosts />
          {filteredDiscussions.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">
              {q ? `"${q}" 검색 결과가 없습니다` : '등록된 토론이 없습니다'}
            </p>
          )}
          <div className="space-y-3">
            {filteredDiscussions.map((d) => (
              <a
                key={d.id}
                href={`/community/${d.id}`}
                className="block"
              >
                <Card className="border-gray-200 transition-shadow hover:shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={d.category === 'tip' ? 'primary' : 'default'}>
                        {CATEGORY_LABELS[d.category]}
                      </Badge>
                      <span className="text-xs text-gray-500">{d.createdAt}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-gray-900">{d.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{d.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
                      <span>{d.author}</span>
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(d.views)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {d.comments}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
          </>
        )}

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center">
          <div className="text-sm text-gray-500">직접 경험을 나눠보세요</div>
          <h2 className="mt-1 text-h4 font-bold text-gray-900">창업 후기 & 질문 남기기</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            직접 경험한 가맹 창업 스토리, 본사 계약 후기, 운영 팁을 커뮤니티에 공유해보세요.
          </p>
          <a
            href="/community/write"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            글쓰기 <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">가맹 커뮤니티 소식을 받아보세요</h2>
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

function TabLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={
        'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ' +
        (active
          ? 'border-gray-900 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-900')
      }
    >
      {children}
    </a>
  )
}
