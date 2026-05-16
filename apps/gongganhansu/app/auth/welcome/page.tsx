'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, Search, Hammer, Building2 } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof Search; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  tenant: {
    label: '임차인 (창업 준비)',
    icon: Search,
    welcome: '꿈의 공간을 찾아드릴게요',
    cta: '시공 포트폴리오 보기',
    ctaHref: '/portfolio',
    tips: [
      '포트폴리오에서 업종별 시공 사례를 먼저 탐색하세요',
      '견적 요청 시 지역·예산을 상세히 입력할수록 정확한 안내를 받아요',
      '더명당에서 매물을 찾은 후 공간한수에서 시공을 의뢰하세요',
    ],
  },
  contractor: {
    label: '시공·인테리어업체',
    icon: Hammer,
    welcome: '포트폴리오로 신규 수주를 늘려보세요',
    cta: '포트폴리오 등록하기',
    ctaHref: '/contractors',
    tips: [
      '업체 프로필과 포트폴리오를 상세히 작성하면 노출이 높아져요',
      '업종별 특화 시공 사례를 추가하면 관련 의뢰가 늘어요',
      '인사이트 리포트를 구독해 상권 트렌드를 파악하세요',
    ],
  },
  landlord: {
    label: '건물주·임대인',
    icon: Building2,
    welcome: '공실 정보를 등록하고 임차인을 만나세요',
    cta: '상권 인사이트 보기',
    ctaHref: '/insights',
    tips: [
      '공실 정보를 등록하면 예비 창업자에게 노출돼요',
      '더명당과 연계해 매물 정보를 동시에 등록하세요',
      '인사이트 리포트로 지역 임대 시세를 파악하세요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'tenant'
  const meta = ROLE_META[role] ?? ROLE_META.tenant
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
