export type TrendDir = 'up' | 'flat' | 'down'

export const TREND_LABEL: Record<TrendDir, string> = {
  up: '↑ 상승',
  flat: '→ 보합',
  down: '↓ 하락',
}

export const TREND_COLOR: Record<TrendDir, string> = {
  up: '#DC2626',
  flat: '#6B7280',
  down: '#2563EB',
}

export interface CategoryPriceRow {
  key: string
  label: string
  rightFeeMin: number
  rightFeeMax: number
  note?: string
}

export interface AreaPriceRow {
  areaKey: string
  areaName: string
  region: string
  rightFeeMin: number
  rightFeeMax: number
  depositMin: number
  depositMax: number
  rentPerPyeongMin: number
  rentPerPyeongMax: number
  trendPct: number
  trend: TrendDir
  txCount: number
  byCategory: CategoryPriceRow[]
}

export interface CategoryInsight {
  key: string
  label: string
  avgNational: number
  premiumAreaKey: string
  premiumAreaName: string
  valueAreaKey: string
  valueAreaName: string
  trendPct: number
  trend: TrendDir
  tip: string
}

export const PRICE_GUIDE_CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'cafe', label: '카페' },
  { key: 'chicken', label: '치킨' },
  { key: 'korean', label: '한식' },
  { key: 'snack', label: '분식' },
  { key: 'bar', label: '주점' },
  { key: 'dessert', label: '디저트' },
]

