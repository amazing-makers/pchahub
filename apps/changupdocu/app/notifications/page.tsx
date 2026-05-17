'use client'

import { useEffect, useState } from 'react'
import { Bell, PlayCircle, BookOpen, Bookmark, Heart, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface Notification {
  id: string
  type: 'new-episode' | 'new-article' | 'watch-later' | 'like' | 'system'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'new-episode', title: '새 에피소드가 올라왔습니다', body: '"치킨 프랜차이즈 5년, 진짜 이야기" 에피소드가 공개되었습니다.', href: '/episodes', createdAt: '방금 전', read: false },
  { id: 'n2', type: 'new-episode', title: '인기 에피소드', body: '"카페 창업 실패 후기"가 이번 주 조회수 1위입니다.', href: '/categories/failure', createdAt: '2시간 전', read: false },
  { id: 'n3', type: 'new-article', title: '매거진 신규 발행', body: '"2026 프랜차이즈 창업 트렌드 분석" 아티클이 발행되었습니다.', href: '/magazine', createdAt: '어제', read: false },
  { id: 'n4', type: 'watch-later', title: '나중에 보기 알림', body: '"브랜드 확장 전략 — 100호점의 비밀" 에피소드를 저장하셨습니다.', href: '/mypage', createdAt: '어제', read: true },
  { id: 'n5', type: 'new-article', title: '매거진 신규 발행', body: '"가맹비 이것만 알면 됩니다" 아티클이 발행되었습니다.', href: '/magazine', createdAt: '3일 전', read: true },
  { id: 'n6', type: 'like', title: '에피소드 좋아요 추천', body: '좋아요하신 에피소드와 유사한 콘텐츠가 업로드되었습니다.', href: '/episodes', createdAt: '일주일 전', read: true },
  { id: 'n7', type: 'system', title: '서비스 업데이트', body: '나중에 보기 기능이 추가되었습니다. 에피소드에서 저장해보세요.', href: '/episodes', createdAt: '2주 전', read: true },
]

const ICON_MAP = {
  'new-episode': PlayCircle,
  'new-article': BookOpen,
  'watch-later': Bookmark,
  'like': Heart,
  'system': Bell,
}

const COLOR_MAP: Record<Notification['type'], string> = {
  'new-episode': 'text-amber-600 bg-amber-50',
  'new-article': 'text-blue-600 bg-blue-50',
  'watch-later': 'text-amber-500 bg-amber-50',
  'like': 'text-rose-500 bg-rose-50',
  'system': 'text-gray-500 bg-gray-100',
}

const STORAGE_KEY = 'changupdocu:notifications'

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
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-500">새 에피소드·매거진 알림을 확인하세요.</p>
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
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                )}
              </a>
            )
          })
        )}
      </div>
    </main>
  )
}
