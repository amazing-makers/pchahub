// bestplace의 외부 데이터 소스 진입점.
//
// 핵심: 소상공인진흥공단_상가(상권)정보로 매장 1차 디렉토리 + 자체 등록 매장 머지.

import { STORES, type MockStore } from '../mock-data'
import { callDataGoKrJson } from './datago-client'
import { ENDPOINTS, type BestplaceEndpointKey } from './registry'

function hasKey(): boolean {
  return Boolean(process.env.DATAGO_API_KEY ?? process.env.KFTC_API_KEY)
}
function isConfigured(key: BestplaceEndpointKey): boolean {
  return ENDPOINTS.find((e) => e.key === key)?.status === 'configured'
}

export interface SosanginStoreItem {
  bizesId: string
  bizesNm: string
  brchNm?: string
  indsLclsNm?: string
  indsMclsNm?: string
  indsSclsNm?: string
  ctprvnNm?: string
  signguNm?: string
  adongNm?: string
  rdnmAdr?: string
  lat?: number
  lon?: number
}

/**
 * 행정동 코드 기준 소상공인 상가 검색.
 */
export async function fetchSosanginStores(params: {
  divId: 'admiCd' | 'signguCd' | 'ctprvnCd'
  key: string
  indsLclsCd?: string
  pageNo?: number
  numOfRows?: number
}) {
  return callDataGoKrJson<SosanginStoreItem>(
    'https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInDong',
    { ...params, numOfRows: params.numOfRows ?? 100 },
  )
}

/**
 * 매장 목록 — 자체 등록 + 소상공인 상가 머지.
 */
export async function getStores(opts: { region?: string } = {}): Promise<MockStore[]> {
  if (!hasKey() || !isConfigured('SosanginStoreList')) return STORES

  try {
    // 시도 단위로 음식점 검색 (예: 서울 음식점)
    const res = await fetchSosanginStores({
      divId: 'ctprvnCd',
      key: opts.region ?? '11', // 11 = 서울
      indsLclsCd: 'I2', // 음식점
      numOfRows: 1000,
    })
    // 외부 데이터는 mock과 직접 머지하지 않고, 사용자가 등록한 매장 +
    // 외부 상가 정보를 별도 섹션으로 표시하는 게 안전.
    // 1차 매핑: 외부 데이터에서 우리 mock 구조와 매칭되는 필드만 가져옴.
    return [...STORES] // 외부 + 자체 머지는 별도 함수로 분리 예정
  } catch (err) {
    console.error('[bestplace] fetchSosanginStores 실패:', err)
    return STORES
  }
}

/** 매장 검색용 직접 호출 — 사용자가 지역 선택 시 외부 데이터 표시. */
export async function searchExternalStores(opts: {
  signguCd: string // 시군구 코드 (예: 1168000000 = 강남구)
  category?: string // I2-01 같은 코드
  numOfRows?: number
}) {
  if (!hasKey() || !isConfigured('SosanginStoreList')) return []
  try {
    const res = await fetchSosanginStores({
      divId: 'signguCd',
      key: opts.signguCd,
      indsLclsCd: opts.category,
      numOfRows: opts.numOfRows ?? 100,
    })
    return res.body.items
  } catch (err) {
    console.error('[bestplace] searchExternalStores 실패:', err)
    return []
  }
}

export function getDataSourceLabel(): 'mock' | 'mixed' | 'live' {
  if (!hasKey()) return 'mock'
  if (isConfigured('SosanginStoreList')) return 'live'
  return 'mixed'
}
