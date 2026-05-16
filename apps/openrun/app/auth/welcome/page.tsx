'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, ShoppingBag, Building2, Users2 } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof ShoppingBag; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  franchisee: {
    label: '점주',
    icon: ShoppingBag,
    welcome: '개점·판촉 캠페인을 시작해보세요',
    cta: '서비스 보기',
    ctaHref: '/services',
    tips: [
      '개점 캠페인 서비스로 오픈 초기 고객을 빠르게 모아보세요',
      'SNS·배달앱 연동 판촉 캠페인을 원스톱으로 의뢰하세요',
      '캠페인 리포트로 효과를 실시간으로 확인하세요',
    ],
  },
  hq: {
    label: '본사·가맹사업부',
    icon: Building2,
    welcome: '브랜드 캠페인을 함께 기획해요',
    cta: '서비스 알아보기',
    ctaHref: '/services',
    tips: [
      '브랜드 통합 캠페인으로 가맹점 전체 매출을 끌어올리세요',
      '점주별 맞춤 캠페인 패키지를 제공할 수 있어요',
      '포트폴리오에서 다른 브랜드 캠페인 사례를 참고하세요',
    ],
  },
  partner: {
    label: '파트너사·대행사',
    icon: Users2,
    welcome: '협력 캠페인 제안을 남겨주세요',
    cta: '상담 신청하기',
    ctaHref: '/contact',
    tips: [
      '공동 캠페인 기획서를 상담 폼으로 제출해 주세요',
      '포트폴리오로 대행 역량을 보여주세요',
      '오픈런 파트너 등록 시 우선 협력 대상이 돼요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'franchisee'
  const meta = ROLE_META[role] ?? ROLE_META.franchisee
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
