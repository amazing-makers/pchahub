import type { Metadata } from 'next'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildPageMetadata } from '@amakers/design-system'
import { FestivalSubmitForm } from './festival-submit-form'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '행사·박람회 제보',
  description: '우리 동네 축제·박람회·플리마켓 정보를 직접 제보해 다른 점주들과 공유하세요.',
  path: '/festivals/new',
})

export default function FestivalNewPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          <a href="/festivals" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> 축제·박람회
          </a>
          <h1 className="mt-3 inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
            <CalendarDays className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
            행사·박람회 제보
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            알고 있는 축제·박람회·플리마켓을 등록해 점주들과 공유하세요. 등록하면 ‘점주 제보’로 표시됩니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl py-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <FestivalSubmitForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
