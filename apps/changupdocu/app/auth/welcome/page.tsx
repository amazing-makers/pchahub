'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, Play, Mic, PenLine } from 'lucide-react'
import { Button } from '@amakers/ui'

const ROLE_META: Record<string, { label: string; icon: typeof Play; welcome: string; cta: string; ctaHref: string; tips: string[] }> = {
  viewer: {
    label: '시청자·독자',
    icon: Play,
    welcome: '창업 현장의 이야기를 만나보세요',
    cta: '최신 에피소드 보기',
    ctaHref: '/episodes',
    tips: [
      '최신 다큐멘터리 에피소드를 구독하세요',
      '매거진에서 현장 분석·인사이트를 읽어보세요',
      '관심 업종 필터로 맞춤 콘텐츠를 찾아보세요',
    ],
  },
  creator: {
    label: '창업가',
    icon: Mic,
    welcome: '창업 스토리를 나눠주세요',
    cta: '매거진 읽기',
    ctaHref: '/magazine',
    tips: [
      '창업 과정을 기고하면 예비 창업자에게 큰 도움이 돼요',
      '다큐 인터뷰 신청으로 브랜드를 알릴 수 있어요',
      '장사노트 커뮤니티에서 다른 창업가와 교류하세요',
    ],
  },
  contributor: {
    label: '기고자·전문가',
    icon: PenLine,
    welcome: '분석과 인사이트로 창업 생태계를 이끌어요',
    cta: '매거진 기고하기',
    ctaHref: '/magazine',
    tips: [
      '기고 양식을 제출하면 에디터가 검토 후 연락드려요',
      '회계사·변호사·컨설턴트 분야 기고를 환영해요',
      '인터뷰 형식도 가능해요. 상담 문의를 남겨주세요',
    ],
  },
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'viewer'
  const meta = ROLE_META[role] ?? ROLE_META.viewer
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
