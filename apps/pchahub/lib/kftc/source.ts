// 데이터 소스 자동 분기.
//
// KFTC_API_KEY가 설정되어 있으면 실 API를 사용하고, 없으면 mock-data.ts를
// 그대로 사용한다. 페이지 코드는 항상 이 모듈만 import하여 데이터 소스에
// 신경 쓰지 않는다.
//
// 사용 예:
//   import { getBrands, getBrandDetailById } from '@/lib/kftc/source'
//   const brands = await getBrands()  // mock 또는 실 API
//
// 키 발급 후 활성화:
//   1. .env에 KFTC_API_KEY=발급키 추가
//   2. 자동으로 실 API 사용 (3개 확인된 endpoint 활용)

import { BRANDS, CATEGORIES, type MockBrand } from '../mock-data'
import { getBrandDetail as getMockDetail } from '../mock-brand-detail'
import { listDisclosures, getDisclosureContent } from './client'
import {
  fetchBrandList,
  fetchBrandStoreStats,
  fetchHqRegistrations,
  fetchIndutyBrandStats,
  fetchBrandFntnStats,
  fetchBrandBrandStats,
} from './json-apis'
import { isConfigured } from './registry'
import {
  aggregateIndutyBrandStats,
  aggregateFrcsStatsToCategoryTrend,
  mapContentToDetail,
  mapListItemToBrand,
  mergeIntoBrands,
  mergeRealApiBrands,
  type CategoryTrend,
} from './mapper'

function hasKey(): boolean {
  return Boolean(process.env.KFTC_API_KEY)
}

/**
 * 모든 브랜드 목록.
 *
 * 데이터 소스 우선순위:
 *   1. 확인된 3개 실 API 통합
 *      - getBrandFrcsStats (가맹점수 + 평균매출)
 *      - getBrandFntnStats (창업비용)
 *      - getBrandBrandStats (브랜드 개요·가맹연수)
 *   2. 정보공개서 list API (XML) — 1순위 실패 시 fallback
 *   3. mock-data.ts — 최종 fallback
 *
 * 캐시: fetch 단위 24시간.
 */
