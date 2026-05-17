'use client'

import { useEffect, useState } from 'react'
import { Bell, Award, Star, TrendingUp, CheckCircle2, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface Notification {
  id: string
  type: 'award' | 'new-store' | 'ranking-change' | 'application-update' | 'system'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'award', title: '2026 어워드 투표 시작', body: '2026년 베스트 프랜차이즈 어워드 투표가 시작되었습니다. 지금 바로 참여하세요!', href: '/awards', createdAt: '방금 전', read: false },
  { id: 'n2', type: 'ranking-change', title: '관심 매장 랭킹 변동', body: '저장하신 "치킨다이스 강남역점"이 이번 주 방문자 랭킹 1위로 올랐습니다.', href: '/rankings', createdAt: '2시간 전', read: false },
  { id: 'n3', type: 'application-update', title: '매장 등록 승인', body: '"데일리브루 홍대점" 매장 등록 신청이 승인되었습니다.', href: '/mypage', createdAt: '어제', read: false },
  { id: 'n4', type: 'new-store', title: '관심 브랜드 신규 매장', body: '저장하신 브랜드 "한솥미식"의 새 매장 "한솥미식 판교점"이 등록되었습니다.', href: '/stores', createdAt: '2일 전', read: true },
  { id: 'n5', type: 'award', title: '어워드 결과 발표', body: '2025년 베스트 프랜차이즈 어워드 수상 결과가 발표되었습니다.', href: '/awards', createdAt: '일주일 전', read: true },
  { id: 'n6', type: 'system', title: '실시간 랭킹 업데이트', body: '매장 방문자 실시간 랭킹 데이터가 갱신되었습니다.', href: '/rankings', createdAt: '2주 전', read: true },
]

const ICON_MAP = {
  'award': Award,
  'new-store': Star,
  'ranking-change': TrendingUp,
  'application-update': CheckCircle2,
  'system': Bell,
}

const COLOR_MAP: Record<Notification['type'], string> = {
  'award': 'text-amber-600 bg-amber-50',
  'new-store': 'text-blue-600 bg-blue-50',
  'ranking-change': 'text-emerald-600 bg-emerald-50',
  'application-update': 'text-indigo-600 bg-indigo-50',
  'system': 'text-gray-500 bg-gray-100',
}

const STORAGE_KEY = 'bestplace:notifications'

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
              <p className="mt-1 text-sm text-gray-500">어워드·랭킹 변동·매장 등록 알림을 확인하세요.</p>
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
