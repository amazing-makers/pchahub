import { buildPageMetadata } from '@amakers/design-system'
import { ArrowRight, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { ROADMAP_STAGES } from '@/lib/roadmap-data'

export const metadata = buildPageMetadata('themanual', {
  title: '프랜차이즈 창업 로드맵 — 6단계 완벽 가이드',
  description: '프랜차이즈 창업을 6단계로 완성하는 실전 로드맵. 창업 준비부터 계약, 인테리어, 메뉴, 마케팅, 운영까지.',
  path: '/roadmap',
})

const RESOURCE_TYPE_STYLE: Record<string, string> = {
  강의: 'bg-blue-50 text-blue-700 border-blue-100',
  가이드: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  멘토링: 'bg-violet-50 text-violet-700 border-violet-100',
}

export default function RoadmapPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand-primary)' }}
            >
              창업 로드맵
            </p>
            <h1 className="mt-4 text-hero font-bold text-gray-900">
              프랜차이즈 창업 완벽 로드맵
              <br />
              <span className="mt-2 block text-2xl font-semibold text-gray-500 sm:text-3xl">
                6단계로 완성하는 나만의 매장
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              막막한 창업, 단계별로 쪼개면 길이 보입니다.
              <br className="hidden sm:inline" />
              창업 준비부터 안정적 운영까지 검증된 프로세스를 따라가세요.
            </p>

            {/* Summary stats */}
            <div className="mt-10 grid grid-cols-3 gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div>
                <div className="text-2xl font-black text-gray-900">4-6개월</div>
                <div className="mt-1 text-xs text-gray-500">총 소요 기간</div>
              </div>
              <div className="border-x border-gray-100">
                <div className="text-2xl font-black text-gray-900">6단계</div>
                <div className="mt-1 text-xs text-gray-500">핵심 단계</div>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">30+</div>
                <div className="mt-1 text-xs text-gray-500">학습 항목</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap stages */}
      <section className="container mx-auto py-section">
        {/* Desktop: 3-column grid, 2 rows */}
        <div className="hidden md:block">
          {/* Row 1: stages 1-3 */}
          <div className="grid grid-cols-3 gap-6">
            {ROADMAP_STAGES.slice(0, 3).map((stage, idx) => (
              <div key={stage.id} className="relative">
                <Card className={`h-full border ${stage.borderColorClass} transition-shadow hover:shadow-lg`}>
                  <CardContent className="p-6">
                    {/* Number badge */}
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white ${stage.colorClass}`}
                      >
                        {stage.order}
                      </span>
                      <div>
                        <h2 className={`text-base font-bold ${stage.textColorClass}`}>{stage.title}</h2>
                        <p className="text-xs text-gray-500">{stage.subtitle}</p>
                      </div>
                    </div>

                    {/* Duration pill */}
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
                      <Clock className="h-3 w-3" />
                      {stage.duration}
                    </div>

                    {/* Skills */}
                    <ul className="mt-4 space-y-1.5">
                      {stage.skills.map((skill) => (
                        <li key={skill} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${stage.textColorClass}`} />
                          {skill}
                        </li>
                      ))}
                    </ul>

                    {/* Milestone */}
                    <div className={`mt-4 rounded-lg border p-3 ${stage.bgLightClass} ${stage.borderColorClass}`}>
                      <div className="flex items-start gap-2">
                        <MapPin className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${stage.textColorClass}`} />
                        <p className={`text-xs font-semibold leading-relaxed ${stage.textColorClass}`}>
                          {stage.milestone}
                        </p>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {stage.resources.map((res) => (
                        <a
                          key={res.label}
                          href={res.href}
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80 ${RESOURCE_TYPE_STYLE[res.type] ?? 'bg-gray-50 text-gray-600 border-gray-100'}`}
                        >
                          {res.type}: {res.label}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Arrow connector to next card */}
                {idx < 2 && (
                  <div className="absolute -right-4 top-1/2 z-10 -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Down arrow between rows */}
          <div className="flex justify-center py-4">
            <div className="flex flex-col items-center gap-0">
              <div className="h-8 w-0.5 bg-gray-200" />
              <ArrowRight className="h-5 w-5 rotate-90 text-gray-300" />
            </div>
          </div>

          {/* Row 2: stages 4-6 */}
          <div className="grid grid-cols-3 gap-6">
            {ROADMAP_STAGES.slice(3).map((stage, idx) => (
              <div key={stage.id} className="relative">
                <Card className={`h-full border ${stage.borderColorClass} transition-shadow hover:shadow-lg`}>
                  <CardContent className="p-6">
                    {/* Number badge */}
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white ${stage.colorClass}`}
                      >
                        {stage.order}
                      </span>
                      <div>
                        <h2 className={`text-base font-bold ${stage.textColorClass}`}>{stage.title}</h2>
                        <p className="text-xs text-gray-500">{stage.subtitle}</p>
                      </div>
                    </div>

                    {/* Duration pill */}
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
                      <Clock className="h-3 w-3" />
                      {stage.duration}
                    </div>

                    {/* Skills */}
                    <ul className="mt-4 space-y-1.5">
                      {stage.skills.map((skill) => (
                        <li key={skill} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${stage.textColorClass}`} />
                          {skill}
                        </li>
                      ))}
                    </ul>

                    {/* Milestone */}
                    <div className={`mt-4 rounded-lg border p-3 ${stage.bgLightClass} ${stage.borderColorClass}`}>
                      <div className="flex items-start gap-2">
                        <MapPin className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${stage.textColorClass}`} />
                        <p className={`text-xs font-semibold leading-relaxed ${stage.textColorClass}`}>
                          {stage.milestone}
                        </p>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {stage.resources.map((res) => (
                        <a
                          key={res.label}
                          href={res.href}
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80 ${RESOURCE_TYPE_STYLE[res.type] ?? 'bg-gray-50 text-gray-600 border-gray-100'}`}
                        >
                          {res.type}: {res.label}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Arrow connector */}
                {idx < 2 && (
                  <div className="absolute -right-4 top-1/2 z-10 -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="space-y-3 md:hidden">
          {ROADMAP_STAGES.map((stage, idx) => (
            <div key={stage.id}>
              <Card className={`border ${stage.borderColorClass}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-black text-white ${stage.colorClass}`}
                    >
                      {stage.order}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className={`text-sm font-bold ${stage.textColorClass}`}>{stage.title}</h2>
                        <span className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-[10px] font-medium text-gray-400">
                          <Clock className="h-2.5 w-2.5" />
                          {stage.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">{stage.subtitle}</p>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {stage.skills.map((skill) => (
                      <li key={skill} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${stage.textColorClass}`} />
                        {skill}
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-3 rounded-lg border p-3 ${stage.bgLightClass} ${stage.borderColorClass}`}>
                    <div className="flex items-start gap-2">
                      <MapPin className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${stage.textColorClass}`} />
                      <p className={`text-xs font-semibold leading-relaxed ${stage.textColorClass}`}>
                        {stage.milestone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {stage.resources.map((res) => (
                      <a
                        key={res.label}
                        href={res.href}
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${RESOURCE_TYPE_STYLE[res.type] ?? 'bg-gray-50 text-gray-600 border-gray-100'}`}
                      >
                        {res.type}: {res.label}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Down arrow connector */}
              {idx < ROADMAP_STAGES.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="h-4 w-4 rotate-90 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h3 font-bold text-gray-900">로드맵 시작하기</h2>
            <p className="mt-3 text-gray-600">
              1단계 강의부터 차근차근 따라가면 누구나 프랜차이즈 창업을 완성할 수 있습니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/courses"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                첫 강의 보러가기 <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/mentors"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                1:1 멘토 상담 신청
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