export async function getBrands(): Promise<MockBrand[]> {
  if (!hasKey()) return BRANDS

  const prevYear = new Date().getFullYear() - 1

  // 1순위: 확인된 3개 실 API 통합
  try {
    // KFTC 연간 데이터는 indutyMlsfcNm 기준으로 정렬됨 (한식 → 분식 → 일식 → 치킨 → 커피… 순).
    // 따라서 앞부분만 가져오면 한식 위주가 됨. 다양한 업종을 커버하기 위해
    // 앞 1000건 + 중간 1000건(p40 = 커피/카페 구간)을 병렬로 가져와 합산.
    // numOfRows=1000 기준 페이지 번호. KFTC yr=2025 데이터는 indutyMlsfcNm 정렬이라
    // 한식이 p1-p2에 집중됨. 다양한 업종 커버를 위해 3개 구간을 병렬 fetch:
    //   p1 (1-1000): 한식/분식/일식 위주
    //   p3 (2001-3000): 치킨/주점/아이스크림/빙수 구간
    //   p5 (4001-5000): 커피/카페/패스트푸드 구간
    const [frcsR1, frcsR2, frcsR3, fntnR1, fntnR2, fntnR3, brandR1, brandR2, brandR3] = await Promise.all([
      fetchBrandStoreStats({ yr: prevYear, pageNo: 1, numOfRows: 1000 }),
      fetchBrandStoreStats({ yr: prevYear, pageNo: 3, numOfRows: 1000 }),
      fetchBrandStoreStats({ yr: prevYear, pageNo: 5, numOfRows: 1000 }),
      fetchBrandFntnStats({ yr: prevYear, pageNo: 1, numOfRows: 1000 }),
      fetchBrandFntnStats({ yr: prevYear, pageNo: 3, numOfRows: 1000 }),
      fetchBrandFntnStats({ yr: prevYear, pageNo: 5, numOfRows: 1000 }),
      fetchBrandBrandStats({ yr: prevYear, pageNo: 1, numOfRows: 1000 }),
      fetchBrandBrandStats({ yr: prevYear, pageNo: 3, numOfRows: 1000 }),
      fetchBrandBrandStats({ yr: prevYear, pageNo: 5, numOfRows: 1000 }),
    ])
    // brandNm+corpNm 키 기반이라 중복 없음 (서로 다른 페이지 = 서로 다른 브랜드)
    const frcsItems = [...frcsR1.body.items, ...frcsR2.body.items, ...frcsR3.body.items]
    const fntnItems = [...fntnR1.body.items, ...fntnR2.body.items, ...fntnR3.body.items]
    const brandItems = [...brandR1.body.items, ...brandR2.body.items, ...brandR3.body.items]
    const merged = mergeRealApiBrands(frcsItems, fntnItems, brandItems)
    if (merged.length > 0) return merged
  } catch (err) {
    console.error('[kftc] 실API 3종 머지 실패 — 정보공개서 list로 fallback:', err)
  }

  // 2순위: JSON API 4종 통합 (registry configured 상태일 때)
  if (isConfigured('BrandList')) {
    try {
      const [brandList, storeStats, storeStatsPrev, hqReg] = await Promise.all([
        fetchBrandList({ yr: prevYear, numOfRows: 1000 }),
        isConfigured('BrandStoreStats')
          ? fetchBrandStoreStats({ yr: prevYear, numOfRows: 1000 })
          : Promise.resolve({ header: { resultCode: '00', resultMsg: '' }, body: { items: [], numOfRows: 0, pageNo: 1, totalCount: 0 } } as Awaited<ReturnType<typeof fetchBrandStoreStats>>),
        isConfigured('BrandStoreStats')
          ? fetchBrandStoreStats({ yr: prevYear - 1, numOfRows: 1000 })
          : Promise.resolve({ header: { resultCode: '00', resultMsg: '' }, body: { items: [], numOfRows: 0, pageNo: 1, totalCount: 0 } } as Awaited<ReturnType<typeof fetchBrandStoreStats>>),
        isConfigured('HqRegistrations')
          ? fetchHqRegistrations({ yr: prevYear, numOfRows: 1000 })
          : Promise.resolve({ header: { resultCode: '00', resultMsg: '' }, body: { items: [], numOfRows: 0, pageNo: 1, totalCount: 0 } } as Awaited<ReturnType<typeof fetchHqRegistrations>>),
      ])
      const merged = mergeIntoBrands({
        brandList: brandList.body.items,
        storeStats: storeStats.body.items,
        storeStatsPrev: storeStatsPrev.body.items,
        hqReg: hqReg.body.items,
      })
      if (merged.length > 0) return merged
    } catch (err) {
      console.error('[kftc] JSON API 머지 실패 — 정보공개서 list로 fallback:', err)
    }
  }

  // 3순위: 정보공개서 list (XML)
  if (isConfigured('DisclosureList')) {
    try {
      const currentYear = new Date().getFullYear()
      const res = await listDisclosures(currentYear, { numOfRows: 1000 })
      return res.items.map((item) => mapListItemToBrand(item))
    } catch (err) {
      console.error('[kftc] listDisclosures 실패 — mock으로 fallback:', err)
    }
  }

  // 최종 fallback: mock
  return BRANDS
}

/**
 * 브랜드 ID로 상세 조회.
 * - mock ID (b1, b2…) → mock 데이터
 * - kftc ID (kftc-숫자) → 실 API 호출
 */
