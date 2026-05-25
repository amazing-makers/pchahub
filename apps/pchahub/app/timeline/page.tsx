import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { ArrowRight, BookOpen, Calculator, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '프랜차이즈 창업 일정표 — 탐색부터 그랜드 오픈까지',
  description: '프랜차이즈 창업의 전체 과정을 7단계로 정리했습니다. 탐색·자금·계약·인테리어·오픈까지 평균 소요 기간과 단계별 할 일을 확인하세요.',
  path: '/timeline',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차허브', url: 'https://pchahub.amakers.co.kr' },
    { name: '창업 일정표', url: 'https://pchahub.amakers.co.kr/timeline' },
  ],
})

const PHASES = [
  {
    phase: 1,
    title: '업종 탐색',
    duration: '1~4주',
    color: '#7C3AED',
    tasks: [
      '관심 업종·예산 범위 결정',
      '프차허브 브랜드 검색 → 업종별 필터',
      '창업 스캐너로 조건 맞는 브랜드 Top3 추천',
      '최대 3개 브랜드 나란히 비교',
      '지역별 브랜드 현황 확인',
    ],
    tools: [
      { label: '브랜드 검색', href: '/brands', icon: null },
      { label: '창업 스캐너', href: '/scanner', icon: Sparkles },
      { label: '브랜드 비교', href: '/brands/compare', icon: null },
    ],
    tip: '업종을 먼저 결정하면 브랜드 선택이 훨씬 빨라집니다. 치킨·카페·한식 등 대분류부터 시작하세요.',
  },
  {
    phase: 2,
    title: '자금 계획 수립',
    duration: '1~2주',
    color: '#0891B2',
    tasks: [
      '수익 계산기로 예상 매출·비용·회수 기간 시뮬레이션',
      '순수 자기자본 파악 (인테리어·설비·운영비 포함)',
      '소상공인 정책자금 (신용보증기금·소진공) 조회',
      '은행 창업 대출 조건 비교',
      '예비비 최소 10~20% 확보',
    ],
    tools: [
      { label: '수익 계산기', href: '/calculator', icon: Calculator },
      { label: '창업비 분석 가이드', href: '/guide/startup-cost-breakdown', icon: BookOpen },
    ],
    tip: '정책자금은 심사 기간이 3~6주 걸립니다. 브랜드 선택 전에 미리 신청하면 일정이 단축됩니다.',
  },
  {
    phase: 3,
    title: '본사 상담',
    duration: '2~4주',
    color: '#059669',
    tasks: [
      '정보공개서 공식 수령 (계약 14일 전 의무)',
      '정보공개서 주요 항목 직접 검토 — 폐점율·가맹비·광고비',
      '가맹 상담 미팅 1회 이상',
      '예비 가맹점주 교육 참여 (대부분 1~2일)',
      '계약 조건·상권 보호 범위 협의',
    ],
    tools: [
      { label: '정보공개서 읽는 법', href: '/guide/how-to-choose-brand', icon: BookOpen },
      { label: '브랜드 상담 신청', href: '/inquiry', icon: null },
    ],
    tip: '정보공개서 수령 후 14일 이내에는 계약을 강요할 수 없습니다. 충분히 검토하세요.',
  },
  {
    phase: 4,
    title: '계약 체결',
    duration: '1~2주',
    color: '#D97706',
    tasks: [
      '계약서 서명 전 체크리스트 20항목 확인',
      '가능하면 변호사·법무사 계약서 검토',
      '가맹 계약서 공정위 표준 계약서와 비교',
      '가맹비·보증금 납입',
      '예정 상권·입지 본사 승인 받기',
    ],
    tools: [
      { label: '계약서 체크리스트', href: '/guide/contract-checklist', icon: BookOpen },
    ],
    tip: '계약서에 서명하기 전 반드시 법적 조력을 받으세요. 계약 후 변경은 매우 어렵습니다.',
    warning: true,
  },
  {
    phase: 5,
    title: '입지 확정 · 인테리어',
    duration: '4~12주',
    color: '#7C3AED',
    tasks: [
      '상권 분석 — 유동인구·경쟁점·임대료 비교',
      '임대차 계약 (보증금·월세·계약 기간)',
      '본사 지정 시공사 또는 자체 공사 진행',
      '가구·주방기기·간판 납품·설치',
      '위생·소방 등 관할 기관 허가 취득',
    ],
    tools: [
      { label: '지역별 브랜드 현황', href: '/regions', icon: MapPin },
    ],
    tip: '인테리어는 예산의 30~40%를 차지합니다. 추가 공사로 인한 일정 지연이 가장 흔합니다.',
  },
  {
    phase: 6,
    title: '오픈 준비',
    duration: '2~4주',
    color: '#DC2626',
    tasks: [
      '직원 채용 · 서비스 교육',
      '배달앱 (배달의민족·쿠팡이츠·요기요) 입점 세팅',
      '소셜미디어 계정 개설 + 오픈 예고 콘텐츠',
      '오픈 이벤트·할인 쿠폰 기획',
      '소프트 오픈 (가족·지인 대상 시범 운영)',
      'POS·정산 시스템 점검',
    ],
    tools: [],
    tip: '소프트 오픈은 실수를 안전하게 수정할 기회입니다. 주말 전 평일에 진행하는 것이 좋습니다.',
  },
  {
    phase: 7,
    title: '그랜드 오픈',
    duration: '오픈 당일 ~ D+30',
    color: '#0EA5E9',
    tasks: [
      '오픈 당일 SNS·배달앱 동시 오픈 알림',
      '오픈런 이벤트 진행 (선착순 할인·사은품 등)',
      '본사 수퍼바이저(SV) 동행 지원 확인',
      '매출·객수 일별 추적 시작',
      '오픈 30일 후 월간 리뷰 — 매출 목표 대비 달성률 점검',
    ],
    tools: [],
    tip: '오픈 30일이 지나도 매출이 목표치를 밑돌면 즉시 본사 SV와 원인을 분석하세요.',
  },
]

