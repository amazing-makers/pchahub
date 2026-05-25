import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { AlertTriangle, ArrowRight, CheckCircle, FileText, Shield, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

export const metadata: Metadata = buildPageMetadata('pchabridge', {
  title: '투자자 가이드',
  description: '프차브릿지 투자자 가이드. 프랜차이즈 투자 방식·절차·위험 요소를 단계별로 설명합니다. 초보 투자자도 안심하고 시작하세요.',
  path: '/guide',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '프차브릿지', url: 'https://pchabridge.amakers.co.kr' },
    { name: '투자자 가이드', url: 'https://pchabridge.amakers.co.kr/guide' },
  ],
})

const STEPS = [
  {
    step: 1,
    title: '회원가입 · 정보 확인',
    body: '본인 인증 후 회원가입합니다. 투자 방식·최소 금액·예상 ROI가 라운드별로 공개되어 있으며, 로그인 없이도 기본 정보를 확인할 수 있습니다.',
  },
  {
    step: 2,
    title: 'IR 자료 · 재무 검토',
    body: '관심 라운드를 선택 후 사업 계획서·재무제표·위험 고지 등 IR 자료를 다운로드합니다. 일부 자료는 NDA 동의 후 공개됩니다.',
  },
  {
    step: 3,
    title: '투자 신청 · 에스크로 입금',
    body: '투자 신청 후 전용 에스크로 계좌에 입금합니다. 에스크로 잔금은 라운드 마감 시 본사에 전달되며, 미달 시 전액 반환됩니다.',
  },
  {
    step: 4,
    title: '진행 현황 · 성과 리포트',
    body: '투자 후 분기별 성과 리포트를 통해 매장 수·매출·ROI 실적을 확인할 수 있습니다. 주요 결정 사항은 투자자 공지로 안내됩니다.',
  },
  {
    step: 5,
    title: '수익 분배 · 엑시트',
    body: '약정에 따라 수익이 분배됩니다. M&A·IPO 시 지분을 매각하는 방식으로 엑시트하거나, 다점포 펀딩은 계약 기간 만료 후 원금 + 수익을 반환받습니다.',
  },
]

const TYPE_EXPLAINERS = [
  {
    type: 'Seed · Series',
    icon: TrendingUp,
    color: '#7C3AED',
    minInvest: '500만원~',
    riskLevel: '높음',
    horizon: '3~5년',
    points: [
      '본사 지분 취득 — 가치 상승 시 매각 차익 또는 배당',
      '초기(Seed)일수록 높은 기대 수익, 높은 불확실성',
      'Series가 높을수록 안정성 ↑, 기대 수익률 ↓',
      '엑시트: M&A, IPO, 2차 거래',
    ],
  },
  {
    type: '다점포 펀딩',
    icon: Users,
    color: '#10B981',
    minInvest: '100만원~',
    riskLevel: '중간',
    horizon: '2~3년',
    points: [
      '본사 직영 다점포 오픈 자금에 참여',
      '매장 운영 손익에 비례한 수익 분배',
      '소액부터 가능, 상대적으로 이해하기 쉬운 구조',
      '목표 미달 시 미달 자금 전액 반환',
    ],
  },
  {
    type: '본사 M&A',
    icon: Shield,
    color: '#0EA5E9',
    minInvest: '10억원~',
    riskLevel: '낮음~중간',
    horizon: '즉시 운영',
    points: [
      '안정화된 본사 전체 또는 일부 지분 인수',
      'NDA 동의 후 재무·법인 실사 진행',
      '인수 후 기존 가맹점·직원 승계',
      'amakers 표준 계약서 + 전문 변호사 연결',
    ],
  },
]

const RISKS = [
  {
    title: '원금 손실 가능성',
    body: '모든 투자에는 원금이 전부 손실될 수 있습니다. 특히 Seed 단계 본사는 시장 검증이 완료되지 않은 단계로 고위험 투자입니다.',
  },
  {
    title: '유동성 제한',
    body: '투자 후 기간 중 환매나 매도가 제한됩니다. 급전이 필요한 자금을 투자하지 마십시오.',
  },
  {
    title: '정보 비대칭',
    body: '본사와 투자자 사이에는 정보 비대칭이 존재합니다. 공개된 IR 자료를 충분히 검토하고, 필요시 외부 전문가의 도움을 받으세요.',
  },
  {
    title: '프랜차이즈 시장 변동성',
    body: '외식·음료 트렌드, 경쟁 브랜드 출현, 부동산 임대 환경 등 외부 요인이 본사 실적에 영향을 미칩니다.',
  },
]

const TERMS = [
  { term: 'Valuation (기업가치)', def: '본사의 현재 가치. Pre-money는 투자 전, Post-money는 투자 후 기업가치.' },
  { term: 'ROI (투자 수익률)', def: '투자 원금 대비 수익의 비율. 예상 ROI는 실제와 다를 수 있음.' },
  { term: 'NDA (비밀유지계약)', def: '비공개 정보 수령 전 체결하는 계약. 정보 유출 시 법적 책임.' },
  { term: '에스크로', def: '제3자 기관이 자금을 보관하다가 조건 충족 시 이전하는 안전 거래 방식.' },
  { term: '엑시트 (Exit)', def: '투자금 회수 방법. M&A, IPO, 2차 거래 등이 있음.' },
]

