import { CheckCircle2, Star } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { CATEGORIES, type MockContractor } from '@/lib/mock-data'
import { CompareToggleButton } from '@/components/compare-toggle-button'

interface ContractorCardProps {
  contractor: MockContractor
  showCompare?: boolean
}

export function ContractorCard({ contractor: c, showCompare }: ContractorCardProps) {
  return (
    <div className="group relative h-full">
      <a href={`/contractors/${c.id}`} className="block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-32 w-full overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.heroImage}
            alt={`${c.name} 시공 스튜디오`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
          {c.featured && (
            <Badge variant="warning" className="absolute right-2 top-2">
              추천
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div
              className="-mt-9 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-white text-base font-bold text-white shadow-sm"
              style={{ background: c.brandColor }}
            >
              {c.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-gray-900">{c.name}</h3>
                {c.verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-label="인증 시공사" />
                )}
              </div>
              <div className="mt-0.5 text-xs text-gray-500">
                {c.region} · {c.foundedYear}년 설립 · {c.projectCount}건
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-gray-700">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{c.rating}</span>
                  <span className="text-gray-400">({c.reviewCount})</span>
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-gray-700">{c.tagline}</p>

          <div className="mt-3 flex flex-wrap gap-1">
            {c.specialties.slice(0, 3).map((s) => {
              const cat = CATEGORIES.find((x) => x.key === s)
              return (
                <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  {cat?.label ?? s}
                </span>
              )
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs">
            <div>
              <div className="text-gray-500">평당 단가</div>
              <div className="mt-0.5 font-semibold text-gray-900">{c.avgPricePerPyeong}만원</div>
            </div>
            <div>
              <div className="text-gray-500">예산 범위</div>
              <div className="mt-0.5 font-semibold text-gray-900 truncate">{c.budgetRange}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      </a>
      {showCompare && (
        <div className="absolute bottom-3 right-3 z-10">
          <CompareToggleButton contractorId={c.id} contractorName={c.name} />
        </div>
      )}
    </div>
  )
}
