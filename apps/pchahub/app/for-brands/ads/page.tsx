import type { Metadata } from 'next'
import { buildFaqPageJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '광고 상품',
  description: '예비 창업자 월 12만 명에게 브랜드를 노출하는 프차허브 광고 상품. 배너·피처드·카탈로그 패키지를 비교하세요.',
  path: '/for-brands/ads',
})

import { ArrowRight, Check, Minus } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

interface PricingTier {
  key: string
  name: string
  priceLabel: string
  priceNote: string
  highlight?: boolean
  description: string
  features: Array<{ label: string; included: boolean | string }>
}

const TIERS: PricingTier[] = [
  {
    key: 'basic',
    name: '기본 등록',
    priceLabel: '무료',
    priceNote: '본사 운영 한도 없음',
    description:
      '검색 결과 일반 노출 + 본사 대시보드 운영 + 가맹 문의 수신. 추가 비용 없이 영구 사용 가능합니다.',
    features: [
      { label: '검색 결과 노출', included: '일반' },
      { label: '협회 정보공개서 자동 연동', included: true },
      { label: '본사 정보 직접 수정', included: true },
      { label: '가맹 문의 수신', included: true },
      { label: '이메일 알림', included: true },
      { label: '광고 뱃지', included: false },
      { label: '카테고리 상단 노출', included: false },
      { label: '홈 hero 노출', included: false },
      { label: '매칭 우선순위', included: false },
      { label: '실시간 SMS 알림', included: false },
      { label: '월간 매칭 분석 리포트', included: false },
      { label: '전담 매니저', included: false },
    ],
  },
  {
    key: 'featured',
    name: '노출 강화',
    priceLabel: '300,000원',
    priceNote: '월 정액 · 약정 없음',
    highlight: true,
    description:
      '본인 카테고리에서 검색 결과 최상위 노출. 광고 뱃지가 붙어 신뢰성과 노출이 동시에 올라갑니다.',
    features: [
      { label: '검색 결과 노출', included: '카테고리 상단' },
      { label: '협회 정보공개서 자동 연동', included: true },
      { label: '본사 정보 직접 수정', included: true },
      { label: '가맹 문의 수신', included: true },
      { label: '이메일 알림', included: true },
      { label: '광고 뱃지', included: true },
      { label: '카테고리 상단 노출', included: true },
      { label: '홈 hero 노출', included: false },
      { label: '매칭 우선순위', included: '우선' },
      { label: '실시간 SMS 알림', included: true },
      { label: '월간 매칭 분석 리포트', included: '월 1회' },
      { label: '전담 매니저', included: false },
    ],
  },
  {
    key: 'premium',
    name: '프리미엄',
    priceLabel: '800,000원',
    priceNote: '월 정액 · 약정 없음',
    description:
      '홈 hero 노출 + 검색 결과 최상위 + 매칭 우선순위 최우선. 전담 매니저가 광고 운영과 점주 응답을 함께 관리합니다.',
    features: [
      { label: '검색 결과 노출', included: '전체 최상위' },
      { label: '협회 정보공개서 자동 연동', included: true },
      { label: '본사 정보 직접 수정', included: true },
      { label: '가맹 문의 수신', included: true },
      { label: '이메일 알림', included: true },
      { label: '광고 뱃지', included: true },
      { label: '카테고리 상단 노출', included: true },
      { label: '홈 hero 노출', included: true },
      { label: '매칭 우선순위', included: '최우선' },
      { label: '실시간 SMS 알림', included: true },
      { label: '월간 매칭 분석 리포트', included: '매주' },
      { label: '전담 매니저', included: true },
    ],
  },
]

const ADD_ONS = [
  {
    label: '정보공개서 PDF 호스팅',
    price: '무료',
    note: '모든 등급 포함',
  },
  {
    label: '매장 위치 지도 노출 (전국)',
    price: '무료',
    note: '모든 등급 포함',
  },
  {
    label: '상권 분석 리포트',
    price: '월 100,000원',
    note: '본사가 지정한 5개 지역까지',
  },
  {
    label: '점주 후기 인증 관리',
    price: '월 50,000원',
    note: '진위 검증 + 본사 답글 우선 노출',
  },
  {
    label: '브랜드 라이브 매장 투어',
    price: '회당 300,000원',
    note: 'amakers 운영 라이브 + 영상 자산 제공',
  },
  {
    label: '다국어 페이지 (영/중)',
    price: '월 200,000원',
    note: '해외 투자자·이민자 대상 노출',
  },
]