const TOTAL_WEEKS_MIN = 14
const TOTAL_WEEKS_MAX = 30

export default function TimelinePage() {
  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto py-section">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Startup Timeline
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">프랜차이즈 창업 일정표</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            탐색부터 그랜드 오픈까지 — 7단계 전체 여정의 평균 소요 기간과 단계별 할 일을 정리했습니다.
          </p>

          {/* Total duration */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              평균 총 소요 기간:{' '}
              <strong className="text-gray-900">
                {TOTAL_WEEKS_MIN}~{TOTAL_WEEKS_MAX}주 ({Math.ceil(TOTAL_WEEKS_MIN / 4)}~{Math.ceil(TOTAL_WEEKS_MAX / 4)}개월)
              </strong>
            </span>
          </div>

          <nav className="mt-5 flex flex-wrap gap-2 text-xs" aria-label="단계 바로 가기">
            {PHASES.map((p) => (
              <a
                key={p.phase}
                href={`#phase-${p.phase}`}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              >
                {p.phase}. {p.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto py-section">
        <div className="mx-auto max-w-3xl">
          <ol className="space-y-0">
            {PHASES.map((p, i) => (
              <li key={p.phase} id={`phase-${p.phase}`} className="relative flex gap-6">
                {/* Connector line */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                    style={{ background: p.color }}
                  >
                    {p.phase}
                  </div>
                  {i < PHASES.length - 1 && (
                    <div className="mt-2 flex-1 w-px bg-gray-200" style={{ minHeight: '2rem' }} />
                  )}
                </div>

                {/* Card */}
                <div className={`flex-1 pb-10 ${i === PHASES.length - 1 ? 'pb-0' : ''}`}>
                  <Card className={`border-gray-200 ${p.warning ? 'border-amber-200' : ''}`}>
                    <CardContent className="p-0">
                      {/* Phase header */}
                      <div
                        className="flex items-center justify-between rounded-t-2xl px-5 py-3"
                        style={{ background: p.color + '12' }}
                      >
                        <h2 className="text-base font-bold text-gray-900">
                          단계 {p.phase}. {p.title}
                        </h2>
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                          style={{ background: p.color }}
                        >
                          <Clock className="h-3 w-3" />
                          {p.duration}
                        </span>
                      </div>

                      <div className="p-5">
                        {/* Tasks */}
                        <ul className="space-y-2">
                          {p.tasks.map((task) => (
                            <li key={task} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle2
                                className="mt-0.5 h-4 w-4 shrink-0"
                                style={{ color: p.color }}
                              />
                              {task}
                            </li>
                          ))}
                        </ul>

                        {/* Tip */}
                        <div
                          className={`mt-4 rounded-xl p-3.5 text-sm ${
                            p.warning
                              ? 'border border-amber-200 bg-amber-50 text-amber-800'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className="font-semibold">
                            {p.warning ? '⚠ 주의' : '💡 팁'}:{' '}
                          </span>
                          {p.tip}
                        </div>

                        {/* Tools */}
                        {p.tools.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {p.tools.map((tool) => (
                              <a
                                key={tool.href}
                                href={tool.href}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                              >
                                {tool.icon && <tool.icon className="h-3.5 w-3.5" />}
                                {tool.label}
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-h3 font-bold text-gray-900">창업 초보자가 자주 놓치는 것들</h2>
            <p className="mt-2 text-sm text-gray-500">480개 이상의 창업 사례에서 반복된 실수</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: '예비비 미확보',
                  body: '총 창업비의 10~20%를 예비비로 남겨두지 않으면, 인테리어 초과·설비 추가 시 자금 부족으로 오픈이 지연됩니다.',
                },
                {
                  title: '상권 조사 부족',
                  body: '유동인구를 평일·주말·시간대별로 직접 확인하지 않고 계약했다가 예상 매출을 달성하지 못하는 경우가 많습니다.',
                },
                {
                  title: '계약서 미검토',
                  body: '가맹비·로열티·광고비 외에 인테리어 강요·전용 식자재 구매 의무 조항을 모르고 계약하는 경우가 흔합니다.',
                },
                {
                  title: '정보공개서 기간 무시',
                  body: '정보공개서 수령 후 14일이 지나기 전에 본사 압박으로 계약서에 서명하는 것은 법적으로 무효입니다.',
                },
                {
                  title: '오픈 마케팅 미준비',
                  body: '개업일 직전까지 SNS 계정조차 없는 상태로 오픈하면 첫 달 매출이 절반 이하로 떨어질 수 있습니다.',
                },
                {
                  title: '직원 교육 기간 과소 산정',
                  body: '직원 채용 후 현장 적응까지 최소 2주가 필요합니다. 오픈 직전 채용은 서비스 품질에 직접 영향을 줍니다.',
                },
              ].map((m) => (
                <div key={m.title} className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-bold text-gray-900">✗ {m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl bg-gray-900 px-8 py-10 text-white">
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
                지금 시작하기
              </p>
              <h2 className="mt-3 text-h3 font-bold">브랜드 탐색이 첫걸음입니다</h2>
              <p className="mt-2 text-sm text-gray-300">
                일정표를 확인했다면 이제 실제로 브랜드를 찾아보세요.
                7개 질문에 답하면 내 조건에 맞는 브랜드 Top 3를 바로 추천해 드립니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/scanner"
                  className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <Sparkles className="h-4 w-4" />
                  창업 스캐너 시작 <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/brands"
                  className="inline-flex items-center gap-1 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:border-white/40 hover:text-white"
                >
                  브랜드 직접 검색 <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
