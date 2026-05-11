// Mock real estate listings used on /listings and /brands/[id] detail.
// In production these would come from themyungdang's API.

export interface MockListing {
  id: string
  title: string
  /** Category keys that this property would suit (matches MockBrand.category). */
  fitCategories: string[]
  region: string
  district: string
  area: number // 평
  /** 권리금 (만원). 0 means none. */
  rightFee: number
  /** 보증금 (만원) */
  deposit: number
  /** 월세 (만원) */
  monthlyRent: number
  /** "오피스 상권", "역세권", "주거지 인근" 같은 입지 태그 */
  tags: string[]
  /** 평균 일 유동인구 (명) */
  footTraffic: number
  /** 입점 가능 시점 */
  availableFrom: string
  /** verified by themyungdang */
  verified: boolean
}

export const LISTINGS: MockListing[] = [
  {
    id: 'l1',
    title: '판교 IT 단지 1층 코너 매물',
    fitCategories: ['cafe', 'snack', 'korean'],
    region: '경기',
    district: '성남시 분당구',
    area: 14,
    rightFee: 3500,
    deposit: 5000,
    monthlyRent: 280,
    tags: ['오피스 상권', '코너', '1층', '신축'],
    footTraffic: 4800,
    availableFrom: '2026-06-01',
    verified: true,
  },
  {
    id: 'l2',
    title: '강남역 도보 5분 2층 매물',
    fitCategories: ['chicken', 'bar', 'korean'],
    region: '서울',
    district: '강남구',
    area: 28,
    rightFee: 7000,
    deposit: 8000,
    monthlyRent: 520,
    tags: ['역세권', '대로변', '2층'],
    footTraffic: 9200,
    availableFrom: '2026-05-20',
    verified: true,
  },
  {
    id: 'l3',
    title: '연남동 골목 카페 자리 (양도)',
    fitCategories: ['cafe', 'dessert', 'beverage'],
    region: '서울',
    district: '마포구',
    area: 12,
    rightFee: 2500,
    deposit: 4000,
    monthlyRent: 230,
    tags: ['SNS 상권', '주거지 인근', '인테리어 양호'],
    footTraffic: 3200,
    availableFrom: '2026-05-15',
    verified: true,
  },
  {
    id: 'l4',
    title: '해운대 신축 상가 1층',
    fitCategories: ['cafe', 'dessert', 'beverage', 'snack'],
    region: '부산',
    district: '해운대구',
    area: 22,
    rightFee: 0,
    deposit: 6000,
    monthlyRent: 380,
    tags: ['신축', '관광 상권', '1층'],
    footTraffic: 5600,
    availableFrom: '2026-07-01',
    verified: true,
  },
  {
    id: 'l5',
    title: '대전 둔산동 학원가 매물',
    fitCategories: ['snack', 'dessert', 'beverage', 'cafe'],
    region: '대전',
    district: '서구 둔산동',
    area: 16,
    rightFee: 1800,
    deposit: 3500,
    monthlyRent: 180,
    tags: ['학원가', '학생 상권'],
    footTraffic: 2800,
    availableFrom: '2026-06-10',
    verified: true,
  },
  {
    id: 'l6',
    title: '인천 송도 신도시 코너 매물',
    fitCategories: ['chicken', 'korean', 'japanese'],
    region: '경기',
    district: '인천 연수구 송도동',
    area: 32,
    rightFee: 4200,
    deposit: 7000,
    monthlyRent: 420,
    tags: ['신도시', '코너', '대형 아파트 단지'],
    footTraffic: 5100,
    availableFrom: '2026-06-20',
    verified: true,
  },
  {
    id: 'l7',
    title: '대구 동성로 1.5층 매물 (양도)',
    fitCategories: ['bar', 'korean', 'japanese'],
    region: '대구',
    district: '중구 동성로',
    area: 26,
    rightFee: 5500,
    deposit: 6000,
    monthlyRent: 350,
    tags: ['상권 중심', '1.5층', '인테리어 가능'],
    footTraffic: 7400,
    availableFrom: '2026-06-01',
    verified: true,
  },
  {
    id: 'l8',
    title: '서울 영등포 오피스 빌딩 지하 1층',
    fitCategories: ['korean', 'japanese', 'snack', 'cafe'],
    region: '서울',
    district: '영등포구',
    area: 24,
    rightFee: 3000,
    deposit: 5500,
    monthlyRent: 310,
    tags: ['오피스 상권', '지하 1층', '직장인 점심'],
    footTraffic: 4400,
    availableFrom: '2026-05-25',
    verified: true,
  },
  {
    id: 'l9',
    title: '광주 충장로 골목 코너 매물',
    fitCategories: ['cafe', 'dessert', 'snack'],
    region: '광주',
    district: '동구 충장로',
    area: 15,
    rightFee: 1500,
    deposit: 3000,
    monthlyRent: 170,
    tags: ['상권 중심', '코너', '인테리어 양호'],
    footTraffic: 3800,
    availableFrom: '2026-06-05',
    verified: true,
  },
  {
    id: 'l10',
    title: '울산 삼산동 신축 상가',
    fitCategories: ['chicken', 'korean', 'snack'],
    region: '울산',
    district: '남구 삼산동',
    area: 30,
    rightFee: 0,
    deposit: 6500,
    monthlyRent: 360,
    tags: ['신축', '상권 중심', '주차 가능'],
    footTraffic: 4200,
    availableFrom: '2026-07-15',
    verified: true,
  },
]

/** Pick 3-5 listings appropriate for a given brand category. */
export function listingsForCategory(category: string, limit = 4): MockListing[] {
  return LISTINGS.filter((l) => l.fitCategories.includes(category)).slice(0, limit)
}
