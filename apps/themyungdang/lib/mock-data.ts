// 더명당 도메인 데이터 — 상권 정보(AREAS) + 카테고리 라벨 등.
//
// 매물 데이터(MockListing, LISTINGS)는 @amakers/listings 패키지가 단일
// 소스로 보유. 더명당이 본가지만 패키지 형태로 추출해 pchahub 등 다른
// 앱이 동일 데이터를 직접 import할 수 있게 함. 더명당에서 매물이 추가되면
// 패키지에 반영 → 다른 앱이 빌드만 다시 하면 자동 동기화.

import { listingPhotoSet } from './listing-images'
import {
  LISTINGS as PKG_LISTINGS,
  type MockListing as PkgMockListing,
  type ListingType as PkgListingType,
} from '@amakers/listings'

export type ListingType = PkgListingType

export type MockListing = PkgMockListing

export interface MockArea {
  key: string
  name: string
  region: string
  district: string
  description: string
  /** 일 평균 유동인구 (명) */
  footTraffic: number
  /** 평당 평균 월세 (만원) */
  avgMonthlyRentPerPyeong: number
  /** 평균 권리금 (만원) */
  avgRightFee: number
  /** 평균 보증금 (만원) */
  avgDeposit: number
  /** 주요 업종 비중 */
  topCategories: Array<{ key: string; label: string; share: number }>
  highlights: string[]
  cautions: string[]
  /** 상권 중심 좌표 — 지도 오버레이 원 표시용 */
  lat?: number
  lng?: number
  /** 오버레이 반경 (미터) */
  radiusM?: number
}

export interface ListingCategory {
  key: string
  label: string
  brandRefCount: number
}

export const LISTING_CATEGORIES: ListingCategory[] = [
  { key: 'chicken', label: '치킨', brandRefCount: 142 },
  { key: 'cafe', label: '카페', brandRefCount: 318 },
  { key: 'korean', label: '한식', brandRefCount: 87 },
  { key: 'japanese', label: '일식', brandRefCount: 54 },
  { key: 'snack', label: '분식', brandRefCount: 76 },
  { key: 'dessert', label: '디저트', brandRefCount: 49 },
  { key: 'beverage', label: '음료', brandRefCount: 62 },
  { key: 'bar', label: '주점', brandRefCount: 38 },
  { key: 'convenience', label: '편의점', brandRefCount: 24 },
  { key: 'education', label: '교육', brandRefCount: 41 },
]

export const TYPE_LABEL: Record<ListingType, string> = {
  transfer: '양도',
  new: '신규 임대',
  sale: '매각',
}

