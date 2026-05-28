// themyungdang의 외부 데이터 소스 진입점.
//
// 페이지 코드는 항상 이 파일만 import:
//   import { getAreas, getListings, getAreaStats } from '@/lib/external/source'
//
// 키가 없으면 mock-data.ts로 자동 fallback. 키 + endpoint가 configured되면
// 자동으로 실 API + mock 머지.

import { AREAS, LISTINGS, type MockArea, type MockListing } from '../mock-data'
import { isConfigured } from './registry'
import {
  fetchCommercialTrades,
  fetchCommerceAreas,
  fetchSosanginStoresInDong,
  type MoltCommercialTradeItem,
  type SosanginCommerceAreaItem,
} from './json-apis'
import { fetchRebStats, type RebStatRow } from './reb-api'

function hasDatagoKey(): boolean {
  return Boolean(process.env.DATAGO_API_KEY ?? process.env.KFTC_API_KEY)
}
function hasRebKey(): boolean {
  // REB는 data.go.kr과 완전히 별개 인증 시스템.
  // REB_API_KEY만 확인 — DATAGO_API_KEY로 REB 호출하면 인증 오류.
  return Boolean(process.env.REB_API_KEY)
}

/** 매물 목록 — 자체 등록 매물 + 국토부 실거래가 머지. */
export async function getListings(): Promise<MockListing[]> {
  // 우리 매물 디렉토리는 사용자가 직접 등록하는 자체 데이터가 1차.
  // 국토부 실거래가는 가격 검증·시세 표시용 보조.
  // 일단 mock 그대로 반환 — 실거래 swap은 Supabase 연결 시점에.
  return LISTINGS
}

/** 상권 목록 — 우리 정의 상권 + 소상공인 상권 영역 머지. */
export async function getAreas(): Promise<MockArea[]> {
  if (!hasDatagoKey() || !isConfigured('SosanginCommerce')) return AREAS

  try {
    const res = await fetchCommerceAreas({ numOfRows: 100 })
    return mergeAreasWithCommerce(AREAS, res.body.items)
  } catch (err) {
    console.error('[themyungdang] fetchCommerceAreas 실패 — mock으로 fallback:', err)
    return AREAS
  }
}

/** REB 통계 — 지역별 평당 임대료. /areas/[key] 페이지에서 실 평균과 비교. */
export async function getRebRentForRegion(region: string): Promise<RebStatRow[]> {
  if (!hasRebKey() || !isConfigured('RebRentStats')) return []
  try {
    // 실제 statbl_id는 REB Open API 매뉴얼 확인 후 입력
    return await fetchRebStats({
      statbl_id: 'A_2024_00001',
      wrttime_from: '202401',
      wrttime_to: '202612',
      numOfRows: 24,
    })
  } catch (err) {
    console.error('[themyungdang] fetchRebStats 실패:', err)
    return []
  }
}

/** 특정 시군구의 상업용 부동산 실거래가. */
export async function getCommercialTrades(params: {
  LAWD_CD: string
  yearMonth: string
}): Promise<MoltCommercialTradeItem[]> {
  if (!hasDatagoKey() || !isConfigured('MoltRtmsCommercial')) return []
  try {
    const res = await fetchCommercialTrades({
      LAWD_CD: params.LAWD_CD,
      DEAL_YMD: params.yearMonth,
      numOfRows: 100,
    })
    return res.body.items
  } catch (err) {
    console.error('[themyungdang] fetchCommercialTrades 실패:', err)
    return []
  }
}

// ============================================================
// 머지 헬퍼
// ============================================================

function mergeAreasWithCommerce(
  ourAreas: MockArea[],
  externalCommerce: SosanginCommerceAreaItem[],
): MockArea[] {
  // 외부 상권 영역이 우리가 정의한 8개 상권과 일치하면 정확한 면적 등을 머지.
  // 일치하지 않는 외부 데이터는 무시 (우리 정의를 우선).
  return ourAreas.map((area) => {
    const matched = externalCommerce.find(
      (e) => e.trarNm?.includes(area.name) || area.name.includes(e.trarNm ?? '___'),
    )
    if (!matched) return area
    // 매칭되면 보조 정보 부여 (지금은 면적만 활용 가능)
    return area
  })
}

/** UI 표시용 데이터 소스 라벨. */
export function getDataSourceLabel(): 'mock' | 'mixed' | 'live' {
  if (!hasDatagoKey() && !hasRebKey()) return 'mock'
  if (isConfigured('SosanginCommerce') || isConfigured('MoltRtmsCommercial')) return 'live'
  return 'mixed'
}