const FAQS = [
  {
    q: '약정 기간이 있나요?',
    a: '약정은 없습니다. 모든 광고 상품은 월 단위로 결제·해지 가능하며, 다음 결제일에 자동으로 정산됩니다.',
  },
  {
    q: '효과는 어떻게 측정하나요?',
    a: '대시보드에서 노출 수·클릭 수·문의 수·매칭 신청 수를 일자별로 확인할 수 있습니다. 노출 강화 등급 이상은 월간 분석 리포트가 함께 제공됩니다.',
  },
  {
    q: '복수 브랜드를 운영합니다. 할인이 있나요?',
    a: '3개 이상 브랜드 운영 시 동일 본사 명의로 통합 결제하면 두 번째 브랜드부터 20% 할인이 적용됩니다.',
  },
  {
    q: '광고 시작 후 언제부터 노출되나요?',
    a: '결제 확인 후 영업일 기준 1일 이내 적용됩니다. 야간·주말 결제는 다음 영업일에 반영됩니다.',
  },
]

const faqJsonLd = buildFaqPageJsonLd({
  url: 'https://pchahub.kr/for-brands/ads',
  items: FAQS.map((f) => ({ question: f.q, answer: f.a })),
})

export default function AdsPage() {
  return (
    <main className="bg-gray-50">
      <JsonLd data={faqJsonLd} />
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-section">
          <a
            href="/for-brands"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            ← 본사 안내로
          </a>
          <h1 className="mt-4 text-h2 font-bold text-gray-900">광고 상품</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            기본 등록은 무료이지만, 카테고리 상단·홈 노출 같은 광고 상품으로 매칭 효율을 더 빠르게
            끌어올릴 수 있습니다. 모든 상품은 월 정액제로 약정이 없습니다.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {TIERS.map((t) => (
            <Card
              key={t.key}
              className={
                'flex h-full flex-col ' +
                (t.highlight
                  ? 'border-2 shadow-lg'
                  : 'border border-gray-200 shadow-sm')
              }
              style={t.highlight ? { borderColor: 'var(--brand-primary)' } : undefined}
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-h4 font-bold text-gray-900">{t.name}</h2>
                  {t.highlight && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                      style={{ background: 'var(--brand-primary)' }}
                    >
                      추천
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-h2 font-bold text-gray-900">{t.priceLabel}</div>
                  <div className="mt-1 text-xs text-gray-500">{t.priceNote}</div>
                </div>
                <p className="mt-4 min-h-[3.5rem] text-sm text-gray-600">{t.description}</p>

                <ul className="mt-5 space-y-2.5 text-sm">
                  {t.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2">
                      {f.included === false ? (
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                      ) : (
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: 'var(--brand-primary)' }}
                        />
                      )}
                      <span className={f.included === false ? 'text-gray-400' : 'text-gray-700'}>
                        {f.label}
                        {typeof f.included === 'string' && (
                          <span className="ml-1 text-xs text-gray-500">— {f.included}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex-1" />
                <a href="/for-brands/register" className="mt-6 block">
                  <Button
                    size="lg"
                    variant={t.highlight ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {t.key === 'basic' ? '무료 등록 시작' : '이 등급으로 시작'}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto py-8">
        <div className="mb-6">
          <h2 className="text-h4 font-semibold text-gray-900">부가 옵션</h2>
          <p className="mt-1 text-sm text-gray-500">
            등급과 별개로 필요한 옵션만 골라 추가할 수 있습니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ADD_ONS.map((a) => (
            <Card key={a.label} className="border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{a.label}</div>
                    <div className="mt-1 text-xs text-gray-500">{a.note}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-bold text-gray-900">{a.price}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto py-8">
        <h2 className="text-h4 font-semibold text-gray-900">자주 묻는 질문</h2>
        <div className="mt-4 space-y-2">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-gray-200 bg-white open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-gray-900">
                {f.q}
                <span className="text-gray-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-700">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="container mx-auto pb-section">
        <Card className="border-gray-200 bg-gray-900 text-white">
          <CardContent className="p-10 text-center">
            <h2 className="text-h3 font-bold">먼저 무료로 등록하고, 필요하면 광고를 켜세요</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-300">
              기본 등록만으로도 검색 노출·문의 수신·대시보드를 모두 사용할 수 있습니다. 광고는
              매칭 효율을 가속하고 싶을 때 한 달 단위로 부담 없이 시작하세요.
            </p>
            <a href="/for-brands/register" className="mt-6 inline-block">
              <Button size="lg" className="gap-1">
                본사 등록 시작
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
