import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ChecklistClient } from './checklist-client'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '그랜드 오픈 완전 체크리스트 — D-30부터 D+7까지',
  description: '프랜차이즈 매장 오픈 전 30일부터 오픈 후 7일까지 48개 필수 항목. 놓치면 치명적인 항목을 단계별로 체크하세요.',
  path: '/checklist',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '오픈런', url: 'https://openrun.amakers.co.kr' },
    { name: '그랜드 오픈 체크리스트', url: 'https://openrun.amakers.co.kr/checklist' },
  ],
})

export default function ChecklistPage() {
  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white py-section">
        <div className="container mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            무료 리소스 · Open Run Checklist
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">그랜드 오픈 완전 체크리스트</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            D-30부터 D+7까지 6단계 48개 항목. 오픈 초보도 빠짐없이 준비할 수 있도록
            실전 경험을 담았습니다. 완료한 항목을 체크하면 진행률이 저장됩니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
            {[
              '공간·계약 마무리',
              '직원 채용·교육',
              'SNS·마케팅 세팅',
              '최종 점검·리허설',
              '오픈 당일',
              '오픈 후 1주',
            ].map((phase) => (
              <span
                key={phase}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1"
              >
                {phase}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-section">
        <ChecklistClient />
      </div>
    </main>
  )
}
