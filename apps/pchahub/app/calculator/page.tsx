import type { Metadata } from 'next'
import { buildPageMetadata, buildSoftwareApplicationJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '창업 수익 계산기',
  description: '브랜드·지역·면적·운영 조건을 입력하면 예상 월 매출·순이익·회수 기간을 시뮬레이션해 드립니다.',
  path: '/calculator',
})

import { CalculatorForm } from './form'

const calculatorJsonLd = buildSoftwareApplicationJsonLd({
  name: '프차허브 창업 수익 계산기',
  description: '브랜드·지역·면적·운영 조건을 입력하면 예상 월 매출·순이익·회수 기간을 시뮬레이션합니다.',
  url: 'https://pchahub.kr/calculator',
  applicationCategory: 'FinanceApplication',
  price: 'Free',
})

interface CalculatorPageProps {
  searchParams: { brand?: string }
}

export default function CalculatorPage({ searchParams }: CalculatorPageProps) {
  return (
    <main className="bg-gray-50">
      <JsonLd data={calculatorJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">수익 계산기</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            매장 조건과 운영 가정을 입력하면 예상 월매출, 비용, 영업이익, 회수 기간을 실시간으로 보여드립니다.
            브랜드를 선택하면 협회 등록 정보공개서 기반 기본값을 자동으로 채워줍니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <CalculatorForm initialBrandId={searchParams.brand} />
      </div>
    </main>
  )
}
