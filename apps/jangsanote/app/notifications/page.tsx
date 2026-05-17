'use client'

import { useEffect, useState } from 'react'
import { Bell, Heart, MessageSquare, Users, Megaphone, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface Notification {
  id: string
  type: 'like' | 'reply' | 'mention' | 'meeting' | 'channel' | 'system'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'reply', title: '내 글에 댓글이 달렸습니다', body: '"치킨 가맹 5년차..." 글에 새 댓글이 달렸습니다.', href: '/posts/p1', createdAt: '방금 전', read: false },
  { id: 'n2', type: 'like', title: '좋아요를 받았습니다', body: '내 글 "저자본 카페 창업 후기"에 좋아요 12개가 달렸습니다.', href: '/posts/p2', createdAt: '1시간 전', read: false },
  { id: 'n3', type: 'meeting', title: '새 모임 알림', body: '카페방에 "5월 정기 오프라인 모임"이 개설되었습니다.', href: '/meetings', createdAt: '3시간 전', read: false },
  { id: 'n4', type: 'mention', title: '멘션 알림', body: '점주닷컴 님이 내 댓글에 답글을 남겼습니다.', href: '/posts/p3', createdAt: '어제', read: false },
  { id: 'n5', type: 'channel', title: '치킨방 인기 글', body: '"2026 치킨 프랜차이즈 비교 TOP 5" 글이 HOT 게시물로 선정되었습니다.', href: '/channels/category/chicken', createdAt: '어제', read: true },
  { id: 'n6', type: 'reply', title: '내 글에 댓글이 달렸습니다', body: '"본사 지원이 없는 브랜드 피하는 법" 글에 새 댓글이 달렸습니다.', href: '/posts/p4', createdAt: '2일 전', read: true },
  { id: 'n7', type: 'system', title: '새 기능 안내', body: '이제 모임 참가 신청 후 알림을 받을 수 있습니다.', href: '/meetings', createdAt: '일주일 전', read: true },
  { id: 'n8', type: 'meeting', title: '모임 D-1 알림', body: '"서울 카페 점주 네트워킹" 모임이 내일 오후 2시에 시작됩니다.', href: '/meetings/m1', createdAt: '일주일 전', read: true },
]

const ICON_MAP = {
  like: Heart,
  reply: MessageSquare,
  mention: MessageSquare,
  meeting: Users,
  channel: Megaphone,
  system: Bell,
}

const COLOR_MAP: Record<Notification['type'], string> = {
  like: 'text-rose-500 bg-rose-50',
  reply: 'text-blue-500 bg-blue-50',
  mention: 'text-indigo-500 bg-indigo-50',
  meeting: 'text-amber-500 bg-amber-50',
  channel: 'text-emerald-500 bg-emerald-50',
  system: 'text-gray-500 bg-gray-100',
}

const STORAGE_KEY = 'jangsanote:notifications'

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setItems(raw ? JSON.parse(raw) : SEED_NOTIFICATIONS)
    } catch {
      setItems(SEED_NOTIFICATIONS)
    }
    setHydrated(true)
  }, [])

  const save = (next: Notification[]) => {
    setItems(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const markAllRead = () => save(items.map((n) => ({ ...n, read: true })))
  const markRead = (id: string) => save(items.map((n) => n.id === id ? { ...n, read: true } : n))

  const unreadCount = items.filter((n) => !n.read).length

  if (!hydrated) {
    return (
      <div className="container mx-auto py-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h3 font-bold text-gray-900 flex items-center gap-2">
                알림
                {unreadCount > 0 && (
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-500">댓글·좋아요·모임 알림을 확인하세요.</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                <CheckCheck className="h-4 w-4" />
                모두 읽음
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-6 space-y-1">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">아직 알림이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          items.map((n) => {
            const Icon = ICON_MAP[n.type]
            const colorClass = COLOR_MAP[n.type]
            return (
              <a
                key={n.id}
                href={n.href}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-white ${n.read ? 'bg-transparent' : 'bg-white shadow-sm border border-gray-100'}`}
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>{n.title}</div>
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{n.body}</p>
                </div>
                <div className="shrink-0 text-xs text-gray-400">{n.createdAt}</div>
                {!n.read && (
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--brand-primary)]" />
                )}
              </a>
            )
          })
        )}
      </div>
    </main>
  )
}
