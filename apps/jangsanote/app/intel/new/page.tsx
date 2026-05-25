import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'
import { IntelSubmitForm } from './intel-submit-form'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '상권 리포트 작성',
  description: '직접 발로 뛰며 파악한 상권 정보를 공유해 주세요. 전국 점주들에게 도움이 됩니다.',
  path: '/intel/new',
})

export default function NewIntelPage() {
  return (
    <main>
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">상권 리포트 작성</h1>
          <p className="mt-1 text-sm text-gray-500">
            직접 발로 뛰며 파악한 상권 정보를 공유해 주세요. 다른 점주들에게 큰 도움이 됩니다.
          </p>
        </div>
      </div>
      <div className="container mx-auto py-section max-w-2xl">
        <IntelSubmitForm />
      </div>
    </main>
  )
}
