import type { Metadata } from 'next'
import { buildBreadcrumbsJsonLd, buildFaqPageJsonLd, buildHowToJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('themyungdang', {
  title: '안전 거래',
  description: '매물 실사·표준 계약서·에스크로 결제·30일 분쟁 보호. amakers 안전 거래로 권리금 분쟁과 허위 매물 위험을 줄이세요.',
  path: '/safe-deal',
})

import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  FileText,
  HandCoins,
  KeySquare,
  Scale,
  Shield,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

const STEPS = [
  {
    icon: FileSearch,
    title: '매물 실사 보고서',
    body: '본인 확인 + 임대차계약서 검토 + 권리·근저당 조회. 실거주 점주 인터뷰까지 포함된 실사 보고서를 받아보세요.',
  },
  {
    icon: FileText,
    title: '표준 계약서 + 변호사 검토',
    body: 'amakers 표준 계약서 + 양측 합의 사항을 변호사가 검토합니다. 권리금 분쟁의 80%는 계약서 부실에서 시작됩니다.',
  },
  {
    icon: HandCoins,
    title: '에스크로 결제',
    body: '권리금 + 보증금을 amakers 에스크로 계좌에 보관. 거래 조건 충족 시에만 양도인에게 송금됩니다.',
  },
  {
    icon: KeySquare,
    title: '입점 + 분쟁 보호',
    body: '입점 후 30일간 매물 정보와 다른 점 발견 시 대금 환불. 분쟁 발생 시 amakers가 중재합니다.',
  },
]

const PROTECTIONS = [
  {
    icon: ShieldCheck,
    title: '권리금 사기 방지',
    body: '권리금을 전달하기 전 매물 실사로 권리·근저당·미납 임대료를 모두 확인합니다.',
  },
  {
    icon: FileSearch,
    title: '허위 매출 차단',
    body: '신고된 월매출은 POS 데이터·카드 매출 자료로 검증된 매물만 "검증 매출"로 표시됩니다.',
  },
  {
    icon: Scale,
    title: '계약 분쟁 중재',
    body: '입점 후 30일간 양측 클레임을 amakers 중재팀이 검토. 평균 5일 이내 결과 통지.',
  },
  {
    icon: Wallet,
    title: '권리금 환불 보장',
    body: '실사 결과와 상이한 매물로 확인되면 입금된 권리금 + 보증금이 전액 환불됩니다.',
  },
  {
    icon: Shield,
    title: '보험 가입 매물',
    body: '안전 거래 매물은 amakers 손해 보장 보험에 자동 가입되어 거래 사고 시 보장됩니다.',
  },
  {
    icon: CheckCircle2,
    title: '점주 본인 확인',
    body: '양도인·임대인 본인 확인을 사업자등록증과 신분증으로 검증합니다.',
  },
]

const FEES = [
  { label: '실사 보고서', price: '50만원' },
  { label: '표준 계약서 + 변호사 검토', price: '30만원' },
  { label: '에스크로 보관 수수료', price: '거래액의 0.5%' },
  { label: '분쟁 중재 (입점 후 30일)', price: '무료' },
  { label: '손해 보장 보험', price: '거래액의 0.3%' },
]

const FAQS = [
  {
    q: '안전 거래로 등록하면 모든 매물이 검증되나요?',
    a: '아니요. 안전 거래 등록은 양측이 동의한 매물에만 적용됩니다. 등록 후 amakers 실사팀이 매물 자료를 검증합니다.',
  },
  {
    q: '실사 비용은 누가 부담하나요?',
    a: '양도인·매도인이 부담하는 게 일반적이지만 양측 협의로 분담할 수 있습니다.',
  },
  {
    q: '에스크로 보관 기간은?',
    a: '입점 후 30일까지 보관됩니다. 30일 이내 클레임이 없으면 자동으로 양도인에게 송금됩니다.',
  },
  {
    q: '분쟁 시 어떻게 진행되나요?',
    a: 'amakers 중재팀이 양측 자료를 검토하고 평균 5일 이내 결과를 통지합니다. 합의가 어려운 경우 법적 절차로 이관됩니다.',
  },
  {
    q: '안전 거래 매물은 검색 결과에서 표시되나요?',
    a: '네. "안전 거래 지원" 뱃지가 매물 카드와 상세 페이지에 노출됩니다.',
  },
]

const STATS = [
  { label: '누적 안전 거래', value: '4,820건' },
  { label: '평균 분쟁 처리 기간', value: '5일' },
  { label: '권리금 환불 비율', value: '0.4%' },
  { label: '고객 만족도', value: '94%' },
]

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '더명당', url: 'https://themyungdang.amakers.co.kr' },
    { name: '안전 거래', url: 'https://themyungdang.amakers.co.kr/safe-deal' },
  ],
})

