import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { MENTORS } from '@/lib/mock-data'
import { BookClient } from './book-client'

export function generateStaticParams() {
  return MENTORS.map((m) => ({ id: m.id }))
}

interface BookPageProps {
  params: { id: string }
}

export function generateMetadata({ params }: BookPageProps): Metadata {
  const mentor = MENTORS.find((m) => m.id === params.id)
  if (!mentor) return {}
  return buildPageMetadata('themanual', {
    title: `${mentor.name} 멘토 예약`,
    description: `${mentor.role} 전문 ${mentor.name} 멘토와 1:1 화상 상담을 예약하세요.`,
    path: `/mentors/${mentor.id}/book`,
  })
}

export default async function MentorBookPage({ params }: BookPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect(`/auth/signin?callbackUrl=/mentors/${params.id}/book`)

  const mentor = MENTORS.find((m) => m.id === params.id)
  if (!mentor) notFound()

  const breadcrumbs = buildBreadcrumbsJsonLd({
    items: [
      { name: '멘토', url: 'https://themanual.amakers.co.kr/mentors' },
      { name: mentor.name, url: `https://themanual.amakers.co.kr/mentors/${mentor.id}` },
      { name: '예약', url: `https://themanual.amakers.co.kr/mentors/${mentor.id}/book` },
    ],
  })

  return (
    <main className="bg-gray-50">
      <JsonLd data={breadcrumbs} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-6">
          {/* 브레드크럼 */}
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <a href="/mentors" className="hover:text-gray-900">멘토</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href={`/mentors/${mentor.id}`} className="hover:text-gray-900">{mentor.name}</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700">예약</span>
          </nav>
          <h1 className="mt-3 text-h3 font-bold text-gray-900">
            {mentor.name} 멘토 예약
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            날짜·시간을 선택하고 상담 내용을 입력하면 예약이 완료됩니다.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <BookClient
          mentorId={mentor.id}
          mentorName={mentor.name}
          mentorRole={mentor.role}
          hourlyRate={mentor.hourlyRate}
        />
      </div>
    </main>
  )
}
