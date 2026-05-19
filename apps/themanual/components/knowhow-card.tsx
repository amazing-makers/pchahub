import { Clock, Eye, Lock, BookOpen } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import {
  KNOWHOW_CATEGORY_LABEL,
  KNOWHOW_CATEGORY_EMOJI,
  type KnowhowItem,
} from '@/lib/knowhow'

interface KnowhowCardProps {
  item: KnowhowItem
  featured?: boolean
}

export function KnowhowCard({ item, featured = false }: KnowhowCardProps) {
  const freeLabel = !item.premium
  const priceLabel = item.premium
    ? `₩${item.price.toLocaleString()}`
    : '무료'

  return (
    <a href={`/knowhow/${item.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          {/* Hero image */}
          <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.heroImage}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/50" />

            {/* Category badge */}
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-900">
                {KNOWHOW_CATEGORY_EMOJI[item.category]} {KNOWHOW_CATEGORY_LABEL[item.category]}
              </span>
            </div>

            {/* Featured badge */}
            {featured && (
              <div className="absolute right-3 top-3">
                <Badge variant="warning">추천</Badge>
              </div>
            )}

            {/* Price pill */}
            <div
              className={`absolute bottom-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                freeLabel
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-[var(--brand-primary)]/90 text-white'
              }`}
            >
              {item.premium ? <Lock className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
              {priceLabel}
            </div>
          </div>

          <div className="p-4">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
              {item.title}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">{item.subtitle}</p>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">{item.excerpt}</p>

            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.readTime}분 읽기
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-gray-400">
                <Eye className="h-3 w-3" />
                {item.viewCount.toLocaleString()}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
              <span>by {item.author.split(' ')[0]}</span>
              <span>{item.sections.length}개 섹션</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
