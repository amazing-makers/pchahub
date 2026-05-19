import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('jangsanote', {
    title: '모임 만들기',
    description: '자영업자·가맹점주와 함께할 모임을 만들어보세요.',
    path: '/meetings/new',
  }),
  robots: { index: false, follow: false },
}

import { Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { MeetingForm } from './meeting-form'

export default function NewMeetingPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a href="/meetings" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-3.5 w-3.5" />
            모임 목록
          </a>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">모임 만들기</h1>
          <p className="mt-1 text-sm text-gray-500">
            자영업자·가맹점주와 함께할 모임을 만들어보세요.
          </p>
        </div>
      </section>
      <div className="container mx-auto max-w-xl py-10">
        <Suspense>
          <MeetingForm />
        </Suspense>
      </div>
    </main>
  )
}
