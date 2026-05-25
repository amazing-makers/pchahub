import type { Metadata } from 'next'
import { CheckCircle2, FileText } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { buildBreadcrumbsJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('themyungdang', {
  title: '양도인 가이드 — 권리금 받고 매장을 넘기는 법',
  description: '프랜차이즈 매장 양도 절차 7단계. 권리금 산정법·필요 서류·본사 동의까지 실전 가이드.',
  path: '/seller-guide',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더명당', url: 'https://themyungdang.amakers.co.kr' },
    { name: '양도인 가이드', url: 'https://themyungdang.amakers.co.kr/seller-guide' },
  ],
})

interface GuideStep {
  step: number
  timing: string
  title: string
  description: string
  tips: string[]
  caution?: string
}

const STEPS: GuideStep[] = [
  {
    step: 1,
    timing: 'D-90',
    title: '양도 결정 — 타이밍 확인',
    description: '양도를 결정하기 가장 좋은 시점은 임대 만료 90일 전입니다. 세 가지 신호 중 하나라도 해당하면 준비를 시작하세요.',
    tips: [
      '임대차 계약 만료 6개월 이내 (재계약 여부 불투명)',
      '월 영업이익이 3개월 연속 하락세',
      '건강·개인 사유로 직접 운영이 어려워짐',
    ],
    caution: '양도 결정 후 최소 3개월은 걸린다고 보세요. 급하게 진행하면 권리금 협상에서 불리해집니다.',
  },
  {
    step: 2,
    timing: 'D-90 ~ D-60',
    title: '권리금 산정',
    description: '권리금은 시설·영업·바닥 세 가지를 합산해 산정합니다. 과도하게 높으면 매수인이 없고, 낮으면 손해입니다.',
    tips: [
      '시설 권리금: 인테리어 잔존 가치 (시공비 × 잔여 임차 기간 ÷ 전체 임차 기간)',
      '영업 권리금: 월 영업이익 × 12~24배 (업종·상권에 따라 다름)',
      '바닥 권리금: 동일 상권 최근 거래 사례 3건 이상 참고',
    ],
    caution: '권리금은 법적 보호 대상이지만 반드시 계약서에 명시해야 합니다. 구두 합의는 분쟁 시 인정되지 않습니다.',
  },
  {
    step: 3,
    timing: 'D-60 ~ D-30',
    title: '매물 등록 및 홍보',
    description: '더명당에 매물을 등록하면 가맹 창업자·투자자가 바로 조회합니다. 정보가 상세할수록 문의가 빠릅니다.',
    tips: [
      '업종·면적·임대 조건·권리금·최근 월매출을 정확히 입력',
      '인테리어 사진은 최소 5장 이상 (외부·내부·주방·간판)',
      '매출 증빙 자료(POS 캡처)를 첨부하면 신뢰도 상승',
    ],
  },
  {
    step: 4,
    timing: 'D-30 ~ D-7',
    title: '인수인 탐색 및 미팅',
    description: '문의가 들어오면 허수 손님을 걸러내고 진지한 매수인을 먼저 확인하세요.',
    tips: [
      '가맹 본사 기준을 통과할 수 있는 자금 여력 여부 확인',
      '현장 방문 전 비밀유지 서약서(NDA) 작성 권장',
      '매출 자료 열람은 비밀유지 서약 후 제공',
    ],
    caution: '임차인 동의 없는 재임대(전대차)는 계약 해지 사유입니다. 반드시 임대인 동의 절차를 병행하세요.',
  },
  {
    step: 5,
    timing: 'D-7',
    title: '계약서 작성',
    description: '권리금 계약서와 임대차 계약 승계 동의서를 별도로 작성합니다. 두 계약서는 같은 날 작성하는 것이 안전합니다.',
    tips: [
      '권리금 계약서: 금액·지급 일정·반환 조건을 명시',
      '임대차 승계 동의서: 임대인·양도인·양수인 3자 서명 필수',
      '공증을 받으면 추후 분쟁 시 가장 강력한 증거가 됩니다',
    ],
    caution: '계약금은 총 권리금의 10% 이내로 설정하고, 잔금은 본사 승인·인수인계 완료 후 지급하세요.',
  },
  {
    step: 6,
    timing: 'D-7 ~ D-3',
    title: '본사 동의 및 가맹 승인',
    description: '프랜차이즈 가맹점은 본사 동의 없이 양도할 수 없습니다. 가맹 계약서의 "양도·양수" 조항을 반드시 확인하세요.',
    tips: [
      '본사에 양도 신청서와 양수인 정보를 제출',
      '양수인이 본사 교육을 이수해야 승인되는 경우가 많음',
      '승인 기간이 7~14일 소요되므로 여유 있게 신청',
    ],
    caution: '본사 미동의 상태에서 양도를 완료하면 가맹 계약 해지 및 법적 분쟁으로 이어질 수 있습니다.',
  },
  {
    step: 7,
    timing: 'D-0 (인수인계일)',
    title: '인수인계 완료',
    description: '운영 매뉴얼·직원 정보·재고·식자재 계약을 정리하고, 잔금을 수령합니다.',
    tips: [
      '운영 매뉴얼·메뉴 레시피 문서화 후 전달',
      '기존 직원 승계 여부를 사전 협의 (거부 시 퇴직금 처리)',
      '식자재·소모품 계약 명의 변경 or 해지 처리',
    ],
  },
]

