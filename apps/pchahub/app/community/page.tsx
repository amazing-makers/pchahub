import type { Metadata } from 'next'
import {  buildItemListJsonLd, buildPageMetadata, JsonLd, buildBreadcrumbsJsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '커뮤니티',
  description: '프랜차이즈 창업 예비 점주 커뮤니티. 가맹비·수익·브랜드 질문과 토론을 자유롭게 나누세요.',
  path: '/community',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '커뮤니티', url: 'https://pchahub.amakers.co.kr/community' },
  ],
})

import { AlertCircle, ArrowRight, Bell, CalendarDays, Eye, MessageSquare, Search, ThumbsUp, TrendingUp } from 'lucide-react'
import { Badge, Card, CardContent, NewsletterForm, PageAiChat } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { DISCUSSIONS, QUESTIONS } from '@/lib/mock-community'
import { LocalCommunityPosts } from './local-posts'

const MARKET_INTEL = [
  {
    id: 'mi1',
    title: '홍대·신촌 상권 공실률 급등 — 카페·디저트 신규 진입 주의',
    tag: '상권 경보',
    urgent: true,
    date: '2026-05-24',
  },
  {
    id: 'mi2',
    title: '2026년 2분기 배달앱 수수료 인상 예고 — 배달 비중 높은 매장 손익 재계산 필요',
    tag: '플랫폼 변화',
    urgent: true,
    date: '2026-05-22',
  },
  {
    id: 'mi3',
    title: '소상공인 정책자금 5월 신청 마감 임박 — 잔여 한도 40% 소진',
    tag: '정책 자금',
    urgent: false,
    date: '2026-05-20',
  },
  {
    id: 'mi4',
    title: '치킨·한식 업종 폐업률 전년比 8%p 개선 — 상반기 통계',
    tag: '업종 동향',
    urgent: false,
    date: '2026-05-18',
  },
]

