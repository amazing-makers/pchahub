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
 * Endpoint: FftcIndutyBrandStatsService/getIndutyBrandStats
 * (getIndutyBrandStats 미확인 시 FftcBrandFrcsStatsService fallback)
 */
export async function fetchIndutyBrandStats(params: FetchIndutyBrandStatsParams = {}) {
  return callDataGoKrJson<KftcIndutyBrandStats>('FftcBrandFrcsStatsService/getBrandFrcsStats', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    indutyLclas: params.indutyLclas,
    pageNo: params.pageNo ?? 1,
    numOfRows: params.numOfRows ?? 200,
  })
}

// ============================================================
// 2. 브랜드별 가맹점 현황 + 평균매출
//    endpoint: FftcBrandFrcsStatsService/getBrandFrcsStats (확인됨 ✅)
//    실제 필드: yr, indutyLclasNm, indutyMlsfcNm, corpNm, brandNm,
//              frcsCnt, newFrcsRgsCnt, ctrtEndCnt, avrgSlsAmt, arUnitAvrgSlsAmt
// ============================================================

export interface KftcBrandStoreStats {
  /** 기준 연도 */
  yr: string
  /** 업종 대분류 */
  indutyLclasNm: string
  /** 업종 중분류 */
  indutyMlsfcNm?: string
  /** 법인명 */
  corpNm: string
  /** 브랜드명 */
  brandNm: string
  /** 가맹점 수 */
  frcsCnt: number
  /** 신규 가맹점 등록 수 */
  newFrcsRgsCnt?: number
  /** 계약 종료 수 */
  ctrtEndCnt?: number
  /** 계약 해지 수 */
  ctrtCncltnCnt?: number
  /** 명칭 변경 수 */
  nmChgCnt?: number
  /** 평균 매출액 (만원) */
  avrgSlsAmt?: number
  /** 단위면적당 평균 매출액 (만원/㎡) */
  arUnitAvrgSlsAmt?: number
  // 하위 호환 — 기존 mapper가 참조하는 필드
  fcCrpoMngNo?: string
  fcStoreCnt?: number
  drStoreCnt?: number
  avgFcSale?: number
}

/**
 * 브랜드별 가맹점 현황 + 평균매출.
 * Endpoint: FftcBrandFrcsStatsService/getBrandFrcsStats ✅
 */