export async function getBrandById(id: string): Promise<{ brand: MockBrand; detail: ReturnType<typeof getMockDetail> } | null> {
  // mock 모드 (b1…b12 curated + v1000… V2 catalog)
  if (!hasKey() || id.startsWith('b') || id.startsWith('v')) {
    const brand = BRANDS.find((b) => b.id === id)
    if (!brand) return null
    return { brand, detail: getMockDetail(brand) }
  }

  // kftc 실 API 모드 — 브랜드 목록에서 찾아서 상세 보완
  try {
    // 브랜드 목록에서 해당 ID 찾기
    const allBrands = await getBrands()
    const brand = allBrands.find((b) => b.id === id)
    if (!brand) return null

    const detail = getMockDetail(brand)

    // kftc-* 브랜드: 가짜 본사 정보를 실제 데이터로 교체.
    // getBrandFrcsStats/BrandBrandStats로 얻는 필드만 채우고,
    // 알 수 없는 필드(phone, address, bizNumber, ceo, website)는 undefined로 지워
    // → HQSection이 자동으로 해당 행을 숨긴다.
    const kftcHq = {
      companyName: brand.corpNm ?? brand.name,
      ceo: undefined,
      foundedYear: detail.hq.foundedYear, // 매장수 기반 추정값 유지
      franchiseStartYear: brand.jngBizStartYear ?? detail.hq.franchiseStartYear,
      address: undefined,
      phone: undefined,
      website: undefined,
      bizNumber: undefined,
    } as const

    // 비용 세부내역: fntn API 데이터가 startupCost에 있으면 세분화
    const kftcCosts = brand.startupCost > 0
      ? buildKftcCosts(brand, detail.costs)
      : detail.costs

    // 정보공개서 content API 가능하면 추가 상세 적용 (더 정확)
    const serial = id.replace(/^kftc-/, '')
    if (/^\d+$/.test(serial) && isConfigured('DisclosureContent')) {
      try {
        const content = await getDisclosureContent(serial)
        const mapped = mapContentToDetail(content)
        return {
          brand: {
            ...brand,
            storeCount: mapped.storeHistory.at(-1)?.totalStores ?? brand.storeCount,
            startupCost:
              mapped.costs.franchiseFee + mapped.costs.deposit +
              mapped.costs.interiorFee + mapped.costs.educationFee + mapped.costs.otherFees,
          },
          detail: {
            ...detail,
            hq: mapped.hq,  // content API는 실제 hq 정보 포함
            costs: mapped.costs,
            revenue: mapped.revenue,
            storeHistory: mapped.storeHistory,
            disclosure: mapped.disclosure,
          },
        }
      } catch {
        // content 실패해도 계속
      }
    }

    return {
      brand,
      detail: {
        ...detail,
        hq: kftcHq,
        costs: kftcCosts,
      },
    }
  } catch (err) {
    console.error('[kftc] getBrandById 실패:', err)
    return null
  }
}

/**
 * KFTC 브랜드의 창업비 세부내역 재구성.
 * fntn API 개별 항목이 있으면 실데이터 그대로 사용.
 * 없으면 총액(startupCost)을 카테고리별 일반 비율로 분배.
 * content API가 있으면 이 값은 덮어써진다.
 */
