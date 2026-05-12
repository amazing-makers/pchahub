// Mock data for pchahub homepage. Will be replaced with real DB queries
// once Supabase is connected. Brand names are fictional to avoid trademark
// issues; figures are illustrative and not based on actual KFA disclosures.

import { brandImageSet } from './brand-images'

export interface MockCategory {
  key: string
  label: string
  brandCount: number
}

export interface MockBrand {
  id: string
  name: string
  category: string
  categoryLabel: string
  /** Hex color used as a flat logo placeholder until real logos exist. */
  logoColor: string
  description: string
  storeCount: number
  /** Initial startup cost in 만원 (10,000 KRW). */
  startupCost: number
  /** Monthly royalty in 만원. */
  monthlyRoyalty: number
  /** Verified by KFA / 협회 등록 정보공개서 reference. */
  hqVerified: boolean
  /** Brand is actively recruiting new franchisees. */
  recruiting: boolean
  /** Paid ad placement (top-of-list). */
  featured: boolean
  /** Rough new-store growth rate this year (%). */
  growthRate: number
  /** HQ headquarters region (시·도). Used for /brands region filter. */
  hqRegion: string
  /** Hero image URL — real photo for brand card / detail page. */
  heroImage: string
  // ── 실 API(KFTC) 전용 필드 ──────────────────────────────
  /** KFTC 법인명 (실API 브랜드). 없으면 name 기반 표시. */
  corpNm?: string
  /** 평균 연매출 (만원). getBrandFrcsStats avrgSlsAmt. */
  avgAnnualSales?: number
  /** 가맹사업 시작연도. getBrandBrandStats jngBizStrtDate. */
  jngBizStartYear?: number
  /** 계약 종료(폐점) 수. getBrandFrcsStats ctrtEndCnt. */
  closedCount?: number
  /** 신규 가맹점 등록 수. getBrandFrcsStats newFrcsRgsCnt. */
  newOpenCount?: number
  /** 가맹금 (만원). getBrandFntnStats jngBzmnJngAmt. */
  fntnFranchiseFee?: number
  /** 교육비 (만원). getBrandFntnStats jngBzmnEduAmt. */
  fntnEducationFee?: number
  /** 보증금 (만원). getBrandFntnStats jngBzmnAssrncAmt. */
  fntnDeposit?: number
  /** 기타 (만원). getBrandFntnStats jngBzmnEtcAmt. */
  fntnOtherFees?: number
}

export const CATEGORIES: MockCategory[] = [
  { key: 'chicken', label: '치킨', brandCount: 142 },
  { key: 'cafe', label: '카페', brandCount: 318 },
  { key: 'korean', label: '한식', brandCount: 87 },
  { key: 'japanese', label: '일식', brandCount: 54 },
  { key: 'snack', label: '분식', brandCount: 76 },
  { key: 'dessert', label: '디저트', brandCount: 49 },
  { key: 'beverage', label: '음료', brandCount: 62 },
  { key: 'bar', label: '주점', brandCount: 38 },
  { key: 'convenience', label: '편의점', brandCount: 24 },
  { key: 'education', label: '교육', brandCount: 41 },
]

type RawBrand = Omit<MockBrand, 'heroImage' | 'hqRegion'> & { hqRegion?: string }

