// Mock data for bestplace — store directory + annual awards + realtime rankings.
// Cross-links: brand keys/labels match pchahub so brand → bestplace stores
// flows make sense. Future Supabase migration will share the Brand table.

import { storePhotoSet } from './store-images'

export interface MockBrand {
  id: string
  name: string
  category: string
  categoryLabel: string
  logoColor: string
}

export interface MockStore {
  id: string
  /** e.g. "교촌치킨 강남역점" */
  name: string
  brandId: string
  region: string
  district: string
  address: string
  /** 일 평균 유동인구 (명) */
  footTraffic: number
  area: number // 평
  openedYear: number
  rating: number
  reviewCount: number
  monthlyVisitors: number
  imageColor: string
  awards: string[] // 수상 라벨 (예: "2026 베스트 치킨 1위")
  verified: boolean
  highlights: string[]
  recentReview?: { author: string; rating: number; text: string }
  /** Real hero image — auto-filled below. */
  heroImage: string
  /** Real gallery images — auto-filled below. */
  gallery: string[]
}

export type AwardRank = 1 | 2 | 3

export interface MockAward {
  id: string
  year: number
  /** 카테고리 키 — brand 카테고리와 일치 */
  category: string
  categoryLabel: string
  quarter?: number // 분기 어워드용, 없으면 연간
  rank: AwardRank
  brandId: string
  /** 이 시상에 대한 한 줄 평. */
  citation: string
  /** 수상한 매장 ID (대표 매장이 있는 경우) */
  representativeStoreId?: string
}

export const BRANDS: MockBrand[] = [
  { id: 'b1', name: '교촌치킨', category: 'chicken', categoryLabel: '치킨', logoColor: '#B45309' },
  { id: 'b2', name: '메가커피', category: 'cafe', categoryLabel: '카페', logoColor: '#7C3AED' },
  { id: 'b3', name: '한솥도시락', category: 'korean', categoryLabel: '한식', logoColor: '#16A34A' },
  { id: 'b4', name: '하코야', category: 'japanese', categoryLabel: '일식', logoColor: '#0EA5E9' },
  { id: 'b5', name: '죠스떡볶이', category: 'snack', categoryLabel: '분식', logoColor: '#DC2626' },
  { id: 'b6', name: '설빙', category: 'dessert', categoryLabel: '디저트', logoColor: '#EC4899' },
  { id: 'b7', name: '쥬시', category: 'beverage', categoryLabel: '음료', logoColor: '#10B981' },
  { id: 'b8', name: '역전할머니맥주', category: 'bar', categoryLabel: '주점', logoColor: '#7C3AED' },
  { id: 'b9', name: '굽네치킨', category: 'chicken', categoryLabel: '치킨', logoColor: '#EAB308' },
  { id: 'b10', name: '이디야커피', category: 'cafe', categoryLabel: '카페', logoColor: '#A16207' },
  { id: 'b11', name: '봉추찜닭', category: 'korean', categoryLabel: '한식', logoColor: '#B45309' },
  { id: 'b12', name: '마루가메제면', category: 'japanese', categoryLabel: '일식', logoColor: '#991B1B' },
]

export const CATEGORIES = Array.from(new Set(BRANDS.map((b) => b.category))).map((c) => ({
  key: c,
  label: BRANDS.find((b) => b.category === c)!.categoryLabel,
}))

export function brandById(id: string): MockBrand | undefined {
  return BRANDS.find((b) => b.id === id)
}

type RawStore = Omit<MockStore, 'heroImage' | 'gallery'>

