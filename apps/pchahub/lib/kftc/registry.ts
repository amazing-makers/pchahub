// pchahub이 호출할 모든 공정위 가맹정보 API 레지스트리.
//
// 사용자가 data.go.kr에서 활용신청한 API들을 여기에 한 줄씩 등록하면
// 1) endpoint URL이 자동 인식되고
// 2) 응답 매퍼와 mock 구조 매핑이 자동 연결되며
// 3) 빠진 API는 mock으로 graceful fallback된다.
//
// 사용자가 캡처/링크로 신규 API를 알려주면 이 파일에 한 줄 추가하는 것
// 만으로 통합 끝.

export type KftcEndpointKey =
  | 'IndutyBrandStats'   // 업종별 브랜드 변동 현황 (트렌드)
  | 'BrandList'           // 브랜드 목록 (디렉토리)
  | 'BrandStoreStats'     // 페어데이터 — 가맹점/직영점/평균매출
  | 'HqInfo'              // 가맹본부 일반 정보
  | 'HqRegistrations'     // 가맹본부 등록 목록 (사업자번호)
  | 'DisclosureList'      // 정보공개서 목록 (franchise.ftc.go.kr)
  | 'DisclosureContent'   // 정보공개서 본문 (franchise.ftc.go.kr)
  | 'HqFinance'
  | 'AvgSaleByRegion'
  | 'BrandBrandStats'
  | 'IndutyFrcsCntStats'
  | 'CtpvJnghdqrtrsStus'
  | 'IndutyStusStats'
  | 'IndutyFrcsStats'
  | 'Jnghdqrtrsspclprtctinfo'
  | 'Brandmmbrswrtetcchginfo'
  | 'Brandcustntsllmttinfo'
  | 'Jnghdqrtrsacptnmergeinfo'
  | 'Brandprcdcslmttinfo'
  | 'Jnghdqrtrsspclprtctbizinfo'
  | 'Brandcmpetprhibtinfo'
  | 'Brandmnplyeclbsnareainfo'
  | 'Brandfrcsmnginfo'
  | 'Brandmmbrswrtreprchsinfo'
  | 'Brandfrcsbsnlmttinfo'
  | 'Brandedctmpcrtrainfo'
  | 'Brandfrcsbzmnntsllmttinfo'
  | 'Brandbsnareastngcrtrainfo'
  | 'Brandbsnareareadjstinfo'
  | 'Brandfrcsmnmnginfo'
  | 'Jnghdqrtrscorpindvdlrtstat'
  | 'Indutyflctnstat'
  | 'Brandmngmtsprtinfo'
  | 'Brandstevmpsprtinfo'
  | 'Brandfrcsinsrncinfo'
  | 'Indutybrdcntstat'
  | 'Brandmngmtcnsutinfo'
  | 'Brandjgtrsinfo'
  | 'Brandagencydistbchnnlinfo'
  | 'Jnghdqrtrscvlstinfo'
  | 'Indutyiprsholdstat'
  | 'Brandadvrtspromtndvolbinfo'
  | 'Brandfrcseduhrctinfo'
  | 'Yrindutyifrmpdclrstat'
  | 'Brandjnntdepoinstinfo'
  | 'Brandevntsprtinfo'
  | 'Brandfrcsbzmngtninfo'
  | 'Jnghdqrtrsexctvlist'
  | 'Brandiprsinfo'
  | 'Jnghdqrtrscorecactninfo'
  | 'Brandadvrtspromtnexpndinfo'
  | 'Brandonlinedistbchnnlinfo'
  | 'Brandfrcsstrtprocssinfo'
  | 'Brandscalholdstat'
  | 'Jnghdqrtrspetyadjuinfo'
  | 'Brandfrcsjnntinfo'
  | 'Brandfrcsbzmnbndctinfo'
  | 'BrandRtrcnInfo2_'
  | 'Brandfrcsbzmnothctinfo'
  | 'AnaYrDifRcvStats'
  | 'Brandlcsltcrtrainfo'
  | 'Brandexcljngbizinfo'
  | 'Areajnghdqrtrscntstat'
  | 'Branddmstcslsrelimpinfo'
  | 'BrandFrcsStrtInfo2_'
  | 'Brandadvslsstat'
  | 'Jnghdqrtrsfrntngnlinfo'
  | 'IndutyAnaBrandMaintStats'
  | 'BrandFrcsAlotmCtInfo2_'
  | 'Brandhistinfo'
  | 'Onoffslsrtstat'
  | 'BrandJnghdqrtrsRank'
  | 'JnghdqrtrsInfoChghst2_'
  | 'Branddmsoperpdinfo'
  | 'JnghdqrtrsStableStats'
  | 'JnghdqrtrsExctvInfo2_'
  | 'DealerCertsInfo'
  | 'Brandnewlistinfo'
  | 'IndutyAvrRankStats'
  | 'BrandFrcsAlotmInfo2_'
  | 'Indutyfrcscntstat'
  | 'Jnghdqrtrsslsareastat'
  | 'BrandCompInfo2_'
  | 'JnghdqrtrsExctvVioltInfo2_'
  | 'SalJnghdqrtrsRankStats'
  | 'Jnghdqrtrsernstat'
  | 'JnghdqrtrsAlotmSalStats'
  | 'IndutyFrcsOpclStats'
  | 'BrandFrcsChghst2_'
  | 'BrandFrcsIntInfo2_'
  | 'Indutyfrcsflctnstat'
  | 'JnghdqrtrsGrStats'
  | 'BrandIndutyDropFrcsStats'
  | 'Brandfrcslistinfo'
  | 'SclasIndutyFntnStats'
  | 'BrandFntnStats'
  | 'BrandFrcsUnitAvrSalInfo2_'
  | 'BrandFrcsStats'

