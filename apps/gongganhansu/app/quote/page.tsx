import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, buildServiceJsonLd, JsonLd } from '@amakers/design-system'

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '공간한수', url: 'https://gongganhansu.amakers.co.kr' },
    { name: '무료 견적 신청', url: 'https://gongganhansu.amakers.co.kr/quote' },
  ],
})

const quoteJsonLd = buildServiceJsonLd({
  name: '공간한수 매장 인테리어 무료 견적',
  description: '매장 카테고리·면적·지역·예산을 입력하면 적합한 시공사 3~5곳의 견적을 영업일 기준 48시간 내에 받아보실 수 있습니다.',
  url: 'https://gongganhansu.amakers.co.kr/quote',
  provider: { name: '공간한수', url: 'https://gongganhansu.amakers.co.kr' },
})

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
      <JsonLd data={quoteJsonLd} />
      <JsonLd data={breadcrumbs} />
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
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
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