export const AREA_PRICES: AreaPriceRow[] = [
  {
    areaKey: 'gangnam',
    areaName: '강남역 상권',
    region: '서울',
    rightFeeMin: 6000,
    rightFeeMax: 12000,
    depositMin: 7000,
    depositMax: 12000,
    rentPerPyeongMin: 18,
    rentPerPyeongMax: 28,
    trendPct: 8.2,
    trend: 'up',
    txCount: 184,
    byCategory: [
      { key: 'cafe', label: '카페', rightFeeMin: 7000, rightFeeMax: 12000, note: '스타벅스 등 대형 브랜드 출구 인접 매물 +30%' },
      { key: 'chicken', label: '치킨', rightFeeMin: 5500, rightFeeMax: 7500 },
      { key: 'korean', label: '한식', rightFeeMin: 7500, rightFeeMax: 10500, note: '점심 오피스 수요로 프리미엄 강세' },
      { key: 'snack', label: '분식', rightFeeMin: 4500, rightFeeMax: 7000 },
      { key: 'bar', label: '주점', rightFeeMin: 6500, rightFeeMax: 11000, note: '심야 영업 가능 여부에 따라 편차 큼' },
      { key: 'dessert', label: '디저트', rightFeeMin: 5000, rightFeeMax: 9000 },
    ],
  },
  {
    areaKey: 'myeongdong',
    areaName: '명동 상권',
    region: '서울',
    rightFeeMin: 5500,
    rightFeeMax: 11000,
    depositMin: 6500,
    depositMax: 11000,
    rentPerPyeongMin: 17,
    rentPerPyeongMax: 27,
    trendPct: 5.6,
    trend: 'up',
    txCount: 96,
    byCategory: [
      { key: 'cafe', label: '카페', rightFeeMin: 5500, rightFeeMax: 10000 },
      { key: 'korean', label: '한식', rightFeeMin: 5000, rightFeeMax: 9000 },
      { key: 'snack', label: '분식', rightFeeMin: 5000, rightFeeMax: 8500, note: '관광객 수요로 분식 프리미엄 높음' },
      { key: 'dessert', label: '디저트', rightFeeMin: 6000, rightFeeMax: 10500, note: '외국인 관광객 유입 높아 디저트 최상위' },
      { key: 'bar', label: '주점', rightFeeMin: 3500, rightFeeMax: 6000 },
      { key: 'chicken', label: '치킨', rightFeeMin: 3500, rightFeeMax: 5500 },
    ],
  },
  {
    areaKey: 'seongsu',
    areaName: '성수동 상권',
    region: '서울',
    rightFeeMin: 4200,
    rightFeeMax: 8500,
    depositMin: 5000,
    depositMax: 8500,
    rentPerPyeongMin: 14,
    rentPerPyeongMax: 22,
    trendPct: 14.3,
    trend: 'up',
    txCount: 112,
    byCategory: [
      { key: 'cafe', label: '카페', rightFeeMin: 5500, rightFeeMax: 10000, note: '프리미엄 카페 수요 최고 — 전국 카페 평균 2배 이상' },
      { key: 'dessert', label: '디저트', rightFeeMin: 5000, rightFeeMax: 9000, note: 'SNS 바이럴 기대 프리미엄 반영' },
      { key: 'korean', label: '한식', rightFeeMin: 3500, rightFeeMax: 6000 },
      { key: 'bar', label: '주점', rightFeeMin: 3000, rightFeeMax: 5500 },
      { key: 'chicken', label: '치킨', rightFeeMin: 2500, rightFeeMax: 4000 },
      { key: 'snack', label: '분식', rightFeeMin: 2000, rightFeeMax: 3800 },
    ],
  },
  {
    areaKey: 'jamsil',
    areaName: '잠실 상권',
    region: '서울',
    rightFeeMin: 4500,
    rightFeeMax: 8500,
    depositMin: 5500,
    depositMax: 10000,
    rentPerPyeongMin: 15,
    rentPerPyeongMax: 24,
    trendPct: 6.1,
    trend: 'up',
    txCount: 143,
    byCategory: [
      { key: 'cafe', label: '카페', rightFeeMin: 5000, rightFeeMax: 9000 },
      { key: 'korean', label: '한식', rightFeeMin: 5500, rightFeeMax: 8500, note: '가족 단위 수요로 한식 프리미엄' },
      { key: 'dessert', label: '디저트', rightFeeMin: 5000, rightFeeMax: 8000 },
      { key: 'snack', label: '분식', rightFeeMin: 3500, rightFeeMax: 5500 },
      { key: 'chicken', label: '치킨', rightFeeMin: 4000, rightFeeMax: 6000 },
      { key: 'bar', label: '주점', rightFeeMin: 3500, rightFeeMax: 6500 },
    ],
  },
  {
    areaKey: 'hongdae',
    areaName: '홍대 상권',
    region: '서울',
    rightFeeMin: 3800,
    rightFeeMax: 8000,
    depositMin: 4800,
    depositMax: 9000,
    rentPerPyeongMin: 14,
    rentPerPyeongMax: 24,
    trendPct: 4.2,
    trend: 'up',
    txCount: 201,
    byCategory: [
      { key: 'cafe', label: '카페', rightFeeMin: 5000, rightFeeMax: 9000, note: '2층 루프탑 매물 최상위 프리미엄' },
      { key: 'dessert', label: '디저트', rightFeeMin: 4000, rightFeeMax: 7500 },
      { key: 'bar', label: '주점', rightFeeMin: 4000, rightFeeMax: 7500 },
      { key: 'snack', label: '분식', rightFeeMin: 3000, rightFeeMax: 5000 },
      { key: 'korean', label: '한식', rightFeeMin: 3500, rightFeeMax: 6000 },
      { key: 'chicken', label: '치킨', rightFeeMin: 2800, rightFeeMax: 4500 },
    ],
  },
  {
    areaKey: 'konkuk',
    areaName: '건대입구 상권',
    region: '서울',
    rightFeeMin: 3500,
    rightFeeMax: 6800,
    depositMin: 4000,
    depositMax: 7500,
    rentPerPyeongMin: 13,
    rentPerPyeongMax: 20,
    trendPct: 2.8,
    trend: 'flat',
    txCount: 118,
    byCategory: [
      { key: 'bar', label: '주점', rightFeeMin: 4000, rightFeeMax: 7500, note: '야간 집객 특성상 주점 권리금 최고' },
      { key: 'chicken', label: '치킨', rightFeeMin: 3500, rightFeeMax: 5500 },
      { key: 'snack', label: '분식', rightFeeMin: 3000, rightFeeMax: 5000 },
      { key: 'cafe', label: '카페', rightFeeMin: 3500, rightFeeMax: 6500 },
      { key: 'korean', label: '한식', rightFeeMin: 3000, rightFeeMax: 5500 },
      { key: 'dessert', label: '디저트', rightFeeMin: 2500, rightFeeMax: 4500 },
    ],
  },
  {
    areaKey: 'pangyo',
    areaName: '판교 IT 단지',
    region: '경기',
    rightFeeMin: 3000,
    rightFeeMax: 6500,
    depositMin: 3800,
    depositMax: 7500,
    rentPerPyeongMin: 12,
    rentPerPyeongMax: 20,
    trendPct: 3.5,
    trend: 'up',
    txCount: 88,
    byCategory: [
      { key: 'cafe', label: '카페', rightFeeMin: 3500, rightFeeMax: 7000, note: 'IT 직장인 아침 수요로 안정 매출 보장' },
      { key: 'korean', label: '한식', rightFeeMin: 3500, rightFeeMax: 6500, note: '점심 수요 안정 — 한식 프리미엄 높음' },
      { key: 'snack', label: '분식', rightFeeMin: 2500, rightFeeMax: 4500 },
      { key: 'chicken', label: '치킨', rightFeeMin: 2500, rightFeeMax: 4500 },
      { key: 'bar', label: '주점', rightFeeMin: 2000, rightFeeMax: 3800 },
      { key: 'dessert', label: '디저트', rightFeeMin: 2500, rightFeeMax: 4500 },
    ],
  },
  {
    areaKey: 'haeundae',
    areaName: '해운대 상권',
    region: '부산',
    rightFeeMin: 3800,
    rightFeeMax: 8000,
    depositMin: 4500,
    depositMax: 9000,
    rentPerPyeongMin: 14,
    rentPerPyeongMax: 23,
    trendPct: 5.1,
    trend: 'up',
    txCount: 76,
    byCategory: [
      { key: 'cafe', label: '카페', rightFeeMin: 4500, rightFeeMax: 8500, note: '해변 뷰 매물 별도 프리미엄 30%↑' },
      { key: 'bar', label: '주점', rightFeeMin: 4500, rightFeeMax: 8000 },
      { key: 'korean', label: '한식', rightFeeMin: 3500, rightFeeMax: 6500 },
      { key: 'japanese', label: '일식', rightFeeMin: 3500, rightFeeMax: 6500 },
      { key: 'dessert', label: '디저트', rightFeeMin: 3500, rightFeeMax: 6500 },
      { key: 'chicken', label: '치킨', rightFeeMin: 2500, rightFeeMax: 4500 },
    ],
  },
  {
    areaKey: 'seomyeon',
    areaName: '서면 상권',
    region: '부산',
    rightFeeMin: 2800,
    rightFeeMax: 6000,
    depositMin: 3800,
    depositMax: 7000,
    rentPerPyeongMin: 11,
    rentPerPyeongMax: 19,
    trendPct: 1.8,
    trend: 'flat',
    txCount: 134,
    byCategory: [
      { key: 'bar', label: '주점', rightFeeMin: 3500, rightFeeMax: 7000, note: '심야 상권 특성상 주점 권리금 최상위' },
      { key: 'korean', label: '한식', rightFeeMin: 3000, rightFeeMax: 5500 },
      { key: 'cafe', label: '카페', rightFeeMin: 2500, rightFeeMax: 5000 },
      { key: 'japanese', label: '일식', rightFeeMin: 2500, rightFeeMax: 5000 },
      { key: 'chicken', label: '치킨', rightFeeMin: 2000, rightFeeMax: 3800 },
      { key: 'snack', label: '분식', rightFeeMin: 1800, rightFeeMax: 3500 },
    ],
  },
  {
    areaKey: 'suwon_ingye',
    areaName: '수원 인계동',
    region: '경기',
    rightFeeMin: 2000,
    rightFeeMax: 4800,
    depositMin: 3000,
    depositMax: 6000,
    rentPerPyeongMin: 9,
    rentPerPyeongMax: 15,
    trendPct: -1.2,
    trend: 'down',
    txCount: 97,
    byCategory: [
      { key: 'bar', label: '주점', rightFeeMin: 2500, rightFeeMax: 5500 },
      { key: 'korean', label: '한식', rightFeeMin: 2500, rightFeeMax: 4500 },
      { key: 'cafe', label: '카페', rightFeeMin: 2000, rightFeeMax: 4000 },
      { key: 'chicken', label: '치킨', rightFeeMin: 1800, rightFeeMax: 3500 },
      { key: 'snack', label: '분식', rightFeeMin: 1500, rightFeeMax: 3000 },
      { key: 'dessert', label: '디저트', rightFeeMin: 1500, rightFeeMax: 3000 },
    ],
  },
  {
    areaKey: 'jeju_yeon',
    areaName: '제주 연동',
    region: '제주',
    rightFeeMin: 2200,
    rightFeeMax: 5000,
    depositMin: 3000,
    depositMax: 6000,
    rentPerPyeongMin: 11,
    rentPerPyeongMax: 18,
    trendPct: 9.4,
    trend: 'up',
    txCount: 62,
    byCategory: [
      { key: 'cafe', label: '카페', rightFeeMin: 2800, rightFeeMax: 6000, note: '관광객 유입으로 카페 수요 전국 상위권' },
      { key: 'dessert', label: '디저트', rightFeeMin: 2500, rightFeeMax: 5500 },
      { key: 'korean', label: '한식', rightFeeMin: 2000, rightFeeMax: 4500 },
      { key: 'beverage', label: '음료', rightFeeMin: 2000, rightFeeMax: 4000 },
      { key: 'chicken', label: '치킨', rightFeeMin: 1500, rightFeeMax: 3000 },
      { key: 'snack', label: '분식', rightFeeMin: 1200, rightFeeMax: 2800 },
    ],
  },
  {
    areaKey: 'dunsan',
    areaName: '둔산 상권',
    region: '대전',
    rightFeeMin: 1400,
    rightFeeMax: 3500,
    depositMin: 2000,
    depositMax: 4500,
    rentPerPyeongMin: 8,
    rentPerPyeongMax: 14,
    trendPct: 0.5,
    trend: 'flat',
    txCount: 79,
    byCategory: [
      { key: 'snack', label: '분식', rightFeeMin: 1500, rightFeeMax: 3500, note: '학원가 분식 수요로 분식 권리금 상위' },
      { key: 'cafe', label: '카페', rightFeeMin: 1500, rightFeeMax: 3200 },
      { key: 'beverage', label: '음료', rightFeeMin: 1200, rightFeeMax: 2800 },
      { key: 'korean', label: '한식', rightFeeMin: 1200, rightFeeMax: 2800 },
      { key: 'chicken', label: '치킨', rightFeeMin: 1000, rightFeeMax: 2500 },
      { key: 'bar', label: '주점', rightFeeMin: 900, rightFeeMax: 2200 },
    ],
  },
  {
    areaKey: 'jeonju_gaeksa',
    areaName: '전주 객사',
    region: '전북',
    rightFeeMin: 1200,
    rightFeeMax: 3200,
    depositMin: 1800,
    depositMax: 4000,
    rentPerPyeongMin: 7,
    rentPerPyeongMax: 13,
    trendPct: 3.2,
    trend: 'up',
    txCount: 44,
    byCategory: [
      { key: 'korean', label: '한식', rightFeeMin: 1500, rightFeeMax: 3500, note: '전통 한식 관광 수요 — 한식 권리금 타 업종 2배' },
      { key: 'dessert', label: '디저트', rightFeeMin: 1400, rightFeeMax: 3000 },
      { key: 'cafe', label: '카페', rightFeeMin: 1200, rightFeeMax: 2800 },
      { key: 'snack', label: '분식', rightFeeMin: 1000, rightFeeMax: 2500 },
      { key: 'chicken', label: '치킨', rightFeeMin: 800, rightFeeMax: 2000 },
      { key: 'bar', label: '주점', rightFeeMin: 700, rightFeeMax: 1800 },
    ],
  },
]

