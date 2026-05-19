'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, BookOpen, Search, Building2, Hammer } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof Search; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  user: {
    label: '예비 창업자',
    icon: Search,
    welcome: '창업 여정을 함께 시작해요',
    cta: '브랜드 탐색하기',
    ctaHref: '/brands',
    tips: [
      '브랜드 필터로 업종·투자금·지역을 좁혀 보세요',
      '관심 브랜드에 상담 신청을 보내면 본사가 직접 답변해 드려요',
      '장사노트 커뮤니티에서 현직 점주의 리얼 후기를 확인하세요',
    ],
  },
  franchisee: {
    label: '가맹점주',
    icon: Building2,
    welcome: '운영 정보와 커뮤니티가 준비되어 있어요',
    cta: '커뮤니티 바로가기',
    ctaHref: 'https://jangsanote.kr',
    tips: [
      '내 브랜드 정보를 즐겨찾기로 바로 접근하세요',
      '장사노트에서 같은 브랜드 점주와 소통할 수 있어요',
      '더명당에서 매물 정보를 한눈에 확인하세요',
    ],
  },
  hq: {
    label: '본사 / 가맹사업',
    icon: BookOpen,
    welcome: '브랜드를 등록하고 점주를 모집하세요',
    cta: '브랜드 등록하기',
    ctaHref: '/brands/new',
    tips: [
      '브랜드 프로필을 완성하면 예비 창업자에게 더 많이 노출돼요',
      '오픈런에서 개점·판촉 캠페인을 설계할 수 있어요',
      '창업다큐에 인터뷰를 신청해 브랜드 스토리를 전달하세요',
    ],
  },
  contractor: {
    label: '시공·협력사',
    icon: Hammer,
    welcome: '포트폴리오로 가맹점 시공 수주를 늘리세요',
    cta: '포트폴리오 등록하기',
    ctaHref: 'https://gongganhansu.kr/contractors',
    tips: [
      '공간한수에 시공 포트폴리오를 등록해 두세요',
      '더명당 신규 임대 매물에 시공 견적을 제안할 수 있어요',
      '오픈런 캠페인과 연계해 개점 패키지를 제공해 보세요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'user'
  const meta = ROLE_META[role] ?? ROLE_META.user!
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
