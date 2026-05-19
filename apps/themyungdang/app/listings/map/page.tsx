import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'
import { LISTINGS } from '@/lib/mock-data'
import MapSearchClient from '@/components/map-search-client'

export const metadata: Metadata = buildPageMetadata('themyungdang', {
  title: '지도로 매물 검색',
  description: '지도를 이동하며 원하는 위치의 양도·임대·매각 매물을 찾아보세요. 전국 상권별 매물을 한눈에 확인하세요.',
  path: '/listings/map',
})

export default function MapSearchPage() {
  return <MapSearchClient allListings={LISTINGS} />
}
