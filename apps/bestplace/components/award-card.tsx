import { Award, Trophy } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import { brandById, RANK_COLOR, RANK_LABEL, storeById, type MockAward } from '@/lib/mock-data'

interface AwardCardProps {
  award: MockAward
  /** Compact mode (used on the brand sidebar in award list pages) */
  compact?: boolean
}

export function AwardCard({ award, compact = false }: AwardCardProps) {
  const brand = brandById(award.brandId)
  const store = award.representativeStoreId ? storeById(award.representativeStoreId) : undefined
  const rankColor = RANK_COLOR[award.rank]

  return (
    <Card className="h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div
          className="flex items-center justify-between px-5 py-3 text-white"
          style={{ background: rankColor }}
        >
          <div className="inline-flex items-center gap-2 text-sm font-bold">
            <Trophy className="h-4 w-4" />
            {award.year} 베스트 {award.categoryLabel} · {RANK_LABEL[award.rank]}
          </div>
          <div className="text-xs">#{award.rank}</div>
        </div>

        <div className={compact ? 'p-4' : 'p-5'}>
          <div className="flex items-start gap-3">
            {brand && (
              <span
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ background: brand.logoColor }}
                aria-hidden
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-gray-900">{brand?.name ?? '브랜드'}</h3>
              {store && (
                <a
                  href={`/stores/${store.id}`}
                  className="mt-0.5 inline-block text-xs text-gray-500 hover:text-gray-900"
                >
                  대표 매장 · {store.name}
                </a>
              )}
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-700">{award.citation}</p>

          {!compact && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3 text-xs">
              <a
                href={`https://pchahub.kr/brands/${award.brandId}`}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                브랜드 정보 (프차허브) →
              </a>
              {store && (
                <a
                  href={`/stores/${store.id}`}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                >
                  대표 매장 보기 <Award className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
