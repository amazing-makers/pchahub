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
import type {
  KftcBrandListItem,
  KftcBrandStoreStats,
  KftcHqInfoItem,
  KftcHqRegistrationItem,
  KftcIndutyBrandStats,
  KftcBrandFntnStatsItem,
  KftcBrandFrcsStatsItem,
  KftcBrandUnitAvrSalItem,
  KftcJnghdqrtrsGrStatsItem,
  KftcJnghdqrtrsStableItem,
  KftcJnghdqrtrsErnItem,
  KftcBrandFrcsListItem,
  KftcSclasIndutyFntnItem,
  KftcIndutyAnaBrandMaintItem,
  KftcBrandFrcsIntItem,
  KftcBrandBrandStatsItem,
} from './json-apis'

// ============================================================
// 업태 코드 → mock 카테고리 키 매핑
// ============================================================

/**
 * 공정위 업종 분류명을 pchahub 카테고리 키로 매핑.
 * KFTC가 "indutyClsfNm" 필드로 주는 값을 normalize.
 */
const INDUSTRY_TO_CATEGORY: Record<string, { key: string; label: string }> = {
  // 치킨
  치킨: { key: 'chicken', label: '치킨' },
  '치킨/통닭': { key: 'chicken', label: '치킨' },
  통닭: { key: 'chicken', label: '치킨' },

  // 카페/음료
  커피: { key: 'cafe', label: '카페' },
  '카페/디저트': { key: 'cafe', label: '카페' },
  '커피/차': { key: 'cafe', label: '카페' },
  카페: { key: 'cafe', label: '카페' },
  음료: { key: 'beverage', label: '음료' },
  '음료 (커피 외)': { key: 'beverage', label: '음료' },
  '주스/스무디': { key: 'beverage', label: '음료' },
  '음료/주스': { key: 'beverage', label: '음료' },
  버블티: { key: 'beverage', label: '음료' },
  '티/음료': { key: 'beverage', label: '음료' },

  // 한식
  한식: { key: 'korean', label: '한식' },
  '한식/도시락': { key: 'korean', label: '한식' },
  도시락: { key: 'korean', label: '한식' },
  '국/탕/찌개': { key: 'korean', label: '한식' },
  '삼겹살/고기': { key: 'korean', label: '한식' },
  '구이/고기': { key: 'korean', label: '한식' },
  족발: { key: 'korean', label: '한식' },
  '족발/보쌈': { key: 'korean', label: '한식' },
  '순대/곱창': { key: 'korean', label: '한식' },
  '김치찌개/된장찌개': { key: 'korean', label: '한식' },
  '쌀국수/국수': { key: 'korean', label: '한식' },
  '죽/해장': { key: 'korean', label: '한식' },
  '샐러드/건강식': { key: 'korean', label: '한식' },
  '중식/중국음식': { key: 'korean', label: '한식' },
  중식: { key: 'korean', label: '한식' },
  '양식/패밀리레스토랑': { key: 'korean', label: '한식' },
  양식: { key: 'korean', label: '한식' },
  '패스트푸드/버거': { key: 'korean', label: '한식' },
  패스트푸드: { key: 'korean', label: '한식' },
  버거: { key: 'korean', label: '한식' },

  // 기타 (외식 대분류 내 미분류/혼합)
  '기타 외식': { key: 'korean', label: '한식' },
  '기타 외국식': { key: 'japanese', label: '일식' },
  서양식: { key: 'japanese', label: '일식' },

  // 일식
  일식: { key: 'japanese', label: '일식' },
  '일식/돈가스': { key: 'japanese', label: '일식' },
  돈가스: { key: 'japanese', label: '일식' },
  초밥: { key: 'japanese', label: '일식' },
  '초밥/스시': { key: 'japanese', label: '일식' },
  '라멘/라면': { key: 'japanese', label: '일식' },
  '해물/생선': { key: 'japanese', label: '일식' },
  횟집: { key: 'japanese', label: '일식' },
  '해산물/횟집': { key: 'japanese', label: '일식' },
  피자: { key: 'japanese', label: '일식' },

  // 분식
  분식: { key: 'snack', label: '분식' },
  '분식/김밥': { key: 'snack', label: '분식' },
  김밥: { key: 'snack', label: '분식' },
  '떡볶이/분식': { key: 'snack', label: '분식' },
  떡볶이: { key: 'snack', label: '분식' },
  '샌드위치/토스트': { key: 'snack', label: '분식' },
  토스트: { key: 'snack', label: '분식' },

  // 디저트
  디저트: { key: 'dessert', label: '디저트' },
  '베이커리/디저트': { key: 'dessert', label: '디저트' },
  베이커리: { key: 'dessert', label: '디저트' },
  제과제빵: { key: 'dessert', label: '디저트' },
  '케이크/빵': { key: 'dessert', label: '디저트' },
  아이스크림: { key: 'dessert', label: '디저트' },
  '아이스크림/빙수': { key: 'dessert', label: '디저트' },
  와플: { key: 'dessert', label: '디저트' },
  '마카롱/쿠키': { key: 'dessert', label: '디저트' },

  // 주점
  주점: { key: 'bar', label: '주점' },
  '주점/이자카야': { key: 'bar', label: '주점' },
  이자카야: { key: 'bar', label: '주점' },
  '포차/술집': { key: 'bar', label: '주점' },
  맥주: { key: 'bar', label: '주점' },
  '맥주/호프': { key: 'bar', label: '주점' },
  노래방: { key: 'bar', label: '주점' },

  // 편의점/도소매
  편의점: { key: 'convenience', label: '편의점' },
  '편의점/슈퍼': { key: 'convenience', label: '편의점' },
  슈퍼마켓: { key: 'convenience', label: '편의점' },
  '도소매/유통': { key: 'convenience', label: '편의점' },
  기타도소매: { key: 'convenience', label: '편의점' },
  '약국/의약품': { key: 'convenience', label: '편의점' },
  건강식품: { key: 'convenience', label: '편의점' },
  '의류/패션': { key: 'convenience', label: '편의점' },
  '의류 / 패션': { key: 'convenience', label: '편의점' },
  화장품: { key: 'convenience', label: '편의점' },
  '화장품/미용용품': { key: 'convenience', label: '편의점' },
  '문구/완구': { key: 'convenience', label: '편의점' },
  꽃: { key: 'convenience', label: '편의점' },
  '꽃/화훼': { key: 'convenience', label: '편의점' },
  안경: { key: 'convenience', label: '편의점' },
  '안경/렌즈': { key: 'convenience', label: '편의점' },

  // 교육/서비스
  교육: { key: 'education', label: '교육' },
  '학원/교육': { key: 'education', label: '교육' },
  '어린이/유아': { key: 'education', label: '교육' },
  '외국어/영어': { key: 'education', label: '교육' },
  '교육 (외국어)': { key: 'education', label: '교육' },
  '교육 (보습)': { key: 'education', label: '교육' },
  '교육 (음악)': { key: 'education', label: '교육' },
  '교육 (미술)': { key: 'education', label: '교육' },
  '교육 (체육)': { key: 'education', label: '교육' },
  '교육 (기타)': { key: 'education', label: '교육' },
  '예체능/미술': { key: 'education', label: '교육' },
  이미용: { key: 'education', label: '교육' },
  '미용/헤어': { key: 'education', label: '교육' },
  헤어: { key: 'education', label: '교육' },
  '뷰티/미용': { key: 'education', label: '교육' },
  네일: { key: 'education', label: '교육' },
  '세탁/클리닝': { key: 'education', label: '교육' },
  세탁: { key: 'education', label: '교육' },
  '헬스/피트니스': { key: 'education', label: '교육' },
  피트니스: { key: 'education', label: '교육' },
  '스포츠 관련': { key: 'education', label: '교육' },
  오락: { key: 'education', label: '교육' },
  '반려동물/펫': { key: 'education', label: '교육' },
  반려동물: { key: 'education', label: '교육' },
  '인테리어/리모델링': { key: 'education', label: '교육' },
  '청소/환경': { key: 'education', label: '교육' },
  '부동산/임대': { key: 'education', label: '교육' },
  '공인중개사': { key: 'education', label: '교육' },
  배달: { key: 'education', label: '교육' },
  '기타 서비스': { key: 'education', label: '교육' },
  '서비스/기타': { key: 'education', label: '교육' },
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
  return BRAND_COLOR_POOL[seed % BRAND_COLOR_POOL.length] ?? '#F97316'
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
  return m ? parseInt(m[1]!, 10) : 2020
}

