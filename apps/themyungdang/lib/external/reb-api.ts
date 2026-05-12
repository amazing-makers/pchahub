// 한국부동산원 (REB) Open API fetcher.
//
// REB는 data.go.kr이 아닌 자체 도메인을 사용한다:
//   https://www.reb.or.kr/r-one/openapi/{Service}.do
//
// 활용신청은 data.go.kr이 아니라 REB 자체 사이트에서 별도로 받는다:
//   https://www.reb.or.kr/r-one/openapi/openApiApply.do
//
// 발급된 키는 `REB_API_KEY` 환경변수에 저장.

import { callRebApi } from './datago-client'

/**
 * REB의 통계표 단일 row.
 * `STATBL_ID` (통계표 식별자) 별로 컬럼이 달라 generic하게 받는다.
 */
export interface RebStatRow {
  STATBL_ID: string
  STAT_ITEM_NAME?: string
  /** 지역명 (예: "서울") */
  CLS_NM?: string
  /** 기준 시점 (YYYYMM or YYYY) */
  WRTTIME_DESC?: string
  /** 통계값 */
  DTA_VAL?: string | number
  /** 단위 */
  UI_NM?: string
}

interface FetchRebStatsParams {
  /** 통계표 식별자 (예: A_2024_0001) */
  statbl_id: string
  /** 분류 식별자 (예: A_2024_0001_A) */
  dtacycle_cd?: string
  /** 검색 시작 시점 (YYYYMM) */
  wrttime_from?: string
  /** 검색 종료 시점 (YYYYMM) */
  wrttime_to?: string
  numOfRows?: number
}

/**
 * REB 통계표 데이터 조회.
 * 정확한 statbl_id는 REB Open API 매뉴얼 확인 필요.
 */
export async function fetchRebStats(params: FetchRebStatsParams): Promise<RebStatRow[]> {
  return callRebApi<RebStatRow>('SttsApiTblData', {
    STATBL_ID: params.statbl_id,
    DTACYCLE_CD: params.dtacycle_cd,
    WRTTIME_DESC_FROM: params.wrttime_from,
    WRTTIME_DESC_TO: params.wrttime_to,
    pSize: params.numOfRows ?? 100,
    pIndex: 1,
  })
}
