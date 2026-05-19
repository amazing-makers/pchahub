'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, BookOpen, GraduationCap, Building2 } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof BookOpen; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  student: {
    label: '수강생',
    icon: BookOpen,
    welcome: '배움으로 창업 성공률을 높여요',
    cta: '강좌 탐색하기',
    ctaHref: '/courses',
    tips: [
      '관심 분야 필터로 맞춤 강좌를 찾아보세요',
      '자격증 과정으로 창업 신뢰도를 높이세요',
      '수강 완료 후 더명당·pchahub와 연계해 실전에 활용하세요',
    ],
  },
  instructor: {
    label: '강사·전문가',
    icon: GraduationCap,
    welcome: '강좌를 개설하고 수강생을 만나보세요',
    cta: '강좌 등록하기',
    ctaHref: '/courses',
    tips: [
      '강좌 소개와 커리큘럼을 상세히 작성할수록 수강 신청이 늘어요',
      '자격증 연계 강좌는 우선 추천 대상이에요',
      '강사 프로필에 경력과 저서를 상세히 기재해 신뢰를 높이세요',
    ],
  },
  staff: {
    label: '본사·운영자',
    icon: Building2,
    welcome: '교육 프로그램을 관리하고 점주를 성장시켜요',
    cta: '강좌 목록 보기',
    ctaHref: '/courses',
    tips: [
      '브랜드 전용 강좌를 개설해 점주 교육을 체계화하세요',
      '수강 이력을 트래킹해 점주별 교육 현황을 파악하세요',
      '더매뉴얼 기업 교육 파트너십을 문의해 보세요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'student'
  const meta = ROLE_META[role] ?? ROLE_META.student!
  const Icon = meta.icon

  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-[calc(100vh-64px-200px)] items-center justify-center py-12">
        <div className="w-full max-w-lg text-center">
          {/* 성공 배지 */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>

          <h1 className="mt-6 text-h2 font-bold text-gray-900">가입 완료!</h1>
          <p className="mt-2 text-gray-500">
            <span
              className="inline-block rounded-full px-3 py-1 text-sm font-semibold"
              style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)' }}
            >
              {meta.label}
            </span>
            으로 등록되었습니다
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{meta.welcome}</p>

          {/* 추천 시작 팁 */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Icon className="h-5 w-5 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">이렇게 시작해 보세요</h2>
            </div>
            <ol className="space-y-3">
              {meta.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: 'var(--brand-primary)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA 버튼 */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <a href={meta.ctaHref}>
              <Button size="lg" className="gap-2">
                {meta.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="/mypage/settings" className="text-sm text-gray-500 hover:text-gray-900">
              프로필 설정 먼저 하기
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function WelcomePage() {
  return (
    <Suspense>
      <WelcomeContent />
    </Suspense>
  )
}