const RAW_STORES: RawStore[] = [
  {
    id: 's1',
    name: '교촌치킨 강남역점',
    brandId: 'b1',
    region: '서울',
    district: '강남구',
    address: '서울 강남구 테헤란로 142',
    footTraffic: 9200,
    area: 32,
    openedYear: 2022,
    rating: 4.8,
    reviewCount: 482,
    monthlyVisitors: 18400,
    imageColor: '#B45309',
    awards: ['2026 베스트 치킨 1위'],
    verified: true,
    highlights: ['강남 한복판 신축 매장', '교촌 허니콤보 인기', '심야 운영'],
    recentReview: { author: '직장인A', rating: 5, text: '회식 자주 옵니다. 야간 분위기 좋고 인력 응대 빠릅니다.' },
  },
  {
    id: 's2',
    name: '메가커피 홍대입구점',
    brandId: 'b2',
    region: '서울',
    district: '마포구',
    address: '서울 마포구 와우산로 31',
    footTraffic: 7800,
    area: 14,
    openedYear: 2024,
    rating: 4.7,
    reviewCount: 624,
    monthlyVisitors: 22800,
    imageColor: '#7C3AED',
    awards: ['2026 베스트 카페 1위', '2025 신규 카페 1위'],
    verified: true,
    highlights: ['SNS 노출 강세', '저가형 스페셜티 커피', '1인 운영 효율 매장'],
    recentReview: { author: '대학생B', rating: 5, text: '가성비 좋고 줄 길어도 회전이 빨라요.' },
  },
  {
    id: 's3',
    name: '한솥도시락 판교테크노밸리점',
    brandId: 'b3',
    region: '경기',
    district: '성남시 분당구',
    address: '경기 성남시 분당구 판교역로 234',
    footTraffic: 4800,
    area: 22,
    openedYear: 2023,
    rating: 4.6,
    reviewCount: 318,
    monthlyVisitors: 9600,
    imageColor: '#16A34A',
    awards: ['2026 베스트 한식 2위'],
    verified: true,
    highlights: ['IT 단지 점심 강세', '배달 비중 60%', '도시락 회전율 우수'],
    recentReview: { author: '판교직장인', rating: 5, text: '점심 배달 30분 내 항상 도착. 만족합니다.' },
  },
  {
    id: 's4',
    name: '하코야 송도점',
    brandId: 'b4',
    region: '인천',
    district: '연수구',
    address: '인천 연수구 송도과학로 16',
    footTraffic: 5200,
    area: 38,
    openedYear: 2023,
    rating: 4.7,
    reviewCount: 246,
    monthlyVisitors: 8400,
    imageColor: '#0EA5E9',
    awards: ['2026 베스트 일식 1위'],
    verified: true,
    highlights: ['신축 상가 1층', '이자카야 + 다이닝 복합', '주말 가족 객수 강세'],
    recentReview: { author: '가족모임', rating: 5, text: '안주 신선하고 가성비 굿. 주말 예약 추천.' },
  },
  {
    id: 's5',
    name: '죠스떡볶이 동성로점',
    brandId: 'b5',
    region: '대구',
    district: '중구',
    address: '대구 중구 동성로 134',
    footTraffic: 6200,
    area: 18,
    openedYear: 2020,
    rating: 4.5,
    reviewCount: 412,
    monthlyVisitors: 14200,
    imageColor: '#DC2626',
    awards: ['2026 베스트 분식 3위'],
    verified: true,
    highlights: ['대구 핵심 상권', '학생 객수 안정', '회전율 매우 높음'],
    recentReview: { author: '대구학생', rating: 4, text: '단가 저렴하고 빠르게 나와요. 주말 줄 길어요.' },
  },
  {
    id: 's6',
    name: '설빙 성수점',
    brandId: 'b6',
    region: '서울',
    district: '성동구',
    address: '서울 성동구 성수이로 12-3',
    footTraffic: 5600,
    area: 22,
    openedYear: 2024,
    rating: 4.8,
    reviewCount: 538,
    monthlyVisitors: 16800,
    imageColor: '#EC4899',
    awards: ['2026 베스트 디저트 1위', '2026 인스타 핫플 카테고리상'],
    verified: true,
    highlights: ['SNS 핫플', '신축 인테리어', '주말 줄 서는 매장'],
    recentReview: { author: '데이터분석A', rating: 5, text: '빙수 + 아이스크림 조합 인생샷 각.' },
  },
  {
    id: 's7',
    name: '쥬시 영등포점',
    brandId: 'b7',
    region: '서울',
    district: '영등포구',
    address: '서울 영등포구 양평로 24',
    footTraffic: 4400,
    area: 10,
    openedYear: 2024,
    rating: 4.6,
    reviewCount: 218,
    monthlyVisitors: 11200,
    imageColor: '#10B981',
    awards: ['2026 베스트 음료 2위'],
    verified: true,
    highlights: ['1인 운영 가능', '점심 직장인 객수', '여름 매출 강세'],
    recentReview: { author: '직장인C', rating: 5, text: '아침 출근길 단골입니다.' },
  },
  {
    id: 's8',
    name: '역전할머니맥주 서면점',
    brandId: 'b8',
    region: '부산',
    district: '부산진구',
    address: '부산 부산진구 중앙대로 668',
    footTraffic: 8400,
    area: 26,
    openedYear: 2022,
    rating: 4.7,
    reviewCount: 386,
    monthlyVisitors: 12400,
    imageColor: '#7C3AED',
    awards: ['2026 베스트 주점 1위'],
    verified: true,
    highlights: ['부산 야간 상권', '주말 매출 강세', '안주 다양성'],
    recentReview: { author: '서면주민', rating: 5, text: '안주 종류 많고 야간 분위기 좋음. 주말 예약 필수.' },
  },
  {
    id: 's9',
    name: '굽네치킨 강서마곡점',
    brandId: 'b9',
    region: '서울',
    district: '강서구',
    address: '서울 강서구 마곡중앙로 31',
    footTraffic: 3800,
    area: 24,
    openedYear: 2025,
    rating: 4.6,
    reviewCount: 162,
    monthlyVisitors: 7200,
    imageColor: '#EAB308',
    awards: ['2026 신규 매장상'],
    verified: true,
    highlights: ['오븐 구이 콘셉트', '건강 지향 객층', '저칼로리 강조'],
    recentReview: { author: '강서주민', rating: 5, text: '느끼하지 않고 깔끔. 동네 단골 됐어요.' },
  },
  {
    id: 's10',
    name: '이디야커피 송도센트럴파크점',
    brandId: 'b10',
    region: '인천',
    district: '연수구',
    address: '인천 연수구 송도해돋이로 154',
    footTraffic: 3200,
    area: 28,
    openedYear: 2023,
    rating: 4.5,
    reviewCount: 284,
    monthlyVisitors: 8400,
    imageColor: '#A16207',
    awards: ['2026 베스트 카페 3위'],
    verified: true,
    highlights: ['주거 단지 인근', '단골 비중 70%', '넓은 좌석'],
    recentReview: { author: '송도주민', rating: 4, text: '동네 단골 카페. 좌석 넓고 쾌적해요.' },
  },
  {
    id: 's11',
    name: '봉추찜닭 부산서면점',
    brandId: 'b11',
    region: '부산',
    district: '부산진구',
    address: '부산 부산진구 중앙대로 752',
    footTraffic: 4200,
    area: 32,
    openedYear: 2021,
    rating: 4.6,
    reviewCount: 322,
    monthlyVisitors: 9800,
    imageColor: '#B45309',
    awards: ['2026 베스트 한식 1위'],
    verified: true,
    highlights: ['찜닭 단가 안정', '단체석 우수', '점심 객수 강세'],
    recentReview: { author: '부산직장인', rating: 5, text: '점심 자주 옵니다. 찜닭 양 많고 간이 딱 맞아요.' },
  },
  {
    id: 's12',
    name: '마루가메제면 광화문점',
    brandId: 'b12',
    region: '서울',
    district: '종로구',
    address: '서울 종로구 광화문역 5번출구',
    footTraffic: 6800,
    area: 26,
    openedYear: 2022,
    rating: 4.7,
    reviewCount: 412,
    monthlyVisitors: 14600,
    imageColor: '#991B1B',
    awards: ['2026 베스트 일식 2위'],
    verified: true,
    highlights: ['오피스 상권', '점심 피크 매출 강세', '우동 직타 인기'],
    recentReview: { author: '오피스워커', rating: 5, text: '점심 줄이 길어도 회전 빨라요. 우동 진하고 맛있어요.' },
  },
  {
    id: 's13',
    name: '교촌치킨 해운대점',
    brandId: 'b1',
    region: '부산',
    district: '해운대구',
    address: '부산 해운대구 해운대로 567',
    footTraffic: 5800,
    area: 30,
    openedYear: 2023,
    rating: 4.5,
    reviewCount: 286,
    monthlyVisitors: 10200,
    imageColor: '#B45309',
    awards: ['2026 신규 매장상'],
    verified: true,
    highlights: ['관광 상권', '주말 매출 강세', '신축'],
    recentReview: { author: '해운대주민', rating: 4, text: '치킨 맛 좋고 양도 많아요. 평일 한산.' },
  },
  {
    id: 's14',
    name: '메가커피 판교역점',
    brandId: 'b2',
    region: '경기',
    district: '성남시 분당구',
    address: '경기 성남시 분당구 판교역로 145',
    footTraffic: 5400,
    area: 18,
    openedYear: 2024,
    rating: 4.6,
    reviewCount: 312,
    monthlyVisitors: 14200,
    imageColor: '#7C3AED',
    awards: ['2026 베스트 카페 2위'],
    verified: true,
    highlights: ['IT 직장인 점심', '커피 가성비', '신축'],
    recentReview: { author: '판교개발자', rating: 5, text: '회사 옆이라 매일 옵니다. 가성비 최고.' },
  },
  {
    id: 's15',
    name: '설빙 강남역점',
    brandId: 'b6',
    region: '서울',
    district: '강남구',
    address: '서울 강남구 강남대로 456',
    footTraffic: 6800,
    area: 26,
    openedYear: 2023,
    rating: 4.7,
    reviewCount: 478,
    monthlyVisitors: 15800,
    imageColor: '#EC4899',
    awards: ['2026 베스트 디저트 2위'],
    verified: true,
    highlights: ['강남 한복판', '프리미엄 빙수', '인스타 활발'],
    recentReview: { author: '강남직장인', rating: 5, text: '미팅 장소로 좋아요. 빙수 + 음료 조합 굿.' },
  },
]

