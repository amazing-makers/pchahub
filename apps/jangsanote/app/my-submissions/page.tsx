import type { Metadata } from 'next'
import { PencilLine, ShieldCheck } from 'lucide-react'
import { buildPageMetadata } from '@amakers/design-system'
import { MySubmissions } from '@/components/my-submissions'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '내 제보 관리',
  description: '내가 등록한 행사·박람회와 레시피를 확인하고 관리하세요.',
  path: '/my-submissions',
})

export default function MySubmissionsPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
                <PencilLine className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                내 제보 관리
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                내가 등록한 행사·레시피를 확인하고 삭제할 수 있습니다. 이 기기에 저장됩니다.
              </p>
            </div>
            <a
              href="/admin/review"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ShieldCheck className="h-4 w-4" />
              검수 화면
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl py-8">
        <MySubmissions />
      </div>
    </main>
  )
}
