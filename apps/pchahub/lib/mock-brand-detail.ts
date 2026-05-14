// Detailed disclosure-style data per brand. Shaped to mirror what the
// Korean Franchise Association (KFA) publishes in 정보공개서.
// All figures are illustrative until real KFA data is wired in.

import type { MockBrand } from './mock-data'

export interface BrandHQ {
  companyName: string
  /** 대표자 — 실API 브랜드는 제공 안됨 */
  ceo?: string
  foundedYear: number
  franchiseStartYear: number
  /** 본사 주소 — 실API 브랜드는 제공 안됨 */
  address?: string
  /** 연락처 — 실API 브랜드는 제공 안됨 */
  phone?: string
  website?: string
  /** 사업자등록번호 — 실API 브랜드는 제공 안됨 */
  bizNumber?: string
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

/** Sourced from 정보공개서 X-2 ~ X-7 sections. */
export interface BrandDisclosureExtras {
  /** 본사 광고비 부담 비율 (%) — 100이면 본사가 전액 부담 */
  hqAdvertisingShare: number
  /** 점주 광고/판촉 분담 (매출의 %) — 0이면 없음 */
  storeAdvertisingShare: number
  /** 계약 기간 (년) */
  contractYears: number
  /** 계약 갱신 조건 */
  renewalTerms: string
  /** 영업지역 보호 정책 */
  territoryProtection: string
  /** 상표 등록 여부 */
  trademarkRegistered: boolean
  /** 가맹사업 등록번호 (정보공개서 등록 번호) */
  registrationNumber: string
  /** 정보공개서 최종 갱신일 */
  disclosureUpdatedAt: string
}

export interface BrandMenuItem {
  name: string
  /** 만원 단위가 아닌 원 단위 가격 */
  priceWon: number
  image: string
  /** 시그니처 메뉴 표시 */
  signature?: boolean
  /** 한 줄 소개 */
  description?: string
}

export interface BrandRecentOpening {
  storeName: string
  region: string
  district: string
  /** 오픈일 (ISO date) */
  openedAt: string
  /** 매장 평수 */
  area: number
  image: string
}

export interface BrandPhotos {
  /** 매장 대표 이미지 (히어로) */
  hero: string
  /** 매장 인테리어 사진 모음 */
  store: string[]
  /** 메뉴/제품 사진 모음 (메뉴 이미지와 별개) */
  gallery: string[]
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
  disclosure: BrandDisclosureExtras
  menu: BrandMenuItem[]
  recentOpenings: BrandRecentOpening[]
  photos: BrandPhotos
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
  b3: [
    {
      id: 'r3-1',
      rating: 4,
      summary: '배달 비중이 높아 입지 부담이 적은 편',
      detail: '도시락 콘셉트라서 매장 객수보다 배달 비중이 70%입니다. 1층이 아니어도 운영 가능해서 임대료 부담이 다른 한식 브랜드보다 확실히 낮아요. 다만 배달앱 광고비를 매출의 5-7% 정도 추가로 잡아야 합니다.',
      operatorRole: '2년차 가맹점주',
      region: '경기 일산',
      helpful: 19,
      createdAt: '2026-03-22',
    },
    {
      id: 'r3-2',
      rating: 3,
      summary: '신메뉴 주기가 너무 잦아서 식자재 재고가 부담',
      detail: '매월 신메뉴가 추가되는 점은 단골 유지에 좋지만, 의무 발주 품목이 늘어서 폐기율이 올라갑니다. 본사에 협의해 발주량을 점주가 조정할 수 있게 해주면 좋겠습니다.',
      operatorRole: '1년차 가맹점주',
      region: '서울 노원',
      helpful: 27,
      createdAt: '2026-02-18',
    },
    {
      id: 'r3-3',
      rating: 5,
      summary: '본사 SV가 한 달에 두 번 매장 방문 — 응대가 적극적',
      detail: '본사 슈퍼바이저가 정기적으로 방문해서 매출 분석, 메뉴 제안, 인력 운영까지 코칭해주십니다. 다른 한식 브랜드 비교해봤는데 본사 응대 빈도가 압도적으로 높았어요.',
      operatorRole: '3년차 가맹점주',
      region: '인천 부평',
      helpful: 14,
      createdAt: '2026-01-05',
    },
  ],
  b4: [
    {
      id: 'r4-1',
      rating: 5,
      summary: '객단가가 높아 매출 변동성이 적어요',
      detail: '평균 객단가 25,000원 정도라 매장당 월매출이 안정적입니다. 다만 인테리어가 평당 130만원으로 정말 비싸요. 30평 기준 4천만원 가까이 들어갑니다.',
      operatorRole: '2년차 가맹점주',
      region: '서울 송파',
      helpful: 38,
      createdAt: '2026-04-08',
    },
    {
      id: 'r4-2',
      rating: 3,
      summary: '본사 식자재 단가가 시장가 대비 비쌉니다',
      detail: '본사 지정 식자재가 의무라서 자유롭게 도매로 못 가져옵니다. 품질은 좋은데 원가율이 35-38%로 한식 평균보다 높아요. 매출 잘 나오는 매장 위주로 추천하는 이유가 있습니다.',
      operatorRole: '1년차 가맹점주',
      region: '경기 분당',
      helpful: 42,
      createdAt: '2026-03-15',
    },
    {
      id: 'r4-3',
      rating: 4,
      summary: '주방 인력이 핵심 — 인건비 부담이 큽니다',
      detail: '초밥 + 라멘 듀얼이라 주방 인력 3명이 기본입니다. 인건비가 매출의 22-25% 가까이 차지해서 월매출 3천만원 이하로 떨어지면 손익분기 위협받습니다.',
      operatorRole: '4개월차 가맹점주',
      region: '부산 서면',
      helpful: 21,
      createdAt: '2026-02-28',
    },
  ],
  b5: [
    {
      id: 'r5-1',
      rating: 4,
      summary: '오래된 브랜드라 운영 시스템이 안정적',
      detail: '20년 된 브랜드라 본사 매뉴얼이 정말 잘 정비되어 있습니다. 다만 트렌드 변화가 빠른 분식 시장에서 신메뉴 출시 속도가 느린 게 단점이에요.',
      operatorRole: '5년차 가맹점주',
      region: '서울 강북',
      helpful: 31,
      createdAt: '2026-03-30',
    },
    {
      id: 'r5-2',
      rating: 3,
      summary: '회전율이 안 되면 적자입니다. 입지가 정말 중요',
      detail: '객단가가 낮아서 일 객수 200명 이상은 나와야 손익분기를 맞춥니다. 학원가, 학교 앞 같은 학생 상권 아니면 추천 안 합니다.',
      operatorRole: '2년차 가맹점주',
      region: '대구 수성구',
      helpful: 47,
      createdAt: '2026-02-22',
    },
    {
      id: 'r5-3',
      rating: 4,
      summary: '낮은 가맹비 + 낮은 인테리어 = 저자본 가능',
      detail: '총 창업비 3,800만원으로 시작할 수 있어 첫 창업으로 부담이 적었습니다. 다만 매장 관리가 까다롭고 회전율 압박이 큰 만큼 1인 운영은 비추천.',
      operatorRole: '1년차 가맹점주',
      region: '광주 북구',
      helpful: 18,
      createdAt: '2026-01-12',
    },
  ],
  b6: [
    {
      id: 'r6-1',
      rating: 5,
      summary: 'SNS 마케팅이 강해서 신규 매장 자리잡기 쉬워요',
      detail: '본사 인스타그램이 잘 운영되고 인플루언서 협업도 자주 있어서 오픈 한 달 만에 단골이 생겼습니다. 디저트 카페는 SNS가 곧 매출이라 이건 결정적이에요.',
      operatorRole: '8개월차 가맹점주',
      region: '서울 성수',
      helpful: 34,
      createdAt: '2026-04-10',
    },
    {
      id: 'r6-2',
      rating: 4,
      summary: '재료 원가율이 높아 객단가 관리가 핵심',
      detail: '프리미엄 디저트라 재료비가 매출의 38-42%까지 갑니다. 본사가 정한 가격대를 어기면 안 되니 마케팅으로 객수를 끌어올리는 게 답이에요.',
      operatorRole: '1년차 가맹점주',
      region: '경기 광교',
      helpful: 22,
      createdAt: '2026-03-08',
    },
    {
      id: 'r6-3',
      rating: 5,
      summary: '본사 디저트 트렌드 반영이 빠릅니다',
      detail: '분기마다 새로운 디저트 라인을 출시해주십니다. 일본·유럽 트렌드를 빠르게 가져와서 단골 이탈을 막아줍니다. 다만 신메뉴 출시 때 초도물품 발주가 부담스러워요.',
      operatorRole: '2년차 가맹점주',
      region: '부산 광안리',
      helpful: 16,
      createdAt: '2026-02-04',
    },
  ],
  b7: [
    {
      id: 'r7-1',
      rating: 5,
      summary: '1인 운영 가능해서 인건비 부담이 적습니다',
      detail: '메뉴가 단순하고 자동화된 부분이 많아 본인 혼자 운영 가능합니다. 인건비 부담이 없어서 매출이 그대로 영업이익으로 남는 구조입니다.',
      operatorRole: '1년차 가맹점주',
      region: '서울 영등포',
      helpful: 28,
      createdAt: '2026-04-15',
    },
    {
      id: 'r7-2',
      rating: 3,
      summary: '여름 매출 의존도가 너무 큽니다',
      detail: '6-9월 4개월이 연 매출의 60% 정도입니다. 겨울에는 매장 운영 시간 줄이고 비용 통제 들어가지 않으면 적자나기 쉬워요. 비수기 대비 자금 준비 필수.',
      operatorRole: '2년차 가맹점주',
      region: '대전 둔산',
      helpful: 39,
      createdAt: '2026-03-02',
    },
    {
      id: 'r7-3',
      rating: 4,
      summary: '객단가는 낮지만 회전율로 커버합니다',
      detail: '객단가 6,000원 정도라 일 객수 100명 이상은 나와야 합니다. 테이크아웃 비중이 높은 입지에서 강합니다.',
      operatorRole: '8개월차 가맹점주',
      region: '경기 평촌',
      helpful: 15,
      createdAt: '2026-01-28',
    },
  ],
  b8: [
    {
      id: 'r8-1',
      rating: 3,
      summary: '야간 인력 확보가 가장 어렵습니다',
      detail: '저녁 5시-새벽 2시 운영이라 야간 시급이 일반 매장의 1.5배입니다. 그것도 사람 구하기 어려워요. 본인이 직접 매장 서는 게 손익에 가장 좋습니다.',
      operatorRole: '1년차 가맹점주',
      region: '서울 종로',
      helpful: 33,
      createdAt: '2026-04-05',
    },
    {
      id: 'r8-2',
      rating: 4,
      summary: '객단가가 높고 주말 매출 강합니다',
      detail: '객단가 25,000원 정도로 주류 매출이 함께 들어와서 매장당 월매출이 식음료 평균보다 30% 이상 높습니다. 다만 주말에 매출이 몰려서 평일 운영이 부담.',
      operatorRole: '3년차 가맹점주',
      region: '부산 서면',
      helpful: 26,
      createdAt: '2026-02-15',
    },
    {
      id: 'r8-3',
      rating: 5,
      summary: '본사가 점주 교육에 적극적입니다',
      detail: '주류 운영, 안주 메뉴, 야간 응대까지 본사 교육이 2주 진행됩니다. 야간 매장이 처음이라도 사고 없이 운영할 수 있도록 본사 매뉴얼이 자세해요.',
      operatorRole: '2년차 가맹점주',
      region: '대구 동성로',
      helpful: 12,
      createdAt: '2026-01-08',
    },
  ],
  b9: [
    {
      id: 'r9-1',
      rating: 5,
      summary: '성장세가 빠르고 SNS 노출이 좋아 신규 진입 메리트 있음',
      detail: '에어프라이 콘셉트가 차별화되어 SNS 노출 빈도가 높습니다. 매장 수가 빠르게 늘어나는 시기라 신규 매장도 빠르게 자리잡습니다.',
      operatorRole: '6개월차 가맹점주',
      region: '경기 동탄',
      helpful: 24,
      createdAt: '2026-04-12',
    },
    {
      id: 'r9-2',
      rating: 3,
      summary: '신생 브랜드라 본사 시스템은 아직 미흡',
      detail: '성장은 빠르지만 SV 인력이 부족해서 본사 응대가 늦어지는 경우가 있습니다. 매장 운영 문제는 점주가 자체적으로 해결해야 하는 부분도 있어요. 1-2년 더 지나면 안정될 것으로 봅니다.',
      operatorRole: '1년차 가맹점주',
      region: '서울 마곡',
      helpful: 31,
      createdAt: '2026-03-18',
    },
    {
      id: 'r9-3',
      rating: 4,
      summary: '저칼로리 콘셉트가 여성 고객층에 강합니다',
      detail: '20-30대 여성 고객이 매출의 60% 이상입니다. 일반 치킨 대비 객단가는 살짝 높지만 충성도 좋은 고객이 잘 잡혀서 매출 변동성이 적습니다.',
      operatorRole: '3개월차 가맹점주',
      region: '대전 유성',
      helpful: 11,
      createdAt: '2026-02-20',
    },
  ],
  b10: [
    {
      id: 'r10-1',
      rating: 4,
      summary: '동네 카페로 자리잡기 쉽고 안정적입니다',
      detail: '주거지 인근 30평 매장으로 운영하는데 단골 위주로 매출이 안정적입니다. 트렌디한 카페는 아니지만 꾸준한 매출이 매력입니다.',
      operatorRole: '3년차 가맹점주',
      region: '서울 노원',
      helpful: 19,
      createdAt: '2026-03-25',
    },
    {
      id: 'r10-2',
      rating: 5,
      summary: '본사 시스템이 잘 정비되어 있어 운영이 편해요',
      detail: 'POS, 발주, 인력 매뉴얼이 다 정비되어 있고 본사 응대도 빠릅니다. 카페 운영 경험 없어도 본사 교육 2주면 충분히 시작할 수 있습니다.',
      operatorRole: '2년차 가맹점주',
      region: '인천 송도',
      helpful: 27,
      createdAt: '2026-02-08',
    },
    {
      id: 'r10-3',
      rating: 3,
      summary: '디저트 부문이 약해서 객단가 한계',
      detail: '커피만으로는 객단가 5,500원이 한계라서 매장당 월매출 1,800만원이 평균입니다. 디저트 라인업이 좀 더 강화되면 좋겠습니다.',
      operatorRole: '1년차 가맹점주',
      region: '경기 부천',
      helpful: 22,
      createdAt: '2026-01-15',
    },
  ],
  b11: [
    {
      id: 'r11-1',
      rating: 4,
      summary: '국밥 단가 안정적이고 매출 변동 적음',
      detail: '한 그릇 9,000원으로 객단가가 안정적이고 점심·저녁 매출이 고르게 나옵니다. 매장당 월매출 변동성이 다른 한식 대비 낮습니다.',
      operatorRole: '4년차 가맹점주',
      region: '부산 동래',
      helpful: 25,
      createdAt: '2026-04-01',
    },
    {
      id: 'r11-2',
      rating: 5,
      summary: '본사 식자재 단가가 적정 수준입니다',
      detail: '식자재 단가가 시장 평균 수준이라 원가 부담이 적습니다. 다른 한식 본사 비교해봤는데 단가 정책이 가장 합리적이었어요.',
      operatorRole: '2년차 가맹점주',
      region: '대구 북구',
      helpful: 16,
      createdAt: '2026-02-25',
    },
    {
      id: 'r11-3',
      rating: 3,
      summary: '메뉴가 한정적이라 객단가 상승 어려움',
      detail: '국밥·곰탕 중심이라 객단가 1만원을 넘기기 어렵습니다. 사이드 메뉴를 더 늘려주면 좋겠는데 본사 정책상 메뉴 자유도가 낮은 점이 아쉬워요.',
      operatorRole: '1년차 가맹점주',
      region: '울산 남구',
      helpful: 18,
      createdAt: '2026-01-22',
    },
  ],
  b12: [
    {
      id: 'r12-1',
      rating: 5,
      summary: '라멘 전문이라 점심 매출이 안정적',
      detail: '오피스 상권에서 점심 객수가 안정적입니다. 라멘 단일 메뉴로 회전율이 빠르고 객단가도 13,000원 정도라 매출 안정성 좋아요.',
      operatorRole: '2년차 가맹점주',
      region: '서울 광화문',
      helpful: 29,
      createdAt: '2026-03-28',
    },
    {
      id: 'r12-2',
      rating: 4,
      summary: '주방 동선 효율이 손익에 결정적',
      detail: '주방이 좁으면 회전율이 떨어져 점심 피크 시간을 못 받습니다. 매장 답사 때 주방 구조를 가장 꼼꼼히 봐야 합니다.',
      operatorRole: '1년차 가맹점주',
      region: '경기 판교',
      helpful: 21,
      createdAt: '2026-02-14',
    },
    {
      id: 'r12-3',
      rating: 4,
      summary: '본사 재료 공급이 안정적입니다',
      detail: '돈코츠 육수 등 본사 직배송 재료가 항상 안정적으로 들어옵니다. 다만 본사 지정 단가가 시장가보다 살짝 높아 원가율이 35% 정도 됩니다.',
      operatorRole: '3년차 가맹점주',
      region: '인천 청라',
      helpful: 14,
      createdAt: '2026-01-30',
    },
  ],
}

// ============================================================
// 메뉴 데이터 — 카테고리별 대표 메뉴 라인업 (실제 본사 사진 자리)
// ============================================================

const MENU_BY_CATEGORY: Record<string, Array<{ name: string; priceWon: number; signature?: boolean; description?: string }>> = {
  chicken: [
    { name: '시그니처 후라이드', priceWon: 19800, signature: true, description: '24시간 저온 숙성 + 자체 튀김옷' },
    { name: '매콤양념치킨', priceWon: 21800, description: '본사 제조 양념 소스' },
    { name: '간장갈릭치킨', priceWon: 22800 },
    { name: '치킨버거 세트', priceWon: 9800, description: '단품 + 감자튀김 + 음료' },
  ],
  cafe: [
    { name: '시그니처 라떼', priceWon: 4800, signature: true, description: '본사 자체 블렌딩 원두' },
    { name: '아메리카노', priceWon: 3500 },
    { name: '플랫화이트', priceWon: 5000 },
    { name: '계절 디저트 (월 변경)', priceWon: 6500 },
  ],
  korean: [
    { name: '한솥 정식', priceWon: 9500, signature: true, description: '주반찬 + 5종 반찬' },
    { name: '제육 도시락', priceWon: 8500 },
    { name: '불고기 도시락', priceWon: 9000 },
    { name: '김치찌개 정식', priceWon: 9800 },
  ],
  japanese: [
    { name: '오마카세 런치 세트', priceWon: 18800, signature: true, description: '셰프 추천 8피스 + 미소국' },
    { name: '회전 모듬 (10pcs)', priceWon: 22800 },
    { name: '돈코츠 라멘', priceWon: 11800 },
    { name: '치킨가츠 정식', priceWon: 13800 },
  ],
  snack: [
    { name: '국물떡볶이 (2인)', priceWon: 7500, signature: true },
    { name: '참치김밥', priceWon: 3800 },
    { name: '치즈라면', priceWon: 5800 },
    { name: '튀김 모듬', priceWon: 6800 },
  ],
  dessert: [
    { name: '시즌 케이크 (조각)', priceWon: 8500, signature: true, description: '월 1회 신메뉴 출시' },
    { name: '마카롱 (5pcs)', priceWon: 12000 },
    { name: '크림 파스타 라떼', priceWon: 6800 },
    { name: '바닐라 슈크림', priceWon: 4800 },
  ],
  beverage: [
    { name: '생과일 딸기 스무디', priceWon: 6500, signature: true },
    { name: '청포도 에이드', priceWon: 5500 },
    { name: 'ABC 주스 (사과·비트·당근)', priceWon: 7500 },
    { name: '망고 요거트 볼', priceWon: 8800 },
  ],
  bar: [
    { name: '모듬 안주 플래터', priceWon: 28000, signature: true, description: '4인 기준 안주 모듬' },
    { name: '치즈 떡볶이', priceWon: 14800 },
    { name: '계란말이', priceWon: 9800 },
    { name: '소주·맥주 (병)', priceWon: 5000 },
  ],
}

function menuFor(brand: MockBrand): BrandMenuItem[] {
  const base = MENU_BY_CATEGORY[brand.category] ?? MENU_BY_CATEGORY.korean
  // Use the brand's curated menu photos. When HQ uploads its own, brand.menuImages
  // already contains the uploaded set, so this stays correct.
  const photoUrls = brand.menuImages.map((m) => m.url)
  if (photoUrls.length === 0) return base
  return base.map((m, i) => ({
    ...m,
    image: photoUrls[i % photoUrls.length] ?? photoUrls[0]!,
  }))
}

// ============================================================
// 최근 오픈 정보 — 매장 신규 오픈 데이터
// ============================================================

const RECENT_OPENING_LOCATIONS = [
  { region: '서울', district: '강남구', storeSuffix: '강남역점' },
  { region: '서울', district: '마포구', storeSuffix: '연남점' },
  { region: '경기', district: '성남시 분당구', storeSuffix: '서현역점' },
  { region: '경기', district: '수원시 영통구', storeSuffix: '광교점' },
  { region: '인천', district: '연수구', storeSuffix: '송도점' },
  { region: '부산', district: '해운대구', storeSuffix: '해운대점' },
  { region: '대구', district: '수성구', storeSuffix: '수성못점' },
  { region: '대전', district: '서구 둔산동', storeSuffix: '둔산점' },
  { region: '광주', district: '동구', storeSuffix: '충장로점' },
]

function recentOpeningsFor(brand: MockBrand): BrandRecentOpening[] {
  const seed = brand.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const startIdx = seed % RECENT_OPENING_LOCATIONS.length
  // 신규 매장이 많을수록 더 많은 오픈 표시
  const count = brand.growthRate >= 30 ? 5 : brand.growthRate >= 15 ? 4 : 3
  const today = new Date('2026-05-11')
  // 매장별 실제 사진이 없으므로 brand.storeImages를 순환해 사용.
  // 비어 있으면 heroImage를 fallback (kftc 모드처럼 stock 사진인 경우 컴포넌트에서 처리).
  const photoPool = brand.storeImages.length > 0
    ? brand.storeImages
    : brand.heroImage
      ? [brand.heroImage]
      : []
  return Array.from({ length: count }).map((_, i) => {
    const loc = RECENT_OPENING_LOCATIONS[(startIdx + i * 2) % RECENT_OPENING_LOCATIONS.length]
    const daysAgo = 14 + i * 21 + ((seed + i) % 11)
    const date = new Date(today)
    date.setDate(date.getDate() - daysAgo)
    return {
      storeName: `${brand.name} ${loc.storeSuffix}`,
      region: loc.region,
      district: loc.district,
      openedAt: date.toISOString().slice(0, 10),
      area: 10 + ((seed + i * 3) % 22),
      image: photoPool.length > 0
        ? photoPool[i % photoPool.length]!
        : `https://picsum.photos/seed/${brand.id}-opening${i}/600/400`,
    }
  })
}

// ============================================================
// 정보공개서 추가 필드
// ============================================================

function disclosureExtrasFor(brand: MockBrand): BrandDisclosureExtras {
  const hasStrongHQ = brand.storeCount >= 50 && brand.hqVerified
  return {
    hqAdvertisingShare: hasStrongHQ ? 70 : 50,
    storeAdvertisingShare: hasStrongHQ ? 1 : 2,
    contractYears: 3,
    renewalTerms:
      '계약 만료 6개월 전 본사 평가를 통해 갱신 가능. 본사 운영 가이드 위반 사항이 없으면 갱신 거절 사유 없음.',
    territoryProtection:
      brand.category === 'cafe' || brand.category === 'snack'
        ? '반경 300m 이내 직영·가맹점 중복 출점 제한'
        : '반경 500m 이내 직영·가맹점 중복 출점 제한',
    trademarkRegistered: true,
    registrationNumber: `KFA-2024-${brand.id.replace('b', '').padStart(4, '0')}`,
    disclosureUpdatedAt: '2026-04-15',
  }
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

  // Pull pre-computed brand assets directly from the brand record. These were
  // populated when BRANDS was built (or overridden with HQ-uploaded files).
  const photos: BrandPhotos = {
    hero: brand.heroImage,
    store: brand.storeImages,
    gallery: brand.menuImages.map((m) => m.url),
  }

  return {
    hq,
    costs,
    operations,
    revenue,
    storeHistory,
    reviews,
    ratingDistribution,
    faqs: FAQ_DEFAULTS,
    disclosure: disclosureExtrasFor(brand),
    menu: menuFor(brand),
    recentOpenings: recentOpeningsFor(brand),
    photos,
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
