import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('gongganhansu', {
    title: '시공사 등록',
    description: '가맹점 인테리어 시공사로 등록하시면 amakers 9개 사이트의 점주·본사 견적 요청을 받을 수 있습니다. 등록 후 영업일 3일 이내 활성화됩니다.',
    path: '/contractors/new',
  }),
  robots: { index: false, follow: false },
}

import { ContractorForm } from './form'

export default function NewContractorPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/contractors"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            ← 시공사 목록으로
          </a>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">시공사 등록</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            가맹점 인테리어 시공사로 등록하시면 amakers 9개 사이트의 점주·본사 견적 요청을 받을 수 있습니다.
            등록 후 운영팀의 포트폴리오·자격 검수를 거쳐 영업일 3일 이내 활성화됩니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <ContractorForm />
      </div>
    </main>
  )
}
