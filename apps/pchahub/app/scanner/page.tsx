import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, buildSoftwareApplicationJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '창업 도구 — 스캐너 & 수익 계산기',
  description: '7가지 질문에 답하면 자본·운영 조건에 맞는 프랜차이즈 브랜드를 자동으로 추천. 수익 계산기로 예상 수익도 바로 확인하세요.',
  path: '/scanner',
})

import { ScannerWizard } from './wizard'
import { CalculatorForm } from '../calculator/form'

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '창업 도구', url: 'https://pchahub.amakers.co.kr/scanner' },
  ],
})

const scannerJsonLd = buildSoftwareApplicationJsonLd({
  name: '프차허브 창업 도구',
  description: '창업 스캐너 & 수익 계산기. 7가지 질문으로 맞춤 브랜드 추천, 예상 수익 시뮬레이션.',
  url: 'https://pchahub.amakers.co.kr/scanner',
  applicationCategory: 'BusinessApplication',
  price: 'Free',
})

interface ScannerPageProps {
  searchParams: { tab?: string; brand?: string }
}

export default function ScannerPage({ searchParams }: ScannerPageProps) {
  const tab = searchParams.tab ?? 'scanner'

  return (
    <main className="bg-gray-50">
      <JsonLd data={scannerJsonLd} />
      <JsonLd data={breadcrumbs} />

      {/* 헤더 */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">창업 도구</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            창업 스캐너로 내 조건에 맞는 브랜드를 찾고, 수익 계산기로 예상 수익을 미리 계산해 보세요.
          </p>

          {/* 탭 네비게이션 */}
          <div className="mt-5 flex gap-1">
            <a
              href="/scanner"
              className={
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
                (tab === 'scanner'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100')
              }
            >
              ✨ 브랜드 스캐너
            </a>
            <a
              href="/scanner?tab=calculator"
              className={
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ' +
                (tab === 'calculator'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100')
              }
            >
              🧮 수익 계산기
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {tab === 'calculator' ? (
          <CalculatorForm initialBrandId={searchParams.brand} />
        ) : (
          <ScannerWizard />
        )}
      </div>
    </main>
  )
}