// ============================================================
// 업종별 브랜드변동현황 → 카테고리 트렌드 요약
// ============================================================

export interface CategoryTrend {
  categoryKey: string
  categoryLabel: string
  currBrandCnt: number
  newBrandCnt: number
  closedBrandCnt: number
  changeRate: number
}

/**
 * 업종별 브랜드 변동 통계를 카테고리별로 그룹핑.
 * /categories/[key] 페이지에 "올해 신규 등장한 브랜드 N개" 표시용.
 */
export function aggregateIndutyBrandStats(items: KftcIndutyBrandStats[]): CategoryTrend[] {
  // 같은 카테고리 키로 모이는 항목들을 합산 (소분류 → 우리 카테고리 8종)
  const buckets = new Map<string, CategoryTrend>()
  for (const it of items) {
    const induty = it.indutySclasNm ?? it.indutyMlsfcNm ?? it.indutyLclasNm
    const cat = normalizeCategory(induty)
    const existing = buckets.get(cat.key)
    const curr = it.currBrandCnt ?? 0
    const ne = it.newBrandCnt ?? 0
    const cl = it.closedBrandCnt ?? 0
    if (existing) {
      existing.currBrandCnt += curr
      existing.newBrandCnt += ne
      existing.closedBrandCnt += cl
    } else {
      buckets.set(cat.key, {
        categoryKey: cat.key,
        categoryLabel: cat.label,
        currBrandCnt: curr,
        newBrandCnt: ne,
        closedBrandCnt: cl,
        changeRate: 0,
      })
    }
  }
  // 변동률 계산
  for (const t of buckets.values()) {
    const denom = t.currBrandCnt - t.newBrandCnt + t.closedBrandCnt
    t.changeRate = denom > 0 ? Math.round(((t.newBrandCnt - t.closedBrandCnt) / denom) * 1000) / 10 : 0
  }
  return Array.from(buckets.values()).sort((a, b) => b.currBrandCnt - a.currBrandCnt)
}

