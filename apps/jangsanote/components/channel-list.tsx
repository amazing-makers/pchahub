import { Hash, MapPin, Users } from 'lucide-react'
import { CHANNELS, type ChannelType } from '@/lib/mock-data'

interface ChannelListProps {
  /** Highlight an active channel (current page). */
  activeChannel?: { type: ChannelType; key: string }
}

export function ChannelList({ activeChannel }: ChannelListProps) {
  const categories = CHANNELS.filter((c) => c.type === 'category')
  const regions = CHANNELS.filter((c) => c.type === 'region')
  const general = CHANNELS.filter((c) => c.type === 'general')

  return (
    <div className="space-y-5">
      <Section title="업종방" icon={Hash}>
        {categories.map((c) => (
          <ChannelItem
            key={c.key}
            href={`/categories/${c.key}`}
            label={c.label}
            count={c.postCount}
            active={activeChannel?.type === 'category' && activeChannel.key === c.key}
          />
        ))}
      </Section>
      <Section title="지역방" icon={MapPin}>
        {regions.map((c) => (
          <ChannelItem
            key={c.key}
            href={`/regions/${c.key}`}
            label={c.label}
            count={c.postCount}
            active={activeChannel?.type === 'region' && activeChannel.key === c.key}
          />
        ))}
      </Section>
      <Section title="자유" icon={Users}>
        {general.map((c) => (
          <ChannelItem
            key={c.key}
            href="/general"
            label={c.label}
            count={c.postCount}
            active={activeChannel?.type === 'general' && activeChannel.key === c.key}
          />
        ))}
      </Section>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof Hash
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function ChannelItem({
  href,
  label,
  count,
  active,
}: {
  href: string
  label: string
  count: number
  active: boolean
}) {
  return (
    <a
      href={href}
      className={
        'flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ' +
        (active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100')
      }
    >
      <span>{label}</span>
      <span className={'text-xs ' + (active ? 'text-gray-300' : 'text-gray-400')}>{count}</span>
    </a>
  )
}
