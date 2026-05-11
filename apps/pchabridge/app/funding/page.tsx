import { RoundCard } from '@/components/round-card'
import { ROUNDS } from '@/lib/mock-data'

export default function FundingPage() {
  const fund = ROUNDS.filter((r) => r.type === 'store-fund' || r.type === 'crowd')

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">다점포 펀딩 + 크라우드</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            본사 직영점 2 ~ 5개 동시 오픈에 자금 참여하거나, 30만원부터 시작하는 크라우드펀딩.
            소액 투자자 대상.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        {fund.length === 0 ? (
          <p className="text-center text-sm text-gray-500">현재 모집 중인 라운드가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fund.map((r) => (
              <RoundCard key={r.id} round={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