function buildKftcCosts(
  brand: import('../mock-data').MockBrand,
  fallback: import('../mock-brand-detail').BrandCosts,
): import('../mock-brand-detail').BrandCosts {
  const total = brand.startupCost
  if (total <= 0) return fallback

  // 실 fntn API 데이터가 있으면 그대로 사용 (가장 정확)
  const hasFntnDetail =
    brand.fntnFranchiseFee != null || brand.fntnEducationFee != null ||
    brand.fntnDeposit != null || brand.fntnOtherFees != null
  if (hasFntnDetail) {
    const franchiseFee = brand.fntnFranchiseFee ?? 0
    const deposit      = brand.fntnDeposit ?? 0
    const educationFee = brand.fntnEducationFee ?? 0
    const otherFees    = brand.fntnOtherFees ?? 0
    // 인테리어비 = 총액 - 나머지 (공정위 fntn API에는 인테리어 별도 집계 없음)
    const interiorFee  = Math.max(total - franchiseFee - deposit - educationFee - otherFees, 0)
    return {
      franchiseFee,
      deposit,
      interiorFee,
      educationFee,
      otherFees,
      royaltyType: 'none',
      royaltyValue: 0,
      recommendedArea: fallback.recommendedArea,
      minArea: fallback.minArea,
    }
  }

  // fntn 세부내역 없으면 총액 기준 비율 근사
  // 일반적 프랜차이즈 구성 (가맹비 15%, 보증금 20%, 인테리어 40%, 교육비 5%, 기타 20%)
  const franchiseFee = Math.round(total * 0.15)
  const deposit      = Math.round(total * 0.20)
  const educationFee = Math.round(total * 0.05)
  const otherFees    = Math.round(total * 0.20)
  const interiorFee  = Math.max(total - franchiseFee - deposit - educationFee - otherFees, 0)
  return {
    franchiseFee,
    deposit,
    interiorFee,
    educationFee,
    otherFees,
    royaltyType: 'none',
    royaltyValue: 0,
    recommendedArea: fallback.recommendedArea,
    minArea: fallback.minArea,
  }
}

/**
 * 카테고리별 트렌드 (신규/말소 브랜드 수).
 * /categories/[key] 페이지에서 "올해 신규 등장 N개" 표시용.
 *
 * 키 없으면 mock에서 임의 값 생성.
 */
export async function getCategoryTrends(): Promise<CategoryTrend[]> {
  if (!hasKey()) {
    // mock — 카테고리별 임의 트렌드
    return CATEGORIES.map((c) => {
      const seed = c.key.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)
      return {
        categoryKey: c.key,
        categoryLabel: c.label,
        currBrandCnt: c.brandCount,
        newBrandCnt: 8 + (seed % 20),
        closedBrandCnt: 3 + (seed % 8),
        changeRate: 5 + (seed % 12),
      }
    })
  }

  // 실 API — getBrandFrcsStats 기반 집계 (IndutyBrandStats API 미확인)
  try {
    const yr = new Date().getFullYear() - 1
    const [r1, r2, r3] = await Promise.all([
      fetchBrandStoreStats({ yr, numOfRows: 1000, pageNo: 1 }),
      fetchBrandStoreStats({ yr, numOfRows: 1000, pageNo: 3 }),
      fetchBrandStoreStats({ yr, numOfRows: 1000, pageNo: 5 }),
    ])
    const items = [...r1.body.items, ...r2.body.items, ...r3.body.items]
    if (items.length > 0) {
      return aggregateFrcsStatsToCategoryTrend(items)
    }
  } catch (err) {
    console.error('[kftc] fetchBrandStoreStats(카테고리트렌드) 실패:', err)
  }

  // fallback: fetchIndutyBrandStats 시도
  try {
    const yr = new Date().getFullYear() - 1
    const res = await fetchIndutyBrandStats({ yr, numOfRows: 500 })
    if (res.body.items.length > 0) {
      return aggregateIndutyBrandStats(res.body.items)
    }
  } catch (err) {
    console.error('[kftc] fetchIndutyBrandStats 실패 — mock으로 fallback:', err)
  }

  return getCategoryTrendsMockFallback()
}

function getCategoryTrendsMockFallback(): CategoryTrend[] {
  return CATEGORIES.map((c) => ({
    categoryKey: c.key,
    categoryLabel: c.label,
    currBrandCnt: c.brandCount,
    newBrandCnt: 10,
    closedBrandCnt: 4,
    changeRate: 6,
  }))
}

/**
 * 현재 활성 데이터 소스 — UI 표시용.
 */
export function getDataSourceLabel(): 'mock' | 'kftc' {
  return hasKey() ? 'kftc' : 'mock'
}
