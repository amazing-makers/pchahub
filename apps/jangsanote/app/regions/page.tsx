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
    url: 'https://jangsanote.amakers.co.kr/regions',
    items: regions.map((c) => ({ name: c.label, url: `https://jangsanote.amakers.co.kr/regions/${c.key}` })),
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

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">지역 점주 소식을 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">지역별 상권 동향·모임 소식·지역 점주 인사이트를 격주로 보내드립니다.</p>
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