export interface KftcEndpointDef {
  key: KftcEndpointKey
  /** data.go.kr 활용신청 페이지 화면에 표시되는 정확한 데이터명. */
  dataName: string
  /** 전체 URL — apis.data.go.kr 또는 franchise.ftc.go.kr. */
  endpoint: string
  /** 응답 포맷 */
  format: 'JSON' | 'XML' | 'JSON+XML'
  /** pchahub 가치 기여도 — 🔴 필수 / 🟡 유용 / 🟢 보완. */
  priority: 'critical' | 'useful' | 'supplementary'
  /** 이 API가 채워주는 우리 mock 필드 (사람이 읽는 설명). */
  fillsMockFields: string[]
  /** 활용신청·연결 상태. */
  status: 'configured' | 'pending-endpoint' | 'not-applied'
}

/**
 * 사용자가 활용신청한 API 등록부.
 *
 * 새 API 추가하는 방법:
 *   1. data.go.kr 마이페이지 → 해당 API → "개발계정 상세보기"
 *   2. "데이터명"과 "End Point" 복사
 *   3. 아래 ENDPOINTS 배열에 한 줄 추가
 *      (status: 'configured'로 설정)
 *
 * 응답 포맷이 다른 새 API라면 lib/kftc/json-apis.ts에 타입+fetcher
 * 한 쌍을 추가하면 됨.
 */
