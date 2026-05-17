'use client'

import { useEffect, useState } from 'react'
import { Bell, BookOpen, Award, MessageSquare, Zap, CheckCheck } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

interface Notification {
  id: string
  type: 'new-course' | 'mentor-reply' | 'certificate' | 'reminder' | 'system'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'new-course', title: '새 강의가 등록되었습니다', body: '"2026 치킨 창업 완전정복" 강의가 업로드되었습니다. 무료로 미리보기 가능합니다.', href: '/courses', createdAt: '방금 전', read: false },
  { id: 'n2', type: 'mentor-reply', title: '멘토 답변 도착', body: '김민준 멘토님이 상담 요청에 답변을 남겼습니다.', href: '/mentors', createdAt: '1시간 전', read: false },
  { id: 'n3', type: 'certificate', title: '수료증 발급 가능', body: '"카페 창업 기초" 강의를 100% 완료했습니다. 수료증을 다운받으세요.', href: '/mypage', createdAt: '어제', read: false },
  { id: 'n4', type: 'reminder', title: '강의 복습 알림', body: '"점포 운영 핵심" 강의를 3일간 듣지 않으셨습니다. 이어서 보세요!', href: '/courses', createdAt: '2일 전', read: true },
  { id: 'n5', type: 'new-course', title: '추천 강의 업데이트', body: '저장하신 멘토 최서연 님의 새 강의 "프랜차이즈 계약서 파헤치기"가 공개되었습니다.', href: '/courses', createdAt: '3일 전', read: true },
  { id: 'n6', type: 'system', title: '서비스 업데이트', body: '강의 진도 표시 기능이 개선되었습니다. 내 강의실에서 확인해보세요.', href: '/mypage', createdAt: '일주일 전', read: true },
]

const ICON_MAP = {
  'new-course': BookOpen,
  'mentor-reply': MessageSquare,
  'certificate': Award,
  'reminder': Zap,
  'system': Bell,
}

const COLOR_MAP: Record<Notification['type'], string> = {
  'new-course': 'text-blue-600 bg-blue-50',
  'mentor-reply': 'text-emerald-600 bg-emerald-50',
  'certificate': 'text-amber-600 bg-amber-50',
  'reminder': 'text-violet-600 bg-violet-50',
  'system': 'text-gray-500 bg-gray-100',
}

const STORAGE_KEY = 'themanual:notifications'

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
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-500">새 강의·멘토 답변·수료증 알림을 확인하세요.</p>
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
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                )}
              </a>
            )
          })
        )}
      </div>
    </main>
  )
}
