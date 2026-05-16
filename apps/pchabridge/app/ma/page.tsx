import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: 'M&A 매물',
  description: '프랜차이즈 인수·합병 매물 목록. 브랜드·지역별로 찾아보세요.',
  path: '/ma',
})

import { MACard } from '@/components/ma-card'
import { MA_LISTINGS } from '@/lib/mock-data'

export default function MAPage() {
  const open = MA_LISTINGS.filter((m) => m.status === 'open')
  const underNeg = MA_LISTINGS.filter((m) => m.status === 'under-negotiation')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">M&A 매물</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            매각 진행 중인 본사 매물. 상세 자료는 NDA 후 공개됩니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">공개 매물</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {open.map((m) => (
              <MACard key={m.id} listing={m} />
            ))}
          </div>
        </section>

        {underNeg.length > 0 && (
          <section>
            <h2 className="mb-4 text-h4 font-semibold text-gray-900">협상 중인 매물</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {underNeg.map((m) => (
                <MACard key={m.id} listing={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