const RAW_BRANDS: RawBrand[] = [
  {
    id: 'b1',
    name: '치킨다이스',
    category: 'chicken',
    categoryLabel: '치킨',
    logoColor: '#F97316',
    description: '바삭한 트렌드 치킨 · 30평형 매장 특화',
    storeCount: 84,
    startupCost: 5500,
    monthlyRoyalty: 50,
    hqVerified: true,
    recruiting: true,
    featured: true,
    growthRate: 28,
  },
  {
    id: 'b2',
    name: '데일리브루',
    category: 'cafe',
    categoryLabel: '카페',
    logoColor: '#92400E',
    description: '저가형 스페셜티 커피 · 10평 소형 매장',
    storeCount: 312,
    startupCost: 4200,
    monthlyRoyalty: 30,
    hqVerified: true,
    recruiting: true,
    featured: true,
    growthRate: 45,
  },
  {
    id: 'b3',
    name: '한솥미식',
    category: 'korean',
    categoryLabel: '한식',
    logoColor: '#16A34A',
    description: '정통 한식 도시락 · 배달 위주 운영',
    storeCount: 56,
    startupCost: 6800,
    monthlyRoyalty: 80,
    hqVerified: true,
    recruiting: true,
    featured: true,
    growthRate: 12,
  },
  {
    id: 'b4',
    name: '스시키친',
    category: 'japanese',
    categoryLabel: '일식',
    logoColor: '#0EA5E9',
    description: '컨베이어 스시 + 라멘 듀얼 콘셉트',
    storeCount: 22,
    startupCost: 9500,
    monthlyRoyalty: 120,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 35,
  },
  {
    id: 'b5',
    name: '분식나라',
    category: 'snack',
    categoryLabel: '분식',
    logoColor: '#DC2626',
    description: '떡볶이 · 김밥 · 라면 종합 분식',
    storeCount: 138,
    startupCost: 3800,
    monthlyRoyalty: 35,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 8,
  },
  {
    id: 'b6',
    name: '스윗스튜디오',
    category: 'dessert',
    categoryLabel: '디저트',
    logoColor: '#EC4899',
    description: '프리미엄 케이크 + 마카롱 디저트 카페',
    storeCount: 41,
    startupCost: 7200,
    monthlyRoyalty: 70,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 22,
  },
  {
    id: 'b7',
    name: '주스레인',
    category: 'beverage',
    categoryLabel: '음료',
    logoColor: '#10B981',
    description: '생과일 주스 · 스무디 전문',
    storeCount: 67,
    startupCost: 3500,
    monthlyRoyalty: 25,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 18,
  },
  {
    id: 'b8',
    name: '포차모임',
    category: 'bar',
    categoryLabel: '주점',
    logoColor: '#7C3AED',
    description: '한식 포차 안주 · 야간 상권 특화',
    storeCount: 29,
    startupCost: 8500,
    monthlyRoyalty: 100,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 5,
  },
  {
    id: 'b9',
    name: '크리스피네스트',
    category: 'chicken',
    categoryLabel: '치킨',
    logoColor: '#EAB308',
    description: '저칼로리 에어프라이 치킨',
    storeCount: 18,
    startupCost: 6200,
    monthlyRoyalty: 60,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 55,
  },
  {
    id: 'b10',
    name: '카페모먼트',
    category: 'cafe',
    categoryLabel: '카페',
    logoColor: '#A16207',
    description: '디저트 강화형 동네 카페',
    storeCount: 94,
    startupCost: 5800,
    monthlyRoyalty: 45,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 14,
  },
  {
    id: 'b11',
    name: '한그릇진심',
    category: 'korean',
    categoryLabel: '한식',
    logoColor: '#B45309',
    description: '국밥 · 곰탕 전문 한식 식당',
    storeCount: 33,
    startupCost: 7500,
    monthlyRoyalty: 90,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 6,
  },
  {
    id: 'b12',
    name: '라멘이치고',
    category: 'japanese',
    categoryLabel: '일식',
    logoColor: '#991B1B',
    description: '돈코츠 라멘 + 사이드 메뉴 특화',
    storeCount: 47,
    startupCost: 6500,
    monthlyRoyalty: 55,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 19,
  },
]

/** Brand HQ region map. Used by the /brands region filter and brand detail
 *  page. Real KFA disclosure address per brand will replace this once Supabase
 *  is connected. */
const BRAND_HQ_REGION: Record<string, string> = {
  b1: '서울',
  b2: '서울',
  b3: '경기',
  b4: '서울',
  b5: '경기',
  b6: '서울',
  b7: '인천',
  b8: '서울',
  b9: '경기',
  b10: '서울',
  b11: '부산',
  b12: '서울',
}

export const BRANDS: MockBrand[] = RAW_BRANDS.map((b) => ({
  ...b,
  hqRegion: b.hqRegion ?? BRAND_HQ_REGION[b.id] ?? '서울',
  heroImage: brandImageSet(b.id, b.category).hero,
}))

export const FEATURED_BRANDS = BRANDS.filter((b) => b.featured)
export const RECRUITING_BRANDS = BRANDS.filter((b) => b.recruiting && !b.featured)

/** Brands currently trending — combined signal of recent growth + store base. */
export const TRENDING_BRANDS = [...BRANDS]
  .sort((a, b) => b.growthRate * Math.log(b.storeCount + 1) - a.growthRate * Math.log(a.storeCount + 1))
  .slice(0, 6)
