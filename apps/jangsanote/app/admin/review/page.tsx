import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { Lock, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildPageMetadata } from '@amakers/design-system'
import { ReviewQueue } from '@/components/review-queue'

export const metadata: Metadata = buildPageMetadata('jangsanote', {
  title: '제보 검수 (관리자)',
  description: '점주가 제보한 행사·레시피를 검수하여 승인·반려합니다.',
  path: '/admin/review',
})

const ADMIN_ROLES = ['admin', 'moderator']

export default async function AdminReviewPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/admin/review')

  const role = (session.user as { role?: string })?.role
  const isAdmin = role ? ADMIN_ROLES.includes(role) : false

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
        {isAdmin ? (
          <ReviewQueue />
        ) : (
          <Card className="border-gray-200">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <Lock className="h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-700">관리자 전용 페이지입니다</p>
              <p className="mt-1 text-sm text-gray-500">
                제보 검수는 운영 관리자(admin·moderator)만 접근할 수 있습니다.
                <br />
                현재 역할: <span className="font-medium text-gray-700">{role ?? '없음'}</span>
              </p>
              <a
                href="/auth/signin?callbackUrl=/admin/review"
                className="mt-5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                관리자 계정으로 로그인
              </a>
              <p className="mt-3 text-xs text-gray-400">※ 개발용 로그인에서 역할을 ‘admin’으로 입력하면 접근됩니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
