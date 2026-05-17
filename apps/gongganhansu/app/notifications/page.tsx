'use client'

import { useEffect, useState } from 'react'
import { Bell, FileText, CheckCircle2, Building2, Lightbulb, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface Notification {
  id: string
  type: 'quote-update' | 'new-portfolio' | 'new-contractor' | 'insight' | 'system'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'quote-update', title: '견적서 도착', body: '"한수디자인"에서 카페 인테리어 견적서가 발송되었습니다. 예상 금액: 1,800만원.', href: '/mypage', createdAt: '방금 전', read: false },
  { id: 'n2', type: 'new-portfolio', title: '저장 시공사 새 포트폴리오', body: '관심 등록하신 "플레인스페이스"에서 새 시공 사례를 업로드했습니다.', href: '/gallery', createdAt: '1시간 전', read: false },
  { id: 'n3', type: 'quote-update', title: '견적 검토 완료', body: '요청하신 견적이 "오픈하우스" 에서 검토되었습니다. 상세 내역을 확인하세요.', href: '/mypage', createdAt: '어제', read: false },
  { id: 'n4', type: 'new-contractor', title: '신규 시공사 등록', body: '서울 강남 지역에 전문 카페 인테리어 시공사가 새로 등록되었습니다.', href: '/contractors', createdAt: '2일 전', read: true },
  { id: 'n5', type: 'insight', title: '인테리어 인사이트', body: '"2026 카페 인테리어 트렌드" 아티클이 발행되었습니다.', href: '/insights', createdAt: '3일 전', read: true },
  { id: 'n6', type: 'system', title: '서비스 안내', body: '3D 렌더링 미리보기 기능이 베타 오픈되었습니다.', href: '/', createdAt: '일주일 전', read: true },
]

const ICON_MAP = {
  'quote-update': FileText,
  'new-portfolio': CheckCircle2,
  'new-contractor': Building2,
  'insight': Lightbulb,
  'system': Bell,
}

const COLOR_MAP: Record<Notification['type'], string> = {
  'quote-update': 'text-teal-600 bg-teal-50',
  'new-portfolio': 'text-indigo-600 bg-indigo-50',
  'new-contractor': 'text-emerald-600 bg-emerald-50',
  'insight': 'text-amber-600 bg-amber-50',
  'system': 'text-gray-500 bg-gray-100',
}

const STORAGE_KEY = 'gongganhansu:notifications'

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
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-teal-600 px-1.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-500">견적 도착·포트폴리오 업데이트 알림을 확인하세요.</p>
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
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                )}
              </a>
            )
          })
        )}
      </div>
    </main>
  )
}
