import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('bestplace', {
  title: '실시간 랭킹',
  description: '방문객·평점·리뷰 수 기준 전국 프랜차이즈 매장 실시간 랭킹.',
  path: '/rankings',
})

import { Card, CardContent } from '@amakers/ui'
import { RankingList } from '@/components/ranking-list'
import {
  newestStores,
  STORES,
  topStoresByRating,
  topStoresByVisitors,
  brandById,
} from '@/lib/mock-data'

export default function RankingsPage() {
  const topRated = topStoresByRating(10)
  const topVisitors = topStoresByVisitors(10)
  const newOpen = newestStores(10)
  const topReviewed = [...STORES].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 10)

  // #1 store by rating for Hall of Fame callout
  const hallOfFameStore = topRated[0]
  const hallOfFameBrand = hallOfFameStore ? brandById(hallOfFameStore.brandId) : undefined

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">실시간 매장 랭킹</h1>
          <p className="mt-1 text-sm text-gray-500">
            평점·방문객·리뷰·신규 오픈 4가지 축으로 매주 업데이트되는 랭킹.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {hallOfFameStore && (
          <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 shadow-md">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <div className="text-4xl">🏆</div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-900">
                  명예의 전당 · 이번 주 종합 1위
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">{hallOfFameStore.name}</h2>
                <p className="mt-0.5 text-sm text-amber-100">
                  {hallOfFameBrand?.categoryLabel} · {hallOfFameStore.region} {hallOfFameStore.district}
                  &nbsp;·&nbsp;평점 ⭐ {hallOfFameStore.rating}
                  &nbsp;·&nbsp;리뷰 {hallOfFameStore.reviewCount.toLocaleString()}건
                </p>
              </div>
              <a
                href={`/stores/${hallOfFameStore.id}`}
                className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 shadow-sm transition-colors hover:bg-amber-50"
              >
                매장 보기 →
              </a>
            </div>
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RankingList stores={topRated} metric="rating" title="평점 Top 10" />
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RankingList stores={topVisitors} metric="visitors" title="월 방문객 Top 10" />
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RankingList stores={topReviewed} metric="rating" title="리뷰 많은 매장 Top 10" />
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RankingList stores={newOpen} metric="visitors" title="신규 오픈 매장 Top 10" />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardContent className="p-5 text-sm">
            <div className="font-semibold text-amber-900">랭킹 산정 방식</div>
            <p className="mt-1 text-amber-800">
              실시간 랭킹은 매장의 평점·리뷰 수·방문객·운영 안정성을 가중 합산해 매주 갱신됩니다.
              어워드는 연 1회 amakers 선정위원회가 별도 기준으로 시상합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
