// Detailed disclosure-style data per brand. Shaped to mirror what the
// Korean Franchise Association (KFA) publishes in 정보공개서.
// All figures are illustrative until real KFA data is wired in.

import type { MockBrand } from './mock-data'

export interface BrandHQ {
  companyName: string
  ceo: string
  foundedYear: number
  franchiseStartYear: number
  address: string
  phone: string
  website?: string
  bizNumber: string
}

export interface BrandCosts {
  /** 가맹비 (만원) */
  franchiseFee: number
  /** 보증금 (만원) */
  deposit: number
  /** 인테리어비 (만원, 표준 평수 기준) */
  interiorFee: number
  /** 교육비 (만원) */
  educationFee: number
  /** 기타 (만원) — 설비, 초도물품 등 */
  otherFees: number
  /** 월 로열티 — fixed: 만원, percentage: % of monthly revenue */
  royaltyType: 'fixed' | 'percentage' | 'none'
  royaltyValue: number
  /** 권장 매장 면적 (평) */
  recommendedArea: number
  /** 최소 매장 면적 (평) */
  minArea: number
}

export interface BrandOperations {
  averageArea: number
  averageStaff: number
  operatingHours: string
  primaryChannel: '매장 중심' | '배달 중심' | '혼합'
}

export interface BrandRevenue {
  /** 매장당 평균 월매출 (최근 1년, 만원) */
  averageMonthly: number
  /** 매장당 평균 영업이익 (월 기준, 만원) */
  averageOperatingProfit: number
  /** 연도별 매장당 평균 월매출 추이 */
  byYear: Array<{ year: number; avgMonthly: number }>
  /** 지역별 매출 비중 (%) */
  byRegion: Array<{ region: string; share: number }>
}

export interface BrandStoreHistory {
  year: number
  totalStores: number
  newStores: number
  closedStores: number
}

export interface BrandReview {
  id: string
  rating: number // 1-5
  summary: string
  detail: string
  /** "3년차 가맹점주" 같은 자기소개 */
  operatorRole: string
  region: string
  helpful: number
  /** ISO date string */
  createdAt: string
}

export interface BrandFAQ {
  q: string
  a: string
}

export interface BrandDetail {
  hq: BrandHQ
  costs: BrandCosts
  operations: BrandOperations
  revenue: BrandRevenue
  storeHistory: BrandStoreHistory[]
  reviews: BrandReview[]
  ratingDistribution: { stars: number; count: number }[]
  faqs: BrandFAQ[]
}

/** Compute total startup cost from cost components. */
export function totalStartupCost(c: BrandCosts): number {
  return c.franchiseFee + c.deposit + c.interiorFee + c.educationFee + c.otherFees
}

const REGION_DEFAULTS = [
  { region: '서울', share: 32 },
  { region: '경기·인천', share: 28 },
  { region: '부산·경남', share: 14 },
  { region: '대구·경북', share: 9 },
  { region: '대전·충청', share: 8 },
  { region: '광주·전라', share: 6 },
  { region: '강원·제주', share: 3 },
]

const FAQ_DEFAULTS: BrandFAQ[] = [
  {
    q: '가맹 신청 후 오픈까지 얼마나 걸리나요?',
    a: '본사 심사 + 입지 선정 + 인테리어 시공을 거쳐 평균 2~4개월 소요됩니다. 입지가 미리 확보되어 있으면 더 빠를 수 있습니다.',
  },
  {
    q: '본사가 점주 매출을 보장해주나요?',
    a: '계약상 매출은 보장되지 않습니다. 다만 본사가 공시한 평균 매출과 영업이익은 정보공개서에 기재되어 있으니 참고하세요.',
  },
  {
    q: '인테리어 비용에 무엇이 포함되나요?',
    a: '간판, 가구, 조명, 주방 설비, 전기·배관 공사가 포함됩니다. 평수에 따라 변동되며, 본사 지정 시공이 원칙입니다.',
  },
  {
    q: '폐업 시 보증금은 돌려받나요?',
    a: '계약 기간 만료 후 본사의 미정산금이 없을 경우 보증금 전액 또는 일부를 환급받습니다. 자세한 조건은 가맹계약서를 확인하세요.',
  },
  {
    q: '본사 광고/마케팅 비용은 누가 부담하나요?',
    a: '광고비는 본사가 부담하거나 점주가 일정 비율(매출의 1~3%)을 분담하는 방식이 있습니다. 정보공개서에 명시되어 있습니다.',
  },
  {
    q: '점주 교육은 어디서 진행하나요?',
    a: '본사 교육센터에서 5~14일간 진행되며, 메뉴 조리·매장 운영·POS 사용·CS 교육이 포함됩니다.',
  },
]

