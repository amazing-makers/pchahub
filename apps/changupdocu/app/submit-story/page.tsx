import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { Camera, CheckCircle2, FileText, Mic, Shield, Users } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { SubmitStoryForm } from './submit-form'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '사연·인터뷰 제보 — 창업다큐',
  description: '창업 성공·실패·브랜드 이야기를 제보해 주세요. 검증 후 창업다큐 에피소드로 제작됩니다.',
  path: '/submit-story',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '창업다큐', url: 'https://changupdocu.amakers.co.kr' },
    { name: '사연 제보', url: 'https://changupdocu.amakers.co.kr/submit-story' },
  ],
})

const STORY_TYPES = [
  {
    icon: CheckCircle2,
    title: '성공 다큐',
    desc: '실제 매출 성장의 변곡점, 어떻게 이겼는지 이야기해 주세요.',
    color: '#10B981',
  },
  {
    icon: FileText,
    title: '실패 분석',
    desc: '폐업·손실·갈등 경험. 다음 창업자를 위한 솔직한 기록.',
    color: '#DC2626',
  },
  {
    icon: Users,
    title: '점주 인터뷰',
    desc: '현재 운영 중인 가맹점의 일상·고충·노하우.',
    color: '#8B5CF6',
  },
  {
    icon: Camera,
    title: '브랜드 인사이드',
    desc: '가맹 본사 내부 이야기, 본사-점주 관계, 정책 변화.',
    color: '#3B82F6',
  },
]

const PROCESS_STEPS = [
  { step: 1, title: '제보 접수', body: '아래 양식으로 사연을 제출하면 창업다큐 취재팀이 검토합니다.' },
  { step: 2, title: '1차 검토', body: '3~5일 이내 연락처로 검토 결과를 안내합니다. 추가 자료가 필요하면 요청드립니다.' },
  { step: 3, title: '취재 진행', body: '채택된 사연은 현장 인터뷰·자료 취재를 진행합니다. 일정은 협의합니다.' },
  { step: 4, title: '에피소드 공개', body: '편집·검수 후 창업다큐 에피소드로 공개됩니다. 출연자 확인 기회가 제공됩니다.' },
]

export default function SubmitStoryPage() {
  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            사연 제보 · Submit Your Story
          </p>
          <h1 className="mt-4 text-h2 font-bold text-gray-900">
            당신의 창업 이야기가
            <br />
            다음 다큐가 됩니다
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            성공이든 실패든, 진짜 이야기가 창업다큐를 만듭니다.
            현장에서 직접 경험한 가맹 창업의 이야기를 제보해 주세요.
            검증과 취재를 거쳐 에피소드로 제작됩니다.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm text-gray-600 shadow-sm">
            <Shield className="h-4 w-4 text-green-500" />
            익명 처리 가능 · 개인정보 보호 · 무보수 동의 후 진행
          </div>
        </div>
      </section>

      {/* Story types */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto py-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            어떤 이야기를 찾나요
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STORY_TYPES.map((t) => {
              const Icon = t.icon
              return (
                <div key={t.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: t.color + '18' }}
                  >
                    <Icon className="h-4 w-4" style={{ color: t.color }} />
                  </div>
                  <div className="mt-2.5 text-sm font-semibold text-gray-900">{t.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{t.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main form + process */}
      <section className="container mx-auto py-section">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Form */}
          <div>
            <h2 className="text-h3 font-bold text-gray-900">제보 양식</h2>
            <p className="mt-1 text-sm text-gray-500">
              모든 제보는 취재팀이 직접 검토합니다. 허위 제보는 제외됩니다.
            </p>
            <div className="mt-6">
              <SubmitStoryForm />
            </div>
          </div>

          {/* Process sidebar */}
          <div className="space-y-4">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Mic className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
                  제보 → 에피소드 과정
                </h3>
                <div className="mt-4 space-y-4">
                  {PROCESS_STEPS.map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: 'var(--brand-primary)' }}
                      >
                        {s.step}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{s.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-gray-900">자주 묻는 질문</h3>
                <div className="mt-3 space-y-3 text-xs text-gray-600">
                  <div>
                    <p className="font-medium text-gray-800">이름이 나오나요?</p>
                    <p className="mt-0.5">익명 처리 요청 시 닉네임·가명으로 제작됩니다.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">모든 제보가 에피소드가 되나요?</p>
                    <p className="mt-0.5">취재 가치와 공익성을 기준으로 채택됩니다. 채택률은 약 20%입니다.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">출연료가 있나요?</p>
                    <p className="mt-0.5">비상업 콘텐츠 특성상 별도 출연료는 없으며, 사전에 고지합니다.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">브랜드 실명을 밝혀야 하나요?</p>
                    <p className="mt-0.5">제보 단계에서는 실명, 에피소드 제작 시 공개 여부는 협의합니다.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
