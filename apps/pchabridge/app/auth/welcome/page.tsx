'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, TrendingUp, Rocket, Users2 } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof TrendingUp; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  investor: {
    label: '투자자·VC',
    icon: TrendingUp,
    welcome: '프랜차이즈 딜을 탐색해 보세요',
    cta: '투자 기회 보기',
    ctaHref: '/investments',
    tips: [
      '섹터·단계 필터로 관심 딜을 빠르게 좁히세요',
      'IR 자료를 열람하고 관심 표명을 남길 수 있어요',
      '뉴스레터를 구독하면 새 딜 알림을 받아보세요',
    ],
  },
  founder: {
    label: '창업가·대표',
    icon: Rocket,
    welcome: 'IR 자료를 등록하고 투자자를 만나보세요',
    cta: 'IR 등록하기',
    ctaHref: '/ma',
    tips: [
      'IR 자료를 올리면 관심 투자자가 직접 연락해요',
      'M&A 섹션에서 전략적 파트너를 찾을 수도 있어요',
      '아마커스 어드바이저의 IR 컨설팅을 신청해 보세요',
    ],
  },
  advisor: {
    label: '어드바이저·중개인',
    icon: Users2,
    welcome: '매칭 네트워크에 참여해 보세요',
    cta: '딜 탐색하기',
    ctaHref: '/investments',
    tips: [
      '어드바이저 프로필을 등록하면 매칭 요청을 받아요',
      '투자자와 창업가 양쪽과 협력해 수수료 수익을 창출하세요',
      '피차브릿지 파트너십 문의를 상담 폼으로 제출해 주세요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'investor'
  const meta = ROLE_META[role] ?? ROLE_META.investor!
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