const SAMPLE_REVIEWS: Record<string, BrandReview[]> = {
  b1: [
    {
      id: 'r1-1',
      rating: 5,
      summary: '본사 응대가 빠르고 신메뉴 회전이 좋아요',
      detail: '2년 전 오픈했는데 본사 슈퍼바이저가 한 달에 두 번씩 방문해서 매장 운영 코칭을 해줍니다. 신메뉴도 자주 출시되어서 단골이 안 떨어집니다. 다만 신메뉴 출시할 때마다 초도물품을 의무 발주해야 해서 재고 부담은 있어요.',
      operatorRole: '3년차 가맹점주',
      region: '경기 안양',
      helpful: 24,
      createdAt: '2026-03-12',
    },
    {
      id: 'r1-2',
      rating: 4,
      summary: '입지에 따라 매출 차이가 크니 입지 분석을 꼼꼼히',
      detail: '오피스 상권이라 평일 점심 매출이 절반을 차지합니다. 본사가 추천해준 입지인데 결과적으로 만족합니다. 다만 주말 매출이 약해서 배달 비중을 키워야 했어요.',
      operatorRole: '2년차 가맹점주',
      region: '서울 마포',
      helpful: 18,
      createdAt: '2026-02-28',
    },
    {
      id: 'r1-3',
      rating: 3,
      summary: '맛은 좋은데 인테리어 비용이 부담스럽다',
      detail: '브랜드 콘셉트는 마음에 들지만 인테리어 단가가 평당 110만원 정도라 30평 매장 기준 3,300만원이 들어갑니다. 다른 브랜드 대비 높은 편이에요. 본사 지정 시공이라 협상 여지도 없습니다.',
      operatorRole: '1년차 가맹점주',
      region: '부산 해운대',
      helpful: 32,
      createdAt: '2026-01-15',
    },
    {
      id: 'r1-4',
      rating: 5,
      summary: '본사 마케팅이 강해서 신규 매장도 빠르게 자리잡았어요',
      detail: '오픈 한 달 만에 손익분기점을 넘었습니다. 본사 SNS와 인플루언서 협업이 좋아서 브랜드 인지도가 이미 만들어져 있는 게 큰 도움이 됩니다.',
      operatorRole: '6개월차 가맹점주',
      region: '인천 송도',
      helpful: 15,
      createdAt: '2025-12-20',
    },
  ],
  b2: [
    {
      id: 'r2-1',
      rating: 4,
      summary: '저자본 창업의 정석. 다만 마진은 박합니다',
      detail: '4천만원으로 시작해서 1년 만에 회수했습니다. 다만 객단가가 낮아서 회전율이 생명이에요. 입지가 안 좋으면 정말 힘듭니다.',
      operatorRole: '1년차 가맹점주',
      region: '경기 수원',
      helpful: 41,
      createdAt: '2026-04-02',
    },
    {
      id: 'r2-2',
      rating: 5,
      summary: '본사 시스템이 잘 되어 있어서 처음이라도 운영이 쉬워요',
      detail: '커피 만드는 법 모르고 시작했는데 본사 교육 2주 받으니 충분했습니다. POS, 발주, 인력 매뉴얼이 다 정비되어 있어요.',
      operatorRole: '8개월차 가맹점주',
      region: '서울 강서',
      helpful: 22,
      createdAt: '2026-03-05',
    },
    {
      id: 'r2-3',
      rating: 3,
      summary: '경쟁이 너무 치열해진 게 최대 단점',
      detail: '몇 년 사이에 동일 카테고리 브랜드가 폭증해서 골목마다 카페가 있습니다. 본사 책임은 아니지만 매장 거리 제한이 너무 짧아 신규 매장 들어올 때마다 매출이 빠집니다.',
      operatorRole: '3년차 가맹점주',
      region: '서울 강남',
      helpful: 56,
      createdAt: '2026-02-10',
    },
  ],
}

function fallbackReviewsFor(brand: MockBrand): BrandReview[] {
  return [
    {
      id: `${brand.id}-r-1`,
      rating: 4,
      summary: '본사 운영 시스템은 안정적이에요',
      detail: '운영 매뉴얼과 발주 시스템이 잘 정비되어 있어 처음 창업하는 분도 큰 어려움 없이 시작할 수 있습니다. 본사 슈퍼바이저 응대도 평균 이상입니다.',
      operatorRole: '2년차 가맹점주',
      region: '서울',
      helpful: 12,
      createdAt: '2026-03-01',
    },
    {
      id: `${brand.id}-r-2`,
      rating: 3,
      summary: '입지 영향이 큰 업종이라 신중하게 결정하세요',
      detail: '같은 브랜드라도 입지에 따라 매출 차이가 큽니다. 본사가 제공하는 상권 분석 외에도 본인이 직접 발품을 팔아 확인해보시는 걸 권합니다.',
      operatorRole: '1년차 가맹점주',
      region: '경기',
      helpful: 8,
      createdAt: '2026-02-12',
    },
    {
      id: `${brand.id}-r-3`,
      rating: 5,
      summary: '꾸준한 신메뉴 출시가 매출 유지에 도움됩니다',
      detail: '본사가 신메뉴를 분기에 한 번씩 출시해서 단골 이탈을 막아줍니다. 다만 신메뉴 출시 때 초도물품 발주가 의무라서 재고 관리는 필요합니다.',
      operatorRole: '3년차 가맹점주',
      region: '부산',
      helpful: 6,
      createdAt: '2026-01-20',
    },
  ]
}

