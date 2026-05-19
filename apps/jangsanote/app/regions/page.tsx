import type { Metadata } from 'next'
import { Card, CardContent } from '@amakers/ui'
import { buildItemListJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { formatNumber } from '@amakers/utils'
import { CHANNELS } from '@/lib/mock-data'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '지역',
  description: '장사노트 커뮤니티 지역 채널 — 시·도별 게시판.',
  path: '/regions',
})

export default function RegionsPage() {
  const regions = CHANNELS.filter((c) => c.type === 'region')

  const listJsonLd = buildItemListJsonLd({
    url: 'https://jangsanote.kr/regions',
    items: regions.map((c) => ({ name: c.label, url: `https://jangsanote.kr/regions/${c.key}` })),
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={listJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">지역</h1>
          <p className="mt-1 text-sm text-gray-500">
            시·도별 자영업·가맹점주 커뮤니티 {regions.length}개. 우리 지역 글만 모아 보세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {regions.map((c) => (
            <a key={c.key} href={`/regions/${c.key}`} className="group block">
              <Card className="h-full border-gray-200 transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <h2 className="text-base font-bold text-gray-900 group-hover:text-gray-700">
                    {c.label}
                  </h2>
                  {c.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{c.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <span>회원 {formatNumber(c.memberCount)}명</span>
                    <span>글 {formatNumber(c.postCount)}개</span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
