// themyungdang 외부 JSON API fetcher들.
//
// 각 API는 endpoint와 응답 필드만 다르고 호출 방식은 동일.
// data.go.kr (공공데이터포털) + REB (한국부동산원) 두 도메인을 다룬다.

import { callDataGoKrJson } from './datago-client'

// ============================================================
// 1. 국토교통부 상업업무용부동산 실거래가 (RTMSDataSvcSHRent)
// ============================================================

export interface MoltCommercialTradeItem {
  /** 시군구 코드 */
  sggCd?: string
  /** 시군구명 */
  sggNm?: string
  /** 법정동 */
  umdNm?: string
  /** 도로명 */
  roadNm?: string
  /** 거래금액 (만원, 콤마 포함 문자열) */
  dealAmount?: string
  /** 보증금 (만원) */
  deposit?: string
  /** 월세 (만원) */
  monthlyRent?: string
  /** 전용면적 (제곱미터) */
  excluUseAr?: number
  /** 거래년월 */
  dealYear?: number
  dealMonth?: number
  dealDay?: number
  /** 층 */
  floor?: number
}

export async function fetchCommercialTrades(params: {
  /** 법정동 코드 (5자리 시군구코드, 예: 11680 = 강남구) */
  LAWD_CD: string
  /** 조회 년월 (예: 202604) */
  DEAL_YMD: string
  pageNo?: number
  numOfRows?: number
}) {
  return callDataGoKrJson<MoltCommercialTradeItem>(
    'https://apis.data.go.kr/1613000/RTMSDataSvcSHRent',
    {
      LAWD_CD: params.LAWD_CD,
      DEAL_YMD: params.DEAL_YMD,
      pageNo: params.pageNo,
      numOfRows: params.numOfRows ?? 100,
    },
  )
}

// ============================================================
// 2. 소상공인시장진흥공단 상가(상권)정보
// ============================================================

export interface SosanginStoreItem {
  /** 상가업소번호 */
  bizesId: string
  /** 상호명 */
  bizesNm: string
  /** 지점명 */
  brchNm?: string
  /** 업종 대분류 */
  indsLclsNm?: string
  /** 업종 중분류 */
  indsMclsNm?: string
  /** 업종 소분류 */
  indsSclsNm?: string
  /** 시도명 */
  ctprvnNm?: string
  /** 시군구명 */
  signguNm?: string
  /** 행정동명 */
  adongNm?: string
  /** 도로명주소 */
  rdnmAdr?: string
  /** 위도 */
  lat?: number
  /** 경도 */
  lon?: number
  /** 전화번호 */
  rprsntvNm?: string
}

/**
 * 행정동 기준 상가 검색.
 * 행정동코드 (signguCd + admiCd) 필요.
 */
export async function fetchSosanginStoresInDong(params: {
  divId: 'admiCd' | 'signguCd' | 'ctprvnCd'
  /** 코드 값 (예: 1168051000 = 강남구 청담동) */
  key: string
  /** 업종 대분류 (예: I2 = 음식점) */
  indsLclsCd?: string
  pageNo?: number
  numOfRows?: number
}) {
  return callDataGoKrJson<SosanginStoreItem>(
    'https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInDong',
    {
      divId: params.divId,
      key: params.key,
      indsLclsCd: params.indsLclsCd,
      pageNo: params.pageNo,
      numOfRows: params.numOfRows ?? 100,
    },
  )
}

// ============================================================
// 3. 소상공인시장진흥공단 상권 영역
// ============================================================

export interface SosanginCommerceAreaItem {
  /** 상권코드 */
  trarNo: string
  /** 상권명 */
  trarNm: string
  /** 상권유형 (지정상권/주요상권 등) */
  trarTypeCd?: string
  /** 시도 */
  ctprvnNm?: string
  /** 시군구 */
  signguNm?: string
  /** 면적 (제곱미터) */
  ar?: number
}

export async function fetchCommerceAreas(params: {
  /** 시도코드 */
  ctprvnCd?: string
  pageNo?: number
  numOfRows?: number
}) {
  return callDataGoKrJson<SosanginCommerceAreaItem>(
    'https://apis.data.go.kr/B553077/api/open/sdsc2/commercialDistrict',
    {
      ctprvnCd: params.ctprvnCd,
      pageNo: params.pageNo,
      numOfRows: params.numOfRows ?? 100,
    },
  )
}
