import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { BookOpen, Heart, MessageCircle, PlayCircle } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { CourseCard } from '@/components/course-card'
import { FEATURED_COURSES, FREE_COURSES } from '@/lib/mock-data'

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/mypage')

  const name = session.user?.name ?? session.user?.email?.split('@')[0] ?? '사용자'
  const enrolled = FEATURED_COURSES.slice(0, 2)
  const saved = FREE_COURSES.slice(0, 3)

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: 'var(--brand-primary)' }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-h3 font-bold text-gray-900">{name}</h1>
              <div className="mt-1 text-sm text-gray-500">{session.user?.email}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={BookOpen} label="수강 중" value={`${enrolled.length}강`} />
          <Stat icon={PlayCircle} label="완료한 강의" value="0강" />
          <Stat icon={Heart} label="찜한 강의" value={`${saved.length}강`} />
          <Stat icon={MessageCircle} label="멘토 상담" value="0건" />
        </div>

        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">수강 중인 강의</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolled.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-h4 font-semibold text-gray-900">찜한 강의</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5 text-sm">
            <div className="font-semibold text-amber-900">이 페이지는 mock 데이터입니다</div>
            <p className="mt-1 text-amber-800">
              Supabase 연결 후 실제 사용자별 수강 데이터로 교체됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen
  label: string
  value: string
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-gray-400" />
        <div className="mt-2 text-xs text-gray-500">{label}</div>
        <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )
}