// ============================================================
// 4개 JSON API 응답을 통합해서 MockBrand[] 생성
// ============================================================

/**
 * 가맹본부관리번호(fcCrpoMngNo)를 키로 4개 API 응답을 머지.
 *
 *   브랜드 목록 + 페어데이터 + 본부 일반정보 + 본부 등록목록
 *     →  완전한 MockBrand[]
 *
 * 각 API 결과는 부분적 — 일부 필드만 있어도 나머지는 mock fallback 채움.
 */
export function mergeIntoBrands(input: {
  brandList?: KftcBrandListItem[]
  storeStats?: KftcBrandStoreStats[]
  hqInfo?: KftcHqInfoItem[]
  hqReg?: KftcHqRegistrationItem[]
  /** 이전 연도 데이터 (성장률 계산용) */
  storeStatsPrev?: KftcBrandStoreStats[]
}): MockBrand[] {
  if (!input.brandList || input.brandList.length === 0) return []

  const statsByCrpo = new Map<string, KftcBrandStoreStats>()
  for (const s of input.storeStats ?? []) if (s.fcCrpoMngNo) statsByCrpo.set(s.fcCrpoMngNo, s)

  const prevStatsByCrpo = new Map<string, KftcBrandStoreStats>()
  for (const s of input.storeStatsPrev ?? []) if (s.fcCrpoMngNo) prevStatsByCrpo.set(s.fcCrpoMngNo, s)

  const hqInfoByCrpo = new Map<string, KftcHqInfoItem>()
  for (const h of input.hqInfo ?? []) hqInfoByCrpo.set(h.fcCrpoMngNo, h)

  const hqRegByCrpo = new Map<string, KftcHqRegistrationItem>()
  for (const r of input.hqReg ?? []) hqRegByCrpo.set(r.fcCrpoMngNo, r)

  return input.brandList.map((b) => {
    const id = `kftc-${b.fcCrpoMngNo}`
    const cat = normalizeCategory(b.indutyNm)
    const stats = statsByCrpo.get(b.fcCrpoMngNo)
    const prev = prevStatsByCrpo.get(b.fcCrpoMngNo)
    const hq = hqInfoByCrpo.get(b.fcCrpoMngNo)
    const storeCount = stats ? (stats.fcStoreCnt ?? 0) + (stats.drStoreCnt ?? 0) : 0
    const prevCount = prev ? (prev.fcStoreCnt ?? 0) + (prev.drStoreCnt ?? 0) : 0
    const growth = prevCount > 0
      ? Math.round(((storeCount - prevCount) / prevCount) * 100)
      : 0

    return {
      id,
      name: b.brandNm,
      category: cat.key,
      categoryLabel: cat.label,
      logoColor: hashColor(id),
      description: hq?.crpoNm
        ? `${hq.crpoNm}이(가) 운영하는 ${cat.label} 가맹 브랜드.`
        : `${cat.label} 가맹 브랜드.`,
      storeCount,
      startupCost: 0, // 정보공개서 본문에서 채움
      monthlyRoyalty: 0,
      hqVerified: true,
      recruiting: true,
      featured: false,
      growthRate: growth,
      hqRegion: hq?.addr ? extractRegion(hq.addr) : '서울',
      heroImage: brandImageSet(id, cat.key).hero,
    } satisfies MockBrand
  })
}

