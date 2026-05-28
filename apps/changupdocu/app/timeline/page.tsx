import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'
import { AlertCircle, ArrowRight, CheckCircle2, TriangleAlert } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { TIMELINE_PHASES, TOTAL_MAX_WEEKS, TOTAL_MIN_WEEKS } from '@/lib/timeline-data'

export const metadata: Metadata = buildPageMetadata('changupdocu', {
  title: '프랜차이즈 창업 타임라인',
  description:
    '준비기부터 성장기까지, 프랜차이즈 창업의 전 과정을 단계별로 정리했습니다. 놓치기 쉬운 체크리스트와 실패 사례를 함께 확인하세요.',
  path: '/timeline',
})

export default function TimelinePage() {
  return (
    <main className="bg-gray-50 pb-24">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-12 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-blue-600 uppercase">
            창업 로드맵
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            프랜차이즈 창업, 처음부터 끝까지 한눈에
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
            계약 도장 찍기 전부터 흑자 달성까지 —{' '}
            <strong className="text-gray-700">{TOTAL_MIN_WEEKS}~{TOTAL_MAX_WEEKS}주</strong>의
            여정을 5단계로 정리했습니다.
          </p>
          {/* Phase quick nav */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {TIMELINE_PHASES.map((p) => (
              <a
                key={p.id}
                href={`#phase-${p.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${p.bgLightClass} ${p.textColorClass} border ${p.borderColorClass} transition-opacity hover:opacity-80`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${p.colorClass}`}
                >
                  {p.order}
                </span>
                {p.phase}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <div className="container mx-auto py-12">
        <div className="relative">
          {/* Vertical connector line — hidden on mobile */}
          <div
            className="absolute left-6 top-0 hidden h-full w-0.5 bg-gray-200 md:block"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {TIMELINE_PHASES.map((phase, idx) => (
              <section key={phase.id} id={`phase-${phase.id}`} className="relative scroll-mt-24">
                {/* Phase header row */}
                <div className="mb-4 flex items-center gap-4">
                  {/* Circle badge — sits on the connector line */}
                  <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm ${phase.colorClass}`}
                  >
                    {phase.order}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{phase.phase}</h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${phase.bgLightClass} ${phase.textColorClass}`}
                    >
                      {phase.duration}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="md:ml-16">
                  <Card className={`border ${phase.borderColorClass} overflow-hidden`}>
                    <CardContent className="p-0">
                      {/* Title + description */}
                      <div className={`px-6 py-4 ${phase.bgLightClass}`}>
                        <p className={`font-semibold ${phase.textColorClass}`}>{phase.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{phase.description}</p>
                      </div>

                      {/* Task list */}
                      <div className="divide-y divide-gray-100 px-6">
                        {phase.tasks.map((t, ti) => (
                          <div key={ti} className="py-3">
                            <div className="flex items-start gap-2">
                              {t.critical ? (
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                              ) : (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-sm ${t.critical ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                                >
                                  {t.task}
                                  {t.critical && (
                                    <span className="ml-1.5 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                                      필수
                                    </span>
                                  )}
                                </p>
                                {t.tip && (
                                  <p className="mt-0.5 text-xs text-gray-400">💡 {t.tip}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Common mistakes */}
                      <div className="border-t border-gray-100 bg-amber-50 px-6 py-4">
                        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-800">
                          <TriangleAlert className="h-4 w-4" />
                          이 단계에서 자주 하는 실수
                        </p>
                        <ul className="space-y-1.5">
                          {phase.commonMistakes.map((m, mi) => (
                            <li key={mi} className="text-sm text-amber-700">
                              <span className="mr-1 font-bold">⚠️</span>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Connector arrow between phases */}
                {idx < TIMELINE_PHASES.length - 1 && (
                  <div className="mt-4 hidden justify-center md:flex md:ml-16">
                    <span className="text-gray-300 text-xl">↓</span>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            전체 소요 기간
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {TOTAL_MIN_WEEKS}주 ~ {TOTAL_MAX_WEEKS}주
          </p>
          <p className="mt-2 text-sm text-gray-500">
            상권 선택·인테리어 공사 기간에 따라 달라지며, 평균적으로
            <strong className="text-gray-700"> 6~8개월</strong>이 걸립니다.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="/episodes"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            관련 에피소드 보러가기
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </main>
  )
}
