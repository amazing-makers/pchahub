import { ImageIcon } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import { CATEGORIES, contractorById, type MockPortfolioItem } from '@/lib/mock-data'

interface PortfolioCardProps {
  item: MockPortfolioItem
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const cat = CATEGORIES.find((c) => c.key === item.category)
  const contractor = contractorById(item.contractorId)

  return (
    <a href={`/gallery/${item.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${item.imageColors[0]}, ${item.imageColors[1] ?? item.imageColors[0]}, ${item.imageColors[2] ?? item.imageColors[0]})`,
            }}
            aria-hidden
          >
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              {cat && (
                <Badge variant="default" className="bg-white/90 text-gray-900">
                  {cat.label}
                </Badge>
              )}
              {item.featured && <Badge variant="warning">대표 사례</Badge>}
            </div>
            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
              <ImageIcon className="h-3 w-3" />
              {item.imageCount}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-gray-600">{item.excerpt}</p>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{item.area}평 · {item.durationDays}일</span>
              <span className="font-semibold text-gray-700">{formatNumber(item.budget)}만</span>
            </div>
            {contractor && (
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
                <span
                  className="h-3 w-3 shrink-0 rounded"
                  style={{ background: contractor.brandColor }}
                  aria-hidden
                />
                {contractor.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