/**
 * 평균 매출 (페어데이터의 avgFcSale)을 MockBrand에 머지된 별도 매핑.
 * BrandRevenue.averageMonthly로 채워진다.
 */
export function avgMonthlyFromStats(stats?: KftcBrandStoreStats): number {
  if (!stats?.avgFcSale) return 0
  // 안전한 가정: 만원 단위로 변환 (avgFcSale / 10000).
  return Math.round(stats.avgFcSale / 10000)
}

// ============================================================
// 브랜드별 창업 금액 → MockBrand.startupCost / BrandCosts 부분 채우기
// ============================================================

/**
 * fcCrpoMngNo → 창업비 합계(만원) 맵.
 * BrandFntnStats API 응답을 인덱싱해서 mergeIntoBrands()에 넘김.
 */
export function indexFntnStatsByBrand(
  items: KftcBrandFntnStatsItem[],
): Map<string, KftcBrandFntnStatsItem> {
  const m = new Map<string, KftcBrandFntnStatsItem>()
  for (const it of items) if (it.fcCrpoMngNo) m.set(it.fcCrpoMngNo, it)
  return m
}

/** 창업비 합계 (만원). fntnFee 없으면 각 항목 합산. */
export function startupCostFromFntn(item: KftcBrandFntnStatsItem): number {
  if (item.fntnFee) return item.fntnFee
  return (item.frcsFee ?? 0) + (item.dpstFee ?? 0) + (item.intFee ?? 0) + (item.eduFee ?? 0) + (item.etcFee ?? 0)
}

/** BrandCosts 부분 채우기 (창업비 세부내역). */
export function costsFromFntn(item: KftcBrandFntnStatsItem): Partial<BrandCosts> {
  return {
    franchiseFee: item.frcsFee ?? 0,
    deposit: item.dpstFee ?? 0,
    interiorFee: item.intFee ?? 0,
    educationFee: item.eduFee ?? 0,
    otherFees: item.etcFee ?? 0,
  }
}

// ============================================================
// 브랜드별 가맹점 현황 → MockBrand.storeCount (BrandFrcsStats)
// ============================================================

export function indexFrcsStatsByBrand(
  items: KftcBrandFrcsStatsItem[],
): Map<string, KftcBrandFrcsStatsItem> {
  const m = new Map<string, KftcBrandFrcsStatsItem>()
  for (const it of items) m.set(it.fcCrpoMngNo, it)
  return m
}

export function storeCountFromFrcsStats(item: KftcBrandFrcsStatsItem): number {
  return (item.fcStoreCnt ?? 0) + (item.drStoreCnt ?? 0)
}

// ============================================================
// 단위면적당 평균 매출 → BrandRevenue.averageMonthly
// ============================================================

export function indexUnitAvrSalByBrand(
  items: KftcBrandUnitAvrSalItem[],
): Map<string, KftcBrandUnitAvrSalItem> {
  const m = new Map<string, KftcBrandUnitAvrSalItem>()
  for (const it of items) m.set(it.fcCrpoMngNo, it)
  return m
}

export function avgMonthlyFromUnitAvrSal(item: KftcBrandUnitAvrSalItem): number {
  if (item.avrMonthlySal) return item.avrMonthlySal
  // 단위 면적당 매출 × 표준 면적 ÷ 12 (연→월 변환)
  if (item.unitAvrSal && item.stdArea) return Math.round((item.unitAvrSal * item.stdArea) / 12)
  return 0
}

