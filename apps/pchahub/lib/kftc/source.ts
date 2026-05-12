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
    const [frcsRes, fntnRes, brandRes] = await Promise.all([
      fetchBrandStoreStats({ yr: prevYear, numOfRows: 1000 }),
      fetchBrandFntnStats({ yr: prevYear, numOfRows: 1000 }),
      fetchBrandBrandStats({ yr: prevYear, numOfRows: 1000 }),
    ])
    const merged = mergeRealApiBrands(
      frcsRes.body.items,
      fntnRes.body.items,
      brandRes.body.items,
    )
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
  // mock 모드
  if (!hasKey() || id.startsWith('b')) {
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

    // 정보공개서 content API 가능하면 추가 상세 적용
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
            hq: mapped.hq,
            costs: mapped.costs,
            revenue: mapped.revenue,
            storeHistory: mapped.storeHistory,
            disclosure: mapped.disclosure,
          },
        }
      } catch {
        // content 실패해도 list 기반 데이터로 반환
      }
    }

    return { brand, detail }
  } catch (err) {
    console.error('[kftc] getBrandById 실패:', err)
    return null
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
    const res = await fetchBrandStoreStats({ yr, numOfRows: 2000 })
    if (res.body.items.length > 0) {
      return aggregateFrcsStatsToCategoryTrend(res.body.items)
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
