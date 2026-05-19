import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = {
  ...buildPageMetadata('themyungdang', {
    title: '매물 등록',
    description: '매물 정보를 입력하시면 운영팀의 실사 후 영업일 2일 이내 검색에 노출됩니다. 검증 매물은 문의 전환율이 평균 3배 이상 높습니다.',
    path: '/post',
  }),
  robots: { index: false, follow: false },
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { PostForm } from './form'

export default async function PostPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/post')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '회원'
  const email = session.user?.email ?? ''

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매물 등록</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {name}님, 매물 정보를 입력하시면 운영팀의 실사 후 영업일 2일 이내 검색에 노출됩니다.
            본인 확인 매물에는 검증 뱃지가 표시되어 문의 전환율이 평균 3배 이상 높습니다.
          </p>
        </div>
      </section>
      <div className="container mx-auto py-8">
        <PostForm defaultName={name} defaultEmail={email} />
      </div>
    </main>
  )
}
