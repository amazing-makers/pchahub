// 매물 데이터 단일 소스 — 모든 amakers 앱이 이 타입을 공유.
//
// 데이터 본체는 더명당(themyungdang)이 운영·관리.
// 다른 앱(pchahub 등)은 이 패키지를 import해 동일 데이터를 노출한다.

export type ListingType = 'transfer' | 'new' | 'sale'

export interface MockListing {
  id: string
  type: ListingType
  title: string
  status: 'active' | 'pending' | 'completed'
  region: string
  district: string
  fullAddress: string
  /** 상권 키 (themyungdang AREAS와 매칭). 없으면 상권 페이지 매핑 안 됨. */
  areaKey?: string
  /** 면적 (평). 0이면 정보 없음. */
  area: number
  floor: string
  buildingType: string
  /** 권리금 (만원). undefined=정보 없음, 0=없음 명시. */
  rightFee?: number
  /** 보증금 (만원). 0이면 정보 없음(외부 출처) 또는 sale 매물. */
  deposit: number
  /** 월세 (만원). 0이면 정보 없음 또는 sale 매물. */
  monthlyRent: number
  /** 매각가 (만원). sale 매물에만 있음. */
  salePrice?: number
  fitCategories: string[]
  currentBusiness?: string
  monthlyRevenue?: number
  revenueVerified?: boolean
  tags: string[]
  footTraffic: number
  availableFrom: string
  verified: boolean
  featured: boolean
  viewCount: number
  inquiryCount: number
  createdAt: string
  ownerType: 'direct' | 'agent'
  agencyName?: string
  /** 사진 배열. 경로는 상대 path(`/listings/cm{id}/{n}.jpg`)로 저장.
   *  더명당 도메인 외에서 노출 시 listingImageUrl() 헬퍼로 절대 URL 변환. */
  images: string[]
  /** 양도인/중개사 한 마디. */
  transferorMessage?: string
  /** 컬러 placeholder (fallback). */
  imageColors: string[]
  /** WGS84 좌표 — 지도 핀 표시용. */
  lat?: number
  lng?: number
  /** 연락처 (표시용). */
  contactPhone?: string
  /** 외부 출처 매물 메타 — 자체 등록은 비움. */
  externalSource?: {
    name: string
    label: string
    sourceId: string
    url: string
    fetchedAt: string
  }
}

// 외부 출처 raw JSON(scrape-changupmall 출력 등)
export interface ExternalListingRaw {
  sourceId: string
  url: string
  title: string
  type: ListingType
  region: string
  district: string
  fullAddress: string
  area: number
  rawSize: string
  rawIndustry: string
  rightFee?: number
  monthlyRevenue?: number
  monthlyExpense?: number
  monthlyProfit?: number
  fitCategories: string[]
  currentBusiness: string
  photos: string[]
}

export interface ExternalListingsJson {
  source: string
  label: string
  fetchedAt: string
  listings: ExternalListingRaw[]
}
