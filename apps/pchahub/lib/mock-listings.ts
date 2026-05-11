// Mock real estate listings used on /listings and /brands/[id] detail.
// In production these would come from themyungdang's API.

import { listingPhotoSet } from './brand-images'

export interface MockListing {
  id: string
  title: string
  /** Category keys that this property would suit (matches MockBrand.category). */
  fitCategories: string[]
  region: string
  district: string
  /** 상세 도로명 주소 */
  fullAddress: string
  area: number // 평
  /** 권리금 (만원). 0 means none. */
  rightFee: number
  /** 보증금 (만원) */
  deposit: number
  /** 월세 (만원) */
  monthlyRent: number
  /** "오피스 상권", "역세권", "주거지 인근" 같은 입지 태그 */
  tags: string[]
  /** 평균 일 유동인구 (명) */
  footTraffic: number
  /** 입점 가능 시점 */
  availableFrom: string
  /** verified by themyungdang */
  verified: boolean
  /** 매물 사진 (1장 이상) */
  images: string[]
  /** 양도/임대 여부 */
  listingType: '양도' | '신규임대'
  /** 양도인 자기 소개 (양도 매물에만 있음) */
  transferorMessage?: string
  /** 이전 업종 (양도 매물) */
  previousBusiness?: string
  /** 매물 등록일 */
  listedAt: string
  /** 문의 수 */
  inquiryCount: number
}

type RawListing = Omit<MockListing, 'images' | 'fullAddress' | 'listingType' | 'transferorMessage' | 'previousBusiness' | 'listedAt' | 'inquiryCount'> & {
  fullAddress: string
  listingType: '양도' | '신규임대'
  transferorMessage?: string
  previousBusiness?: string
  listedAt: string
  inquiryCount: number
}