export const AREAS: MockArea[] = [
  {
    key: 'gangnam',
    name: '강남역 상권',
    region: '서울',
    district: '강남구',
    description:
      '국내 최상위 사무 + 유흥 복합 상권. 객단가가 높고 회전율이 좋지만 임대료 부담도 가장 큽니다.',
    footTraffic: 92000,
    avgMonthlyRentPerPyeong: 22,
    avgRightFee: 8500,
    avgDeposit: 9000,
    topCategories: [
      { key: 'cafe', label: '카페', share: 28 },
      { key: 'korean', label: '한식', share: 18 },
      { key: 'bar', label: '주점', share: 16 },
      { key: 'japanese', label: '일식', share: 12 },
    ],
    highlights: [
      '오피스 점심 + 저녁 + 심야까지 객수가 끊기지 않음',
      '대형 브랜드와 신규 브랜드가 공존하는 트렌드 시험장',
    ],
    cautions: [
      '평당 월세가 다른 상권의 2-3배. 매출이 평균 이상이어도 손익이 빠듯할 수 있음',
      '공시 매물보다 부동산 직접 협상으로 거래되는 비율이 높아 정보 비대칭이 큼',
    ],
    lat: 37.4981, lng: 127.0276, radiusM: 600,
  },
  {
    key: 'hongdae',
    name: '홍대 상권',
    region: '서울',
    district: '마포구',
    description:
      'SNS·트렌드 매장이 집중되는 20-30대 상권. 디저트·카페·캐주얼 다이닝 매장이 강세입니다.',
    footTraffic: 74000,
    avgMonthlyRentPerPyeong: 18,
    avgRightFee: 5500,
    avgDeposit: 6500,
    topCategories: [
      { key: 'cafe', label: '카페', share: 32 },
      { key: 'dessert', label: '디저트', share: 18 },
      { key: 'snack', label: '분식', share: 15 },
      { key: 'bar', label: '주점', share: 14 },
    ],
    highlights: ['SNS 노출 효과가 큰 입지', '관광객 비중 25% 이상으로 평일·주말 매출 차이가 작음'],
    cautions: ['매물 교체 주기가 빠릅니다 — 평균 보증금 회수 기간 2.8년', '소음·민원 발생 빈도가 높음'],
    lat: 37.5571, lng: 126.9240, radiusM: 500,
  },
  {
    key: 'pangyo',
    name: '판교 IT 단지',
    region: '경기',
    district: '성남시 분당구',
    description:
      '국내 대형 IT 본사 밀집 지역. 평일 점심·저녁 객수가 안정적이지만 주말 매출은 약한 편.',
    footTraffic: 48000,
    avgMonthlyRentPerPyeong: 16,
    avgRightFee: 4500,
    avgDeposit: 5500,
    topCategories: [
      { key: 'cafe', label: '카페', share: 30 },
      { key: 'korean', label: '한식', share: 22 },
      { key: 'snack', label: '분식', share: 12 },
      { key: 'japanese', label: '일식', share: 11 },
    ],
    highlights: ['평일 점심 객수가 매우 안정적', '신축 상가 비율이 높아 시설 컨디션 좋음'],
    cautions: ['주말 매출이 평일의 50% 수준 — 평일 매출로 손익 맞춰야 함', '대기업 구내식당 경쟁'],
    lat: 37.3952, lng: 127.1116, radiusM: 700,
  },
  {
    key: 'songdo',
    name: '송도 신도시',
    region: '인천',
    district: '연수구 송도동',
    description:
      '아파트 단지 + 신축 상가 + 외국인 거주 비중이 높은 신도시 상권. 가족 단위 객수 강세.',
    footTraffic: 32000,
    avgMonthlyRentPerPyeong: 13,
    avgRightFee: 2800,
    avgDeposit: 4200,
    topCategories: [
      { key: 'cafe', label: '카페', share: 26 },
      { key: 'korean', label: '한식', share: 20 },
      { key: 'snack', label: '분식', share: 14 },
      { key: 'chicken', label: '치킨', share: 13 },
    ],
    highlights: ['신축 상가라 시설 추가 비용이 적음', '주거 + 직장 + 외국인 객수 균형'],
    cautions: ['평일 점심 의존도가 낮은 만큼 회전 시간이 길어짐', '신도시 특성상 상권 안정화에 1-2년'],
    lat: 37.3944, lng: 126.6528, radiusM: 800,
  },
  {
    key: 'seomyeon',
    name: '서면 상권',
    region: '부산',
    district: '부산진구',
    description: '부산 중심 상권. 1·2층 노출 좋은 매물이 인기가 많고 저녁 매출 비중이 큼.',
    footTraffic: 65000,
    avgMonthlyRentPerPyeong: 15,
    avgRightFee: 4200,
    avgDeposit: 5500,
    topCategories: [
      { key: 'bar', label: '주점', share: 24 },
      { key: 'korean', label: '한식', share: 22 },
      { key: 'cafe', label: '카페', share: 16 },
      { key: 'japanese', label: '일식', share: 13 },
    ],
    highlights: ['관광 + 현지 객수가 균형', '저녁 + 심야 객수 강세로 주점·다이닝에 유리'],
    cautions: ['주말 매출 의존도 + 시즌 변동성 큼', '인접 상권과 경쟁이 치열'],
    lat: 35.1572, lng: 129.0593, radiusM: 500,
  },
  {
    key: 'dongseongro',
    name: '동성로 상권',
    region: '대구',
    district: '중구',
    description: '대구 최대 상권. 10대-20대 객수가 많고 패션·F&B가 함께 자리잡은 곳.',
    footTraffic: 58000,
    avgMonthlyRentPerPyeong: 14,
    avgRightFee: 3800,
    avgDeposit: 5000,
    topCategories: [
      { key: 'snack', label: '분식', share: 22 },
      { key: 'cafe', label: '카페', share: 20 },
      { key: 'bar', label: '주점', share: 15 },
      { key: 'dessert', label: '디저트', share: 12 },
    ],
    highlights: ['학생 + 직장인 객수의 균형', '대구 외 지역에서도 방문하는 광역 상권'],
    cautions: ['10-20대 객수가 많아 객단가 한계가 있음', '폐점율은 평균보다 다소 높음'],
    lat: 35.8684, lng: 128.5968, radiusM: 400,
  },
  {
    key: 'chungjangro',
    name: '충장로 상권',
    region: '광주',
    district: '동구',
    description: '광주 핵심 상권. 권리금·임대료가 광주 내 가장 높지만 객수 안정성도 가장 높음.',
    footTraffic: 42000,
    avgMonthlyRentPerPyeong: 12,
    avgRightFee: 2800,
    avgDeposit: 3800,
    topCategories: [
      { key: 'cafe', label: '카페', share: 28 },
      { key: 'snack', label: '분식', share: 18 },
      { key: 'korean', label: '한식', share: 16 },
      { key: 'dessert', label: '디저트', share: 12 },
    ],
    highlights: ['광주광역시 객수의 30% 이상이 집중', '주말·평일 객수 균형이 좋음'],
    cautions: ['신축 상가가 적어 시설 보강 비용 필요', '권리금 평균이 빠르게 상승 중'],
    lat: 35.1523, lng: 126.9162, radiusM: 350,
  },
  {
    key: 'dunsan',
    name: '둔산 상권',
    region: '대전',
    district: '서구 둔산동',
    description: '대전 정부청사 + 학원가가 결합된 상권. 학생·공무원 객수가 안정적.',
    footTraffic: 38000,
    avgMonthlyRentPerPyeong: 11,
    avgRightFee: 2200,
    avgDeposit: 3200,
    topCategories: [
      { key: 'snack', label: '분식', share: 26 },
      { key: 'cafe', label: '카페', share: 22 },
      { key: 'beverage', label: '음료', share: 14 },
      { key: 'korean', label: '한식', share: 13 },
    ],
    highlights: ['학원가 + 청사 객수가 시간대별로 분산되어 회전율 좋음', '권리금이 광역 상권 중 가장 낮음'],
    cautions: ['겨울철 객수 감소', '방학 기간 매출 변동 큼'],
    lat: 36.3504, lng: 127.3846, radiusM: 500,
  },
  // ── 추가 12개 상권 ─────────────────────────────────────────────────────────
  {
    key: 'sinchon',
    name: '신촌 상권',
    region: '서울',
    district: '서대문구',
    description: '연세·이화·홍익대 인근 대학가 상권. 저녁·심야 매출 비중이 높고 방학 시즌 영향이 큽니다.',
    footTraffic: 62000,
    avgMonthlyRentPerPyeong: 16,
    avgRightFee: 4600,
    avgDeposit: 5800,
    topCategories: [
      { key: 'bar', label: '주점', share: 26 },
      { key: 'cafe', label: '카페', share: 22 },
      { key: 'snack', label: '분식', share: 16 },
      { key: 'beverage', label: '음료', share: 11 },
    ],
    highlights: ['대학생 고정 객수', '심야 2-3시까지 매출 발생'],
    cautions: ['방학 6주 동안 매출 40% 이상 감소', '홍대 상권에 젊은층 일부 이탈'],
    lat: 37.5547, lng: 126.9376, radiusM: 420,
  },
  {
    key: 'itaewon',
    name: '이태원 상권',
    region: '서울',
    district: '용산구',
    description: '외국인·관광객 비중이 높은 글로벌 상권. 이색 F&B와 바(Bar)에 강하며 이국적 콘셉트에 유리.',
    footTraffic: 51000,
    avgMonthlyRentPerPyeong: 17,
    avgRightFee: 5200,
    avgDeposit: 6000,
    topCategories: [
      { key: 'bar', label: '주점', share: 30 },
      { key: 'cafe', label: '카페', share: 18 },
      { key: 'korean', label: '한식', share: 14 },
      { key: 'japanese', label: '일식', share: 12 },
    ],
    highlights: ['외국인 객수 30% 이상 — 높은 객단가', '심야 매출 강세'],
    cautions: ['상권 등락이 크고 폐점 후 재임대 기간이 길 수 있음', '평일 낮 매출 낮음'],
    lat: 37.5345, lng: 126.9947, radiusM: 450,
  },
  {
    key: 'konkuk',
    name: '건대입구 상권',
    region: '서울',
    district: '광진구',
    description: '건국대·세종대 연계 학생 상권이지만 직장인 저녁 수요도 강합니다. 야간 매출 비중 60% 이상.',
    footTraffic: 67000,
    avgMonthlyRentPerPyeong: 16,
    avgRightFee: 4800,
    avgDeposit: 5500,
    topCategories: [
      { key: 'bar', label: '주점', share: 28 },
      { key: 'snack', label: '분식', share: 20 },
      { key: 'cafe', label: '카페', share: 18 },
      { key: 'chicken', label: '치킨', share: 14 },
    ],
    highlights: ['야간 매출 비중 업계 최고 수준', '먹자골목 집객 효과'],
    cautions: ['낮 시간 매출 비중 낮아 운영 시간 길어짐', '방학 시즌 변동'],
    lat: 37.5401, lng: 127.0701, radiusM: 400,
  },
  {
    key: 'jamsil',
    name: '잠실 상권',
    region: '서울',
    district: '송파구',
    description: '대규모 아파트 단지 + 롯데월드·스포츠 컴플렉스가 인접한 복합 상권. 주말 대규모 집객.',
    footTraffic: 78000,
    avgMonthlyRentPerPyeong: 19,
    avgRightFee: 6200,
    avgDeposit: 7800,
    topCategories: [
      { key: 'cafe', label: '카페', share: 24 },
      { key: 'korean', label: '한식', share: 20 },
      { key: 'dessert', label: '디저트', share: 16 },
      { key: 'snack', label: '분식', share: 12 },
    ],
    highlights: ['주말 이벤트 시즌 매출 급등', '가족 단위 객수로 객단가 안정'],
    cautions: ['대형 쇼핑몰 푸드코트와 직접 경쟁', '임대료 상승 가파름'],
    lat: 37.5133, lng: 127.1001, radiusM: 600,
  },
  {
    key: 'myeongdong',
    name: '명동 상권',
    region: '서울',
    district: '중구',
    description: '외국인 관광객 비중 40% 이상의 관광 특화 상권. 코스메틱·디저트·한식 중심.',
    footTraffic: 88000,
    avgMonthlyRentPerPyeong: 21,
    avgRightFee: 7800,
    avgDeposit: 8500,
    topCategories: [
      { key: 'dessert', label: '디저트', share: 28 },
      { key: 'snack', label: '분식', share: 22 },
      { key: 'cafe', label: '카페', share: 20 },
      { key: 'korean', label: '한식', share: 15 },
    ],
    highlights: ['해외 관광객 집중 — 환율 호황 시 매출 급등', '글로벌 브랜드 신규 진입 테스트 베드'],
    cautions: ['관광객 감소 시 매출 타격 크고 내국인 방문 비중 낮음', '임대료 최상위권'],
    lat: 37.5636, lng: 126.9845, radiusM: 500,
  },
  {
    key: 'seongsu',
    name: '성수동 상권',
    region: '서울',
    district: '성동구',
    description: 'MZ세대 팝업·독립 카페·프리미엄 F&B의 성지. 인스타 노출 효과와 브랜딩 가치가 높습니다.',
    footTraffic: 45000,
    avgMonthlyRentPerPyeong: 17,
    avgRightFee: 5800,
    avgDeposit: 6500,
    topCategories: [
      { key: 'cafe', label: '카페', share: 36 },
      { key: 'dessert', label: '디저트', share: 22 },
      { key: 'beverage', label: '음료', share: 16 },
      { key: 'korean', label: '한식', share: 10 },
    ],
    highlights: ['SNS 바이럴 효과로 오픈 초기 매출이 높음', '팝업 스토어 성지 — 브랜드 노출 기회'],
    cautions: ['임시 팝업 매장 경쟁으로 고정 매출 유지 어려움', '빠른 트렌드 변화'],
    lat: 37.5443, lng: 127.0561, radiusM: 500,
  },
  {
    key: 'haeundae',
    name: '해운대 상권',
    region: '부산',
    district: '해운대구',
    description: '해수욕장 + 마린시티 고급 주거가 결합된 관광·프리미엄 복합 상권. 여름 성수기 매출이 집중됩니다.',
    footTraffic: 72000,
    avgMonthlyRentPerPyeong: 18,
    avgRightFee: 5600,
    avgDeposit: 6800,
    topCategories: [
      { key: 'cafe', label: '카페', share: 30 },
      { key: 'bar', label: '주점', share: 22 },
      { key: 'korean', label: '한식', share: 18 },
      { key: 'japanese', label: '일식', share: 12 },
    ],
    highlights: ['여름 성수기 월매출 평시 대비 2-3배', '관광객 + 고소득 거주자 혼재'],
    cautions: ['비수기(11-3월) 매출 급감', '관광 상권 특성상 상권 가치 변동성'],
    lat: 35.1631, lng: 129.1636, radiusM: 600,
  },
  {
    key: 'suwon_ingye',
    name: '수원 인계동',
    region: '경기',
    district: '수원시 팔달구',
    description: '수원 최대 유흥·외식 상권. 직장인·대학생이 공존하는 안정적 저녁 상권.',
    footTraffic: 44000,
    avgMonthlyRentPerPyeong: 12,
    avgRightFee: 3200,
    avgDeposit: 4500,
    topCategories: [
      { key: 'bar', label: '주점', share: 26 },
      { key: 'korean', label: '한식', share: 22 },
      { key: 'cafe', label: '카페', share: 16 },
      { key: 'snack', label: '분식', share: 12 },
    ],
    highlights: ['수원 내 가장 높은 야간 집객', '경기도권 대도시 중 권리금 합리적'],
    cautions: ['주간 매출 약함 — 저녁 의존도 높음', '광교신도시에 일부 이탈'],
    lat: 37.2620, lng: 127.0274, radiusM: 500,
  },
  {
    key: 'jeonju_gaeksa',
    name: '전주 객사 상권',
    region: '전북',
    district: '전주시 완산구',
    description: '전주 한옥마을 인근의 관광·전통 상권. 한식·디저트 특화 매장에 유리하며 SNS 유입이 큽니다.',
    footTraffic: 36000,
    avgMonthlyRentPerPyeong: 10,
    avgRightFee: 2000,
    avgDeposit: 3000,
    topCategories: [
      { key: 'korean', label: '한식', share: 34 },
      { key: 'dessert', label: '디저트', share: 22 },
      { key: 'cafe', label: '카페', share: 18 },
      { key: 'snack', label: '분식', share: 12 },
    ],
    highlights: ['전통 인지도 + SNS 관광 트래픽', '임대료·권리금이 전국 최저 수준'],
    cautions: ['관광 시즌(봄·가을)에 집중 — 겨울 비수기 주의', '신규 브랜드보다 전통 콘셉트 강세'],
    lat: 35.8224, lng: 127.1489, radiusM: 380,
  },
  {
    key: 'ulsan_samsan',
    name: '울산 삼산 상권',
    region: '울산',
    district: '남구 삼산동',
    description: '현대차·조선업 직장인 중심의 안정적 상권. 저녁 외식·회식 수요가 꾸준합니다.',
    footTraffic: 41000,
    avgMonthlyRentPerPyeong: 11,
    avgRightFee: 2600,
    avgDeposit: 3800,
    topCategories: [
      { key: 'korean', label: '한식', share: 28 },
      { key: 'bar', label: '주점', share: 24 },
      { key: 'japanese', label: '일식', share: 16 },
      { key: 'cafe', label: '카페', share: 12 },
    ],
    highlights: ['대기업 직장인 고정 객수 — 경기 변동 영향 적음', '회식 수요로 대형 테이블 매장에 유리'],
    cautions: ['조선업 경기 하락 시 타격 가능', '주말 매출 평일 대비 낮음'],
    lat: 35.5381, lng: 129.3114, radiusM: 480,
  },
  {
    key: 'jeju_yeon',
    name: '제주 연동 상권',
    region: '제주',
    district: '제주시 연동',
    description: '제주시 최대 상권. 관광객·이주민·현지인이 고루 섞인 다층 구조. 카페·디저트 창업 수요 1위.',
    footTraffic: 39000,
    avgMonthlyRentPerPyeong: 14,
    avgRightFee: 3400,
    avgDeposit: 4500,
    topCategories: [
      { key: 'cafe', label: '카페', share: 34 },
      { key: 'dessert', label: '디저트', share: 20 },
      { key: 'beverage', label: '음료', share: 15 },
      { key: 'korean', label: '한식', share: 14 },
    ],
    highlights: ['관광+이주 수요로 연중 안정적 매출', '카페·디저트 브랜드 인지도 쌓기 최적'],
    cautions: ['성수기·비수기 매출 격차 크고 인건비 높음', '임대료 상승 속도 빠름'],
    lat: 33.4890, lng: 126.4983, radiusM: 450,
  },
  {
    key: 'daejeon_eunhaengdong',
    name: '대전 은행동',
    region: '대전',
    district: '중구 은행동',
    description: '대전 원도심 상권. 직장인·학생이 혼재하며 점심·저녁 매출이 고루 발생합니다.',
    footTraffic: 43000,
    avgMonthlyRentPerPyeong: 10,
    avgRightFee: 2400,
    avgDeposit: 3400,
    topCategories: [
      { key: 'korean', label: '한식', share: 26 },
      { key: 'cafe', label: '카페', share: 22 },
      { key: 'snack', label: '분식', share: 16 },
      { key: 'bar', label: '주점', share: 14 },
    ],
    highlights: ['점심·저녁 매출 균형이 좋아 단기 손익 맞추기 용이', '권리금·임대료 부담 낮음'],
    cautions: ['상권 성장이 정체 — 신규 트렌드 흡수가 늦음', '둔산 상권 대비 젊은 객수 약함'],
    lat: 36.3278, lng: 127.4276, radiusM: 360,
  },
]

