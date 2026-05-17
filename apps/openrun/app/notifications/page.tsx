'use client'

import { useEffect, useState } from 'react'
import { Bell, Megaphone, CheckCircle2, MessageSquare, Star, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface Notification {
  id: string
  type: 'inquiry-update' | 'campaign-complete' | 'new-case' | 'review' | 'system'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'inquiry-update', title: '캠페인 의뢰 확인됨', body: '"치킨다이스 그랜드 오픈 캠페인" 의뢰가 검토 단계로 접수되었습니다.', href: '/mypage', createdAt: '방금 전', read: false },
  { id: 'n2', type: 'campaign-complete', title: '캠페인 완료 보고서', body: '"데일리브루 강남점 오픈" 캠페인 결과 보고서가 준비되었습니다. 매출 +38% 달성.', href: '/mypage', createdAt: '2시간 전', read: false },
  { id: 'n3', type: 'new-case', title: '새 성공 사례', body: '"한솥미식 50호점 그랜드 오픈" 캠페인 결과가 포트폴리오에 추가되었습니다.', href: '/portfolio', createdAt: '어제', read: false },
  { id: 'n4', type: 'review', title: '리뷰 요청', body: '최근 완료된 "스윗스튜디오 모집 캠페인"에 대한 후기를 남겨주세요.', href: '/mypage', createdAt: '3일 전', read: true },
  { id: 'n5', type: 'inquiry-update', title: '의뢰 진행 중', body: '"크리스피네스트 가맹 모집" 의뢰가 진행 단계로 전환되었습니다.', href: '/mypage', createdAt: '일주일 전', read: true },
  { id: 'n6', type: 'system', title: '서비스 소식', body: '브랜드 마케팅 패키지가 새롭게 업데이트되었습니다. 확인해보세요.', href: '/services/brand-marketing', createdAt: '2주 전', read: true },
]

const ICON_MAP = {
  'inquiry-update': MessageSquare,
  'campaign-complete': CheckCircle2,
  'new-case': Star,
  'review': Star,
  'system': Bell,
}

const COLOR_MAP: Record<Notification['type'], string> = {
  'inquiry-update': 'text-blue-600 bg-blue-50',
  'campaign-complete': 'text-emerald-600 bg-emerald-50',
  'new-case': 'text-amber-600 bg-amber-50',
  'review': 'text-rose-600 bg-rose-50',
  'system': 'text-gray-500 bg-gray-100',
}

const STORAGE_KEY = 'openrun:notifications'

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
              <p className="mt-1 text-sm text-gray-500">캠페인 의뢰·진행 상태 알림을 확인하세요.</p>
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
