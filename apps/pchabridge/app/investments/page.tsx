import { RoundCard } from '@/components/round-card'
import { ROUND_TYPE_LABEL, ROUNDS, type RoundType } from '@/lib/mock-data'

interface InvestmentsPageProps {
  searchParams: { type?: string; status?: string }
}

export default function InvestmentsPage({ searchParams }: InvestmentsPageProps) {
  const { type, status = 'open' } = searchParams
  let rounds = ROUNDS.slice()
  if (status === 'open') rounds = rounds.filter((r) => r.status === 'open' || r.status === 'closing-soon')
  if (status === 'completed') rounds = rounds.filter((r) => r.status === 'completed')
  if (type) rounds = rounds.filter((r) => r.type === type)

  const TYPES: Array<RoundType | ''> = ['', 'seed', 'series-a', 'series-b', 'crowd', 'store-fund']

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">투자 라운드</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Seed부터 Series B, 다점포 펀딩, 크라우드까지. 모집 중·임박·완료 라운드 모두 확인.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <a
                key={t || 'all'}
                href={t ? `/investments?type=${t}&status=${status}` : `/investments?status=${status}`}
                className={
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                  ((!t && !type) || type === t
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                }
              >
                {t === '' ? '전체 유형' : ROUND_TYPE_LABEL[t]}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">{rounds.length}건</div>
          <div className="flex gap-2 text-sm">
            {[
              { key: 'open', label: '모집 중' },
              { key: 'completed', label: '완료' },
              { key: 'all', label: '전체' },
            ].map((s) => (
              <a
                key={s.key}
                href={type ? `/investments?type=${type}&status=${s.key}` : `/investments?status=${s.key}`}
                className={
                  'rounded-md px-2 py-1 transition-colors ' +
                  (status === s.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100')
                }
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rounds.map((r) => (
            <RoundCard key={r.id} round={r} />
          ))}
        </div>
      </div>
    </main>
  )
}
