import { Clock } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatRelativeTime } from '@amakers/utils'
import type { MockArticle } from '@/lib/mock-data'

interface ArticleCardProps {
  article: MockArticle
  compact?: boolean
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return (
    <a href={`/magazine/${article.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className={'relative w-full overflow-hidden bg-gray-100 ' + (compact ? 'h-28' : 'h-44')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute left-3 top-3">
              <Badge variant="default" className="bg-white/95 text-gray-900">
                {article.category}
              </Badge>
            </div>
          </div>

          <div className="p-5">
            <h3 className="line-clamp-2 text-base font-bold text-gray-900">{article.title}</h3>
            {!compact && (
              <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>
            )}

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="h-6 w-6 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
              <span className="truncate">{article.authorName}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime}분
              </span>
              <span>·</span>
              <span className="truncate">{formatRelativeTime(article.publishedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