const COMMUNITY_EVENTS = [
  {
    id: 'ev1',
    title: '프랜차이즈 계약서 핵심 조항 세미나',
    date: '2026-06-07 (토) 오후 2시',
    location: '서울 강남구 코엑스 B홀',
    spots: 40,
    remaining: 12,
  },
  {
    id: 'ev2',
    title: '카페 창업 예비 점주 네트워킹 — 현직 점주 3인 패널',
    date: '2026-06-14 (토) 오전 11시',
    location: '서울 마포구 (장소 추후 공지)',
    spots: 30,
    remaining: 8,
  },
  {
    id: 'ev3',
    title: '치킨·분식 상권 분석 워크숍 (소상공인진흥공단 협력)',
    date: '2026-06-21 (토) 오후 3시',
    location: '부산 해운대구 벡스코',
    spots: 60,
    remaining: 31,
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  experience: '창업 후기',
  question: '질문',
  tip: '팁',
  news: '시장 동향',
}

const SORT_OPTIONS = [
  { key: 'recent', label: '최신 순' },
  { key: 'views', label: '조회 많은 순' },
  { key: 'comments', label: '댓글 많은 순' },
] as const
type SortKey = (typeof SORT_OPTIONS)[number]['key']

interface CommunityPageProps {
  searchParams: { tab?: string; q?: string; sort?: string }
}

export default function CommunityPage({ searchParams }: CommunityPageProps) {
  const tab = searchParams.tab ?? 'discussions'
  const { q, sort = 'recent' } = searchParams
  const activeSort = (SORT_OPTIONS.find((o) => o.key === sort)?.key ?? 'recent') as SortKey
  const needle = q?.toLowerCase().trim() ?? ''

  let filteredDiscussions = needle
    ? DISCUSSIONS.filter(
        (d) =>
          d.title.toLowerCase().includes(needle) ||
          d.excerpt.toLowerCase().includes(needle) ||
          d.author.toLowerCase().includes(needle),
      )
    : [...DISCUSSIONS]
  filteredDiscussions = [...filteredDiscussions].sort((a, b) => {
    switch (activeSort) {
      case 'views': return b.views - a.views
      case 'comments': return b.comments - a.comments
      default: return b.createdAt.localeCompare(a.createdAt)
    }
  })

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

  const totalViews = DISCUSSIONS.reduce((s, d) => s + d.views, 0)
  const totalComments = DISCUSSIONS.reduce((s, d) => s + d.comments, 0)
  const categoryCount = new Set(DISCUSSIONS.map((d) => d.category)).size

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">프랜차이즈 커뮤니티</h1>
          <p className="mt-1 text-sm text-gray-500">
            가맹점주·예비창업자·업계 전문가가 함께하는 창업 커뮤니티. 토론·후기·상권 인텔을 나누세요.
          </p>
          <form method="GET" action="/community" className="mt-5 flex max-w-lg gap-2">
            {tab !== 'discussions' && <input type="hidden" name="tab" value={tab} />}
            {activeSort !== 'recent' && tab === 'discussions' && <input type="hidden" name="sort" value={activeSort} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                type="search"
                defaultValue={q ?? ''}
                aria-label="제목, 내용, 작성자 검색…"
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

      {/* 통계 스트립 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{DISCUSSIONS.length}건</span>
              <span className="text-[11px] font-semibold text-gray-700">커뮤니티 글</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{formatNumber(totalViews)}</span>
              <span className="text-[11px] font-semibold text-gray-700">누적 조회</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{totalComments}</span>
              <span className="text-[11px] font-semibold text-gray-700">전체 댓글</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-4 py-2 text-center">
              <span className="text-xl font-black tracking-tight text-gray-900">{QUESTIONS.length}건</span>
              <span className="text-[11px] font-semibold text-gray-700">전문가 Q&A</span>
            </div>
          </div>
        </div>
      </section>

      {/* 시장 인텔 — 상권·업종 긴급 공지 */}
      <section className="border-b border-gray-100 bg-amber-50">
        <div className="container mx-auto py-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">상권 · 업종 인텔</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {MARKET_INTEL.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-white p-3"
              >
                {item.urgent && (
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                )}
                {!item.urgent && (
                  <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                )}
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">{item.tag}</div>
                  <p className="mt-0.5 text-xs font-medium leading-snug text-gray-800 line-clamp-2">{item.title}</p>
                  <div className="mt-1 text-[10px] text-gray-400">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 커뮤니티 이벤트 · 모임 */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
              <span className="text-sm font-semibold text-gray-900">예정된 모임 · 세미나</span>
            </div>
            <a href="/community/events" className="text-xs text-gray-500 hover:text-gray-800">전체 보기 →</a>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {COMMUNITY_EVENTS.map((ev) => (
              <div
                key={ev.id}
                className="w-64 shrink-0 rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex-1 text-sm font-semibold leading-snug text-gray-900 line-clamp-2">{ev.title}</h3>
                </div>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    {ev.date}
                  </div>
                  <div className="line-clamp-1">{ev.location}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">잔여 {ev.remaining}/{ev.spots}석</span>
                  <a
                    href="/community/events"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                    style={{ background: 'var(--brand-primary)' }}
                  >
                    신청
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-4 flex gap-1 border-b border-gray-200">
          <TabLink href={`/community?${new URLSearchParams({ tab: 'discussions', ...(activeSort !== 'recent' ? { sort: activeSort } : {}), ...(q ? { q } : {}) }).toString()}`} active={tab === 'discussions'}>
            토론 / 후기 ({filteredDiscussions.length})
          </TabLink>
          <TabLink href={`/community?${new URLSearchParams({ tab: 'questions', ...(q ? { q } : {}) }).toString()}`} active={tab === 'questions'}>
            전문가 Q&A ({filteredQuestions.length})
          </TabLink>
        </div>
        {tab === 'discussions' && (
          <div className="mb-4 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <a
                key={o.key}
                href={`/community?${new URLSearchParams({ tab: 'discussions', sort: o.key, ...(q ? { q } : {}) }).toString()}`}
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
        )}

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
                <Card className="overflow-hidden border-gray-200 transition-shadow hover:shadow-sm">
                  <div className="flex">
                    {d.coverImage && (
                      <div className="w-28 shrink-0 sm:w-36">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={d.coverImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="flex-1 p-5">
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
                  </div>
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
      {/* AI 도우미 */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-8">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-1 text-center text-base font-bold text-gray-900">커뮤니티 AI에게 물어보세요</h2>
            <p className="mb-4 text-center text-xs text-gray-500">창업 고민, 브랜드 비교, 상권 분석 등 궁금한 점을 질문해 보세요</p>
            <PageAiChat
              greeting="안녕하세요! 창업 커뮤니티에서 나누는 고민들, AI가 먼저 도와드릴게요. 어떤 점이 궁금하세요? 😊"
              placeholder="예) 치킨 vs 커피 브랜드, 어떤 게 수익이 더 좋을까요?"
              accentBg="bg-indigo-600"
              accentHoverBg="hover:bg-indigo-700"
              helpanyCompanyId="cmokx2zoe000o135jibr31y5p"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">가맹 커뮤니티 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">인기 토론·본사 공지·업종별 핫이슈를 격주로 보내드립니다.</p>
            <NewsletterForm />
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
