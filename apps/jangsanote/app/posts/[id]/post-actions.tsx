'use client'

import { useEffect, useState } from 'react'
import { Flag, Share2, ThumbsUp } from 'lucide-react'
import { Button } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

const LIKED_KEY = 'jangsanote:likedPosts'
const SUBS_KEY = 'jangsanote:subscriptions'
const REPORTED_KEY = 'jangsanote:reportedPosts'

interface PostActionsProps {
  postId: string
  likes: number
  channelType: string
  channelKey: string
  channelName: string
  shareTitle: string
  shareUrl: string
}

export function PostActions({
  postId,
  likes,
  channelType,
  channelKey,
  channelName,
  shareTitle,
  shareUrl,
}: PostActionsProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [subscribed, setSubscribed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LIKED_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setLiked(ids.includes(postId))
    } catch { /* ignore */ }
    try {
      const raw2 = window.localStorage.getItem(SUBS_KEY)
      const subs: { type: string; key: string }[] = raw2 ? JSON.parse(raw2) : []
      setSubscribed(subs.some((s) => s.type === channelType && s.key === channelKey))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [postId, channelType, channelKey])

  function toggleLike() {
    try {
      const raw = window.localStorage.getItem(LIKED_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = liked ? ids.filter((id) => id !== postId) : [...ids, postId]
      window.localStorage.setItem(LIKED_KEY, JSON.stringify(next))
      setLiked(!liked)
      setLikeCount((c) => c + (liked ? -1 : 1))
    } catch { /* ignore */ }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch { /* ignore */ }
  }

  function toggleSubscribe() {
    try {
      const raw = window.localStorage.getItem(SUBS_KEY)
      const subs: { type: string; key: string; label: string }[] = raw ? JSON.parse(raw) : []
      let next: typeof subs
      if (subscribed) {
        next = subs.filter((s) => !(s.type === channelType && s.key === channelKey))
      } else {
        next = [...subs, { type: channelType, key: channelKey, label: channelName }]
      }
      window.localStorage.setItem(SUBS_KEY, JSON.stringify(next))
      setSubscribed(!subscribed)
    } catch { /* ignore */ }
  }

  return (
    <>
      {/* 좋아요 + 공유 — 본문 하단 */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={hydrated && liked ? 'primary' : 'outline'}
          className="gap-1"
          onClick={toggleLike}
          disabled={!hydrated}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          좋아요 {formatNumber(likeCount)}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 text-gray-600"
          onClick={share}
        >
          <Share2 className="h-3.5 w-3.5" />
          {copied ? '복사됨 ✓' : '공유'}
        </Button>
      </div>

      {/* 채널 구독 — 사이드바에서 호출 (별도 export) */}
      <button
        id={`subscribe-${channelKey}`}
        data-subscribed={hydrated && subscribed ? 'true' : 'false'}
        onClick={toggleSubscribe}
        className="hidden"
        aria-label="채널 구독 토글"
      />
    </>
  )
}

interface ChannelSubscribeButtonProps {
  channelType: string
  channelKey: string
  channelName: string
}

export function ChannelSubscribeButton({
  channelType,
  channelKey,
  channelName,
}: ChannelSubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SUBS_KEY)
      const subs: { type: string; key: string }[] = raw ? JSON.parse(raw) : []
      setSubscribed(subs.some((s) => s.type === channelType && s.key === channelKey))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [channelType, channelKey])

  function toggle() {
    try {
      const raw = window.localStorage.getItem(SUBS_KEY)
      const subs: { type: string; key: string; label: string }[] = raw ? JSON.parse(raw) : []
      let next: typeof subs
      if (subscribed) {
        next = subs.filter((s) => !(s.type === channelType && s.key === channelKey))
      } else {
        next = [...subs, { type: channelType, key: channelKey, label: channelName }]
      }
      window.localStorage.setItem(SUBS_KEY, JSON.stringify(next))
      setSubscribed(!subscribed)
    } catch { /* ignore */ }
  }

  return (
    <Button
      size="sm"
      variant={hydrated && subscribed ? 'primary' : 'outline'}
      className="mt-3 w-full"
      onClick={toggle}
      disabled={!hydrated}
    >
      {hydrated && subscribed ? '구독 중 ✓' : '채널 구독'}
    </Button>
  )
}

export function ReportButton({ postId }: { postId: string }) {
  const [reported, setReported] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(REPORTED_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setReported(ids.includes(postId))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [postId])

  function report() {
    if (reported) return
    try {
      const raw = window.localStorage.getItem(REPORTED_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      if (!ids.includes(postId)) {
        window.localStorage.setItem(REPORTED_KEY, JSON.stringify([...ids, postId]))
      }
      setReported(true)
    } catch { /* ignore */ }
  }

  if (!hydrated) return null

  return (
    <button
      type="button"
      onClick={report}
      disabled={reported}
      className={
        'inline-flex items-center gap-1 text-xs ' +
        (reported
          ? 'cursor-default text-gray-300'
          : 'text-gray-500 hover:text-rose-500')
      }
    >
      <Flag className="h-3 w-3" />
      {reported ? '신고됨' : '신고'}
    </button>
  )
}
