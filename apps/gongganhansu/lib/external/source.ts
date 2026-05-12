// gongganhansu 외부 데이터 소스 진입점.
//
// 인테리어·시공 도메인. 현재 외부 API는 국토안전관리원 시설물 통계 1종.
// 키가 없거나 endpoint가 configured가 아니면 mock-data.ts로 자동 fallback.
//
// 사용 예:
//   import { getContractors } from '@/lib/external/source'

import { CONTRACTORS, type MockContractor } from '../mock-data'
import { isConfigured } from './registry'
import { callDataGoKrJson } from './datago-client'

function hasKey(): boolean {
  return Boolean(process.env.DATAGO_API_KEY ?? process.env.KFTC_API_KEY)
}

/** 국토안전관리원 시설물 통계 단일 row. */
export interface FacilStatItem {
  /** 시설물 종류 코드 */
  facilKindCd?: string
  /** 시설물 종류명 */
  facilKindNm?: string
  /** 시도명 */
  ctpvNm?: string
  /** 시군구명 */
  signguNm?: string
  /** 시설물 수 */
  facilCnt?: number
  /** 총 시설 면적 (㎡) */
  totFacilArea?: number
}

/**
 * 시설물 통계 목록 조회.
 * 인테리어 사업 대상 지역 분석에 활용 (향후 Supabase 연동 시 매장 추천에 반영).
 */
export async function getFacilStats(params: {
  ctpvNm?: string
  numOfRows?: number
} = {}): Promise<FacilStatItem[]> {
  if (!hasKey() || !isConfigured('FacilStat')) return []
  try {
    const res = await callDataGoKrJson<FacilStatItem>(
      'https://apis.data.go.kr/B552016/FacilStatService/getFacilStatInfo',
      { ctpvNm: params.ctpvNm, numOfRows: params.numOfRows ?? 100 },
    )
    return res.body.items
  } catch (err) {
    console.error('[gongganhansu] FacilStat 실패 — 빈 배열 반환:', err)
    return []
  }
}

/**
 * 시공업체 목록.
 * 현재는 mock 반환. Supabase 연결 + FacilStat 데이터 머지는 추후 구현.
 */
export async function getContractors(): Promise<MockContractor[]> {
  return CONTRACTORS
}

/** UI 표시용 데이터 소스 라벨. */
export function getDataSourceLabel(): 'mock' | 'live' {
  return hasKey() && isConfigured('FacilStat') ? 'live' : 'mock'
}
