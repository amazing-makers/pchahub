import type { Metadata } from 'next'
import { buildPageMetadata, buildServiceJsonLd, JsonLd } from '@amakers/design-system'

const inquiryJsonLd = buildServiceJsonLd({
  name: '프차허브 가맹 상담 신청',
  description: '관심 브랜드의 가맹 상담을 신청하세요. 영업일 1일 이내 담당자가 연락드립니다.',
  url: 'https://pchahub.amakers.co.kr/inquiry',
  provider: { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
})

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '가맹 상담 신청',
  description: '관심 브랜드의 가맹 상담을 신청하세요. 영업일 1일 이내 담당자가 연락드립니다.',
  path: '/inquiry',
})

import { Suspense } from 'react'
import { InquiryPageContent } from './inquiry-form'

export default function InquiryPage() {
  return (
    <main className="bg-gray-50">
      <JsonLd data={inquiryJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">가맹 상담 신청</h1>
          <p className="mt-1 text-sm text-gray-500">
            정보를 남겨주시면 영업일 기준 24시간 이내에 연락드립니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto max-w-xl py-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
          <InquiryPageContent />
        </Suspense>
      </div>
    </main>
  )
}