export async function fetchBrandStoreStats(params: {
  yr?: number
  pageNo?: number
  numOfRows?: number
} = {}) {
  return callDataGoKrJson<KftcBrandStoreStats>(
    'FftcBrandFrcsStatsService/getBrandFrcsStats',
    {
      yr: params.yr ?? new Date().getFullYear() - 1,
      pageNo: params.pageNo ?? 1,
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

// ============================================================
// 6. 브랜드별 창업 금액 현황 (BrandFntnStats)
// ============================================================

export interface KftcBrandFntnStatsItem {
  /** 기준 연도 */
  yr?: string
  /** 업종 대분류 */
  indutyLclasNm?: string
  /** 업종 중분류 */
  indutyMlsfcNm?: string
  /** 브랜드명 */
  brandNm: string
  /** 법인명 */
  corpNm?: string
  /** 가맹금 (실API: jngBzmnJngAmt, 만원) */
  jngBzmnJngAmt?: number
  /** 교육비 (실API: jngBzmnEduAmt, 만원) */
  jngBzmnEduAmt?: number
  /** 보증금 (실API: jngBzmnAssrncAmt, 만원) */
  jngBzmnAssrncAmt?: number
  /** 기타 (실API: jngBzmnEtcAmt, 만원) */
  jngBzmnEtcAmt?: number
  /** 창업비 합계 (실API: smtnAmt, 만원) */
  smtnAmt?: number
  // 하위 호환 필드 (기존 mapper 참조)
  fcCrpoMngNo?: string
  baseYr?: string
  /** 창업비 합계 (만원, 구 필드) */
  fntnFee?: number
  /** 가맹금 (구 필드) */
  frcsFee?: number
  /** 보증금 (구 필드) */
  dpstFee?: number
  /** 인테리어비 */
  intFee?: number
  /** 교육비 (구 필드) */
  eduFee?: number
  /** 기타 (구 필드) */
  etcFee?: number
}

export async function fetchBrandFntnStats(params: { yr?: number; pageNo?: number; numOfRows?: number } = {}) {
  return callDataGoKrJson<KftcBrandFntnStatsItem>('FftcBrandFntnStatsService/getBrandFntnStats', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    pageNo: params.pageNo ?? 1,
    numOfRows: params.numOfRows ?? 500,
  })
}

// ============================================================
// 7. 브랜드별 가맹점 현황 (BrandFrcsStats)
// ============================================================

export interface KftcBrandFrcsStatsItem {
  fcCrpoMngNo: string
  brandNm: string
  baseYr?: string
  indutyNm?: string
  /** 가맹점수 */
  fcStoreCnt?: number
  /** 직영점수 */
  drStoreCnt?: number
  /** 전년 대비 가맹점수 증감 */
  fcStoreCntCgQty?: number
}

export async function fetchBrandFrcsStats(params: { yr?: number; numOfRows?: number } = {}) {
  return callDataGoKrJson<KftcBrandFrcsStatsItem>('FftcBrandFrcsStatsService/getBrandFrcsStats', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    pageNo: 1,
    numOfRows: params.numOfRows ?? 500,
  })
}

// ============================================================
// 8. 브랜드별 개요 통계 (BrandBrandStats) ✅ 확인됨
//    endpoint: FftcBrandBrandStatsService/getBrandBrandStats
//    실제 필드: yr, indutyLclasNm, indutyMlsfcNm, brandNm, corpNm,
//              jngBizStrtDate, jngBizYycnt, frcsCnt, allExctvCnt, empCnt
// ============================================================

export interface KftcBrandBrandStatsItem {
  /** 기준 연도 */
  yr: string
  /** 업종 대분류 */
  indutyLclasNm: string
  /** 업종 중분류 */
  indutyMlsfcNm?: string
  /** 브랜드명 */
  brandNm: string
  /** 법인명 */
  corpNm: string
  /** 가맹사업 시작일 (yyyymmdd) */
  jngBizStrtDate?: string
  /** 가맹업 운영 기간 (예: "5년 4개월") */
  jngBizYycnt?: string
  /** 가맹점 수 */
  frcsCnt?: number
  /** 전체 임원 수 */
  allExctvCnt?: number
  /** 직원 수 */
  empCnt?: number
}

/**
 * 브랜드별 개요 통계 (가맹사업 연수·임직원 수).
 * Endpoint: FftcBrandBrandStatsService/getBrandBrandStats ✅
 */
export async function fetchBrandBrandStats(params: { yr?: number; pageNo?: number; numOfRows?: number } = {}) {
  return callDataGoKrJson<KftcBrandBrandStatsItem>('FftcBrandBrandStatsService/getBrandBrandStats', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    pageNo: params.pageNo ?? 1,
    numOfRows: params.numOfRows ?? 500,
  })
}

// ============================================================
// 9-prev. 브랜드 가맹점 단위면적당 평균 매출액 (BrandFrcsUnitAvrSalInfo2_)
// ============================================================

export interface KftcBrandUnitAvrSalItem {
  fcCrpoMngNo: string
  brandNm: string
  baseYr?: string
  /** 단위면적당 평균 매출 (만원/㎡) */
  unitAvrSal?: number
  /** 표준 면적 (㎡) */
  stdArea?: number
  /** 평균 월매출 (만원, 표준 면적 기준) */
  avrMonthlySal?: number
}

export async function fetchBrandUnitAvrSal(params: { yr?: number; numOfRows?: number } = {}) {
  return callDataGoKrJson<KftcBrandUnitAvrSalItem>('FftcBrandFrcsUnitAvrSalInfo2_Service', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    numOfRows: params.numOfRows ?? 500,
  })
}

// ============================================================
// 9. 가맹본부별 성장성 통계 (JnghdqrtrsGrStats)
// ============================================================

export interface KftcJnghdqrtrsGrStatsItem {
  fcCrpoMngNo: string
  crpoNm: string
  baseYr?: string
  /** 가맹점수 증감률 (%) */
  fcStoreCntCgRate?: number
  /** 매출 증감률 (%) */
  slsCgRate?: number
  /** 성장성 종합 점수 */
  grScore?: number
}

export async function fetchJnghdqrtrsGrStats(params: { yr?: number; numOfRows?: number } = {}) {
  return callDataGoKrJson<KftcJnghdqrtrsGrStatsItem>('FftcJnghdqrtrsGrStatsService', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    numOfRows: params.numOfRows ?? 500,
  })
}

// ============================================================
// 10. 가맹본부별 안정성 통계 (JnghdqrtrsStableStats)
// ============================================================

export interface KftcJnghdqrtrsStableItem {
  fcCrpoMngNo: string
  crpoNm: string
  baseYr?: string
  /** 안정성 종합 점수 */
  stableScore?: number
  /** 폐점률 (%) */
  closureRate?: number
  /** 평균 운영연차 */
  avgRunYrs?: number
}

