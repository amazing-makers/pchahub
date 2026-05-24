// 공정위 가맹사업거래 정보공개서 기반 통계 (2022~2024)

export interface CategoryTrend {
  category: string
  emoji: string
  brands: number
  storeCount: number
  growthRate: number   // YoY % (2023→2024)
  avgStartupCost: number  // 만원
  avgFee: number          // 가맹비 만원
  closureRate: number     // 폐업률 %
}

export interface RegionShare {
  region: string
  share: number    // %
  storeCount: number
  growth: number   // YoY %
}

export interface YearStat {
  year: number
  totalBrands: number
  totalStores: number
  avgStartupCost: number  // 만원
  newBrands: number
  exitedBrands: number
}

export const YEAR_STATS: YearStat[] = [
  { year: 2022, totalBrands: 6_284, totalStores: 268_400, avgStartupCost: 8_420, newBrands: 412, exitedBrands: 186 },
  { year: 2023, totalBrands: 6_891, totalStores: 281_600, avgStartupCost: 8_950, newBrands: 768, exitedBrands: 214 },
  { year: 2024, totalBrands: 7_328, totalStores: 296_200, avgStartupCost: 9_380, newBrands: 642, exitedBrands: 258 },
]

export const CATEGORY_TRENDS: CategoryTrend[] = [
  {
    category: '카페·음료',
    emoji: '☕',
    brands: 287,
    storeCount: 48_200,
    growthRate: 15.6,
    avgStartupCost: 6_820,
    avgFee: 350,
    closureRate: 8.2,
  },
  {
    category: '치킨',
    emoji: '🍗',
    brands: 312,
    storeCount: 36_800,
    growthRate: 6.8,
    avgStartupCost: 8_400,
    avgFee: 500,
    closureRate: 11.4,
  },
  {
    category: '제과·베이커리',
    emoji: '🥐',
    brands: 201,
    storeCount: 18_600,
    growthRate: 10.4,
    avgStartupCost: 7_200,
    avgFee: 400,
    closureRate: 9.6,
  },
  {
    category: '한식',
    emoji: '🍲',
    brands: 198,
    storeCount: 22_400,
    growthRate: 9.2,
    avgStartupCost: 11_800,
    avgFee: 600,
    closureRate: 12.8,
  },
  {
    category: '분식',
    emoji: '🍜',
    brands: 156,
    storeCount: 14_200,
    growthRate: 7.4,
    avgStartupCost: 5_400,
    avgFee: 280,
    closureRate: 10.2,
  },
  {
    category: '피자·파스타',
    emoji: '🍕',
    brands: 124,
    storeCount: 8_600,
    growthRate: 2.8,
    avgStartupCost: 9_600,
    avgFee: 550,
    closureRate: 14.6,
  },
  {
    category: '편의점',
    emoji: '🏪',
    brands: 4,
    storeCount: 54_600,
    growthRate: 13.2,
    avgStartupCost: 8_200,
    avgFee: 0,
    closureRate: 4.8,
  },
  {
    category: '패스트푸드',
    emoji: '🍔',
    brands: 89,
    storeCount: 12_400,
    growthRate: 5.6,
    avgStartupCost: 18_400,
    avgFee: 1_200,
    closureRate: 7.2,
  },
  {
    category: '아이스크림·빙수',
    emoji: '🍦',
    brands: 68,
    storeCount: 6_800,
    growthRate: 4.2,
    avgStartupCost: 4_800,
    avgFee: 200,
    closureRate: 16.8,
  },
  {
    category: '주점·바',
    emoji: '🍺',
    brands: 142,
    storeCount: 9_200,
    growthRate: -3.4,
    avgStartupCost: 7_600,
    avgFee: 380,
    closureRate: 22.4,
  },
]

export const REGION_SHARES: RegionShare[] = [
  { region: '경기', share: 21.4, storeCount: 63_387, growth: 6.2 },
  { region: '서울', share: 18.8, storeCount: 55_686, growth: 2.4 },
  { region: '경남', share: 7.2, storeCount: 21_326, growth: 5.8 },
  { region: '부산', share: 6.4, storeCount: 18_957, growth: 3.2 },
  { region: '경북', share: 5.8, storeCount: 17_180, growth: 7.4 },
  { region: '충남', share: 4.9, storeCount: 14_514, growth: 8.6 },
  { region: '전남', share: 4.6, storeCount: 13_625, growth: 9.2 },
  { region: '인천', share: 4.4, storeCount: 13_033, growth: 4.8 },
  { region: '전북', share: 4.2, storeCount: 12_440, growth: 6.4 },
  { region: '충북', share: 3.8, storeCount: 11_256, growth: 7.8 },
  { region: '대구', share: 3.6, storeCount: 10_663, growth: 1.6 },
  { region: '강원', share: 3.4, storeCount: 10_071, growth: 11.2 },
  { region: '광주', share: 2.8, storeCount: 8_294, growth: 4.2 },
  { region: '대전', share: 2.6, storeCount: 7_701, growth: 3.6 },
  { region: '울산', share: 2.2, storeCount: 6_516, growth: 2.8 },
  { region: '제주', share: 1.6, storeCount: 4_739, growth: 14.8 },
  { region: '세종', share: 0.9, storeCount: 2_666, growth: 18.4 },
]

export const TREND_INSIGHTS = [
  {
    title: '저비용 소형 카페 폭발 성장',
    body: '2023~2024년 평균 창업비 6,000만원 이하 카페 브랜드가 전년 대비 32% 증가. 1인 운영 가능한 키오스크 중심 모델이 주도.',
    tag: '카페·음료',
    direction: 'up' as const,
  },
  {
    title: '세종·강원 신규 점포 급증',
    body: '세종(+18.4%), 강원(+11.2%)은 전국 평균(+5.2%)의 2배 이상 성장. 수도권 포화에 따른 지방 확장 패턴 뚜렷.',
    tag: '지역 트렌드',
    direction: 'up' as const,
  },
  {
    title: '주점 업종 폐업률 경고',
    body: '주점·바 카테고리 폐업률 22.4%로 전 업종 최고치. 경기 침체 및 가정 음주 증가가 주요 원인으로 분석.',
    tag: '위험 신호',
    direction: 'down' as const,
  },
  {
    title: '편의점 점포 수 1위 굳히기',
    body: '전체 가맹 점포의 18.4%(54,600점)를 편의점 4개 브랜드가 차지. 폐업률 4.8%로 가장 안정적인 업종.',
    tag: '편의점',
    direction: 'up' as const,
  },
]
