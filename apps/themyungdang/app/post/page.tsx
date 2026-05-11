import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { Bell, PencilLine } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

export default async function PostPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/post')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '회원'

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">매물 등록</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            본인 확인 매물로 등록하면 검색 결과에서 검증 뱃지가 함께 표시됩니다.
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
                <p className="mt-0.5 text-sm text-gray-500">
                  현재 매물 등록 폼은 준비 중입니다.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-700">
              <p>
                Phase 2.2 인증 흐름이 완성되었고, 본인 확인 + 매물 정보 + 실사 보고서 업로드를
                포함한 등록 폼은 다음 phase에서 구현됩니다. 그 전까지는 amakers 운영팀(
                <a href="mailto:help@amakers.co.kr" className="underline">
                  help@amakers.co.kr
                </a>
                )로 매물 정보를 보내주시면 직접 등록 도와드립니다.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <Bell className="h-4 w-4" />
                등록 시 준비할 자료
              </div>
              <ul className="mt-2 space-y-1 text-amber-800">
                <li>· 임대차계약서 또는 매매계약서 사본</li>
                <li>· 매물 사진 5장 이상 (외관·내부·주방·화장실·주변)</li>
                <li>· 양도 매물의 경우 최근 3개월 매출 자료 (선택)</li>
                <li>· 상권 또는 입지 특성 설명</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              <a href="/listings">
                <Button variant="outline" size="lg">
                  매물 둘러보기
                </Button>
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