export const CATEGORY_INSIGHTS: CategoryInsight[] = [
  {
    key: 'cafe',
    label: '카페',
    avgNational: 4200,
    premiumAreaKey: 'gangnam',
    premiumAreaName: '강남역',
    valueAreaKey: 'dunsan',
    valueAreaName: '둔산',
    trendPct: 7.8,
    trend: 'up',
    tip: '성수·홍대 등 SNS 상권은 오픈 초기 집객 효과가 크지만 보증금 회수 기간이 짧아 리스크가 함께 삽니다. 안정적 매출을 원한다면 판교·잠실 사무+주거 복합 상권을 추천합니다.',
  },
  {
    key: 'chicken',
    label: '치킨',
    avgNational: 2800,
    premiumAreaKey: 'gangnam',
    premiumAreaName: '강남역',
    valueAreaKey: 'jeonju_gaeksa',
    valueAreaName: '전주 객사',
    trendPct: -0.5,
    trend: 'flat',
    tip: '배달 비중이 높아 입지 프리미엄보다 배달 구역 밀도가 더 중요합니다. 2층 이상 매물도 경쟁력 있어 동일 상권 내 권리금을 낮출 수 있습니다.',
  },
  {
    key: 'korean',
    label: '한식',
    avgNational: 3600,
    premiumAreaKey: 'gangnam',
    premiumAreaName: '강남역',
    valueAreaKey: 'dunsan',
    valueAreaName: '둔산',
    trendPct: 2.1,
    trend: 'flat',
    tip: '점심 오피스 수요가 강한 상권(강남·판교·서면)은 한식 프리미엄이 높습니다. 저녁 수요까지 잡으려면 근처에 주거 밀집 지역이 있는지 확인하세요.',
  },
  {
    key: 'snack',
    label: '분식',
    avgNational: 2400,
    premiumAreaKey: 'myeongdong',
    premiumAreaName: '명동',
    valueAreaKey: 'jeonju_gaeksa',
    valueAreaName: '전주 객사',
    trendPct: 1.5,
    trend: 'flat',
    tip: '대학가·학원가에서 분식 권리금이 안정적입니다. 관광 상권(명동)은 외국인 대상 분식 수요로 프리미엄이 형성되지만 임대료도 높습니다.',
  },
  {
    key: 'bar',
    label: '주점',
    avgNational: 3800,
    premiumAreaKey: 'gangnam',
    premiumAreaName: '강남역',
    valueAreaKey: 'dunsan',
    valueAreaName: '둔산',
    trendPct: -2.4,
    trend: 'down',
    tip: '심야 영업 규제 강화로 주점 권리금 하락세입니다. 이태원·건대·서면 등 심야 특화 상권에서도 권리금 회수 기간이 길어지는 추세입니다. 취득 시 임대차 계약에 심야 영업 가능 여부를 명시하세요.',
  },
  {
    key: 'dessert',
    label: '디저트',
    avgNational: 3200,
    premiumAreaKey: 'seongsu',
    premiumAreaName: '성수동',
    valueAreaKey: 'dunsan',
    valueAreaName: '둔산',
    trendPct: 6.3,
    trend: 'up',
    tip: '성수동·홍대 디저트 권리금이 SNS 효과로 빠르게 상승 중입니다. 그러나 트렌드 전환이 빠른 업종인 만큼 계약 기간을 2년 이상으로 확보하고 인테리어 비용을 최소화하는 전략이 필요합니다.',
  },
]

export function pricesByCategory(catKey: string): AreaPriceRow[] {
  if (catKey === 'all') return AREA_PRICES
  return AREA_PRICES.map((area) => {
    const cat = area.byCategory.find((c) => c.key === catKey)
    if (!cat) return null
    return { ...area, rightFeeMin: cat.rightFeeMin, rightFeeMax: cat.rightFeeMax }
  })
    .filter(Boolean)
    .sort((a, b) => b!.rightFeeMax - a!.rightFeeMax) as AreaPriceRow[]
}

export const PRICE_STATS = {
  nationalAvgRightFee: 3400,
  nationalMedianRightFee: 2800,
  yoyChangePct: 4.1,
  totalTransactions: 1836,
  highestAreaName: '강남역',
  lowestAreaName: '전주 객사',
}
