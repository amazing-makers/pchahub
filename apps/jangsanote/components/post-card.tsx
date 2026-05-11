import { Eye, MessageSquare, Pin, ThumbsUp } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber, formatRelativeTime } from '@amakers/utils'
import {
  CATEGORY_LABEL,
  channelLabel,
  userById,
  type MockPost,
} from '@/lib/mock-data'
import { UserChip } from './user-chip'

interface PostCardProps {
  post: MockPost
}

export function PostCard({ post }: PostCardProps) {
  const author = userById(post.authorId)
  const channelName = channelLabel(post.channelType, post.channelKey)
  const channelHref =
    post.channelType === 'general'
      ? '/general'
      : post.channelType === 'category'
        ? `/categories/${post.channelKey}`
        : `/regions/${post.channelKey}`

  return (
    <Card className="overflow-hidden border-gray-200 transition-shadow hover:shadow-sm">
      <CardContent className={post.heroImage ? 'p-0' : 'p-5'}>
        {post.heroImage && (
          <a href={`/posts/${post.id}`} className="block">
            <div className="relative h-44 w-full overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.heroImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </a>
        )}
        <div className={post.heroImage ? 'p-5' : ''}>
        <div className="flex items-center justify-between gap-2">
          <a
            href={channelHref}
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900"
          >
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
              {channelName}
            </span>
            <span>·</span>
            <span>{CATEGORY_LABEL[post.category]}</span>
          </a>
          {post.pinned && (
            <Badge variant="warning" className="gap-0.5">
              <Pin className="h-3 w-3" />
              고정
            </Badge>
          )}
        </div>

        <a href={`/posts/${post.id}`} className="mt-3 block">
          <h3 className="text-base font-bold text-gray-900 hover:text-[var(--brand-primary)]">
            {post.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
        </a>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
          <UserChip user={author} anonymous={post.anonymous} size="sm" />
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(post.views)}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {formatNumber(post.likes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {post.commentCount}
            </span>
            <span className="hidden text-gray-400 sm:inline">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  )
}