const RAW_LISTINGS: RawListing[] = [
  {
    id: 'l1',
    title: '판교 IT 단지 1층 코너 매물',
    fitCategories: ['cafe', 'snack', 'korean'],
    region: '경기',
    district: '성남시 분당구',
    fullAddress: '경기도 성남시 분당구 판교역로 152, 1층 코너',
    area: 14,
    rightFee: 3500,
    deposit: 5000,
    monthlyRent: 280,
    tags: ['오피스 상권', '코너', '1층', '신축'],
    footTraffic: 4800,
    availableFrom: '2026-06-01',
    verified: true,
    listingType: '신규임대',
    listedAt: '2026-04-22',
    inquiryCount: 18,
  },
  {
    id: 'l2',
    title: '강남역 도보 5분 2층 매물',
    fitCategories: ['chicken', 'bar', 'korean'],
    region: '서울',
    district: '강남구',
    fullAddress: '서울특별시 강남구 강남대로 396, 2층',
    area: 28,
    rightFee: 7000,
    deposit: 8000,
    monthlyRent: 520,
    tags: ['역세권', '대로변', '2층'],
    footTraffic: 9200,
    availableFrom: '2026-05-20',
    verified: true,
    listingType: '양도',
    transferorMessage: '7년 동안 운영했던 매장이며 단골 비중이 60% 이상입니다. 본사 협의 후 동종업종 인수 시 권리금 협상 가능.',
    previousBusiness: '치킨호프',
    listedAt: '2026-04-10',
    inquiryCount: 42,
  },
  {
    id: 'l3',
    title: '연남동 골목 카페 자리 (양도)',
    fitCategories: ['cafe', 'dessert', 'beverage'],
    region: '서울',
    district: '마포구',
    fullAddress: '서울특별시 마포구 동교로 250-15, 1층',
    area: 12,
    rightFee: 2500,
    deposit: 4000,
    monthlyRent: 230,
    tags: ['SNS 상권', '주거지 인근', '인테리어 양호'],
    footTraffic: 3200,
    availableFrom: '2026-05-15',
    verified: true,
    listingType: '양도',
    transferorMessage: '개인 사정으로 양도합니다. 인테리어 1년차로 깨끗하고 주방 설비 대부분 그대로 사용 가능합니다.',
    previousBusiness: '스페셜티 카페',
    listedAt: '2026-04-18',
    inquiryCount: 27,
  },
  {
    id: 'l4',
    title: '해운대 신축 상가 1층',
    fitCategories: ['cafe', 'dessert', 'beverage', 'snack'],
    region: '부산',
    district: '해운대구',
    fullAddress: '부산광역시 해운대구 해운대해변로 144, 1층',
    area: 22,
    rightFee: 0,
    deposit: 6000,
    monthlyRent: 380,
    tags: ['신축', '관광 상권', '1층'],
    footTraffic: 5600,
    availableFrom: '2026-07-01',
    verified: true,
    listingType: '신규임대',
    listedAt: '2026-04-05',
    inquiryCount: 35,
  },
  {
    id: 'l5',
    title: '대전 둔산동 학원가 매물',
    fitCategories: ['snack', 'dessert', 'beverage', 'cafe'],
    region: '대전',
    district: '서구 둔산동',
    fullAddress: '대전광역시 서구 둔산로 100, 1층',
    area: 16,
    rightFee: 1800,
    deposit: 3500,
    monthlyRent: 180,
    tags: ['학원가', '학생 상권'],
    footTraffic: 2800,
    availableFrom: '2026-06-10',
    verified: true,
    listingType: '양도',
    transferorMessage: '학원가 한복판에 위치하여 학생 손님이 꾸준합니다. 본사 협의 후 동일 업종도 무리없이 운영 가능.',
    previousBusiness: '분식',
    listedAt: '2026-04-25',
    inquiryCount: 14,
  },
  {
    id: 'l6',
    title: '인천 송도 신도시 코너 매물',
    fitCategories: ['chicken', 'korean', 'japanese'],
    region: '경기',
    district: '인천 연수구 송도동',
    fullAddress: '인천광역시 연수구 송도과학로 16, 1층 코너',
    area: 32,
    rightFee: 4200,
    deposit: 7000,
    monthlyRent: 420,
    tags: ['신도시', '코너', '대형 아파트 단지'],
    footTraffic: 5100,
    availableFrom: '2026-06-20',
    verified: true,
    listingType: '양도',
    transferorMessage: '아파트 단지 코너로 가족 단위 손님이 많습니다. 주방 시설 추가 투자 없이 인수 가능.',
    previousBusiness: '한식',
    listedAt: '2026-04-12',
    inquiryCount: 31,
  },
  {
    id: 'l7',
    title: '대구 동성로 1.5층 매물 (양도)',
    fitCategories: ['bar', 'korean', 'japanese'],
    region: '대구',
    district: '중구 동성로',
    fullAddress: '대구광역시 중구 동성로 12, 1.5층',
    area: 26,
    rightFee: 5500,
    deposit: 6000,
    monthlyRent: 350,
    tags: ['상권 중심', '1.5층', '인테리어 가능'],
    footTraffic: 7400,
    availableFrom: '2026-06-01',
    verified: true,
    listingType: '양도',
    transferorMessage: '동성로 한복판 1.5층 자리로 야간 상권이 강합니다. 주점·라멘 등 야간 운영에 적합.',
    previousBusiness: '주점',
    listedAt: '2026-04-08',
    inquiryCount: 52,
  },
  {
    id: 'l8',
    title: '서울 영등포 오피스 빌딩 지하 1층',
    fitCategories: ['korean', 'japanese', 'snack', 'cafe'],
    region: '서울',
    district: '영등포구',
    fullAddress: '서울특별시 영등포구 여의대로 24, 지하 1층',
    area: 24,
    rightFee: 3000,
    deposit: 5500,
    monthlyRent: 310,
    tags: ['오피스 상권', '지하 1층', '직장인 점심'],
    footTraffic: 4400,
    availableFrom: '2026-05-25',
    verified: true,
    listingType: '양도',
    transferorMessage: '오피스 빌딩 푸드코트 자리로 점심 매출이 안정적이며 평일 영업만으로 충분히 손익이 맞습니다.',
    previousBusiness: '한식',
    listedAt: '2026-04-20',
    inquiryCount: 23,
  },
  {
    id: 'l9',
    title: '광주 충장로 골목 코너 매물',
    fitCategories: ['cafe', 'dessert', 'snack'],
    region: '광주',
    district: '동구 충장로',
    fullAddress: '광주광역시 동구 충장로 35-7, 1층 코너',
    area: 15,
    rightFee: 1500,
    deposit: 3000,
    monthlyRent: 170,
    tags: ['상권 중심', '코너', '인테리어 양호'],
    footTraffic: 3800,
    availableFrom: '2026-06-05',
    verified: true,
    listingType: '양도',
    transferorMessage: '청년층 핫플레이스 골목 코너 자리입니다. SNS 노출 잘 되는 위치.',
    previousBusiness: '디저트 카페',
    listedAt: '2026-04-15',
    inquiryCount: 19,
  },
  {
    id: 'l10',
    title: '울산 삼산동 신축 상가',
    fitCategories: ['chicken', 'korean', 'snack'],
    region: '울산',
    district: '남구 삼산동',
    fullAddress: '울산광역시 남구 삼산로 200, 1층',
    area: 30,
    rightFee: 0,
    deposit: 6500,
    monthlyRent: 360,
    tags: ['신축', '상권 중심', '주차 가능'],
    footTraffic: 4200,
    availableFrom: '2026-07-15',
    verified: true,
    listingType: '신규임대',
    listedAt: '2026-04-30',
    inquiryCount: 11,
  },
]

export const LISTINGS: MockListing[] = RAW_LISTINGS.map((l) => ({
  ...l,
  images: listingPhotoSet(l.id),
}))

/** Pick 3-5 listings appropriate for a given brand category. */
export function listingsForCategory(category: string, limit = 4): MockListing[] {
  return LISTINGS.filter((l) => l.fitCategories.includes(category)).slice(0, limit)
}

export function listingById(id: string): MockListing | undefined {
  return LISTINGS.find((l) => l.id === id)
}