export default function GuidePage() {
  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-800 bg-gradient-to-br from-violet-950 to-gray-900 text-white">
        <div className="container mx-auto py-section">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            Investor Guide
          </p>
          <h1 className="mt-3 text-h2 font-bold">투자자 가이드</h1>
          <p className="mt-3 max-w-xl text-gray-300">
            프랜차이즈 투자가 처음이신가요? 투자 방식·절차·위험 요소를 단계별로 안내합니다.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="페이지 내 이동">
            {[
              { label: '투자 절차', id: 'section-steps' },
              { label: '투자 방식', id: 'section-types' },
              { label: '실사 체크리스트', id: 'section-due-diligence' },
              { label: '위험 고지', id: 'section-risk' },
            ].map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-white/20 px-4 py-1.5 text-gray-300 hover:border-white/60 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* 투자 절차 */}
      <section id="section-steps" className="container mx-auto py-section">
        <h2 className="text-h3 font-bold text-gray-900">투자 절차</h2>
        <p className="mt-2 text-sm text-gray-500">프차브릿지에서 투자를 시작하는 5단계</p>
        <ol className="mt-8 space-y-0">
          {STEPS.map((s, i) => (
            <li key={s.step} className="relative flex gap-5">
              <div className="flex flex-col items-center">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  {s.step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mt-1 h-full min-h-[2rem] w-px bg-gray-200" />
                )}
              </div>
              <div className={`pb-8 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 투자 방식 */}
      <section id="section-types" className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <h2 className="text-h3 font-bold text-gray-900">3가지 투자 방식</h2>
          <p className="mt-2 text-sm text-gray-500">목적과 규모에 맞는 방식을 선택하세요</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {TYPE_EXPLAINERS.map((t) => (
              <Card key={t.type} className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: t.color }}
                  >
                    <t.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{t.type}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span>최소 {t.minInvest}</span>
                    <span>위험 {t.riskLevel}</span>
                    <span>기간 {t.horizon}</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: t.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 실사 체크리스트 + 용어 */}
      <section id="section-due-diligence" className="container mx-auto py-section">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h3 font-bold text-gray-900">실사 체크리스트</h2>
            <p className="mt-2 text-sm text-gray-500">투자 결정 전 반드시 확인할 항목</p>
            <ul className="mt-6 space-y-3">
              {[
                '본사 사업 계획서 + 최근 3년 재무제표 검토',
                '가맹점 폐점율 · 점주 만족도 확인',
                '경쟁 본사 시장 현황 비교',
                'NDA 동의 후 법인 등기부 + 분쟁 이력 확인',
                '본사 대표 이력 + 팀 구성 검토',
                '투자 위험 고지서 전문 독해',
                '변호사·세무사 등 전문가 검토 권고',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-h3 font-bold text-gray-900">투자 용어 정리</h2>
            <p className="mt-2 text-sm text-gray-500">투자 전 알아두면 좋은 용어</p>
            <dl className="mt-6 space-y-4">
              {TERMS.map(({ term, def }) => (
                <div key={term} className="border-b border-gray-100 pb-4">
                  <dt className="text-sm font-semibold text-gray-900">{term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-gray-600">{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 위험 고지 */}
      <section id="section-risk" className="border-t border-gray-100 bg-amber-50">
        <div className="container mx-auto py-section">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-h3 font-bold text-gray-900">위험 고지</h2>
          </div>
          <p className="mt-2 text-sm text-amber-700">투자 전 반드시 숙지해야 할 사항입니다</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {RISKS.map((r) => (
              <div key={r.title} className="rounded-xl border border-amber-200 bg-white p-5">
                <h3 className="text-sm font-bold text-gray-900">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 법적 안내 + CTA */}
      <section className="border-t border-gray-100 bg-white">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <h2 className="text-h3 font-bold text-gray-900">법적 안내</h2>
            </div>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-xs leading-relaxed text-gray-500">
              <p>
                프차브릿지 (amakers 운영)는 정보 제공 및 거래 중개 서비스를 제공하며, 투자 수익을 보장하지 않습니다.
                본 플랫폼의 모든 투자 정보는 참고 목적으로만 제공되며, 투자 결정은 투자자 본인의 판단과 책임 하에 이루어져야 합니다.
              </p>
              <p className="mt-2">
                프랜차이즈 투자는 「가맹사업거래의 공정화에 관한 법률」의 적용을 받으며,
                투자 전 정보공개서를 확인할 수 있습니다.
              </p>
              <p className="mt-2">
                에스크로 서비스는 제휴 금융기관을 통해 운영되며, 관련 약관은 서비스 이용 전 별도 공지됩니다.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-gray-900 p-8 text-white">
              <h3 className="text-h4 font-bold">투자 라운드가 궁금하다면?</h3>
              <p className="mt-2 text-sm text-gray-300">
                실제 투자 현황과 시장 데이터를 딜플로우 리포트에서 확인하세요.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/investments"
                  className="inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  투자 라운드 보기 <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/dealflow"
                  className="inline-flex items-center gap-1 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:border-white/40 hover:text-white"
                >
                  딜플로우 리포트 <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