// ============================================================
// 가맹본부별 성장성 통계 → MockBrand.growthRate
// ============================================================

export function indexGrStatsByBrand(
  items: KftcJnghdqrtrsGrStatsItem[],
): Map<string, KftcJnghdqrtrsGrStatsItem> {
  const m = new Map<string, KftcJnghdqrtrsGrStatsItem>()
  for (const it of items) m.set(it.fcCrpoMngNo, it)
  return m
}

/** 가맹점수 증감률을 우선, 없으면 매출 증감률 사용. */
export function growthRateFromGrStats(item: KftcJnghdqrtrsGrStatsItem): number {
  return Math.round(item.fcStoreCntCgRate ?? item.slsCgRate ?? 0)
}

// ============================================================
// 가맹본부별 안정성 통계 (JnghdqrtrsStableStats)
// ============================================================

export interface BrandStabilityMetrics {
  stableScore: number
  closureRate: number
  avgRunYrs: number
}

export function indexStableStatsByBrand(
  items: KftcJnghdqrtrsStableItem[],
): Map<string, KftcJnghdqrtrsStableItem> {
  const m = new Map<string, KftcJnghdqrtrsStableItem>()
  for (const it of items) m.set(it.fcCrpoMngNo, it)
  return m
}

export function stabilityFromStats(item: KftcJnghdqrtrsStableItem): BrandStabilityMetrics {
  return {
    stableScore: item.stableScore ?? 0,
    closureRate: item.closureRate ?? 0,
    avgRunYrs: item.avgRunYrs ?? 0,
  }
}

// ============================================================
// 가맹본부별 수익성 통계 → BrandRevenue.averageOperatingProfit
// ============================================================

export function indexErnStatsByBrand(
  items: KftcJnghdqrtrsErnItem[],
): Map<string, KftcJnghdqrtrsErnItem> {
  const m = new Map<string, KftcJnghdqrtrsErnItem>()
  for (const it of items) m.set(it.fcCrpoMngNo, it)
  return m
}

export function operatingProfitFromErnStats(item: KftcJnghdqrtrsErnItem): number {
  return item.avgFcOprtProfit ?? 0
}

// ============================================================
// 브랜드 가맹점 목록 → 지역별 매장 분포
// ============================================================

export interface StoreLocation {
  storeName: string
  address: string
  region: string
  openDate?: string
}

export function mapFrcsListToLocations(items: KftcBrandFrcsListItem[]): StoreLocation[] {
  return items.map((it) => ({
    storeName: it.storNm ?? it.brandNm,
    address: it.addr ?? '',
    region: it.ctpvNm ?? extractRegion(it.addr ?? ''),
    openDate: it.openDt,
  }))
}

// ============================================================
// 업종별(소분류) 창업비용 → CategoryTrend 확장
// ============================================================

export interface CategoryStartupCost {
  categoryKey: string
  categoryLabel: string
  avgFntnFee: number
  avgFrcsFee: number
  avgDpstFee: number
  avgIntFee: number
}

export function aggregateSclasIndutyFntnStats(
  items: KftcSclasIndutyFntnItem[],
): CategoryStartupCost[] {
  const buckets = new Map<string, { key: string; label: string; fees: number[]; frc: number[]; dpst: number[]; int: number[] }>()
  for (const it of items) {
    const induty = it.indutySclasNm ?? it.indutyMlsfcNm ?? it.indutyLclasNm
    const cat = normalizeCategory(induty)
    const existing = buckets.get(cat.key)
    if (existing) {
      existing.fees.push(it.avgFntnFee ?? 0)
      existing.frc.push(it.avgFrcsFee ?? 0)
      existing.dpst.push(it.avgDpstFee ?? 0)
      existing.int.push(it.avgIntFee ?? 0)
    } else {
      buckets.set(cat.key, {
        key: cat.key,
        label: cat.label,
        fees: [it.avgFntnFee ?? 0],
        frc: [it.avgFrcsFee ?? 0],
        dpst: [it.avgDpstFee ?? 0],
        int: [it.avgIntFee ?? 0],
      })
    }
  }
  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0
  return Array.from(buckets.values()).map((b) => ({
    categoryKey: b.key,
    categoryLabel: b.label,
    avgFntnFee: avg(b.fees),
    avgFrcsFee: avg(b.frc),
    avgDpstFee: avg(b.dpst),
    avgIntFee: avg(b.int),
  }))
}

