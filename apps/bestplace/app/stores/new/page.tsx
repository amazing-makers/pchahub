import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('bestplace', {
    title: '매장 등록',
    description: '운영 중인 가맹 매장을 등록하면 amakers 어워드 후보로 자동 등록되고 검증 매장 뱃지가 발급됩니다.',
    path: '/stores/new',
  }),
  robots: { index: false, follow: false },
}

import { StoreForm } from './form'

export default function NewStorePage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/stores"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            ← 매장 목록으로
          </a>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">매장 등록</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            본인이 운영 중인 가맹 매장을 등록하시면 amakers 어워드 후보로 자동 등록되며, 검증 매장
            뱃지가 발급됩니다. 매장 사진 5장 이상 + 본사 인증서가 필요합니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <StoreForm />
      </div>
    </main>
  )
}
