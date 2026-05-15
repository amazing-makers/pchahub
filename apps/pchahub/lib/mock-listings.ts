// 매물 데이터는 @amakers/listings 패키지가 단일 소스로 보유 (더명당이 본가).
// pchahub은 패키지에서 직접 import해 동일 매물을 노출. 더명당에서 매물이
// 업데이트되면 패키지 빌드만 다시 하면 자동 반영.
//
// pchahub의 MockListing 인터페이스는 themyungdang과 약간 달라(listingType
// 한국어, fullAddress·images 필수 등) 변환 함수 toLocalListing()으로 매핑.

import {
  LISTINGS as PKG_LISTINGS,
  listingImageUrl,
  type MockListing as PkgMockListing,
} from '@amakers/listings'

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
  /** 외부 출처 매물 메타 — 자체 매물이면 비움. */
  externalSource?: PkgMockListing['externalSource']
}

const LISTING_TYPE_MAP: Record<PkgMockListing['type'], MockListing['listingType']> = {
  transfer: '양도',
  new: '신규임대',
  sale: '양도', // pchahub은 sale 카테고리 미사용 — 양도로 fallback
}

function toLocalListing(p: PkgMockListing): MockListing {
  return {
    id: p.id,
    title: p.title,
    fitCategories: p.fitCategories,
    region: p.region,
    district: p.district,
    fullAddress: p.fullAddress,
    area: p.area,
    rightFee: p.rightFee ?? 0,
    deposit: p.deposit,
    monthlyRent: p.monthlyRent,
    tags: p.tags,
    footTraffic: p.footTraffic,
    availableFrom: p.availableFrom,
    verified: p.verified,
    // 사진 절대 URL로 변환 (NEXT_PUBLIC_LISTINGS_HOST 환경변수 활용)
    images: p.images.map(listingImageUrl),
    listingType: LISTING_TYPE_MAP[p.type],
    transferorMessage: p.transferorMessage,
    previousBusiness: p.currentBusiness,
    listedAt: p.createdAt,
    inquiryCount: p.inquiryCount,
    externalSource: p.externalSource,
  }
}

export const LISTINGS: MockListing[] = PKG_LISTINGS.map(toLocalListing)

/** Pick 3-5 listings appropriate for a given brand category. */
export function listingsForCategory(category: string, limit = 4): MockListing[] {
  return LISTINGS.filter((l) => l.fitCategories.includes(category)).slice(0, limit)
}

export function listingById(id: string): MockListing | undefined {
  return LISTINGS.find((l) => l.id === id)
}