// ============================================================
// 업종별 브랜드 유지 현황 → CategoryTrend 유지율 보완
// ============================================================

export interface CategoryMaintRate {
  categoryKey: string
  categoryLabel: string
  /** 평균 브랜드 유지율 (%) */
  avgMaintRate: number
  /** 평균 운영 연차 */
  avgRunYrs: number
}

export function aggregateIndutyAnaBrandMaintStats(
  items: KftcIndutyAnaBrandMaintItem[],
): CategoryMaintRate[] {
  const buckets = new Map<string, { key: string; label: string; rates: number[]; yrs: number[] }>()
  for (const it of items) {
    const induty = it.indutySclasNm ?? it.indutyLclasNm
    const cat = normalizeCategory(induty)
    const existing = buckets.get(cat.key)
    if (existing) {
      if (it.maintRate != null) existing.rates.push(it.maintRate)
      if (it.oprtYrCnt != null) existing.yrs.push(it.oprtYrCnt)
    } else {
      buckets.set(cat.key, {
        key: cat.key,
        label: cat.label,
        rates: it.maintRate != null ? [it.maintRate] : [],
        yrs: it.oprtYrCnt != null ? [it.oprtYrCnt] : [],
      })
    }
  }
  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10 : 0
  return Array.from(buckets.values()).map((b) => ({
    categoryKey: b.key,
    categoryLabel: b.label,
    avgMaintRate: avg(b.rates),
    avgRunYrs: avg(b.yrs),
  }))
}

// ============================================================
// 브랜드 인테리어 비용 → BrandCosts.interiorFee
// ============================================================

export function indexIntInfoByBrand(
  items: KftcBrandFrcsIntItem[],
): Map<string, KftcBrandFrcsIntItem> {
  const m = new Map<string, KftcBrandFrcsIntItem>()
  for (const it of items) m.set(it.fcCrpoMngNo, it)
  return m
}

export function interiorFeeFromIntInfo(item: KftcBrandFrcsIntItem): number {
  // 평균 우선, 없으면 최솟값과 최댓값의 중간값
  if (item.intFeeAvg) return item.intFeeAvg
  if (item.intFeeMin != null && item.intFeeMax != null) {
    return Math.round((item.intFeeMin + item.intFeeMax) / 2)
  }
  return item.intFeeMin ?? item.intFeeMax ?? 0
}

// ============================================================
// 실 API 3종 통합 → MockBrand[] (확인된 작동 API 기반)
//
// API 필드 확인 (2023년 실데이터):
//   getBrandFrcsStats : yr, indutyLclasNm, indutyMlsfcNm, corpNm, brandNm,
//                       frcsCnt, newFrcsRgsCnt, avrgSlsAmt, arUnitAvrgSlsAmt
//   getBrandFntnStats : yr, indutyLclasNm, indutyMlsfcNm, brandNm, corpNm,
//                       jngBzmnJngAmt, jngBzmnEduAmt, jngBzmnAssrncAmt, smtnAmt
//   getBrandBrandStats: yr, indutyLclasNm, indutyMlsfcNm, brandNm, corpNm,
//                       jngBizStrtDate, jngBizYycnt, frcsCnt, allExctvCnt, empCnt
// ============================================================

/**
 * 3개 확인된 실 API 응답을 brandNm+corpNm 키로 조인해 MockBrand[] 생성.
 * fcCrpoMngNo 없음 → `kftc-{hash}` ID 생성.
 */
