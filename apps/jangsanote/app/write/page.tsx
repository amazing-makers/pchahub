import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { Bell, PencilLine } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

export default async function WritePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/write')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '회원'

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">글쓰기</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            업종방·지역방·자유게시판 중 하나를 골라 글을 작성합니다. 익명으로도 가능합니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-10">
        <Card className="mx-auto max-w-2xl border-gray-200 shadow-sm">
          <CardContent className="space-y-5 p-8">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: 'var(--brand-primary)' }}
              >
                <PencilLine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-h4 font-semibold text-gray-900">
                  {name}님, 환영합니다
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">글쓰기 폼은 다음 phase에서 활성화됩니다.</p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-700">
              <p>
                현재는 Phase 2.2 인증 흐름과 mock 데이터 확인 단계입니다. 실제 글쓰기 기능 (제목, 본문 에디터, 채널 선택, 태그, 익명 토글, 이미지 업로드)은 Supabase 연결 후 구현됩니다.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <Bell className="h-4 w-4" />
                글쓰기에서 지원할 기능
              </div>
              <ul className="mt-2 space-y-1 text-amber-800">
                <li>· 채널 선택 (업종방·지역방·자유)</li>
                <li>· 카테고리 (운영 후기·질문·팁·시장 동향·토론)</li>
                <li>· 익명 모드 (실명 가리고 점주·연차만 표시)</li>
                <li>· 마크다운 + 이미지 첨부</li>
                <li>· 태그 (#본사갈등, #저자본, #회계 등)</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              <a href="/">
                <Button variant="outline" size="lg">피드로 돌아가기</Button>
              </a>
              <a href="/mypage">
                <Button size="lg">마이페이지로</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
