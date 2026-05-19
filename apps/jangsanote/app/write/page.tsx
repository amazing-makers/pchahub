import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('jangsanote', {
    title: '글쓰기',
    description: '업종방·지역방·자유게시판 중 하나를 골라 이야기를 나누세요. 익명으로도 작성 가능합니다.',
    path: '/write',
  }),
  robots: { index: false, follow: false },
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { PencilLine } from 'lucide-react'
import { WriteForm } from './write-form'

export default async function WritePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/write')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '회원'

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-2">
            <PencilLine className="h-5 w-5 text-[var(--brand-primary)]" />
            <h1 className="text-h3 font-bold text-gray-900">글쓰기</h1>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            업종방·지역방·자유게시판 중 하나를 골라 글을 작성합니다. 익명으로도 가능합니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-10">
        <WriteForm name={name} />
      </div>
    </main>
  )
}