const DOCUMENTS = [
  '사업자 등록증 사본',
  '임대차 계약서 사본 (전 기간)',
  '가맹 계약서 사본',
  '최근 3개월 POS 매출 데이터',
  '인테리어 시공 내역서 (시설 권리금 산정 근거)',
  '권리금 계약서 (공증 권장)',
  '임대인 임대차 승계 동의서',
  '본사 가맹점 양도 동의서',
]

const RIGHTS_FEE_TYPES = [
  {
    type: '시설 권리금',
    color: '#6366F1',
    formula: '인테리어 시공비 × (잔여 임차 기간 ÷ 전체 임차 기간)',
    note: '감가상각을 반영하기 때문에 시공 직후 양도가 가장 유리합니다.',
  },
  {
    type: '영업 권리금',
    color: '#0891B2',
    formula: '월 평균 영업이익 × 12~24배 (상권·업종에 따라 조정)',
    note: '고정 고객이 많고 배달 매출 비중이 높을수록 배수가 높게 적용됩니다.',
  },
  {
    type: '바닥 권리금',
    color: '#059669',
    formula: '동일 상권 최근 거래 사례 기준 (시세)',
    note: '역세권·대학가·오피스 밀집지의 경우 바닥 권리금이 영업 권리금보다 높을 수 있습니다.',
  },
]

export default function SellerGuidePage() {
  return (
    <main>
      <JsonLd data={breadcrumbs} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white py-section">
        <div className="container mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
            양도인 가이드 · Seller Guide
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">권리금 받고 매장을 넘기는 법</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            프랜차이즈 매장 양도는 7단계로 이루어집니다. 순서를 지키면 권리금 손실 없이 안전하게 마무리할 수 있습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-500">
            {['D-90 결정', '권리금 산정', '매물 등록', '계약서 작성', '본사 동의', '인수인계'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-section">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Steps */}
          <div>
            <h2 className="mb-8 text-h3 font-bold text-gray-900">7단계 양도 절차</h2>
            <div className="space-y-10">
              {STEPS.map((step, idx) => (
                <div key={step.step} className="relative">
                  {idx < STEPS.length - 1 && (
                    <div className="absolute left-[19px] top-[44px] h-[calc(100%+2.5rem)] w-0.5 bg-gray-200" aria-hidden />
                  )}
                  <div className="flex gap-5">
                    <div
                      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                      style={{ background: 'var(--brand-primary)' }}
                    >
                      {step.step}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                        <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs text-gray-500">
                          {step.timing}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-gray-600">{step.description}</p>
                      <ul className="mt-3 space-y-1.5">
                        {step.tips.map((tip) => (
                          <li key={tip} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                      {step.caution && (
                        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                          ⚠️ {step.caution}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rights fee types */}
            <div className="mt-16">
              <h2 className="mb-2 text-h3 font-bold text-gray-900">권리금 3종류와 산정법</h2>
              <p className="mb-6 text-sm text-gray-500">프랜차이즈 매장 권리금은 시설·영업·바닥 3가지를 합산합니다.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {RIGHTS_FEE_TYPES.map((r) => (
                  <Card key={r.type} className="border-gray-200">
                    <CardContent className="p-5">
                      <div
                        className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white"
                        style={{ background: r.color }}
                      >
                        {r.type}
                      </div>
                      <div className="rounded-md bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700">
                        {r.formula}
                      </div>
                      <p className="mt-3 text-xs text-gray-600">{r.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document checklist */}
            <Card className="sticky top-6 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <FileText className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
                  필요 서류 체크리스트
                </div>
                <ul className="mt-4 space-y-2.5">
                  {DOCUMENTS.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                      {doc}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                  공증 받은 서류가 분쟁 시 가장 강력한 증거입니다. 계약 전 법무사 검토를 권장합니다.
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
                  더명당
                </p>
                <h3 className="mt-2 text-base font-bold">지금 매물을 등록하세요</h3>
                <p className="mt-1 text-sm text-gray-300">
                  가맹 창업자가 매일 새 매물을 탐색합니다. 상세 정보가 많을수록 문의가 빠릅니다.
                </p>
                <a
                  href="/post"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  매물 등록하기
                </a>
                <a
                  href="/safe-deal"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-gray-600 py-2.5 text-sm text-gray-300 transition-colors hover:border-gray-400 hover:text-white"
                >
                  안전 거래 절차 알아보기
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
