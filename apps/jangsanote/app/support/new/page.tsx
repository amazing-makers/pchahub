import type { Metadata } from 'next'
import { ArrowLeft, HandCoins } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildPageMetadata } from '@amakers/design-system'
import { SupportSubmitForm } from './support-submit-form'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '지원·이벤트 제보',
  description: '알고 있는 지원사업·보조금·이벤트 정보를 제보해 다른 점주들과 공유하세요.',
  path: '/support/new',
})

export default function SupportNewPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <a href="/support" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> 지원·이벤트
          </a>
          <h1 className="mt-3 inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
            <HandCoins className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
            지원·이벤트 제보
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            알고 있는 지원사업·보조금·공모·이벤트를 등록해 점주들과 공유하세요. 검수 후 공개됩니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl py-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <SupportSubmitForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
