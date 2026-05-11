import { Card, CardContent } from '@amakers/ui'
import { RankingList } from '@/components/ranking-list'
import {
  newestStores,
  STORES,
  topStoresByRating,
  topStoresByVisitors,
} from '@/lib/mock-data'

export default function RankingsPage() {
  const topRated = topStoresByRating(10)
  const topVisitors = topStoresByVisitors(10)
  const newOpen = newestStores(10)
  const topReviewed = [...STORES].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 10)

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
