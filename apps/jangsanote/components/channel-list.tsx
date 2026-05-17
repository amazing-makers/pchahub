import { Hash, MapPin, Users } from 'lucide-react'
import { CHANNELS, type ChannelType } from '@/lib/mock-data'
import { ChannelSubscribeToggle } from './channel-subscribe-toggle'

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
            channelType="category"
            channelKey={c.key}
            channelName={c.label}
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
            channelType="region"
            channelKey={c.key}
            channelName={c.label}
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
            channelType="general"
            channelKey={c.key}
            channelName={c.label}
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
  channelType,
  channelKey,
  channelName,
}: {
  href: string
  label: string
  count: number
  active: boolean
  channelType: string
  channelKey: string
  channelName: string
}) {
  return (
    <div className="group flex items-center gap-1 rounded-md transition-colors hover:bg-gray-100">
      <a
        href={href}
        className={
          'flex min-w-0 flex-1 items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ' +
          (active ? 'text-white' : 'text-gray-700')
        }
        style={active ? { background: 'rgb(17,24,39)' } : undefined}
      >
        <span className="truncate">{label}</span>
        <span className={'ml-2 shrink-0 text-xs ' + (active ? 'text-gray-300' : 'text-gray-400')}>
          {count}
        </span>
      </a>
      <div className="shrink-0 pr-1 opacity-0 transition-opacity group-hover:opacity-100">
        <ChannelSubscribeToggle
          channelType={channelType}
          channelKey={channelKey}
          channelName={channelName}
        />
      </div>
    </div>
  )
}
