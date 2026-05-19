'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, Search, User, TrendingUp } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof Search; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  prospect: {
    label: '예비 창업자',
    icon: Search,
    welcome: '창업 정보를 함께 모아가요',
    cta: '커뮤니티 둘러보기',
    ctaHref: '/',
    tips: [
      '업종방에서 관심 업종 창업 선배의 글을 읽어보세요',
      '지역방에서 같은 지역 예비 창업자와 소통하세요',
      '모임에 참가하면 현직 점주와 직접 네트워킹할 수 있어요',
    ],
  },
  franchisee: {
    label: '현직 점주',
    icon: User,
    welcome: '노하우를 나누고 동료를 만나보세요',
    cta: '업종방 바로가기',
    ctaHref: '/categories',
    tips: [
      '내 업종방에서 현직 점주와 정보를 공유하세요',
      '모임을 만들어 지역 네트워킹을 주도해 보세요',
      '상권 인텔 공유로 지역 점주 커뮤니티에 기여하세요',
    ],
  },
  industry: {
    label: '업계 종사자',
    icon: TrendingUp,
    welcome: '상권·트렌드 인텔을 공유하고 네트워크를 쌓아요',
    cta: '모임 탐색하기',
    ctaHref: '/meetings',
    tips: [
      '자유게시판에서 업계 이슈를 자유롭게 논의하세요',
      '모임 참가로 프랜차이즈 업계 네트워크를 넓히세요',
      '상권 분석 글을 공유하면 전문가로 인정받을 수 있어요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'prospect'
  const meta = ROLE_META[role] ?? ROLE_META.prospect!
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
