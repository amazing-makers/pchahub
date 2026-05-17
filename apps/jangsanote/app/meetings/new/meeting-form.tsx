'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

// ── Storage keys ────────────────────────────────────────────────────────────
const MY_MEETINGS_KEY = 'jangsanote:my-meetings'
const ALL_MEETINGS_KEY = 'jangsanote:meetings'

// ── Shape must match MyMeeting in mypage-client.tsx ─────────────────────────
interface MyMeeting {
  id: string
  title: string
  date: string
  location: string
  type: string
  currentParticipants: number
  maxParticipants: number
  isFree: boolean
  feeWon: number
  createdAt: string
}

// ── Field options ────────────────────────────────────────────────────────────
const MEETING_TYPES = [
  { value: 'offline', label: '오프라인' },
  { value: 'online', label: '온라인' },
  { value: 'hybrid', label: '온·오프 동시' },
] as const

const CATEGORIES = [
  { value: 'networking', label: '네트워킹' },
  { value: 'education', label: '교육·강연' },
  { value: 'workshop', label: '워크샵' },
  { value: 'social', label: '친목' },
  { value: 'other', label: '기타' },
] as const

type MeetingTypeValue = 'offline' | 'online' | 'hybrid'
type CategoryValue = 'networking' | 'education' | 'workshop' | 'social' | 'other'

interface FormErrors {
  title?: string
  date?: string
  location?: string
  maxParticipants?: string
}

export function MeetingForm() {
  // ── Form state ─────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState<MeetingTypeValue>('offline')
  const [maxParticipants, setMaxParticipants] = useState('20')
  const [isFree, setIsFree] = useState(true)
  const [feeWon, setFeeWon] = useState('')
  const [category, setCategory] = useState<CategoryValue>('networking')

  const [errors, setErrors] = useState<FormErrors>({})
  const [done, setDone] = useState(false)

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate(): boolean {
    const next: FormErrors = {}
    if (!title.trim()) next.title = '모임 제목을 입력해주세요.'
    if (!date) next.date = '날짜를 선택해주세요.'
    if (type !== 'online' && !location.trim()) next.location = '장소를 입력해주세요.'
    const parsed = parseInt(maxParticipants)
    if (!maxParticipants || isNaN(parsed) || parsed < 2) {
      next.maxParticipants = '최대 인원은 2명 이상이어야 합니다.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const id = `m-local-${Date.now()}`
    const now = new Date().toISOString().slice(0, 10)

    const entry: MyMeeting = {
      id,
      title: title.trim(),
      date,
      location: type === 'online' ? '온라인 (링크 별도 안내)' : location.trim(),
      type,
      currentParticipants: 1,
      maxParticipants: parseInt(maxParticipants) || 20,
      isFree,
      feeWon: isFree ? 0 : parseInt(feeWon) || 0,
      createdAt: now,
    }

    // Save to jangsanote:my-meetings (list of meetings the user created)
    try {
      const raw = window.localStorage.getItem(MY_MEETINGS_KEY)
      const prev: MyMeeting[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(MY_MEETINGS_KEY, JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }

    // Also save full record to jangsanote:meetings
    const fullEntry = {
      ...entry,
      description: description.trim(),
      time,
      category,
    }
    try {
      const raw2 = window.localStorage.getItem(ALL_MEETINGS_KEY)
      const prev2: typeof fullEntry[] = raw2 ? JSON.parse(raw2) : []
      window.localStorage.setItem(ALL_MEETINGS_KEY, JSON.stringify([fullEntry, ...prev2]))
    } catch { /* ignore */ }

    setDone(true)
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h2 className="mt-4 text-h3 font-bold text-gray-900">모임이 등록되었습니다!</h2>
          <p className="mt-2 text-sm text-gray-500">
            마이페이지에서 내가 만든 모임을 확인할 수 있습니다.
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

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* 기본 정보 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">기본 정보</h2>

          {/* 제목 */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              모임 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 카페 점주 5월 정기 네트워킹"
              className={
                'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 ' +
                (errors.title ? 'border-rose-400' : 'border-gray-200')
              }
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
          </div>

          {/* 설명 */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">모임 소개</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="모임의 목적, 대상, 진행 방식 등을 소개해주세요."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                    (category === c.value
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50')
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 모임 형태 */}
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
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ' +
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
                className={
                  'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 ' +
                  (errors.date ? 'border-rose-400' : 'border-gray-200')
                }
              />
              {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
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
                placeholder="예: 서울 강남 위워크 3층"
                className={
                  'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 ' +
                  (errors.location ? 'border-rose-400' : 'border-gray-200')
                }
              />
              {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location}</p>}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              최대 인원 <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                min={2}
                max={500}
                className={
                  'w-28 rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 ' +
                  (errors.maxParticipants ? 'border-rose-400' : 'border-gray-200')
                }
              />
              <span className="text-sm text-gray-500">명</span>
            </div>
            {errors.maxParticipants && (
              <p className="mt-1 text-xs text-rose-500">{errors.maxParticipants}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 참가비 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-base font-semibold text-gray-900">참가비</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsFree(true)}
              className={
                'rounded-lg border px-4 py-2 text-sm font-medium transition-colors ' +
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
                'rounded-lg border px-4 py-2 text-sm font-medium transition-colors ' +
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
                min={0}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">
                회비는 모임 운영비 충당 한도 내에서 설정해주세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 액션 */}
      <div className="flex justify-end gap-3 pb-4">
        <a
          href="/meetings"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          취소
        </a>
        <Button type="submit" size="lg">
          모임 등록하기
        </Button>
      </div>
    </form>
  )
}
