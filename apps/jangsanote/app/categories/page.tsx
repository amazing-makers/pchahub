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
    </main>
  )
}
