import type { Metadata } from 'next'
import { PencilLine } from 'lucide-react'
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
          <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
            <PencilLine className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
            내 제보 관리
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            내가 등록한 행사·레시피를 확인하고 삭제할 수 있습니다. 이 기기에 저장됩니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl py-8">
        <MySubmissions />
      </div>
    </main>
  )
}