const faqJsonLd = buildFaqPageJsonLd({
  url: 'https://themyungdang.amakers.co.kr/safe-deal',
  items: FAQS.map((f) => ({ question: f.q, answer: f.a })),
})

const howToJsonLd = buildHowToJsonLd({
  name: '더명당 안전 거래 4단계',
  description: '매물 실사부터 에스크로 결제·분쟁 보호까지 권리금 분쟁 없이 거래하는 방법.',
  url: 'https://themyungdang.amakers.co.kr/safe-deal',
  totalTime: 'P3D',
  steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
})

export default function SafeDealPage() {
  return (
    <main>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={breadcrumbs} />
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto py-section">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            Safe Deal · amakers 안전 거래
          </p>
          <h1 className="mt-4 text-hero font-bold">
            권리금 거래의 위험을
            <br />
            절반으로 줄입니다
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            매물 실사·표준 계약서·에스크로 결제·30일 분쟁 보호까지. amakers 안전 거래로 권리금
            분쟁과 허위 매물 위험을 한 번에 줄이세요.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/post">
              <Button size="lg">안전 거래로 매물 등록</Button>
            </a>
            <a href="/listings">
              <Button size="lg" variant="ghost" className="gap-1 text-white hover:bg-white/10">
                안전 거래 매물 보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="mt-0.5 text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2 font-bold text-gray-900">안전 거래 4단계</h2>
            <p className="mt-3 text-gray-600">
              매물 등록부터 입점 후 30일까지, 양측을 모두 보호합니다.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Card key={s.title} className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <s.icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{s.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Protections */}
      <section className="container mx-auto py-section">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            6가지 보호 항목
          </p>
          <h2 className="mt-3 text-h2 font-bold text-gray-900">
            가맹 거래의 흔한 사고들, 어떻게 막을까요
          </h2>
          <p className="mt-3 text-gray-600">
            매물 양도·매각 과정에서 자주 발생하는 분쟁들을 amakers가 어떻게 차단하는지.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROTECTIONS.map((p) => (
            <Card key={p.title} className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <p.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Fees */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2 font-bold text-gray-900">투명한 수수료</h2>
            <p className="mt-3 text-gray-600">
              사후에 추가되는 비용은 없습니다. 사용한 항목만 정산됩니다.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="divide-y divide-gray-100 p-0">
                {FEES.map((f) => (
                  <div key={f.label} className="flex items-center justify-between px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{f.label}</div>
                    <div className="text-sm font-semibold text-gray-900">{f.price}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto py-section">
        <h2 className="text-h2 font-bold text-gray-900">자주 묻는 질문</h2>
        <div className="mt-6 space-y-2">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-gray-200 bg-white open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-gray-900">
                {f.q}
                <span className="text-gray-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-700">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto pb-section">
        <Card className="border-gray-200 bg-gray-900 text-white">
          <CardContent className="p-10 text-center">
            <h2 className="text-h2 font-bold">안전한 거래로 시작하세요</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-300">
              매물을 등록하시면 amakers 실사팀이 검수 후 안전 거래 매물로 등록됩니다.
              점주를 찾는 분은 검색 결과에서 안전 거래 뱃지가 붙은 매물부터 살펴보세요.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <a href="/post">
                <Button size="lg">안전 거래 매물 등록</Button>
              </a>
              <a href="/listings">
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                  안전 거래 매물 보기
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 뉴스레터 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto py-section">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              Newsletter
            </p>
            <h2 className="mt-3 text-h3 font-bold text-gray-900">안전 거래 가이드를 받아보세요</h2>
            <p className="mt-2 text-sm text-gray-500">권리금 분쟁 사례·계약 체크리스트·안전 거래 팁을 격주로 보내드립니다.</p>
            <form action="#" className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                구독하기
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-400">언제든 구독 해제 가능 · 스팸 없음</p>
          </div>
        </div>
      </section>
    </main>
  )
}
