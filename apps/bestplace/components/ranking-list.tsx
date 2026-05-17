import { Star, Users } from 'lucide-react'
import { formatNumber } from '@amakers/utils'
import { brandById, type MockStore } from '@/lib/mock-data'

interface RankingListProps {
  stores: MockStore[]
  /** What metric is being ranked. */
  metric: 'rating' | 'visitors'
  title: string
}

export function RankingList({ stores, metric, title }: RankingListProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <ol className="space-y-2">
        {stores.map((s, i) => {
          const brand = brandById(s.brandId)
          const isTop3 = i < 3
          return (
            <li key={s.id}>
              <a
                href={`/stores/${s.id}`}
                className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 transition-colors hover:border-amber-400"
              >
                <span
                  className={
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold ' +
                    (i === 0
                      ? 'bg-amber-400 text-white'
                      : i === 1
                        ? 'bg-gray-400 text-white'
                        : i === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-gray-100 text-gray-700')
                  }
                >
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                {brand && (
                  <span
                    className="h-8 w-8 shrink-0 rounded-md"
                    style={{ background: brand.logoColor }}
                    aria-hidden
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-900">{s.name}</div>
                  <div className="truncate text-xs text-gray-500">
                    {brand?.categoryLabel} · {s.region} {s.district}
                  </div>
                </div>
                <div className={'text-right text-xs ' + (isTop3 ? 'font-bold text-amber-600' : 'text-gray-700')}>
                  {metric === 'rating' ? (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {s.rating}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {formatNumber(s.monthlyVisitors)}
                    </span>
                  )}
                </div>
              </a>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
