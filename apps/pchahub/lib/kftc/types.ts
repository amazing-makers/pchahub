// 공정거래위원회 가맹사업정보제공시스템 (franchise.ftc.go.kr) API 응답 타입
//
// 4개 엔드포인트가 한 세트:
//   1. type=list   → DisclosureListItem[]   (연도별 정보공개서 전체 목록)
//   2. type=title  → DisclosureTOC           (특정 정보공개서의 목차)
//   3. type=content → DisclosureContent      (본문 — 가맹비, 보증금, 인테리어비 등)
//   4. viewer.do   → 정보공개서 PDF 뷰어 페이지 (외부 링크용, JSON 응답 없음)
//
// 모든 API는 동일한 serviceKey를 공유한다.

/**
 * 정보공개서 일련번호.
 *
 * `type=list` 응답의 각 항목에서 추출되며, 이후 `type=title`,
 * `type=content`, `viewer.do` 호출의 PK로 사용된다.
 */
export type DisclosureSerialNumber = string

// ============================================================
// 1. type=list — 정보공개서 목록
// ============================================================

/**
 * `?type=list&yr=2024` 응답의 단일 행.
 *
 * 실제 XML 응답 예 (franchise.ftc.go.kr 문서):
 *   <item>
 *     <jngIfrmpSn>151420</jngIfrmpSn>
 *     <brandNm>치킨다이스</brandNm>
 *     <crpoNm>(주)치킨다이스코리아</crpoNm>
 *     <regDt>2024-03-15</regDt>
 *     <bizCondCd>외식업</bizCondCd>
 *     ...
 *   </item>
 */
export interface KftcDisclosureListItem {
  /** 정보공개서 일련번호 — 본문/목차/뷰어 호출에 사용 */
  jngIfrmpSn: DisclosureSerialNumber
  /** 브랜드명 */
  brandNm: string
  /** 가맹본부 법인명 */
  crpoNm: string
  /** 등록일 */
  regDt: string
  /** 업태 코드 (외식업/도소매업/서비스업 등) */
  bizCondCd?: string
  /** 업종 분류 */
  indutyClsfNm?: string
  /** 가맹본부관리번호 — 다른 API(가맹본부 일반정보 등)의 키 */
  fcCrpoMngNo?: string
  /** 사업자등록번호 */
  bizRgNo?: string
}

export interface KftcDisclosureListResponse {
  resultCode: string
  resultMsg: string
  totalCount: number
  pageNo: number
  numOfRows: number
  items: KftcDisclosureListItem[]
}

// ============================================================
// 2. type=title — 정보공개서 목차
// ============================================================

/**
 * 정보공개서 본문은 1장(가맹본부의 일반현황) ~ 6장(가맹점사업자의 부담)으로
 * 구성. 목차 API는 각 장의 제목과 sectionId만 알려준다.
 */
export interface KftcDisclosureTOCEntry {
  sectionId: string
  title: string
  level: number
}

export interface KftcDisclosureTOC {
  jngIfrmpSn: DisclosureSerialNumber
  entries: KftcDisclosureTOCEntry[]
}

// ============================================================
// 3. type=content — 정보공개서 본문
// ============================================================

/**
 * 정보공개서 본문 — 6장 구성에 맞춰 우리 mock 구조(BrandCosts,
 * BrandDisclosureExtras)와 1:1 매핑된다.
 *
 * 실제 응답은 XML이며 6개 섹션 안에 또 하위 항목이 매우 많다. 우리 mock
 * 구조에 필요한 핵심 필드만 추출한 정제된 형태로 표현한다.
 */
export interface KftcDisclosureContent {
  jngIfrmpSn: DisclosureSerialNumber

  // 1장. 가맹본부 일반 현황 — BrandHQ로 매핑
  ch1_hqInfo: {
    crpoNm: string
    repNm: string
    estbsDt: string // 설립일
    fcStartDt: string // 가맹사업 시작일
    addr: string
    telNo: string
    homepageUrl?: string
    bizRgNo: string
    trademarkRegistered: boolean // 1-3절 상표권
  }

  // 2장. 가맹사업자의 부담 — BrandCosts로 매핑
  ch2_costs: {
    franchiseFee: number // 가맹비 (만원)
    deposit: number // 보증금
    educationFee: number // 교육비
    interiorFee: number // 인테리어비 (표준 면적 기준)
    interiorPerPyeong: number // 평당 인테리어 단가
    otherFees: number // 기타 비용
    standardArea: number // 표준 매장 면적 (평)
    royaltyType: 'fixed' | 'percentage' | 'none'
    royaltyValue: number
  }

  // 3장. 영업활동 조건 — BrandDisclosureExtras로 매핑
  ch3_terms: {
    contractYears: number
    renewalTerms: string
    territoryProtection: string
    hqAdvertisingShare: number // %
    storeAdvertisingShare: number // 매출의 %
  }

  // 4장. 매장 현황 — BrandStoreHistory로 매핑
  ch4_stores: {
    totalStoresLastYear: number
    byYear: Array<{
      year: number
      totalStores: number
      newStores: number
      closedStores: number
      contractTerminated: number
      ownershipChanged: number
    }>
  }

  // 5장. 매출 정보 — BrandRevenue로 매핑
  ch5_revenue: {
    averageMonthly: number
    averageOperatingProfit: number
    byRegion: Array<{ region: string; share: number }>
  }

  // 정보공개서 메타
  meta: {
    registrationNumber: string
    publishedAt: string // 공시일
  }
}

// ============================================================
// 4. viewer.do — 정보공개서 PDF 뷰어 페이지 (URL만 생성)
// ============================================================

export function viewerUrl(jngIfrmpSn: DisclosureSerialNumber, serviceKey: string): string {
  return `https://franchise.ftc.go.kr/api/viewer.do?jngIfrmpSn=${jngIfrmpSn}&serviceKey=${encodeURIComponent(serviceKey)}`
}
