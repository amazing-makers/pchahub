'use client'

import { useEffect, useState } from 'react'
import { Bell, TrendingUp, Clock, Building2, AlertTriangle, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface Notification {
  id: string
  type: 'round-closing' | 'new-round' | 'ma-update' | 'portfolio-update' | 'system'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'round-closing', title: '마감 임박 라운드', body: '"치킨다이스 Series A" 라운드 마감까지 3일 남았습니다. 현재 목표 대비 65% 달성.', href: '/investments/r1', createdAt: '방금 전', read: false },
  { id: 'n2', type: 'new-round', title: '새 투자 라운드 등록', body: '"주스레인 Series B" 라운드가 공개되었습니다. 목표액 80억, 예상 ROI 28%.', href: '/investments', createdAt: '2시간 전', read: false },
  { id: 'n3', type: 'ma-update', title: 'M&A 매물 상태 변경', body: '관심 등록하신 "데일리브루 본사 지분 매각" 매물이 협상 중 상태로 변경되었습니다.', href: '/ma', createdAt: '어제', read: false },
  { id: 'n4', type: 'portfolio-update', title: '포트폴리오 업데이트', body: '참여하신 "한솥미식 다점포 펀딩"의 1분기 운영 보고서가 업로드되었습니다.', href: '/mypage', createdAt: '2일 전', read: true },
  { id: 'n5', type: 'new-round', title: '카테고리 새 라운드', body: '관심 업종 (카페) 브랜드 "스윗스튜디오" 크라우드 라운드가 공개되었습니다.', href: '/investments', createdAt: '3일 전', read: true },
  { id: 'n6', type: 'system', title: 'NDA 서류 처리 완료', body: '"크리스피네스트 M&A" 관련 NDA 서명이 완료되어 상세 자료가 열람 가능합니다.', href: '/ma', createdAt: '일주일 전', read: true },
]

const ICON_MAP = {
  'round-closing': Clock,
  'new-round': TrendingUp,
  'ma-update': Building2,
  'portfolio-update': TrendingUp,
  'system': Bell,
}

const COLOR_MAP: Record<Notification['type'], string> = {
  'round-closing': 'text-rose-600 bg-rose-50',
  'new-round': 'text-emerald-600 bg-emerald-50',
  'ma-update': 'text-blue-600 bg-blue-50',
  'portfolio-update': 'text-amber-600 bg-amber-50',
  'system': 'text-gray-500 bg-gray-100',
}

const STORAGE_KEY = 'pchabridge:notifications'

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
              <p className="mt-1 text-sm text-gray-500">라운드 마감·M&A 상태 변경 알림을 확인하세요.</p>
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
