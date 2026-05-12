// 공정거래위원회_가맹정보_* JSON API들.
//
// 각 API는 endpoint와 응답 필드만 다르고, 호출 방식은 동일한 표준 envelope.
// data.go.kr의 패턴에 따라 endpoint URL과 응답 타입을 1:1로 정의한다.
//
// 추가 API를 등록할 때는 아래 패턴만 따르면 된다:
//
//   1. 응답 item 타입을 정의 (KftcXxxItem)
//   2. fetcher 함수 추가 (fetchXxx)
//   3. (선택) mapper 작성 — KFTC item → MockBrand/BrandDetail 필드

import { callDataGoKrJson } from './datago-client'

// ============================================================
// 1. 업종별 브랜드변동현황
//    endpoint: FftcIndutyBrandStatsService
//
// 이 API는 매년 업종별로 신규 등록·말소된 브랜드의 변동을 통계로 제공한다.
// pchahub에서 카테고리 페이지에 "올해 새로 등장한 브랜드 N개" 같은
// 트렌드 지표를 채울 수 있다.
// ============================================================

/**
 * 업종별 브랜드 변동 현황의 단일 행.
 * 실제 필드명은 data.go.kr 명세를 따른다.
 */
export interface KftcIndutyBrandStats {
  /** 기준 연도 */
  baseYr: string
  /** 업종 대분류 (외식업/도소매업/서비스업) */
  indutyLclasNm: string
  /** 업종 중분류 */
  indutyMlsfcNm?: string
  /** 업종 소분류 (치킨/카페/한식 등) */
  indutySclasNm?: string
  /** 전년 말 브랜드 수 */
  prevYrBrandCnt?: number
  /** 신규 등록 브랜드 수 */
  newBrandCnt?: number
  /** 등록 말소 브랜드 수 */
  closedBrandCnt?: number
  /** 당해 말 브랜드 수 */
  currBrandCnt?: number
  /** 변동률 (%) */
  changeRate?: number
}

export interface FetchIndutyBrandStatsParams {
  /** 기준 연도 (예: 2024) */
  yr?: number
  /** 업종 대분류 코드 또는 명 */
  indutyLclas?: string
  pageNo?: number
  numOfRows?: number
}

/**
 * 공정거래위원회_가맹정보_업종별 브랜드변동현황 제공 서비스.
 * Endpoint: https://apis.data.go.kr/1130000/FftcIndutyBrandStatsService
 */
export async function fetchIndutyBrandStats(params: FetchIndutyBrandStatsParams = {}) {
  return callDataGoKrJson<KftcIndutyBrandStats>('FftcIndutyBrandStatsService', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    indutyLclas: params.indutyLclas,
    pageNo: params.pageNo,
    numOfRows: params.numOfRows ?? 200,
  })
}

// ============================================================
// 2. 브랜드별 가맹점/직영점 집계 + 평균매출 (페어데이터)
//    endpoint: 추후 사용자가 알려주는 endpoint로 추가
// ============================================================

export interface KftcBrandStoreStats {
  baseYr: string
  /** 가맹본부관리번호 */
  fcCrpoMngNo: string
  /** 브랜드명 */
  brandNm: string
  /** 업종 */
  indutyNm?: string
  /** 가맹점 수 */
  fcStoreCnt: number
  /** 직영점 수 */
  drStoreCnt: number
  /** 가맹점 평균매출 (단위 미상 — 명세 확인 필요) */
  avgFcSale?: number
  /** 평균 운영연차 */
  avgRunYrs?: number
}

/**
 * 페어데이터 — 브랜드별 가맹점/직영점 집계 및 평균매출 학습데이터.
 * Endpoint TBD — 사용자가 키 신청 후 endpoint 공유해주면 채움.
 */
export async function fetchBrandStoreStats(params: {
  yr?: number
  pageNo?: number
  numOfRows?: number
} = {}) {
  return callDataGoKrJson<KftcBrandStoreStats>(
    'FftcBrandStoreStatsService', // TODO: 실제 endpoint 경로로 교체
    {
      yr: params.yr ?? new Date().getFullYear() - 1,
      pageNo: params.pageNo,
      numOfRows: params.numOfRows ?? 200,
    },
  )
}

// ============================================================
// 3. 브랜드 목록 정보
// ============================================================

export interface KftcBrandListItem {
  brandNm: string
  fcCrpoMngNo: string
  indutyNm?: string
  /** 가맹본부 법인명 */
  crpoNm?: string
}

export async function fetchBrandList(params: {
  yr?: number
  pageNo?: number
  numOfRows?: number
} = {}) {
  return callDataGoKrJson<KftcBrandListItem>(
    'FftcBrandService', // TODO: 실제 endpoint 경로로 교체
    {
      yr: params.yr ?? new Date().getFullYear() - 1,
      pageNo: params.pageNo,
      numOfRows: params.numOfRows ?? 500,
    },
  )
}

// ============================================================
// 4. 가맹본부 일반 정보 상세
// ============================================================

export interface KftcHqInfoItem {
  fcCrpoMngNo: string
  crpoNm: string
  /** 대표자명 */
  repNm: string
  /** 기업 규모 (대기업/중견/중소) */
  crpoSizeNm?: string
  /** 주소 */
  addr?: string
  /** 전화 */
  telNo?: string
  /** 홈페이지 */
  hmpgUrl?: string
}

export async function fetchHqInfo(fcCrpoMngNo: string, yr?: number) {
  return callDataGoKrJson<KftcHqInfoItem>('FftcCrpoInfoService', {
    yr: yr ?? new Date().getFullYear() - 1,
    fcCrpoMngNo,
    numOfRows: 1,
  })
}

// ============================================================
// 5. 가맹본부 등록 목록 (사업자번호·법인등록번호)
// ============================================================

export interface KftcHqRegistrationItem {
  fcCrpoMngNo: string
  crpoNm: string
  /** 사업자등록번호 */
  bizRgNo: string
  /** 법인등록번호 */
  corpRgNo?: string
}

export async function fetchHqRegistrations(params: {
  yr?: number
  pageNo?: number
  numOfRows?: number
} = {}) {
  return callDataGoKrJson<KftcHqRegistrationItem>('FftcCrpoRgService', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    pageNo: params.pageNo,
    numOfRows: params.numOfRows ?? 500,
  })
}
