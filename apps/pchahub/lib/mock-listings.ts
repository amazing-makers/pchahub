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

const RAW_LISTINGS: RawListing[] = []

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
