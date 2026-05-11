// 데이터 소스 자동 분기.
//
// KFTC_API_KEY가 설정되어 있으면 실 API를 사용하고, 없으면 mock-data.ts를
// 그대로 사용한다. 페이지 코드는 항상 이 모듈만 import하여 데이터 소스에
//신경 쓰지 않는다.
//
// 사용 예:
//   import { getBrands, getBrandDetailById } from '@/lib/kftc/source'
//   const brands = await getBrands()  // mock 또는 실 API
//
// 키 발급 후 활성화:
//   1. .env에 KFTC_API_KEY=발급키 추가
//   2. lib/kftc/client.ts의 XML parser TODO 구현 (fast-xml-parser 설치)
//   3. 자동으로 실 API 사용

import { BRANDS, type MockBrand } from '../mock-data'
import { getBrandDetail as getMockDetail } from '../mock-brand-detail'
import { listDisclosures, getDisclosureContent } from './client'
import { mapContentToDetail, mapListItemToBrand } from './mapper'

function hasKey(): boolean {
  return Boolean(process.env.KFTC_API_KEY)
}

/**
 * 모든 브랜드 목록.
 * 캐시는 fetch 단위에서 24시간으로 잡힌다 (lib/kftc/client.ts).
 */
export async function getBrands(): Promise<MockBrand[]> {
  if (!hasKey()) return BRANDS

  try {
    const currentYear = new Date().getFullYear()
    const res = await listDisclosures(currentYear, { numOfRows: 1000 })
    return res.items.map((item) => mapListItemToBrand(item))
  } catch (err) {
    // API 실패 시 mock으로 graceful fallback — 사용자 화면이 깨지지 않게
    console.error('[kftc] listDisclosures 실패 — mock으로 fallback:', err)
    return BRANDS
  }
}

/**
 * 브랜드 ID로 상세 조회.
 * - mock ID (b1, b2…) → mock 데이터
 * - kftc ID (kftc-151420) → 실 API 호출
 */
export async function getBrandById(id: string): Promise<{ brand: MockBrand; detail: ReturnType<typeof getMockDetail> } | null> {
  // mock 모드
  if (!hasKey() || id.startsWith('b')) {
    const brand = BRANDS.find((b) => b.id === id)
    if (!brand) return null
    return { brand, detail: getMockDetail(brand) }
  }

  // kftc 실 API 모드
  try {
    const serial = id.replace(/^kftc-/, '')
    const content = await getDisclosureContent(serial)
    const mapped = mapContentToDetail(content)

    // 브랜드 카드용 base는 list API를 한 번 더 호출하거나, 캐시된 list에서 찾아야 한다.
    // 여기서는 stub — Supabase 연결 후 content + list 머지 로직 추가.
    const stub: MockBrand = {
      id,
      name: content.ch1_hqInfo.crpoNm,
      category: 'korean',
      categoryLabel: '한식',
      logoColor: '#16A34A',
      description: '',
      storeCount: mapped.storeHistory.at(-1)?.totalStores ?? 0,
      startupCost:
        mapped.costs.franchiseFee +
        mapped.costs.deposit +
        mapped.costs.interiorFee +
        mapped.costs.educationFee +
        mapped.costs.otherFees,
      monthlyRoyalty: mapped.costs.royaltyType === 'fixed' ? mapped.costs.royaltyValue : 0,
      hqVerified: true,
      recruiting: true,
      featured: false,
      growthRate: 0,
      hqRegion: '서울',
      heroImage: '',
    }

    const detail = getMockDetail(stub)
    return {
      brand: stub,
      detail: {
        ...detail,
        hq: mapped.hq,
        costs: mapped.costs,
        revenue: mapped.revenue,
        storeHistory: mapped.storeHistory,
        disclosure: mapped.disclosure,
      },
    }
  } catch (err) {
    console.error('[kftc] getDisclosureContent 실패:', err)
    return null
  }
}

/**
 * 현재 활성 데이터 소스 — UI 표시용.
 */
export function getDataSourceLabel(): 'mock' | 'kftc' {
  return hasKey() ? 'kftc' : 'mock'
}
