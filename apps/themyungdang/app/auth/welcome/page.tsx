'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, Search, ShoppingBag, Building2 } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof Search; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  buyer: {
    label: '매물 찾는 분',
    icon: Search,
    welcome: '딱 맞는 매물을 찾아드릴게요',
    cta: '매물 검색하기',
    ctaHref: '/listings',
    tips: [
      '지역·업종·예산 필터로 맞춤 매물을 검색해 보세요',
      '지도 보기로 상권 위치를 직접 확인하세요',
      '관심 매물 저장 후 가격 변동 알림을 받아보세요',
    ],
  },
  seller: {
    label: '매물 올리는 분',
    icon: ShoppingBag,
    welcome: '빠른 매물 노출로 거래를 성사시켜요',
    cta: '매물 등록하기',
    ctaHref: '/listings/new',
    tips: [
      '사진과 상세 정보를 충분히 입력하면 조회수가 높아져요',
      '안전 거래 서비스를 활용하면 신뢰도가 올라가요',
      '상권 분석 데이터로 적정 권리금을 산정해 보세요',
    ],
  },
  agent: {
    label: '부동산·공인중개사',
    icon: Building2,
    welcome: '매물 관리와 중개를 체계화하세요',
    cta: '전체 매물 보기',
    ctaHref: '/listings',
    tips: [
      '공인중개사 인증으로 매물 신뢰도를 높이세요',
      '여러 매물을 한 계정에서 관리할 수 있어요',
      '상권 분석 리포트를 고객 상담에 활용해 보세요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'buyer'
  const meta = ROLE_META[role] ?? ROLE_META.buyer
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
