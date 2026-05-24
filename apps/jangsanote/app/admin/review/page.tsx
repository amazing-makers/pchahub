import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { buildPageMetadata } from '@amakers/design-system'
import { ReviewQueue } from '@/components/review-queue'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '제보 검수 (관리자)',
  description: '점주가 제보한 행사·레시피를 검수하여 승인·반려합니다.',
  path: '/admin/review',
})

export default function AdminReviewPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="inline-flex items-center gap-2 text-h3 font-bold text-gray-900">
            <ShieldCheck className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
            제보 검수
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            점주가 제보한 행사·레시피를 검수합니다. 승인하면 공개 목록에 노출됩니다.
            <span className="ml-1 text-gray-400">(데모: 검수 상태는 이 기기에 저장됩니다)</span>
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl py-8">
        <ReviewQueue />
      </div>
    </main>
  )
}
