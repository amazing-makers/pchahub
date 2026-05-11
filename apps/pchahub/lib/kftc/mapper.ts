// KFTC API 응답 → pchahub mock 구조 매퍼.
//
// 이 매퍼만 정확히 동작하면, 페이지 코드는 mock 데이터를 쓰는지 실 API를
// 쓰는지 신경 쓸 필요가 없다.

import type { MockBrand } from '../mock-data'
import { brandImageSet } from '../brand-images'
import type {
  BrandCosts,
  BrandDetail,
  BrandDisclosureExtras,
  BrandHQ,
  BrandRevenue,
  BrandStoreHistory,
} from '../mock-brand-detail'
import type { KftcDisclosureContent, KftcDisclosureListItem } from './types'

// ============================================================
// 업태 코드 → mock 카테고리 키 매핑
// ============================================================

/**
 * 공정위 업종 분류명을 pchahub 카테고리 키로 매핑.
 * KFTC가 "indutyClsfNm" 필드로 주는 값을 normalize.
 */
const INDUSTRY_TO_CATEGORY: Record<string, { key: string; label: string }> = {
  치킨: { key: 'chicken', label: '치킨' },
  '치킨/통닭': { key: 'chicken', label: '치킨' },
  커피: { key: 'cafe', label: '카페' },
  '카페/디저트': { key: 'cafe', label: '카페' },
  한식: { key: 'korean', label: '한식' },
  '한식/도시락': { key: 'korean', label: '한식' },
  일식: { key: 'japanese', label: '일식' },
  '일식/돈가스': { key: 'japanese', label: '일식' },
  '분식/김밥': { key: 'snack', label: '분식' },
  분식: { key: 'snack', label: '분식' },
  디저트: { key: 'dessert', label: '디저트' },
  '베이커리/디저트': { key: 'dessert', label: '디저트' },
  음료: { key: 'beverage', label: '음료' },
  '주스/스무디': { key: 'beverage', label: '음료' },
  주점: { key: 'bar', label: '주점' },
  '주점/이자카야': { key: 'bar', label: '주점' },
  편의점: { key: 'convenience', label: '편의점' },
  교육: { key: 'education', label: '교육' },
}

function normalizeCategory(indutyClsfNm: string | undefined): { key: string; label: string } {
  if (!indutyClsfNm) return { key: 'korean', label: '한식' }
  return INDUSTRY_TO_CATEGORY[indutyClsfNm] ?? { key: 'korean', label: '한식' }
}

// ============================================================
// 본부 지역 — 주소에서 시·도 추출
// ============================================================

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']

function extractRegion(addr: string): string {
  for (const r of REGIONS) {
    if (addr.includes(r)) return r
  }
  return '서울'
}

// ============================================================
// 색상 — 브랜드 ID 해시로 안정적 색상 생성
// ============================================================

const BRAND_COLOR_POOL = [
  '#F97316', '#92400E', '#16A34A', '#0EA5E9', '#DC2626', '#EC4899',
  '#10B981', '#7C3AED', '#EAB308', '#A16207', '#B45309', '#991B1B',
]

function hashColor(id: string): string {
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return BRAND_COLOR_POOL[seed % BRAND_COLOR_POOL.length]
}

// ============================================================
// KFTC list item → MockBrand (브랜드 디렉토리 카드용)
// ============================================================

/**
 * 정보공개서 list 응답의 한 항목을 MockBrand 카드 형태로 변환.
 *
 * list만으로는 storeCount·startupCost를 알 수 없으므로 0으로 두고,
 * 페어데이터 API + 정보공개서 content API 응답을 머지할 때 채운다.
 */
export function mapListItemToBrand(
  item: KftcDisclosureListItem,
  partial?: Partial<MockBrand>,
): MockBrand {
  const cat = normalizeCategory(item.indutyClsfNm)
  const id = `kftc-${item.jngIfrmpSn}`
  const base: MockBrand = {
    id,
    name: item.brandNm,
    category: cat.key,
    categoryLabel: cat.label,
    logoColor: hashColor(id),
    description: `${item.crpoNm}이(가) 운영하는 ${cat.label} 가맹 브랜드.`,
    storeCount: 0,
    startupCost: 0,
    monthlyRoyalty: 0,
    hqVerified: true, // 정보공개서 등록 = 자동 검증
    recruiting: true,
    featured: false,
    growthRate: 0,
    hqRegion: '서울', // content API에서 갱신
    heroImage: brandImageSet(id, cat.key).hero,
    ...partial,
  }
  return base
}

// ============================================================
// KFTC content → BrandDetail (브랜드 상세 페이지용)
// ============================================================

/**
 * 정보공개서 본문 응답을 mock의 BrandDetail 구조로 변환.
 * pchahub /brands/[id] 페이지가 그대로 사용한다.
 */
export function mapContentToDetail(content: KftcDisclosureContent): {
  hq: BrandHQ
  costs: BrandCosts
  revenue: BrandRevenue
  storeHistory: BrandStoreHistory[]
  disclosure: BrandDisclosureExtras
} {
  const hq: BrandHQ = {
    companyName: content.ch1_hqInfo.crpoNm,
    ceo: content.ch1_hqInfo.repNm,
    foundedYear: parseYear(content.ch1_hqInfo.estbsDt),
    franchiseStartYear: parseYear(content.ch1_hqInfo.fcStartDt),
    address: content.ch1_hqInfo.addr,
    phone: content.ch1_hqInfo.telNo,
    website: content.ch1_hqInfo.homepageUrl,
    bizNumber: content.ch1_hqInfo.bizRgNo,
  }

  const c = content.ch2_costs
  const costs: BrandCosts = {
    franchiseFee: c.franchiseFee,
    deposit: c.deposit,
    interiorFee: c.interiorFee,
    educationFee: c.educationFee,
    otherFees: c.otherFees,
    royaltyType: c.royaltyType,
    royaltyValue: c.royaltyValue,
    recommendedArea: c.standardArea,
    minArea: Math.max(c.standardArea - 5, 6),
  }

  const revenue: BrandRevenue = {
    averageMonthly: content.ch5_revenue.averageMonthly,
    averageOperatingProfit: content.ch5_revenue.averageOperatingProfit,
    byYear: content.ch4_stores.byYear.map((y) => ({
      year: y.year,
      // 매출은 매장 수 증가율과 비례한다고 가정 — 정확한 byYear 매출은
      // 페어데이터 API를 동시에 호출해서 머지해야 함
      avgMonthly: content.ch5_revenue.averageMonthly,
    })),
    byRegion: content.ch5_revenue.byRegion,
  }

  const storeHistory: BrandStoreHistory[] = content.ch4_stores.byYear.map((y) => ({
    year: y.year,
    totalStores: y.totalStores,
    newStores: y.newStores,
    closedStores: y.closedStores,
  }))

  const disclosure: BrandDisclosureExtras = {
    hqAdvertisingShare: content.ch3_terms.hqAdvertisingShare,
    storeAdvertisingShare: content.ch3_terms.storeAdvertisingShare,
    contractYears: content.ch3_terms.contractYears,
    renewalTerms: content.ch3_terms.renewalTerms,
    territoryProtection: content.ch3_terms.territoryProtection,
    trademarkRegistered: content.ch1_hqInfo.trademarkRegistered,
    registrationNumber: content.meta.registrationNumber,
    disclosureUpdatedAt: content.meta.publishedAt,
  }

  return { hq, costs, revenue, storeHistory, disclosure }
}

function parseYear(dateStr: string): number {
  const m = dateStr.match(/^(\d{4})/)
  return m ? parseInt(m[1], 10) : 2020
}
