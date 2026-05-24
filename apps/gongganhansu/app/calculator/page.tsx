import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { CalculatorForm } from './calculator-form'

export const metadata: Metadata = buildPageMetadata('gongganhansu', {
  title: '시공 단가 계산기',
  description: '업종·면적·시공 등급을 선택하면 F&B 매장 인테리어 예상 비용과 항목별 내역을 즉시 확인할 수 있습니다.',
  path: '/calculator',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '공간의한수', url: 'https://gongganhansu.amakers.co.kr' },
    { name: '단가 계산기', url: 'https://gongganhansu.amakers.co.kr/calculator' },
  ],
})

export default function CalculatorPage() {
  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <div className="border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            시공 단가 계산기
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">
            내 매장, 얼마나 들까요?
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-500">
            업종·면적·시공 등급을 선택하면 예상 비용과 항목별 내역을 즉시 확인할 수 있습니다.
            실제 견적은 전문 시공사에게 무료로 요청해 보세요.
          </p>
        </div>
      </div>
      <div className="container mx-auto py-section">
        <CalculatorForm />
      </div>
    </main>
  )
}
