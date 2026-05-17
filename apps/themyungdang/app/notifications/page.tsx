'use client'

import { useEffect, useState } from 'react'
import { Bell, Home, TrendingDown, MessageSquare, Star, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface Notification {
  id: string
  type: 'new-listing' | 'price-drop' | 'inquiry-update' | 'saved-match' | 'system'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'new-listing', title: '새 매물 등록', body: '강남 지역에 관심 업종(카페) 신규 매물이 등록되었습니다. 월세 220만원 · 33평.', href: '/listings', createdAt: '방금 전', read: false },
  { id: 'n2', type: 'price-drop', title: '저장 매물 가격 변동', body: '관심 등록하신 "홍대 카페 양도 매물" 권리금이 5,000만원 → 4,200만원으로 인하되었습니다.', href: '/mypage', createdAt: '3시간 전', read: false },
  { id: 'n3', type: 'inquiry-update', title: '문의 처리 완료', body: '"이태원 한식 양도" 매물 문의가 확인되었습니다. 담당자가 연락드릴 예정입니다.', href: '/mypage', createdAt: '어제', read: false },
  { id: 'n4', type: 'saved-match', title: '관심 상권 새 매물', body: '강남 상권에 새 매물 3건이 추가되었습니다.', href: '/areas/gangnam', createdAt: '어제', read: true },
  { id: 'n5', type: 'new-listing', title: '인기 매물 알림', body: '이번 주 조회수 1위 "성수 카페 양도" 매물을 확인해보세요.', href: '/listings', createdAt: '3일 전', read: true },
  { id: 'n6', type: 'system', title: '안전 거래 안내', body: '명도 확인 · 에스크로 서비스를 통해 안전하게 거래하세요.', href: '/safe-deal', createdAt: '일주일 전', read: true },
]

const ICON_MAP = {
  'new-listing': Home,
  'price-drop': TrendingDown,
  'inquiry-update': MessageSquare,
  'saved-match': Star,
  'system': Bell,
}

const COLOR_MAP: Record<Notification['type'], string> = {
  'new-listing': 'text-emerald-600 bg-emerald-50',
  'price-drop': 'text-rose-600 bg-rose-50',
  'inquiry-update': 'text-blue-600 bg-blue-50',
  'saved-match': 'text-amber-600 bg-amber-50',
  'system': 'text-gray-500 bg-gray-100',
}

const STORAGE_KEY = 'themyungdang:notifications'

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
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-500">새 매물·가격 변동·문의 처리 알림을 확인하세요.</p>
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
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                )}
              </a>
            )
          })
        )}
      </div>
    </main>
  )
}
