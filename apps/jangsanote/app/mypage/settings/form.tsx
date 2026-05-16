'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle2, Lock, Save, Shield, Trash2, User } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

const SETTINGS_KEY = 'jangsanote:user-settings'

interface SettingsFormProps {
  defaultName: string
  email: string
  role: string
}

interface FormState {
  name: string
  phone: string
  region: string
  interest: string
  notifyPost: boolean
  notifyMeeting: boolean
  notifyComment: boolean
  marketingConsent: boolean
}

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
const INTERESTS = ['치킨', '카페', '한식', '일식', '분식', '디저트', '음료', '주점', '편의점', '교육']

export function SettingsForm({ defaultName, email, role }: SettingsFormProps) {
  const [state, setState] = useState<FormState>({
    name: defaultName,
    phone: '',
    region: '',
    interest: '',
    notifyPost: true,
    notifyMeeting: true,
    notifyComment: false,
    marketingConsent: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY)
      if (raw) {
        const persisted = JSON.parse(raw) as Partial<FormState>
        setState((prev) => ({ ...prev, ...persisted }))
      }
    } catch { /* ignore */ }
  }, [])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((p) => ({ ...p, [key]: value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(state))
    } catch { /* ignore */ }
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  const roleLabel =
    role === 'franchisee' ? '현직 점주'
    : role === 'industry' ? '업계 종사자'
    : '예비 창업자'

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
      {/* 프로필 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <SectionHeader icon={User} title="프로필" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="이름">
              <input
                type="text"
                value={state.name}
                onChange={(e) => update('name', e.target.value)}
                className="form-input"
              />
            </Field>
            <Field label="이메일">
              <input
                type="email"
                value={email}
                className="form-input bg-gray-50 text-gray-500"
                readOnly
              />
            </Field>
            <Field label="휴대전화">
              <input
                type="tel"
                value={state.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="010-0000-0000"
                className="form-input"
              />
            </Field>
            <Field label="회원 유형">
              <input
                type="text"
                value={roleLabel}
                className="form-input bg-gray-50 text-gray-500"
                readOnly
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* 커뮤니티 선호 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <SectionHeader
            icon={CheckCircle2}
            title="커뮤니티 선호"
            helper="검색·추천 결과에 반영됩니다. 본사에 직접 공유되지 않습니다."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="활동 지역">
              <select
                value={state.region}
                onChange={(e) => update('region', e.target.value)}
                className="form-input"
              >
                <option value="">선택</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="관심 업종">
              <select
                value={state.interest}
                onChange={(e) => update('interest', e.target.value)}
                className="form-input"
              >
                <option value="">선택</option>
                {INTERESTS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* 알림 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-3 p-6">
          <SectionHeader icon={Bell} title="알림 설정" />
          <Toggle
            label="새 글 알림"
            sub="관심 업종방·지역방 새 글 알림"
            checked={state.notifyPost}
            onChange={(v) => update('notifyPost', v)}
          />
          <Toggle
            label="모임 알림"
            sub="근처 창업 모임·네트워킹 이벤트 알림"
            checked={state.notifyMeeting}
            onChange={(v) => update('notifyMeeting', v)}
          />
          <Toggle
            label="댓글 알림"
            sub="내 글에 댓글이 달리면 알림"
            checked={state.notifyComment}
            onChange={(v) => update('notifyComment', v)}
          />
        </CardContent>
      </Card>

      {/* 마케팅 동의 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-3 p-6">
          <SectionHeader icon={Shield} title="마케팅 정보 수신" />
          <Toggle
            label="amakers 전체 마케팅 수신 동의"
            sub="9개 사이트의 신규 기능·이벤트·할인 안내. 언제든 해제 가능."
            checked={state.marketingConsent}
            onChange={(v) => update('marketingConsent', v)}
          />
        </CardContent>
      </Card>

      {/* 계정 관리 */}
      <Card className="border-rose-200 shadow-sm">
        <CardContent className="space-y-3 p-6">
          <SectionHeader icon={Lock} title="계정 관리" />
          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href="/mypage/settings"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Lock className="h-4 w-4" />
              비밀번호 변경
            </a>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              회원 탈퇴
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            저장 완료
          </span>
        )}
        <Button type="submit" size="lg" className="gap-1">
          <Save className="h-4 w-4" />
          변경 사항 저장
        </Button>
      </div>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        :global(.form-input:focus) {
          outline: none;
          box-shadow: 0 0 0 2px var(--brand-primary);
        }
      `}</style>
    </form>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  helper,
}: {
  icon: typeof User
  title: string
  helper?: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-gray-400" />
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {helper && <p className="mt-0.5 text-xs text-gray-500">{helper}</p>}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function Toggle({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string
  sub: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="mt-0.5 text-xs text-gray-500">{sub}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ' +
          (checked ? 'bg-gray-900' : 'bg-gray-200')
        }
        role="switch"
        aria-checked={checked}
      >
        <span
          className={
            'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ' +
            (checked ? 'translate-x-5' : 'translate-x-0.5')
          }
        />
      </button>
    </label>
  )
}
