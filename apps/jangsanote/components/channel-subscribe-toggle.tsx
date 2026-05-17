'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'

const SUBS_KEY = 'jangsanote:subscriptions'

interface Sub {
  type: string
  key: string
  label: string
}

interface ChannelSubscribeToggleProps {
  channelType: string
  channelKey: string
  channelName: string
}

export function ChannelSubscribeToggle({
  channelType,
  channelKey,
  channelName,
}: ChannelSubscribeToggleProps) {
  const [subscribed, setSubscribed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SUBS_KEY)
      const subs: Sub[] = raw ? JSON.parse(raw) : []
      setSubscribed(subs.some((s) => s.type === channelType && s.key === channelKey))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [channelType, channelKey])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = window.localStorage.getItem(SUBS_KEY)
      const subs: Sub[] = raw ? JSON.parse(raw) : []
      const next = subscribed
        ? subs.filter((s) => !(s.type === channelType && s.key === channelKey))
        : [...subs, { type: channelType, key: channelKey, label: channelName }]
      window.localStorage.setItem(SUBS_KEY, JSON.stringify(next))
      setSubscribed(!subscribed)
    } catch { /* ignore */ }
  }

  if (!hydrated) return null

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={subscribed ? '구독 취소' : '채널 구독'}
      title={subscribed ? '구독 취소' : '채널 구독'}
      className={
        'flex h-6 w-6 items-center justify-center rounded-md transition-colors ' +
        (subscribed
          ? 'text-indigo-600 hover:bg-indigo-50'
          : 'text-gray-400 hover:bg-gray-200 hover:text-gray-700')
      }
    >
      {subscribed ? <Bell className="h-3.5 w-3.5 fill-current" /> : <BellOff className="h-3.5 w-3.5" />}
    </button>
  )
}
