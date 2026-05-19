import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('pchahub', {
    title: '커뮤니티 글쓰기',
    description: '프랜차이즈 창업 경험, 질문, 팁을 커뮤니티에 공유하세요.',
    path: '/community/write',
  }),
  robots: { index: false, follow: false },
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { CommunityWriteForm } from './form'

export default async function CommunityWritePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/community/write')

  const name = (session.user as { name?: string } | null)?.name ?? '익명'

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h2 font-bold text-gray-900">커뮤니티 글쓰기</h1>
          <p className="mt-1 text-sm text-gray-500">
            프랜차이즈 창업 경험, 질문, 팁을 커뮤니티에 공유하세요.
          </p>
        </div>
      </section>
      <div className="container mx-auto max-w-2xl py-8">
        <CommunityWriteForm authorName={name} />
      </div>
    </main>
  )
}
