'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, Star, ShoppingBag, Award } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof Star; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  visitor: {
    label: '방문객·리뷰어',
    icon: Star,
    welcome: '매장 발견과 리뷰 여정을 시작해요',
    cta: '매장 탐색하기',
    ctaHref: '/stores',
    tips: [
      '별점과 리뷰로 좋은 매장을 발굴해 보세요',
      '실시간 랭킹에서 지역 최고 매장을 확인하세요',
      '어워드 투표에 참여해 주목할 브랜드를 응원하세요',
    ],
  },
  owner: {
    label: '매장 사장님',
    icon: ShoppingBag,
    welcome: '매장을 등록하고 어워드에 참가하세요',
    cta: '매장 등록하기',
    ctaHref: '/stores/new',
    tips: [
      '매장 프로필을 완성하면 검색 노출이 높아져요',
      '리뷰를 빠르게 응대하면 신뢰도가 올라가요',
      '어워드 수상 시 플랫폼 상단 노출 혜택이 있어요',
    ],
  },
  industry: {
    label: '업계 관계자',
    icon: Award,
    welcome: '어워드 심사와 파트너 활동을 시작하세요',
    cta: '어워드 보기',
    ctaHref: '/awards',
    tips: [
      '어워드 심사 기준과 일정을 확인해 보세요',
      '파트너 등록 시 심사 자료를 우선 수령해요',
      '랭킹 데이터를 활용한 시장 인사이트를 탐색하세요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'visitor'
  const meta = ROLE_META[role] ?? ROLE_META.visitor!
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