export const ENDPOINTS: KftcEndpointDef[] = [
  {
    key: 'IndutyBrandStats',
    dataName: '공정거래위원회_가맹정보_업종별 브랜드변동현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcIndutyBrandStatsService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'CategoryTrend (전체 카테고리 트렌드)',
      '/categories/[key]의 "올해 신규 N개" 표시',
    ],
    status: 'configured',
  },
  {
    key: 'BrandStoreStats',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 및 직영점정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsDropInfo2_Service',
    format: 'JSON',
    priority: 'critical',
    fillsMockFields: [
      'MockBrand.storeCount',
      'MockBrand.growthRate',
      'BrandRevenue.averageMonthly',
      'BrandStoreHistory[]',
    ],
    status: 'configured',
  },
  {
    key: 'BrandList',
    dataName: '공정거래위원회_가맹정보_브랜드 목록 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandRlsInfo2_Service',
    format: 'JSON',
    priority: 'critical',
    fillsMockFields: [
      'MockBrand.name',
      'MockBrand.category',
      'MockBrand.categoryLabel',
    ],
    status: 'configured',
  },
  {
    key: 'HqInfo',
    dataName: '공정거래위원회_가맹정보_가맹본부 일반 정보 상세 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsGnrlDtl2_Service',
    format: 'JSON',
    priority: 'useful',
    fillsMockFields: [
      'BrandHQ.companyName',
      'BrandHQ.ceo',
      'BrandHQ.address',
      'BrandHQ.phone',
      'MockBrand.hqRegion',
    ],
    status: 'configured',
  },
  {
    key: 'HqRegistrations',
    dataName: '공정거래위원회_가맹정보_가맹본부 등록 목록 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsRgsInfo2_Service',
    format: 'JSON',
    priority: 'supplementary',
    fillsMockFields: [
      'BrandHQ.bizNumber',
      'BrandDisclosureExtras.registrationNumber',
    ],
    status: 'configured',
  },
  {
    key: 'DisclosureList',
    dataName: '공정거래위원회_가맹정보_정보공개서_목록_조회',
    endpoint: 'https://franchise.ftc.go.kr/api/search.do?type=list',
    format: 'XML',
    priority: 'critical',
    fillsMockFields: [
      'BrandDetail 전체 (가맹비/보증금/계약조건/매장 변동)',
    ],
    status: 'configured',
  },
  {
    key: 'DisclosureContent',
    dataName: '공정거래위원회_가맹정보_정보공개서_본문_조회',
    endpoint: 'https://franchise.ftc.go.kr/api/search.do?type=content',
    format: 'XML',
    priority: 'critical',
    fillsMockFields: [
      'BrandCosts (가맹비/보증금/인테리어/교육비)',
      'BrandDisclosureExtras (계약기간/광고비/영업지역)',
      'BrandHQ.foundedYear / franchiseStartYear',
    ],
    status: 'configured',
  },
  {
    key: 'HqFinance',
    dataName: '공정거래위원회_가맹정보_가맹본부 재무정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsFnnrInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'AvgSaleByRegion',
    dataName: '공정거래위원회_가맹정보_지역별 업종별 평균 매출액 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcAreaIndutyAvrStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'BrandBrandStats',
    dataName: '공정거래위원회_가맹정보_브랜드별 브랜드 개요 통계 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandBrandStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'IndutyFrcsCntStats',
    dataName: '공정거래위원회_가맹정보_주요 업종별 가맹점수 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcIndutyFrcsCntStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'CtpvJnghdqrtrsStus',
    dataName: '공정거래위원회_페어데이터_시도별 가맹본부현황',
    endpoint: 'https://apis.data.go.kr/1130000/FftcCtpvJnghdqrtrsStusService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'IndutyStusStats',
    dataName: '공정거래위원회_가맹정보_업종별 업종개황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcIndutyStusStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'IndutyFrcsStats',
    dataName: '공정거래위원회_가맹정보_업종별 가맹점변동현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcIndutyFrcsStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrsspclprtctinfo',
    dataName: '공정거래위원회_가맹정보_가맹본부 특수관계인 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsspclprtctinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandmmbrswrtetcchginfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 운영권 기타 변경 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandmmbrswrtetcchginfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandcustntsllmttinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 고객 판매 제한 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandcustntsllmttinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrsacptnmergeinfo',
    dataName: '공정거래위원회_가맹정보_가맹본부 인수합병 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsacptnmergeinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandprcdcslmttinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가격 결정 제한 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandprcdcslmttinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrsspclprtctbizinfo',
    dataName: '공정거래위원회_가맹정보_가맹본부 특수관계인 가맹사업 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsspclprtctbizinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandcmpetprhibtinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 경쟁 금지 업종 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandcmpetprhibtinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandmnplyeclbsnareainfo',
    dataName: '공정거래위원회_가맹정보_브랜드 독점배타영업지역 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandmnplyeclbsnareainfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsmnginfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 감독 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsmnginfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandmmbrswrtreprchsinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 운영권 환매 양도 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandmmbrswrtreprchsinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsbsnlmttinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 영업 제한 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsbsnlmttinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandedctmpcrtrainfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 교육계약채용 기준 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandedctmpcrtrainfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsbzmnntsllmttinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 판매 제한 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsbzmnntsllmttinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandbsnareastngcrtrainfo',
    dataName: '공정거래위원회_가맹정보_브랜드 영업지역 설정 기준 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandbsnareastngcrtrainfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandbsnareareadjstinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 영업지역 재조정 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandbsnareareadjstinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsmnmnginfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 관리 감독 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsmnmnginfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrscorpindvdlrtstat',
    dataName: '공정거래위원회_가맹정보_가맹본부 법인·개인사업자 비율 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrscorpindvdlrtstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Indutyflctnstat',
    dataName: '공정거래위원회_가맹정보_업종별 가맹본부 변동 현황 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcindutyflctnstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandmngmtsprtinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 경영지원 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandmngmtsprtinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandstevmpsprtinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 점포 환경 개선 지원 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandstevmpsprtinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsinsrncinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 보험 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsinsrncinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Indutybrdcntstat',
    dataName: '공정거래위원회_가맹정보_주요 업종별 브랜드수 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcindutybrdcntstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandmngmtcnsutinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 경영자문 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandmngmtcnsutinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandjgtrsinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹지역본부 일반 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandjgtrsinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandagencydistbchnnlinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 별도 유통 채널 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandagencydistbchnnlinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrscvlstinfo',
    dataName: '공정거래위원회_가맹정보_가맹본부 법 위반 민사소송 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrscvlstinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Indutyiprsholdstat',
    dataName: '공정거래위원회_가맹정보_업종별 지식재산권 보유 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcindutyiprsholdstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandadvrtspromtndvolbinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 광고판촉분담 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandadvrtspromtndvolbinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcseduhrctinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 교육 훈련 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcseduhrctinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Yrindutyifrmpdclrstat',
    dataName: '공정거래위원회_가맹정보_연도별 업종별 정보공개서 신고 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcyrindutyifrmpdclrstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandjnntdepoinstinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹금 예치 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandjnntdepoinstinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandevntsprtinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 기타 지원 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandevntsprtinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsbzmngtninfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 보증금 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsbzmngtninfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrsexctvlist',
    dataName: '공정거래위원회_가맹정보_가맹본부 임원 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsexctvlistService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandiprsinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 지식재산권 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandiprsinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrscorecactninfo',
    dataName: '공정거래위원회_가맹정보_가맹본부 법 위반 시정조치 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrscorecactninfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandadvrtspromtnexpndinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 광고판촉 지출 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandadvrtspromtnexpndinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandonlinedistbchnnlinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 온라인 유통 채널 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandonlinedistbchnnlinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsstrtprocssinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 영업 개시 절차 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsstrtprocssinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandscalholdstat',
    dataName: '공정거래위원회_가맹정보_기업 규모별 브랜드 보유 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandscalholdstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrspetyadjuinfo',
    dataName: '공정거래위원회_가맹정보_가맹본부 법 위반 형벌선고 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrspetyadjuinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsjnntinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 가맹금 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsjnntinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsbzmnbndctinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 영업중부담금 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsbzmnbndctinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'BrandRtrcnInfo2_',
    dataName: '공정거래위원회_가맹정보_브랜드 취소 목록 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandRtrcnInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcsbzmnothctinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 기타비용 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcsbzmnothctinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'AnaYrDifRcvStats',
    dataName: '공정거래위원회_가맹정보_연도별 차액 가맹금 수취 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcAnaYrDifRcvStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandlcsltcrtrainfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 입지선정기준 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandlcsltcrtrainfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandexcljngbizinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 제외 경영가맹사업 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandexcljngbizinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Areajnghdqrtrscntstat',
    dataName: '공정거래위원회_가맹정보_지역별 가맹본부 소재지 분포 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcareajnghdqrtrscntstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Branddmstcslsrelimpinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 온라인오프라인 판매 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbranddmstcslsrelimpinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'BrandFrcsStrtInfo2_',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자 가맹기간 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsStrtInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandadvslsstat',
    dataName: '공정거래위원회_가맹정보_업종별 광고 판촉 활동 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandadvslsstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrsfrntngnlinfo',
    dataName: '공정거래위원회_가맹정보_외국계 가맹본부 일반정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsfrntngnlinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'IndutyAnaBrandMaintStats',
    dataName: '공정거래위원회_가맹정보_업종별,연차별 브랜드 유지 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcIndutyAnaBrandMaintStatsService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'CategoryMaintRate — 업종별 평균 유지율·운영연차',
    ],
    status: 'configured',
  },
  {
    key: 'BrandFrcsAlotmCtInfo2_',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자의 예치금정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsAlotmCtInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandhistinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 연혁 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandhistinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Onoffslsrtstat',
    dataName: '공정거래위원회_가맹정보_업종별 온라인오프라인 판매 비율 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftconoffslsrtstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'BrandJnghdqrtrsRank',
    dataName: '공정거래위원회_가맹정보_복수 브랜드 가맹본부 순위 통계 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandJnghdqrtrsRankService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'JnghdqrtrsInfoChghst2_',
    dataName: '공정거래위원회_가맹정보_가맹본부 일반 정보 변경 이력현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsInfoChghst2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Branddmsoperpdinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 직영점 운영 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbranddmsoperpdinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'JnghdqrtrsStableStats',
    dataName: '공정거래위원회_가맹정보_가맹본부별 안정성 통계 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsStableStatsService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'BrandStabilityMetrics (폐점률, 평균운영연차, 안정성점수)',
    ],
    status: 'configured',
  },
  {
    key: 'JnghdqrtrsExctvInfo2_',
    dataName: '공정거래위원회_가맹정보_가맹본부 임직원정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsExctvInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'DealerCertsInfo',
    dataName: '공정거래위원회_가맹정보_가맹거래사 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcDealerCertsInfoService',
    format: 'JSON',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandnewlistinfo',
    dataName: '공정거래위원회_가맹정보_신규등록 브랜드 목록 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandnewlistinfoService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'IndutyAvrRankStats',
    dataName: '공정거래위원회_가맹정보_업종별 평균 창업비용 상위 순위 통계 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcIndutyAvrRankStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'BrandFrcsAlotmInfo2_',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 사업자의 부담금정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsAlotmInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Indutyfrcscntstat',
    dataName: '공정거래위원회_가맹정보_지역별 업종별 가맹점수 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcindutyfrcscntstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrsslsareastat',
    dataName: '공정거래위원회_가맹정보_가맹본부 매출액 분포현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsslsareastatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'BrandCompInfo2_',
    dataName: '공정거래위원회_가맹정보_브랜드 비교 목록 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandCompInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'JnghdqrtrsExctvVioltInfo2_',
    dataName: '공정거래위원회_가맹정보_가맹본부 법 위반정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsExctvVioltInfo2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'SalJnghdqrtrsRankStats',
    dataName: '공정거래위원회_가맹정보_매출액 가맹본부 상위 순위 통계 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcSalJnghdqrtrsRankStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Jnghdqrtrsernstat',
    dataName: '공정거래위원회_가맹정보_가맹본부별 수익성통계 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcjnghdqrtrsernstatService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'BrandRevenue.averageOperatingProfit (가맹점 평균 영업이익)',
    ],
    status: 'configured',
  },
  {
    key: 'JnghdqrtrsAlotmSalStats',
    dataName: '공정거래위원회_가맹정보_가맹사업자 부담금 대비 매출액 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsAlotmSalStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'IndutyFrcsOpclStats',
    dataName: '공정거래위원회_가맹정보_주요 업종별 가맹점 개·폐점률 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcIndutyFrcsOpclStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'BrandFrcsChghst2_',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 변경현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsChghst2_Service',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'BrandFrcsIntInfo2_',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 인테리어 비용정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsIntInfo2_Service',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'BrandCosts.interiorFee (min/max/avg 기반 추정)',
    ],
    status: 'configured',
  },
  {
    key: 'Indutyfrcsflctnstat',
    dataName: '공정거래위원회_가맹정보_업종별 가맹점 변동현황 조회 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcindutyfrcsflctnstatService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'JnghdqrtrsGrStats',
    dataName: '공정거래위원회_가맹정보_가맹본부별 성장성 통계 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcJnghdqrtrsGrStatsService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'MockBrand.growthRate (가맹점수 증감률)',
    ],
    status: 'configured',
  },
  {
    key: 'BrandIndutyDropFrcsStats',
    dataName: '공정거래위원회_가맹정보_브랜드별,업종별 직영점 및 가맹점 분포 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandIndutyDropFrcsStatsService',
    format: 'JSON+XML',
    priority: 'supplementary',
    fillsMockFields: ['TBD'],
    status: 'configured',
  },
  {
    key: 'Brandfrcslistinfo',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 목록 정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcbrandfrcslistinfoService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'StoreLocation[] — 매장 주소·지역별 분포 (지도 뷰)',
    ],
    status: 'configured',
  },
  {
    key: 'SclasIndutyFntnStats',
    dataName: '공정거래위원회_가맹정보_업종별 창업비용 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcSclasIndutyFntnStatsService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'CategoryStartupCost — /categories/[key] 평균 창업비 표시',
    ],
    status: 'configured',
  },
  {
    key: 'BrandFntnStats',
    dataName: '공정거래위원회_가맹정보_브랜드별 창업 금액 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFntnStatsService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'MockBrand.startupCost',
      'BrandCosts.franchiseFee / deposit / interiorFee / educationFee / otherFees',
    ],
    status: 'configured',
  },
  {
    key: 'BrandFrcsUnitAvrSalInfo2_',
    dataName: '공정거래위원회_가맹정보_브랜드 가맹점 단위면적당 평균 매출액정보 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsUnitAvrSalInfo2_Service',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'BrandRevenue.averageMonthly (단위면적 × 표준면적 기반)',
    ],
    status: 'configured',
  },
  {
    key: 'BrandFrcsStats',
    dataName: '공정거래위원회_가맹정보_브랜드별 가맹점 현황 제공 서비스',
    endpoint: 'https://apis.data.go.kr/1130000/FftcBrandFrcsStatsService',
    format: 'JSON+XML',
    priority: 'useful',
    fillsMockFields: [
      'MockBrand.storeCount (가맹점+직영점 합계)',
      'BrandStoreHistory 보완',
    ],
    status: 'configured',
  },
]

export function endpointFor(key: KftcEndpointKey): string {
  const def = ENDPOINTS.find((e) => e.key === key)
  if (!def) throw new Error(`Unknown KFTC endpoint key: ${key}`)
  return def.endpoint
}

export function isConfigured(key: KftcEndpointKey): boolean {
  const def = ENDPOINTS.find((e) => e.key === key)
  return def?.status === 'configured'
}

/** 진행 현황 요약 — 로그·디버깅용. */
export function summarizeStatus() {
  const configured = ENDPOINTS.filter((e) => e.status === 'configured').length
  const pending = ENDPOINTS.filter((e) => e.status === 'pending-endpoint').length
  const notApplied = ENDPOINTS.filter((e) => e.status === 'not-applied').length
  return { configured, pending, notApplied, total: ENDPOINTS.length }
}