function computeRatingDistribution(reviews: BrandReview[]) {
  const counts = [0, 0, 0, 0, 0]
  for (const r of reviews) counts[Math.min(Math.max(r.rating, 1), 5) - 1]++
  return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: counts[stars - 1] }))
}

/**
 * Derive a full detail view for a brand. Used by /brands/[id].
 * Some brands have rich hand-written data (b1, b2); others get sensible
 * defaults computed from base fields so the page is never blank.
 */
export function getBrandDetail(brand: MockBrand): BrandDetail {
  const hq: BrandHQ = {
    companyName: `(주)${brand.name}코리아`,
    ceo: BRAND_CEO_MAP[brand.id] ?? '김대표',
    foundedYear: 2026 - Math.max(5, Math.floor(brand.storeCount / 12)),
    franchiseStartYear: 2026 - Math.max(3, Math.floor(brand.storeCount / 20)),
    address: '서울특별시 강남구 테헤란로 123, 4층',
    phone: '02-1234-5678',
    website: `https://${brand.id}.example.kr`,
    bizNumber: `123-${brand.id.slice(1).padStart(2, '0')}-67890`,
  }

  const interiorPerPyeong = 90 + (brand.startupCost % 7) * 5
  const recommendedArea = brand.category === 'cafe' ? 10 : brand.category === 'snack' ? 12 : 20
  const interiorFee = Math.round(interiorPerPyeong * recommendedArea)
  const franchiseFee = Math.round(brand.startupCost * 0.18)
  const deposit = Math.round(brand.startupCost * 0.18)
  const educationFee = 200
  const otherFees = Math.max(brand.startupCost - franchiseFee - deposit - interiorFee - educationFee, 300)

  const costs: BrandCosts = {
    franchiseFee,
    deposit,
    interiorFee,
    educationFee,
    otherFees,
    royaltyType: brand.monthlyRoyalty > 0 ? 'fixed' : 'none',
    royaltyValue: brand.monthlyRoyalty,
    recommendedArea,
    minArea: Math.max(recommendedArea - 5, 6),
  }

  const operations: BrandOperations = {
    averageArea: recommendedArea + 2,
    averageStaff: brand.category === 'cafe' ? 2 : brand.category === 'snack' ? 2 : 4,
    operatingHours: brand.category === 'bar' ? '17:00 - 02:00' : '10:00 - 22:00',
    primaryChannel:
      brand.category === 'korean' || brand.category === 'snack'
        ? '혼합'
        : brand.category === 'bar'
          ? '매장 중심'
          : '매장 중심',
  }

  const baseRevenue = 1800 + brand.startupCost * 0.15 + brand.growthRate * 8
  const revenue: BrandRevenue = {
    averageMonthly: Math.round(baseRevenue),
    averageOperatingProfit: Math.round(baseRevenue * 0.18),
    byYear: [2021, 2022, 2023, 2024, 2025].map((year, i) => ({
      year,
      avgMonthly: Math.round(baseRevenue * (0.7 + i * 0.08)),
    })),
    byRegion: REGION_DEFAULTS,
  }

  const storeHistory: BrandStoreHistory[] = (() => {
    const final = brand.storeCount
    const growth = brand.growthRate / 100
    const years = [2021, 2022, 2023, 2024, 2025]
    const totals: number[] = []
    let running = final
    for (let i = years.length - 1; i >= 0; i--) {
      totals[i] = Math.max(1, Math.round(running))
      running = running / (1 + growth)
    }
    return years.map((year, i) => {
      const prev = i === 0 ? Math.round(totals[0] * 0.8) : totals[i - 1]
      const total = totals[i]
      const closed = Math.max(0, Math.round(total * 0.04))
      const newStores = total - prev + closed
      return { year, totalStores: total, newStores: Math.max(0, newStores), closedStores: closed }
    })
  })()

  const reviews = SAMPLE_REVIEWS[brand.id] ?? fallbackReviewsFor(brand)
  const ratingDistribution = computeRatingDistribution(reviews)

  return {
    hq,
    costs,
    operations,
    revenue,
    storeHistory,
    reviews,
    ratingDistribution,
    faqs: FAQ_DEFAULTS,
  }
}

const BRAND_CEO_MAP: Record<string, string> = {
  b1: '이상훈',
  b2: '박지영',
  b3: '김민호',
  b4: '나카무라 켄',
  b5: '최서윤',
  b6: '윤다은',
  b7: '오민재',
  b8: '강현우',
  b9: '정태우',
  b10: '한유진',
  b11: '백상목',
  b12: '문정아',
}