export function mergeRealApiBrands(
  frcsStats: KftcBrandStoreStats[],
  fntnStats: KftcBrandFntnStatsItem[],
  brandStats: KftcBrandBrandStatsItem[],
): MockBrand[] {
  if (frcsStats.length === 0) return []

  // brandNm+corpNm → 창업비용 맵
  const fntnMap = new Map<string, KftcBrandFntnStatsItem>()
  for (const f of fntnStats) {
    fntnMap.set(`${f.brandNm}__${f.corpNm}`, f)
  }

  // brandNm+corpNm → 브랜드개요 맵
  const overviewMap = new Map<string, KftcBrandBrandStatsItem>()
  for (const b of brandStats) {
    overviewMap.set(`${b.brandNm}__${b.corpNm}`, b)
  }

  const mapped: MockBrand[] = []
  for (const s of frcsStats) {
    const brandName = String(s.brandNm ?? '').trim()
    if (!brandName) continue  // brandNm 없는 항목 스킵

    const joinKey = `${brandName}__${s.corpNm}`
    const fntn = fntnMap.get(joinKey)
    const overview = overviewMap.get(joinKey)

    const cat = normalizeCategory(s.indutyMlsfcNm ?? s.indutyLclasNm)
    // fcCrpoMngNo가 없으므로 브랜드명+법인명 해시로 안정적 ID 생성
    const idSeed = joinKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const id = `kftc-${idSeed}`

    const startupCost = fntn
      ? Number(fntn.jngBzmnJngAmt ?? 0) + Number(fntn.jngBzmnEduAmt ?? 0) +
        Number(fntn.jngBzmnAssrncAmt ?? 0) + Number(fntn.jngBzmnEtcAmt ?? 0)
      : 0

    // 가맹사업 시작연도로 성장률 근사: 최근 5년내 신규는 높게
    // XML parser가 '20180101' → 20180101 (number)로 변환할 수 있으므로 String() 처리
    const startYear = overview?.jngBizStrtDate
      ? parseInt(String(overview.jngBizStrtDate).slice(0, 4), 10)
      : 2015
    const age = new Date().getFullYear() - startYear
    const frcsCnt = Number(s.frcsCnt ?? 0)
    const newCnt = Number(s.newFrcsRgsCnt ?? 0)
    const endCnt = Number(s.ctrtEndCnt ?? 0)
    const growthRate = newCnt && frcsCnt > 0
      ? Math.round(((newCnt - endCnt) / frcsCnt) * 100)
      : age <= 3 ? 15 : age <= 7 ? 8 : 3

    mapped.push({
      id,
      name: brandName,
      category: cat.key,
      categoryLabel: cat.label,
      logoColor: hashColor(id),
      description: `${s.corpNm ?? ''}이(가) 운영하는 ${cat.label} 가맹 브랜드.`,
      storeCount: frcsCnt,
      startupCost,
      monthlyRoyalty: 0,
      hqVerified: true,
      recruiting: true,
      featured: false,
      growthRate,
      hqRegion: '서울',
      heroImage: brandImageSet(id, cat.key).hero,
    })
  }
  return mapped
}

/**
 * IndutyBrandStats가 없는 경우 getBrandFrcsStats 데이터로 카테고리 트렌드를 집계.
 * 업종별 가맹점 현황에서 신규/말소 카운트 집계.
 */
export function aggregateFrcsStatsToCategoryTrend(items: KftcBrandStoreStats[]): CategoryTrend[] {
  const buckets = new Map<string, CategoryTrend>()
  for (const it of items) {
    const cat = normalizeCategory(it.indutyMlsfcNm ?? it.indutyLclasNm)
    const existing = buckets.get(cat.key)
    const curr = Number(it.frcsCnt ?? 0)
    const ne = Number(it.newFrcsRgsCnt ?? 0)
    const cl = Number(it.ctrtEndCnt ?? 0) + Number(it.ctrtCncltnCnt ?? 0)
    if (existing) {
      existing.currBrandCnt += 1
      existing.newBrandCnt += ne > 0 ? 1 : 0
      existing.closedBrandCnt += cl > 0 ? 1 : 0
    } else {
      buckets.set(cat.key, {
        categoryKey: cat.key,
        categoryLabel: cat.label,
        currBrandCnt: 1,
        newBrandCnt: ne > 0 ? 1 : 0,
        closedBrandCnt: cl > 0 ? 1 : 0,
        changeRate: 0,
      })
    }
  }
  for (const t of buckets.values()) {
    const denom = t.currBrandCnt - t.newBrandCnt + t.closedBrandCnt
    t.changeRate = denom > 0 ? Math.round(((t.newBrandCnt - t.closedBrandCnt) / denom) * 1000) / 10 : 0
  }
  return Array.from(buckets.values()).sort((a, b) => b.currBrandCnt - a.currBrandCnt)
}
