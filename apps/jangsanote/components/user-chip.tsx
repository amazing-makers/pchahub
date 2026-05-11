import { Badge as VerifiedBadge, Building2, Shield, Star } from 'lucide-react'
import type { MockUser } from '@/lib/mock-data'

interface UserChipProps {
  user: MockUser | undefined
  /** Show "익명" instead of handle. */
  anonymous?: boolean
  size?: 'sm' | 'md'
}

export function UserChip({ user, anonymous = false, size = 'md' }: UserChipProps) {
  if (!user || anonymous) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={
            'flex shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500 ' +
            (size === 'sm' ? 'h-6 w-6' : 'h-8 w-8')
          }
          aria-hidden
        >
          ?
        </div>
        <div>
          <div className={size === 'sm' ? 'text-xs' : 'text-sm'}>익명</div>
        </div>
      </div>
    )
  }

  const Icon =
    user.badge === 'expert'
      ? Star
      : user.badge === 'hq'
        ? Building2
        : user.badge === 'verified'
          ? Shield
          : null

  return (
    <div className="flex items-center gap-2">
      <div
        className={
          'relative shrink-0 overflow-hidden rounded-full bg-gray-100 ' +
          (size === 'sm' ? 'h-6 w-6' : 'h-9 w-9')
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatarUrl}
          alt={user.handle}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <div className={'flex items-center gap-1 ' + (size === 'sm' ? 'text-xs' : 'text-sm')}>
          <span className="font-medium text-gray-900">{user.handle}</span>
          {Icon && (
            <Icon
              className={
                'h-3 w-3 ' +
                (user.badge === 'expert'
                  ? 'fill-amber-400 text-amber-400'
                  : user.badge === 'hq'
                    ? 'text-blue-500'
                    : 'text-emerald-500')
              }
              aria-label={user.badge ?? undefined}
            />
          )}
        </div>
        {size !== 'sm' && <div className="text-xs text-gray-500">{user.role}</div>}
      </div>
    </div>
  )
}
