import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, buildSoftwareApplicationJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '창업 스캐너',
  description: '7가지 질문에 답하면 자본·운영 조건에 맞는 프랜차이즈 브랜드를 자동으로 추천해 드립니다. 협회 정보공개서 데이터 기반.',
  path: '/scanner',
})

import { ScannerWizard } from './wizard'

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '창업 스캐너', url: 'https://pchahub.amakers.co.kr/scanner' },
  ],
})

const scannerJsonLd = buildSoftwareApplicationJsonLd({
  name: '프차허브 창업 스캐너',
  description: '7가지 질문에 답하면 자본·운영 조건에 맞는 프랜차이즈 브랜드 Top 3를 추천해 드립니다. 협회 정보공개서 데이터 기반.',
  url: 'https://pchahub.amakers.co.kr/scanner',
  applicationCategory: 'BusinessApplication',
  price: 'Free',
})

export default function ScannerPage() {
  return (
    <main className="bg-gray-50">
      <JsonLd data={scannerJsonLd} />
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">창업 스캐너</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            7개 질문에 답하면 자본·업종·운영 조건에 가장 잘 맞는 가맹 브랜드 Top 3를 추천해 드립니다.
            추천 이유와 점수까지 함께 보여드립니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <ScannerWizard />
      </div>
    </main>
  )
}