export const STORES: MockStore[] = RAW_STORES.map((s) => {
  const brand = BRANDS.find((b) => b.id === s.brandId)
  const photos = storePhotoSet(s.id, brand?.category ?? 'korean')
  return {
    ...s,
    heroImage: photos.hero,
    gallery: photos.gallery,
  }
})

export function storeById(id: string): MockStore | undefined {
  return STORES.find((s) => s.id === id)
}

export function storesByBrand(brandId: string): MockStore[] {
  return STORES.filter((s) => s.brandId === brandId)
}

export function storesByRegion(region: string): MockStore[] {
  return STORES.filter((s) => s.region === region)
}

export function topStoresByRating(limit = 10): MockStore[] {
  return [...STORES].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export function topStoresByVisitors(limit = 10): MockStore[] {
  return [...STORES].sort((a, b) => b.monthlyVisitors - a.monthlyVisitors).slice(0, limit)
}

export function newestStores(limit = 6): MockStore[] {
  return [...STORES].sort((a, b) => b.openedYear - a.openedYear).slice(0, limit)
}

export const AWARDS: MockAward[] = [
  // 2026 — 본년도 베스트
  { id: 'a-2026-chicken-1', year: 2026, category: 'chicken', categoryLabel: '치킨', rank: 1, brandId: 'b1', citation: '가맹점 수 1,000호점 돌파 + 점주 만족도 4.3/5 — 치킨 카테고리 종합 1위', representativeStoreId: 's1' },
  { id: 'a-2026-chicken-2', year: 2026, category: 'chicken', categoryLabel: '치킨', rank: 2, brandId: 'b9', citation: '오븐구이 콘셉트로 건강 지향 신규 객층 개척 + 매장당 매출 성장률 1위', representativeStoreId: 's9' },
  { id: 'a-2026-cafe-1', year: 2026, category: 'cafe', categoryLabel: '카페', rank: 1, brandId: 'b2', citation: '저가형 스페셜티 커피의 새 기준 제시 — 1,700호점 돌파 + 평균 회전율 1위', representativeStoreId: 's2' },
  { id: 'a-2026-cafe-2', year: 2026, category: 'cafe', categoryLabel: '카페', rank: 2, brandId: 'b2', citation: 'IT 단지 점심 점주 만족도 1위 — 판교·강남 상권 점유율 성장', representativeStoreId: 's14' },
  { id: 'a-2026-cafe-3', year: 2026, category: 'cafe', categoryLabel: '카페', rank: 3, brandId: 'b10', citation: '동네 단골 충성도 가장 높은 카페 — 재방문율 68%', representativeStoreId: 's10' },
  { id: 'a-2026-korean-1', year: 2026, category: 'korean', categoryLabel: '한식', rank: 1, brandId: 'b11', citation: '찜닭 단가 안정성 + 단체 객석 운영 1위 — 부산·경남 매장 수 최다', representativeStoreId: 's11' },
  { id: 'a-2026-korean-2', year: 2026, category: 'korean', categoryLabel: '한식', rank: 2, brandId: 'b3', citation: 'IT 단지 점심 도시락 회전율 1위 — 배달 채널 비중 60% 안정화', representativeStoreId: 's3' },
  { id: 'a-2026-japanese-1', year: 2026, category: 'japanese', categoryLabel: '일식', rank: 1, brandId: 'b4', citation: '이자카야·다이닝 복합 운영 매장당 매출 1위', representativeStoreId: 's4' },
  { id: 'a-2026-japanese-2', year: 2026, category: 'japanese', categoryLabel: '일식', rank: 2, brandId: 'b12', citation: '오피스 점심 우동 회전율 1위 — 광화문·여의도 상권 점유율 성장', representativeStoreId: 's12' },
  { id: 'a-2026-snack-3', year: 2026, category: 'snack', categoryLabel: '분식', rank: 3, brandId: 'b5', citation: '학원가 분식 회전율 + 학생 객층 만족도 모두 상위권', representativeStoreId: 's5' },
  { id: 'a-2026-dessert-1', year: 2026, category: 'dessert', categoryLabel: '디저트', rank: 1, brandId: 'b6', citation: 'SNS 트렌드 반영 가장 빠른 디저트 본사 — 성수·강남 핫플 매장 집중', representativeStoreId: 's6' },
  { id: 'a-2026-dessert-2', year: 2026, category: 'dessert', categoryLabel: '디저트', rank: 2, brandId: 'b6', citation: '강남역 인스타 핫플 + 여름 시즌 매출 전년 대비 +42%', representativeStoreId: 's15' },
  { id: 'a-2026-beverage-2', year: 2026, category: 'beverage', categoryLabel: '음료', rank: 2, brandId: 'b7', citation: '1인 운영 효율성 + 저자본 창업 가성비 1위', representativeStoreId: 's7' },
  { id: 'a-2026-bar-1', year: 2026, category: 'bar', categoryLabel: '주점', rank: 1, brandId: 'b8', citation: '안주 다양성 + 야간 상권 점유율 1위 — 부산·대구 지역 매장 급성장', representativeStoreId: 's8' },

  // 2025 — 작년 베스트 (간략)
  { id: 'a-2025-chicken-1', year: 2025, category: 'chicken', categoryLabel: '치킨', rank: 1, brandId: 'b1', citation: '교촌 오리지널 + 허니콤보 신메뉴 SNS 노출 폭증' },
  { id: 'a-2025-cafe-1', year: 2025, category: 'cafe', categoryLabel: '카페', rank: 1, brandId: 'b2', citation: '메가커피 저가형 모델로 1,200호점 돌파 — 신규 점주 유입 최다' },
  { id: 'a-2025-korean-1', year: 2025, category: 'korean', categoryLabel: '한식', rank: 1, brandId: 'b3', citation: '한솥도시락 배달 채널 확장으로 안정적 성장' },
  { id: 'a-2025-dessert-1', year: 2025, category: 'dessert', categoryLabel: '디저트', rank: 1, brandId: 'b6', citation: '설빙 SNS 입소문 + 여름 시즌 매출 최대' },
  { id: 'a-2025-bar-1', year: 2025, category: 'bar', categoryLabel: '주점', rank: 1, brandId: 'b8', citation: '역전할머니맥주 야간 상권 신뢰 브랜드 2년 연속' },

  // 2024 — 재작년 베스트 (간략)
  { id: 'a-2024-chicken-1', year: 2024, category: 'chicken', categoryLabel: '치킨', rank: 1, brandId: 'b1', citation: '교촌치킨 치킨 카테고리 3년 연속 1위' },
  { id: 'a-2024-cafe-1', year: 2024, category: 'cafe', categoryLabel: '카페', rank: 1, brandId: 'b10', citation: '이디야커피 동네 카페 안정성 + 재방문율 1위' },
  { id: 'a-2024-snack-1', year: 2024, category: 'snack', categoryLabel: '분식', rank: 1, brandId: 'b5', citation: '죠스떡볶이 학생 상권 회전율 1위 — 전국 450호점' },
]

export const AVAILABLE_YEARS = Array.from(new Set(AWARDS.map((a) => a.year))).sort((a, b) => b - a)

export function awardsByYear(year: number): MockAward[] {
  return AWARDS.filter((a) => a.year === year).sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    return a.rank - b.rank
  })
}

export function awardsByCategory(year: number, category: string): MockAward[] {
  return AWARDS.filter((a) => a.year === year && a.category === category).sort(
    (a, b) => a.rank - b.rank,
  )
}

export function awardsForStore(storeId: string): MockAward[] {
  return AWARDS.filter((a) => a.representativeStoreId === storeId)
}

export const RANK_LABEL: Record<AwardRank, string> = {
  1: '대상',
  2: '금상',
  3: '은상',
}

export const RANK_COLOR: Record<AwardRank, string> = {
  1: '#EAB308', // gold
  2: '#94A3B8', // silver
  3: '#A16207', // bronze
}
