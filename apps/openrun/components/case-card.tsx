import { ArrowUpRight } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import type { MockPortfolioCase } from '@/lib/mock-data'

interface CaseCardProps {
  case: MockPortfolioCase
}

export function CaseCard({ case: c }: CaseCardProps) {
  return (
    <a href={`/portfolio/${c.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div
            className="relative h-36 w-full"
            style={{
              background: `linear-gradient(135deg, ${c.imageColors[0]}, ${c.imageColors[1] ?? c.imageColors[0]})`,
            }}
            aria-hidden
          >
            <div className="absolute left-4 top-4 flex flex-wrap gap-1">
              <Badge variant="default" className="bg-white/90 text-gray-900">
                {c.serviceLabel}
              </Badge>
              {c.featured && (
                <Badge variant="warning">대표 사례</Badge>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="text-white">
                <div className="text-xs opacity-80">{c.client}</div>
                <div className="text-sm font-semibold">{c.industry} · {c.region}</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-white opacity-80 group-hover:opacity-100" />
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-base font-bold text-gray-900 line-clamp-2">{c.title}</h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{c.hook}</p>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs">
              {c.metrics.slice(0, 2).map((m) => (
                <div key={m.label}>
                  <div className="text-gray-500">{m.label}</div>
                  <div className="mt-0.5 font-bold text-gray-900">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 inline-flex items-center gap-1 text-xs text-gray-500">
              {c.duration} · {c.startedAt}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
