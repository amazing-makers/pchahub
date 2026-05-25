import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'
import { buildBreadcrumbsJsonLd, buildFaqPageJsonLd, buildPageMetadata, JsonLd } from '@amakers/design-system'
import { Card, CardContent } from '@amakers/ui'

export const metadata: Metadata = buildPageMetadata('openrun', {
  title: '요금표',
  description: '오픈런 마케팅 서비스 요금표. 그랜드오픈·채용·브랜드마케팅 3가지 서비스의 패키지별 가격과 포함 항목을 확인하세요.',
  path: '/pricing',
})

const breadcrumbs = buildBreadcrumbsJsonLd({
  items: [
    { name: '오픈런', url: 'https://openrun.amakers.co.kr' },
    { name: '요금표', url: 'https://openrun.amakers.co.kr/pricing' },
  ],
})

const PRICING = [
  {
    slug: 'grand-open',
    service: '그랜드오픈',
    accentColor: '#F97316',
    tiers: [
      {
        name: '베이직',
        price: '390만원',
        duration: '오픈 D-7 ~ D+30',
        highlight: false,
        includes: [
          'SNS 계정 셋업 (인스타그램·네이버)',
          '콘텐츠 제작 20개',
          '블로그 후기 3건',
          '배달앱 오픈 쿠폰 세팅',
          '주간 성과 리포트 4회',
        ],
        notIncludes: ['인플루언서 협업', '배달앱 광고 운영', '오픈 이벤트 기획'],
      },
      {
        name: '스탠다드',
        price: '590만원',
        duration: '오픈 D-7 ~ D+30',
        highlight: true,
        includes: [
          'SNS 계정 셋업 (인스타그램·네이버)',
          '콘텐츠 제작 30개',
          '블로그 후기 5건',
          '인플루언서 협업 3명',
          '배달앱 오픈 쿠폰 세팅',
          '주간 성과 리포트 4회',
        ],
        notIncludes: ['배달앱 광고 운영', '오픈 이벤트 기획'],
      },
      {
        name: '프리미엄',
        price: '890만원',
        duration: '오픈 D-7 ~ D+30',
        highlight: false,
        includes: [
          'SNS 계정 셋업 (인스타그램·네이버)',
          '콘텐츠 제작 30개',
          '블로그 후기 5건',
          '인플루언서 협업 5명',
          '배달앱 광고 운영 (3개 플랫폼)',
          '오픈 이벤트 기획 + 운영',
          '주간 성과 리포트 4회',
        ],
        notIncludes: [],
      },
    ],
  },
  {
    slug: 'recruit',
    service: '채용',
    accentColor: '#10B981',
    tiers: [
      {
        name: '베이직',
        price: '290만원',
        duration: '채용 완료까지 (최대 60일)',
        highlight: false,
        includes: [
          '채용 공고 작성 + 2채널 등록',
          '지원자 서류 1차 검토',
          '채용 완료 후 리포트',
        ],
        notIncludes: ['1차 인터뷰 지원', '다채널(4개+) 동시 게시', '합격자 온보딩 지원'],
      },
      {
        name: '스탠다드',
        price: '490만원',
        duration: '채용 완료까지 (최대 60일)',
        highlight: true,
        includes: [
          '채용 공고 작성 + 4채널 동시 등록',
          '지원자 서류 1차 검토 + 필터링',
          '1차 인터뷰 일정 조율 지원',
          '채용 완료 후 리포트',
        ],
        notIncludes: ['6채널 동시 게시', '합격자 온보딩 지원'],
      },
      {
        name: '프리미엄',
        price: '790만원',
        duration: '채용 완료까지 (최대 90일)',
        highlight: false,
        includes: [
          '채용 공고 작성 + 6채널 동시 등록',
          '지원자 서류 검토 + 1·2차 필터링',
          '인터뷰 2라운드 일정 조율',
          '합격자 온보딩 체크리스트 제공',
          '채용 완료 후 종합 리포트',
        ],
        notIncludes: [],
      },
    ],
  },
  {
    slug: 'brand-marketing',
    service: '브랜드마케팅',
    accentColor: '#8B5CF6',
    tiers: [
      {
        name: '베이직',
        price: '월 490만원',
        duration: '최소 3개월',
        highlight: false,
        includes: [
          '월 콘텐츠 제작 12개',
          '인스타그램·블로그 운영 대행',
          '배달앱 광고 운영',
          '월간 성과 리포트',
        ],
        notIncludes: ['인플루언서 협업', '전담 캠페인 매니저', '광고비 최적화 보고'],
      },
      {
        name: '스탠다드',
        price: '월 790만원',
        duration: '최소 3개월',
        highlight: true,
        includes: [
          '월 콘텐츠 제작 20개',
          '인스타그램·블로그·유튜브 Shorts 운영',
          '인플루언서 협업 월 2명',
          '배달앱 광고 운영',
          '광고비 최적화 주간 리포트',
          '월간 전략 미팅',
        ],
        notIncludes: ['전담 캠페인 매니저'],
      },
      {
        name: '프리미엄',
        price: '월 1,290만원',
        duration: '최소 3개월',
        highlight: false,
        includes: [
          '월 콘텐츠 제작 30개',
          '인스타그램·블로그·유튜브 Shorts 운영',
          '인플루언서 협업 월 4명',
          '배달앱 광고 + 네이버·메타 광고 운영',
          '전담 캠페인 매니저 배정',
          '광고비 최적화 주간 리포트',
          '월간 전략 미팅 + 분기 성과 발표',
        ],
        notIncludes: [],
      },
    ],
  },
]

