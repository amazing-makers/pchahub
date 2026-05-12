import type { Metadata } from 'next'
import { LISTINGS } from '@/lib/mock-data'
import MapSearchClient from '@/components/map-search-client'

export const metadata: Metadata = {
  title: '지도로 매물 검색 — 더명당',
  description: '지도를 이동하며 원하는 위치의 양도·임대·매각 매물을 찾아보세요.',
}

export default function MapSearchPage() {
  return <MapSearchClient allListings={LISTINGS} />
}