type RawListing = Omit<MockListing, 'images'>

const RAW_LISTINGS: RawListing[] = []

// 일부 양도 매물에 양도인 메시지 부여 (자료 풍부도 향상)
const TRANSFEROR_MESSAGES: Record<string, string> = {}

const _OWN_LISTINGS: MockListing[] = RAW_LISTINGS.map((l) => ({
  ...l,
  images: listingPhotoSet(l.id, l.fitCategories),
  transferorMessage: TRANSFEROR_MESSAGES[l.id],
}))

// 외부 출처 매물(창업몰 등)은 @amakers/listings 패키지가 단일 소스로 보유.
// 더명당은 자체 매물(_OWN_LISTINGS)과 합쳐 노출한다. 새 외부 출처가 추가되면
// 패키지에만 반영하면 더명당·pchahub 등 모든 앱에 자동 동기화.
export const LISTINGS: MockListing[] = [..._OWN_LISTINGS, ...PKG_LISTINGS]

export const FEATURED_LISTINGS = LISTINGS.filter((l) => l.featured)
export const TRANSFER_LISTINGS = LISTINGS.filter((l) => l.type === 'transfer')
export const NEW_LISTINGS = LISTINGS.filter((l) => l.type === 'new')
export const SALE_LISTINGS = LISTINGS.filter((l) => l.type === 'sale')

/** Top-N popular listings by view count. */
export function popularListings(limit = 6): MockListing[] {
  return [...LISTINGS].sort((a, b) => b.viewCount - a.viewCount).slice(0, limit)
}

export function listingsByArea(areaKey: string): MockListing[] {
  return LISTINGS.filter((l) => l.areaKey === areaKey)
}