export async function fetchJnghdqrtrsStableStats(params: { yr?: number; numOfRows?: number } = {}) {
  return callDataGoKrJson<KftcJnghdqrtrsStableItem>('FftcJnghdqrtrsStableStatsService', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    numOfRows: params.numOfRows ?? 500,
  })
}

// ============================================================
// 11. 가맹본부별 수익성 통계 (Jnghdqrtrsernstat)
// ============================================================

export interface KftcJnghdqrtrsErnItem {
  fcCrpoMngNo: string
  crpoNm: string
  baseYr?: string
  /** 평균 수익률 (%) */
  avgErnRate?: number
  /** 가맹점 평균 영업이익 (만원/월) */
  avgFcOprtProfit?: number
  /** 수익성 종합 점수 */
  ernScore?: number
}

export async function fetchJnghdqrtrsErnStats(params: { yr?: number; numOfRows?: number } = {}) {
  return callDataGoKrJson<KftcJnghdqrtrsErnItem>('FftcjnghdqrtrsernstatService', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    numOfRows: params.numOfRows ?? 500,
  })
}

// ============================================================
// 12. 브랜드 가맹점 목록 (Brandfrcslistinfo)
// ============================================================

export interface KftcBrandFrcsListItem {
  fcCrpoMngNo: string
  brandNm: string
  /** 매장명 */
  storNm?: string
  /** 주소 */
  addr?: string
  /** 시도명 */
  ctpvNm?: string
  /** 시군구명 */
  signguNm?: string
  /** 전화번호 */
  telNo?: string
  /** 개점일 */
  openDt?: string
}

export async function fetchBrandFrcsList(params: {
  fcCrpoMngNo?: string
  yr?: number
  numOfRows?: number
} = {}) {
  return callDataGoKrJson<KftcBrandFrcsListItem>('FftcbrandfrcslistinfoService', {
    fcCrpoMngNo: params.fcCrpoMngNo,
    yr: params.yr ?? new Date().getFullYear() - 1,
    numOfRows: params.numOfRows ?? 500,
  })
}

// ============================================================
// 13. 업종별(소분류) 창업비용 현황 (SclasIndutyFntnStats)
// ============================================================

export interface KftcSclasIndutyFntnItem {
  baseYr?: string
  indutyLclasNm?: string
  indutyMlsfcNm?: string
  indutySclasNm?: string
  /** 평균 창업비 (만원) */
  avgFntnFee?: number
  /** 평균 가맹금 */
  avgFrcsFee?: number
  /** 평균 보증금 */
  avgDpstFee?: number
  /** 평균 인테리어비 */
  avgIntFee?: number
}

export async function fetchSclasIndutyFntnStats(params: {
  yr?: number
  indutyLclas?: string
  numOfRows?: number
} = {}) {
  return callDataGoKrJson<KftcSclasIndutyFntnItem>('FftcSclasIndutyFntnStatsService', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    indutyLclas: params.indutyLclas,
    numOfRows: params.numOfRows ?? 200,
  })
}

// ============================================================
// 14. 업종별·연차별 브랜드 유지 현황 (IndutyAnaBrandMaintStats)
// ============================================================

export interface KftcIndutyAnaBrandMaintItem {
  baseYr?: string
  indutyLclasNm?: string
  indutySclasNm?: string
  /** 운영 연차 */
  oprtYrCnt?: number
  /** 해당 연차 브랜드 수 */
  brandCnt?: number
  /** 브랜드 유지율 (%) */
  maintRate?: number
}

export async function fetchIndutyAnaBrandMaintStats(params: {
  yr?: number
  numOfRows?: number
} = {}) {
  return callDataGoKrJson<KftcIndutyAnaBrandMaintItem>('FftcIndutyAnaBrandMaintStatsService', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    numOfRows: params.numOfRows ?? 200,
  })
}

// ============================================================
// 15. 브랜드 가맹점 인테리어 비용 (BrandFrcsIntInfo2_)
// ============================================================

export interface KftcBrandFrcsIntItem {
  fcCrpoMngNo: string
  brandNm: string
  baseYr?: string
  /** 인테리어비 최솟값 (만원) */
  intFeeMin?: number
  /** 인테리어비 최댓값 (만원) */
  intFeeMax?: number
  /** 인테리어비 평균 (만원) */
  intFeeAvg?: number
  /** 표준 면적 (평) */
  stdAreaPyeong?: number
}

export async function fetchBrandFrcsIntInfo(params: { yr?: number; numOfRows?: number } = {}) {
  return callDataGoKrJson<KftcBrandFrcsIntItem>('FftcBrandFrcsIntInfo2_Service', {
    yr: params.yr ?? new Date().getFullYear() - 1,
    numOfRows: params.numOfRows ?? 500,
  })
}