const FAQS = [
  {
    q: '계약 후 환불이 가능한가요?',
    a: '캠페인 시작 전(D-3 이전)에는 전액 환불됩니다. 캠페인 시작 이후에는 진행된 업무 비율만큼 차감 후 환불합니다.',
  },
  {
    q: '요금에 광고비(배달앱·SNS 광고비)가 포함되어 있나요?',
    a: '아니오. 요금표에 명시된 금액은 운영 대행 수수료이며, 실제 광고 집행 비용(배달앱·메타·네이버 광고비)은 별도입니다. 광고비 예산은 계약 시 협의합니다.',
  },
  {
    q: '업종·지역에 따라 가격이 달라지나요?',
    a: '기본 요금은 동일하지만, 경쟁이 치열한 상권(강남·홍대·이태원 등) 또는 특수 업종(고급 일식, 복합 브랜드)은 별도 견적이 발생할 수 있습니다.',
  },
  {
    q: '성과 보장이 되나요?',
    a: '특정 수치를 법적으로 보장하지는 않습니다. 다만, 오픈런은 결과 기반 캠페인 설계를 원칙으로 하며, 목표 미달 시 추가 지원을 제공합니다. 과거 480개 캠페인의 평균 ROI는 312%입니다.',
  },
]

const faqJsonLd = buildFaqPageJsonLd({
  url: 'https://openrun.amakers.co.kr/pricing',
  items: FAQS.map((f) => ({ question: f.q, answer: f.a })),
})

interface PricingPageProps {
  searchParams: { service?: string }
}

export default function PricingPage({ searchParams }: PricingPageProps) {
  const activeService = searchParams.service ?? 'grand-open'
  const active = PRICING.find((p) => p.slug === activeService) ?? PRICING[0]

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqJsonLd} />

      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto py-section text-center">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-primary)' }}
          >
            Pricing
          </p>
          <h1 className="mt-3 text-h2 font-bold text-gray-900">투명한 요금표</h1>
          <p className="mt-3 mx-auto max-w-xl text-sm text-gray-500">
            숨겨진 비용 없이 서비스별·패키지별 금액을 공개합니다.
            광고 집행 비용은 별도이며, 모든 패키지는 맞춤 상담 후 조정 가능합니다.
          </p>
        </div>
      </section>

      {/* Service tabs */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="container mx-auto">
          <div className="flex gap-0 overflow-x-auto">
            {PRICING.map((p) => (
              <a
                key={p.slug}
                href={`/pricing?service=${p.slug}`}
                className={
                  'shrink-0 border-b-2 px-5 py-4 text-sm font-semibold transition-colors ' +
                  (activeService === p.slug
                    ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700')
                }
              >
                {p.service}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing tiers */}
      <section className="container mx-auto py-section">
        <div className="grid gap-5 md:grid-cols-3">
          {active.tiers.map((tier) => (
            <Card
              key={tier.name}
              className={
                'relative overflow-hidden transition-shadow ' +
                (tier.highlight ? 'ring-2 shadow-lg' : 'hover:shadow-md')
              }
              style={tier.highlight ? { ringColor: active.accentColor } : undefined}
            >
              {tier.highlight && (
                <div
                  className="absolute inset-x-0 top-0 py-1 text-center text-[11px] font-bold text-white"
                  style={{ background: active.accentColor }}
                >
                  인기 선택
                </div>
              )}
              <div
                className="h-1 w-full"
                style={{ background: active.accentColor }}
              />
              <CardContent className={`p-6 ${tier.highlight ? 'pt-8' : ''}`}>
                <div className="text-sm font-semibold text-gray-500">{tier.name}</div>
                <div className="mt-1 text-2xl font-black text-gray-900">{tier.price}</div>
                <div className="mt-0.5 text-xs text-gray-400">{tier.duration}</div>

                <div className="mt-5 space-y-2">
                  {tier.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: active.accentColor }} />
                      {item}
                    </div>
                  ))}
                  {tier.notIncludes.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-gray-400 line-through">
                      <span className="mt-0.5 h-3.5 w-3.5 shrink-0 text-center text-gray-300">✕</span>
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={`/contact?service=${active.slug}&tier=${tier.name}`}
                  className={
                    'mt-6 flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 ' +
                    (tier.highlight ? 'text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50')
                  }
                  style={tier.highlight ? { background: active.accentColor } : undefined}
                >
                  상담 신청 <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          * 광고 집행 비용(배달앱·메타·네이버 광고비)은 요금에 포함되지 않습니다. 모든 가격은 VAT 별도입니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 py-section">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-h3 font-bold text-gray-900 text-center">자주 묻는 질문</h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-gray-900 p-8 text-center text-white">
            <h3 className="text-h4 font-bold">딱 맞는 패키지가 없다면?</h3>
            <p className="mt-2 text-sm text-gray-300">
              매장 상황에 맞게 구성을 조정할 수 있습니다. 무료 상담으로 최적 플랜을 받아보세요.
            </p>
            <a
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
              style={{ background: 'var(--brand-primary)', color: 'white' }}
            >
              무료 상담 신청 <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
