import type { Metadata } from 'next'
import { buildPageMetadata, buildServiceJsonLd, JsonLd } from '@amakers/design-system'

const contactJsonLd = buildServiceJsonLd({
  name: '오픈런 캠페인 의뢰',
  description: '그랜드 오픈·가맹 모집 캠페인을 의뢰하세요. 영업일 기준 24시간 이내 캠페인 기획안과 예상 견적을 보내드립니다.',
  url: 'https://openrun.amakers.co.kr/contact',
  provider: { name: '오픈런', url: 'https://openrun.amakers.co.kr' },
})

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '캠페인 의뢰',
  description: '그랜드 오픈·가맹 모집 캠페인을 의뢰하세요. 영업일 기준 24시간 이내 캠페인 기획안과 예상 견적을 보내드립니다.',
  path: '/contact',
})

import { ContactForm } from './form'

export default function ContactPage() {
  return (
    <main className="bg-gray-50">
      <JsonLd data={contactJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">캠페인 의뢰</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            아래 폼을 채워주시면 영업일 기준 24시간 이내 캠페인 기획안과 예상 견적을 보내드립니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <ContactForm />
      </div>
    </main>
  )
}
