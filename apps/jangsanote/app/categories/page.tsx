import type { Metadata } from 'next'
import { ArrowRight, Flame } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { CHANNELS } from '@/lib/mock-data'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '카테고리',
  description: '장사노트 커뮤니티 카테고리 — 업종·주제별 게시판.',
  path: '/categories',
})

const CATEGORY_EMOJI: Record<string, string> = {
  chicken:     '🍗',
  cafe:        '☕',
  korean:      '🍲',
  japanese:    '🍣',
  snack:       '🥙',
  dessert:     '🧁',
  beverage:    '🧋',
  bar:         '🍺',
  convenience: '🏪',
  education:   '📚',
  laundry:     '🫧',
  pcbang:      '🖥️',
  study:       '📖',
  life:        '🏠',
  leisure:     '🎮',
}

/** 활성 채널 — 글 수 기준 상위 3개 */
function isTrending(postCount: number, allCounts: number[]) {
  const sorted = [...allCounts].sort((a, b) => b - a)
  return postCount >= (sorted[2] ?? 0)
}

export default function CategoriesPage() {
  const categories = CHANNELS.filter((c) => c.type === 'category')
  const allPostCounts = categories.map((c) => c.postCount)
  const totalMembers = categories.reduce((s, c) => s + c.memberCount, 0)
  const totalPosts = categories.reduce((s, c) => s + c.postCount, 0)
  const hotCount = allPostCounts.filter((n) => {
    const sorted = [...allPostCounts].sort((a, b) => b - a)
    return n >= (sorted[2] ?? 0)
  }).length

  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.amakers.co.kr/categories',
    items: categories.map((c) => ({ name: c.label, url: `https://jangsanote.amakers.co.kr/categories/${c.key}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">카테고리</h1>
          <p className="mt-1 text-sm text-gray-500">
            업종·주제별 게시판 {categories.length}개. 관심 분야 글만 모아 보세요.
          </p>
        </div>
      </section>

      {/* 통계 스트립 */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          {[
            { value: `${categories.length}개`, label: '업종 채널' },
            { value: formatNumber(totalMembers), label: '전체 회원' },
            { value: `${formatNumber(totalPosts)}개`, label: '전체 게시글' },
            { value: `${hotCount}개`, label: 'HOT 채널' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-4">
              <span className="text-xl font-black tracking-tight text-gray-900">{value}</span>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const emoji = CATEGORY_EMOJI[c.key] ?? '💬'
            const trending = isTrending(c.postCount, allPostCounts)
            return (
              <a key={c.key} href={`/categories/${c.key}`} className="group block">
                <Card className="h-full border-gray-200 transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden>{emoji}</span>
                        <div>
                          <h2 className="text-base font-bold text-gray-900 group-hover:text-gray-700">
                            {c.label}
                          </h2>
                          {c.description && (
                            <p className="mt-0.5 text-xs text-gray-500">{c.description}</p>
                          )}
                        </div>
                      </div>
                      {trending && (
                        <Badge variant="error" className="shrink-0 gap-0.5 text-xs">
                          <Flame className="h-2.5 w-2.5" />
                          HOT
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span>회원 {formatNumber(c.memberCount)}명</span>
                        <span>글 {formatNumber(c.postCount)}개</span>
                      </div>
                      <a
                        href={`https://pchahub.amakers.co.kr/categories/${c.key}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                      >
                        브랜드 <ArrowRight className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
      </div>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">업종별 점주 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">카페·치킨·분식 등 업종별 인기 게시글과 운영 팁을 격주로 보내드립니다.</p>
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
