'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle2, Lock, Save, Shield, Trash2, User } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'

const SETTINGS_KEY = 'pchabridge:user-settings'

interface SettingsFormProps {
  defaultName: string
  email: string
  role: string
}

interface FormState {
  name: string
  phone: string
  stage: string
  sector: string
  notifyDeal: boolean
  notifyIR: boolean
  notifyMA: boolean
  marketingConsent: boolean
}

const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'IPO']
const SECTORS = ['F&B', '리테일', 'SaaS', '핀테크', '헬스케어', '물류', 'AI', '기타']

export function SettingsForm({ defaultName, email, role }: SettingsFormProps) {
  const [state, setState] = useState<FormState>({
    name: defaultName,
    phone: '',
    stage: '',
    sector: '',
    notifyDeal: true,
    notifyIR: false,
    notifyMA: false,
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
    role === 'founder' ? '창업가·대표'
    : role === 'advisor' ? '어드바이저·중개인'
    : '투자자·VC'

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

      {/* 투자·IR 선호 */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <SectionHeader
            icon={CheckCircle2}
            title="투자·IR 선호"
            helper="검색·추천 결과에 반영됩니다. 본사에 직접 공유되지 않습니다."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="투자 단계">
              <select
                value={state.stage}
                onChange={(e) => update('stage', e.target.value)}
                className="form-input"
              >
                <option value="">선택</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="관심 섹터">
              <select
                value={state.sector}
                onChange={(e) => update('sector', e.target.value)}
                className="form-input"
              >
                <option value="">선택</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
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
            label="새 투자 기회"
            sub="관심 섹터 새 IR 게시물 알림"
            checked={state.notifyDeal}
            onChange={(v) => update('notifyDeal', v)}
          />
          <Toggle
            label="IR 자료 업데이트"
            sub="내가 등록한 IR의 조회·관심 현황"
            checked={state.notifyIR}
            onChange={(v) => update('notifyIR', v)}
          />
          <Toggle
            label="M&A 소식"
            sub="프랜차이즈 M&A 딜 뉴스레터"
            checked={state.notifyMA}
            onChange={(v) => update('notifyMA', v)}
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
