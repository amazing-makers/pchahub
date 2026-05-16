'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { CHANNELS } from '@/lib/mock-data'

const MEETINGS_KEY = 'jangsanote:my-meetings'

const MEETING_TYPES = [
  { value: 'offline', label: '오프라인 모임' },
  { value: 'online', label: '온라인 (화상)' },
  { value: 'hybrid', label: '하이브리드' },
] as const

const CATEGORY_CHANNELS = CHANNELS.filter((c) => c.type === 'category')

interface MeetingNewFormProps {
  hostName: string
}

export function MeetingNewForm({ hostName }: MeetingNewFormProps) {
  const [type, setType] = useState<'offline' | 'online' | 'hybrid'>('offline')
  const [channelKey, setChannelKey] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [location, setLocation] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('20')
  const [isFree, setIsFree] = useState(true)
  const [feeWon, setFeeWon] = useState('')
  const [done, setDone] = useState(false)
  const [meetingId, setMeetingId] = useState('')

  const isValid =
    title.trim().length >= 5 &&
    description.trim().length >= 10 &&
    date.length > 0 &&
    startTime.length > 0 &&
    (type === 'online' || location.trim().length > 0)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id = `m-local-${Date.now()}`
    const entry = {
      id,
      title: title.trim(),
      description: description.trim(),
      type,
      channelKey,
      date,
      startTime,
      location: type === 'online' ? '온라인 (링크 별도 안내)' : location.trim(),
      maxParticipants: parseInt(maxParticipants) || 20,
      currentParticipants: 1,
      isFree,
      feeWon: isFree ? 0 : parseInt(feeWon.replace(/,/g, '')) || 0,
      hostName,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'upcoming',
    }
    try {
      const raw = window.localStorage.getItem(MEETINGS_KEY)
      const prev: typeof entry[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(MEETINGS_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setMeetingId(id)
    setDone(true)
  }

  if (done) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h2 className="mt-4 text-h3 font-bold text-gray-900">모임이 등록되었습니다!</h2>
          <p className="mt-2 text-sm text-gray-500">
            검토 후 모임 목록에 게재됩니다. 마이페이지에서 신청자 현황을 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/meetings"
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              모임 목록으로
            </a>
            <a
              href="/mypage"
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              마이페이지에서 확인
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* 기본 정보 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">모임 기본 정보</h2>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              모임 형태 <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              {MEETING_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={
                    'rounded-lg border px-3 py-1.5 text-xs font-medium ' +
                    (type === t.value
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              관련 업종 채널 (선택)
            </label>
            <select
              value={channelKey}
              onChange={(e) => setChannelKey(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              <option value="">전체 / 없음</option>
              {CATEGORY_CHANNELS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              모임 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 치킨 프랜차이즈 점주 네트워킹 (서울 강남)"
              minLength={5}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              모임 소개 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="모임의 목적, 대상, 진행 방식 등을 소개해주세요."
              minLength={10}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* 일정·장소 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">일정 및 장소</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                날짜 <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                시작 시간 <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {type !== 'online' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                장소 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 서울 강남구 역삼동 OO카페 2층"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">최대 인원</label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              min={2}
              max={200}
              className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            <span className="ml-2 text-xs text-gray-500">명</span>
          </div>
        </CardContent>
      </Card>

      {/* 참가비 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">참가비</h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsFree(true)}
              className={
                'rounded-lg border px-4 py-2 text-sm font-medium ' +
                (isFree
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')
              }
            >
              무료
            </button>
            <button
              type="button"
              onClick={() => setIsFree(false)}
              className={
                'rounded-lg border px-4 py-2 text-sm font-medium ' +
                (!isFree
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')
              }
            >
              유료
            </button>
          </div>
          {!isFree && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                참가비 (원) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={feeWon}
                onChange={(e) => setFeeWon(e.target.value)}
                placeholder="예: 20000"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <a
          href="/meetings"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          취소
        </a>
        <Button type="submit" size="lg" disabled={!isValid}>
          모임 등록하기
        </Button>
      </div>
    </form>
  )
}
