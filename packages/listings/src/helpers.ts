import type { MockListing, ListingType } from './types'

/** 진짜 매장 사진을 가진 매물인지 — placeholder만 있는 매물 식별용. */
export function hasRealPhoto(listing: MockListing): boolean {
  const first = listing.images[0]
  if (!first) return false
  return first.startsWith('/listings/') || first.startsWith('/api/img-proxy') || first.startsWith('http')
}

/** 카테고리 매칭 매물 top N (브랜드 카테고리 → 추천 매물). */
export function listingsByCategory(
  listings: MockListing[],
  category: string,
  limit = 4,
): MockListing[] {
  return listings.filter((l) => l.fitCategories.includes(category)).slice(0, limit)
}

/** 인기 매물 — viewCount 기준 (없으면 등록일 신순). */
export function popularListings(listings: MockListing[], limit = 6): MockListing[] {
  return [...listings]
    .sort((a, b) => {
      if (a.viewCount !== b.viewCount) return b.viewCount - a.viewCount
      return b.createdAt.localeCompare(a.createdAt)
    })
    .slice(0, limit)
}

/** 거래 형태별 필터. */
export function listingsByType(listings: MockListing[], type: ListingType): MockListing[] {
  return listings.filter((l) => l.type === type)
}

/** ID로 찾기. */
export function listingById(listings: MockListing[], id: string): MockListing | undefined {
  return listings.find((l) => l.id === id)
}
