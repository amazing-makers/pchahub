import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '무료 견적 신청',
  description: '매장 카테고리·면적·지역·예산을 입력하면 적합한 시공사 3~5곳의 견적을 영업일 기준 48시간 내에 받아보실 수 있습니다.',
  path: '/quote',
})

import { QuoteForm } from './form'

interface QuotePageProps {
  searchParams: { contractor?: string }
}

export default function QuotePage({ searchParams }: QuotePageProps) {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">무료 견적 요청</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            매장 정보를 입력하시면 적합한 시공사 3 ~ 5곳의 견적을 영업일 48시간 이내 받아보실 수
            있습니다. 비교 후 부담 없이 선택하세요.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        {/* Step indicator — visual only, form is rendered by QuoteForm */}
        <div className="mb-8 flex items-center justify-between">
          {['공간 정보', '예산·일정', '연락처 확인'].map((step, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <span className="text-xs text-gray-600">{step}</span>
              </div>
              {i < 2 && <div className="mx-2 h-px flex-1 bg-gray-200" />}
            </div>
          ))}
        </div>
        <QuoteForm preselectedContractor={searchParams.contractor} />
      </div>
    </main>
  )
}
