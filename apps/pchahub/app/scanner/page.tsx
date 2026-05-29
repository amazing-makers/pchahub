import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, buildSoftwareApplicationJsonLd, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '창업 스캐너',
  description: '7가지 질문에 답하면 자본·운영 조건에 맞는 프랜차이즈 브랜드를 자동으로 추천해 드립니다. 협회 정보공개서 데이터 기반.',
  path: '/scanner',
})

import { ScannerWizard } from './wizard'
import { PageAiChat } from '@amakers/ui'

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

      {/* AI 도우미 */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-8">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-1 text-center text-base font-bold text-gray-900">스캐너 결과가 궁금하다면 AI에게 물어보세요</h2>
            <p className="mb-4 text-center text-xs text-gray-500">추천 브랜드 비교, 예상 수익, 계약 주의사항 등 자세히 안내해 드려요</p>
            <PageAiChat
              greeting="창업 스캐너로 브랜드를 찾고 계신가요? 결과 해석이나 추가 비교가 필요하면 질문해 주세요 😊"
              placeholder="예) 스캐너에서 나온 브랜드 A와 B 중 어떤 게 더 나을까요?"
              accentBg="bg-indigo-600"
              accentHoverBg="hover:bg-indigo-700"
              helpanyCompanyId="cmokx2zoe000o135jibr31y5p"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
