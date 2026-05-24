'use client'

import { useState } from 'react'
import { Check, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'

interface BookClientProps {
  mentorId: string
  mentorName: string
  mentorRole: string
  hourlyRate: number
}

const TOPIC_OPTIONS = [
  { key: 'startup', label: '창업 준비' },
  { key: 'ops', label: '매장 운영' },
  { key: 'finance', label: '세무·회계' },
  { key: 'legal', label: '법률·계약' },
  { key: 'marketing', label: '마케팅' },
  { key: 'interior', label: '인테리어' },
  { key: 'other', label: '기타' },
]

const TIME_SLOTS = ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function generateDates(count = 14) {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let d = new Date(today)
  d.setDate(d.getDate() + 1) // 내일부터
  while (dates.length < count) {
    if (d.getDay() !== 0 && d.getDay() !== 6) dates.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

function fmtDate(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_LABELS[d.getDay()]})`
}
function isoDate(d: Date) {
  return d.toISOString().split('T')[0]
}

type Step = 'datetime' | 'info' | 'confirm' | 'done'

export function BookClient({ mentorId, mentorName, mentorRole, hourlyRate }: BookClientProps) {
  const dates = generateDates()
  const [step, setStep] = useState<Step>('datetime')
  const [dateOffset, setDateOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [topic, setTopic] = useState('startup')
  const [question, setQuestion] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)

  const visibleDates = dates.slice(dateOffset, dateOffset + 5)
  const canPrev = dateOffset > 0
  const canNext = dateOffset + 5 < dates.length

  const step1Valid = selectedDate !== null && selectedTime !== null
  const step2Valid = question.trim().length >= 10 && name.trim() && phone.trim() && agreed

  function handleConfirm() {
    try {
      const raw = window.localStorage.getItem('themanual:consultations')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: `cs-${Date.now()}`,
        mentorId,
        mentorName,
        name,
        phone,
        topic,
        question,
        date: selectedDate ? isoDate(selectedDate) : '',
        time: selectedTime,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      }
      window.localStorage.setItem('themanual:consultations', JSON.stringify([entry, ...prev]))
    } catch { /* ignore */ }
    setStep('done')
  }

  if (step === 'done') {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-10 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'var(--brand-primary)' }}
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-5 text-h3 font-bold text-gray-900">예약 완료!</h2>
          <p className="mt-2 text-gray-600">
            {mentorName} 멘토와의 상담 예약이 완료되었습니다.
          </p>
          <div className="mt-6 inline-flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-8 py-4 text-sm text-gray-700">
            <span className="font-semibold">
              {selectedDate && fmtDate(selectedDate)} · {selectedTime}
            </span>
            <span className="text-gray-500">{TOPIC_OPTIONS.find((t) => t.key === topic)?.label}</span>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            영업일 기준 1일 이내 확정 안내를 드립니다.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/mypage"
              className="inline-flex rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-400"
            >
              마이페이지
            </a>
            <a
              href="/mentors"
              className="inline-flex rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              다른 멘토 보기
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      {/* 왼쪽: 스텝 폼 */}
      <div className="space-y-6">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-2">
          {(['datetime', 'info', 'confirm'] as Step[]).map((s, i) => {
            const labels = ['날짜·시간', '질문 입력', '최종 확인']
            const active = step === s
            const done =
              (s === 'datetime' && (step === 'info' || step === 'confirm')) ||
              (s === 'info' && step === 'confirm')
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ' +
                    (done
                      ? 'text-white'
                      : active
                      ? 'ring-2 bg-white text-gray-900'
                      : 'bg-gray-100 text-gray-400')
                  }
                  style={
                    done
                      ? { background: 'var(--brand-primary)' }
                      : active
                      ? { outline: '2px solid var(--brand-primary)', outlineOffset: '1px' }
                      : undefined
                  }
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={
                    'text-sm ' + (active ? 'font-semibold text-gray-900' : 'text-gray-400')
                  }
                >
                  {labels[i]}
                </span>
                {i < 2 && <div className="h-px w-6 bg-gray-200" />}
              </div>
            )
          })}
        </div>

        {/* Step 1: 날짜·시간 선택 */}
        {step === 'datetime' && (
          <Card className="border-gray-200">
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">날짜 선택</h3>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={!canPrev}
                      onClick={() => setDateOffset((o) => o - 5)}
                      className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={!canNext}
                      onClick={() => setDateOffset((o) => o + 5)}
                      className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {visibleDates.map((d) => {
                    const sel = selectedDate && isoDate(selectedDate) === isoDate(d)
                    return (
                      <button
                        key={isoDate(d)}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        className={
                          'flex flex-col items-center rounded-xl border py-3 text-xs transition-colors ' +
                          (sel
                            ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
                        }
                      >
                        <span className="font-semibold">{d.getDate()}</span>
                        <span className="mt-0.5 opacity-75">{DAY_LABELS[d.getDay()]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">시간 선택</h3>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => {
                    const sel = selectedTime === t
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={
                          'rounded-lg border py-2 text-sm font-medium transition-colors ' +
                          (sel
                            ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
                        }
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={!step1Valid}
                onClick={() => setStep('info')}
              >
                다음 — 질문 입력
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: 상담 정보 입력 */}
        {step === 'info' && (
          <Card className="border-gray-200">
            <CardContent className="p-6 space-y-5">
              {/* 상담 주제 */}
              <div>
                <label className="text-sm font-semibold text-gray-900">상담 주제</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TOPIC_OPTIONS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTopic(t.key)}
                      className={
                        'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors ' +
                        (topic === t.key
                          ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400')
                      }
                    >
                      {topic === t.key && <Check className="h-3 w-3" />}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 질문 */}
              <div>
                <label className="text-sm font-semibold text-gray-900">
                  질문 내용 <span className="text-rose-500">*</span>
                </label>
                <p className="mt-0.5 text-xs text-gray-500">
                  구체적일수록 멘토가 더 잘 도와드릴 수 있습니다. (최소 10자)
                </p>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="예) 치킨 프랜차이즈 창업 준비 중인데 초기 투자금 4000만원으로 가능한 브랜드와 위험 요소를 알고 싶습니다."
                  rows={5}
                  className="mt-2 w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
                <div className="mt-1 text-right text-xs text-gray-400">
                  {question.length}자
                </div>
              </div>

              {/* 이름·연락처 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-900">
                    이름 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">
                    연락처 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              {/* 동의 */}
              <label className="flex items-start gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-gray-900"
                />
                <span>
                  상담 매칭을 위해 멘토에게 이름·연락처·질문이 전달되는 데 동의합니다.
                </span>
              </label>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('datetime')}
                >
                  이전
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!step2Valid}
                  onClick={() => setStep('confirm')}
                >
                  다음 — 최종 확인
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: 최종 확인 */}
        {step === 'confirm' && (
          <Card className="border-gray-200">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-sm font-semibold text-gray-900">예약 내용 확인</h3>

              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                {[
                  ['멘토', mentorName],
                  ['일시', selectedDate ? `${fmtDate(selectedDate)} ${selectedTime}` : ''],
                  ['주제', TOPIC_OPTIONS.find((t) => t.key === topic)?.label ?? topic],
                  ['이름', name],
                  ['연락처', phone],
                  ['상담료', `${formatNumber(hourlyRate)}원 / 시간`],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4 px-4 py-3 text-sm">
                    <span className="w-20 shrink-0 text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-600 space-y-1">
                <p>· 예약 확정 후 취소는 24시간 전까지 가능합니다.</p>
                <p>· 영업일 기준 1일 이내 확정 안내를 드립니다.</p>
                <p>· 비대면(화상) 상담이며, 링크는 확정 후 전송됩니다.</p>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('info')}
                >
                  이전
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleConfirm}
                >
                  예약 확정
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 오른쪽: 멘토 요약 카드 */}
      <aside className="space-y-4">
        <Card className="border-gray-200">
          <CardContent className="p-5 space-y-4">
            <div>
              <div className="text-xs text-gray-500">멘토</div>
              <div className="mt-1 font-bold text-gray-900">{mentorName}</div>
              <div className="text-sm text-gray-600">{mentorRole}</div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs text-gray-500">시간당 상담료</div>
              <div className="mt-1 text-xl font-bold text-gray-900">
                {formatNumber(hourlyRate)}
                <span className="text-sm font-normal text-gray-500"> 원</span>
              </div>
            </div>
            {selectedDate && selectedTime && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm">
                <div className="text-xs text-gray-500">선택한 일시</div>
                <div className="mt-1 font-semibold text-gray-900">
                  {fmtDate(selectedDate)} · {selectedTime}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
