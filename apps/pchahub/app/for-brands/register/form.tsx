'use client'

import { useState } from 'react'
import { CheckCircle2, FileUp, ImagePlus, Plus, Send, Shield, Trash2, X } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { CATEGORIES } from '@/lib/mock-data'

interface MenuItemDraft {
  name: string
  priceWon: string
  signature: boolean
}

interface FormState {
  // 회사
  companyName: string
  bizNumber: string
  ceoName: string
  address: string
  hqPhone: string
  // 브랜드
  brandName: string
  category: string
  brandDescription: string
  startupCost: string
  storeCount: string
  franchiseStartYear: string
  // 자료
  hasDisclosure: boolean
  hasLogo: boolean
  // 사진
  heroPhotoUploaded: boolean
  storePhotoCount: number
  // 메뉴
  menuItems: MenuItemDraft[]
  // KFA 확장
  contractYears: string
  hqAdvertisingShare: string
  territoryProtection: string
  trademarkRegistered: boolean
  // 담당자
  managerName: string
  managerRole: string
  managerEmail: string
  managerPhone: string
  // 광고 선호
  tier: 'basic' | 'featured' | 'premium'
  // 동의
  agreedPrivacy: boolean
  agreedTerms: boolean
}

const TIERS = [
  { key: 'basic', label: '기본 등록 (무료)', sub: '검색 노출 + 대시보드' },
  { key: 'featured', label: '노출 강화 (월 30만)', sub: '카테고리 상단 + 광고 뱃지' },
  { key: 'premium', label: '프리미엄 (월 80만)', sub: '홈 hero + 매칭 최우선' },
] as const

export function RegisterForm() {
  const [state, setState] = useState<FormState>({
    companyName: '',
    bizNumber: '',
    ceoName: '',
    address: '',
    hqPhone: '',
    brandName: '',
    category: '',
    brandDescription: '',
    startupCost: '',
    storeCount: '',
    franchiseStartYear: '',
    hasDisclosure: false,
    hasLogo: false,
    heroPhotoUploaded: false,
    storePhotoCount: 0,
    menuItems: [{ name: '', priceWon: '', signature: true }],
    contractYears: '3',
    hqAdvertisingShare: '70',
    territoryProtection: '',
    trademarkRegistered: false,
    managerName: '',
    managerRole: '',
    managerEmail: '',
    managerPhone: '',
    tier: 'basic',
    agreedPrivacy: false,
    agreedTerms: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const required = [
    state.companyName,
    state.bizNumber,
    state.ceoName,
    state.brandName,
    state.category,
    state.managerName,
    state.managerEmail,
    state.managerPhone,
  ]
  const allRequired = required.every((v) => v.trim().length > 0)
  const isValid = allRequired && state.agreedPrivacy && state.agreedTerms

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-10 text-center">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'var(--brand-primary)' }}
            >
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-4 text-h3 font-bold text-gray-900">본사 등록이 접수되었습니다</h2>
            <p className="mt-3 text-gray-600">
              운영팀에서 영업일 기준 3일 이내 본사 정보를 검수한 뒤 대시보드 접속 안내를 담당자
              이메일로 보내드립니다.
            </p>
            <div className="mt-6 inline-block rounded-lg bg-gray-50 px-4 py-3 text-left text-sm">
              <div className="text-gray-500">담당자 이메일</div>
              <div className="mt-0.5 font-medium text-gray-900">{state.managerEmail}</div>
            </div>
            <div className="mt-8">
              <a href="/for-brands/ads">
                <Button size="lg" variant="outline">
                  광고 상품 다시 보기
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((p) => ({ ...p, [key]: value }))

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        {/* 회사 정보 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="회사 정보" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="법인명" required>
                <input
                  type="text"
                  value={state.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  placeholder="(주)예시컴퍼니"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="사업자등록번호" required>
                <input
                  type="text"
                  value={state.bizNumber}
                  onChange={(e) => update('bizNumber', e.target.value)}
                  placeholder="123-45-67890"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="대표자명" required>
                <input
                  type="text"
                  value={state.ceoName}
                  onChange={(e) => update('ceoName', e.target.value)}
                  placeholder="홍길동"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="본사 연락처">
                <input
                  type="tel"
                  value={state.hqPhone}
                  onChange={(e) => update('hqPhone', e.target.value)}
                  placeholder="02-1234-5678"
                  className="form-input"
                />
              </Field>
              <Field label="본사 주소" className="sm:col-span-2">
                <input
                  type="text"
                  value={state.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 123"
                  className="form-input"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 브랜드 정보 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="브랜드 정보" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="브랜드명" required>
                <input
                  type="text"
                  value={state.brandName}
                  onChange={(e) => update('brandName', e.target.value)}
                  placeholder="브랜드 이름"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="업종" required>
                <select
                  value={state.category}
                  onChange={(e) => update('category', e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">업종 선택</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="브랜드 한 줄 소개" className="sm:col-span-2">
                <input
                  type="text"
                  value={state.brandDescription}
                  onChange={(e) => update('brandDescription', e.target.value)}
                  placeholder="브랜드를 한 줄로 소개해주세요"
                  className="form-input"
                />
              </Field>
              <Field label="총 창업비 (만원)">
                <input
                  type="number"
                  value={state.startupCost}
                  onChange={(e) => update('startupCost', e.target.value)}
                  placeholder="5500"
                  className="form-input"
                />
              </Field>
              <Field label="현재 매장 수">
                <input
                  type="number"
                  value={state.storeCount}
                  onChange={(e) => update('storeCount', e.target.value)}
                  placeholder="84"
                  className="form-input"
                />
              </Field>
              <Field label="가맹사업 시작 연도">
                <input
                  type="number"
                  value={state.franchiseStartYear}
                  onChange={(e) => update('franchiseStartYear', e.target.value)}
                  placeholder="2020"
                  className="form-input"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 자료 업로드 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="필수 자료"
              helper="검수에 사용되는 자료입니다. 추후 대시보드에서도 업로드할 수 있습니다."
            />
            <UploadRow
              label="정보공개서 (PDF)"
              note="공정거래위원회 등록 자료 또는 가장 최근 버전"
              checked={state.hasDisclosure}
              onChange={(v) => update('hasDisclosure', v)}
            />
            <UploadRow
              label="브랜드 로고 (PNG/SVG)"
              note="투명 배경 권장. 임시 미보유 시에도 등록은 가능합니다."
              checked={state.hasLogo}
              onChange={(v) => update('hasLogo', v)}
            />
          </CardContent>
        </Card>

        {/* 브랜드 사진 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="브랜드 사진"
              helper="실제 매장과 메뉴 사진을 등록하면 가맹 문의가 평균 2배 이상 증가합니다."
            />

            <div>
              <div className="text-xs font-medium text-gray-700">대표 매장 사진 (필수)</div>
              <button
                type="button"
                onClick={() => update('heroPhotoUploaded', !state.heroPhotoUploaded)}
                className={
                  'mt-2 flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed transition-colors ' +
                  (state.heroPhotoUploaded
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300')
                }
              >
                {state.heroPhotoUploaded ? (
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8" />
                    <div className="mt-2 text-sm font-medium">대표 사진 업로드 완료</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImagePlus className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2 text-sm">대표 매장 사진을 업로드하세요</div>
                    <div className="mt-0.5 text-xs">권장 1920×1080 · 5MB 이하</div>
                  </div>
                )}
              </button>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-700">매장 추가 사진 (최대 6장)</div>
              <PhotoUploadGrid
                count={state.storePhotoCount}
                max={6}
                onChange={(c) => update('storePhotoCount', c)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 대표 메뉴 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="대표 메뉴"
              helper="시그니처 메뉴 1개를 포함해 3-4개의 대표 메뉴를 등록해주세요. 메뉴 사진은 등록 후 대시보드에서 업로드할 수 있습니다."
            />
            <div className="space-y-2">
              {state.menuItems.map((m, idx) => (
                <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_140px_120px_auto]">
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        menuItems: p.menuItems.map((it, i) =>
                          i === idx ? { ...it, name: e.target.value } : it,
                        ),
                      }))
                    }
                    placeholder="메뉴명"
                    className="form-input"
                  />
                  <input
                    type="number"
                    value={m.priceWon}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        menuItems: p.menuItems.map((it, i) =>
                          i === idx ? { ...it, priceWon: e.target.value } : it,
                        ),
                      }))
                    }
                    placeholder="가격 (원)"
                    className="form-input"
                  />
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={m.signature}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          menuItems: p.menuItems.map((it, i) =>
                            i === idx ? { ...it, signature: e.target.checked } : it,
                          ),
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    시그니처
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setState((p) => ({
                        ...p,
                        menuItems: p.menuItems.filter((_, i) => i !== idx),
                      }))
                    }
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 text-rose-500 hover:bg-rose-50"
                    aria-label="메뉴 제거"
                    disabled={state.menuItems.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    menuItems: [...p.menuItems, { name: '', priceWon: '', signature: false }],
                  }))
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Plus className="h-4 w-4" />
                메뉴 추가
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 가맹 조건 (KFA 정보공개서 추가 정보) */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="가맹 조건"
              helper="정보공개서에 기재되는 핵심 조건입니다. 정확한 정보 제공 시 가맹 문의 품질이 향상됩니다."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="계약 기간 (년)">
                <input
                  type="number"
                  value={state.contractYears}
                  onChange={(e) => update('contractYears', e.target.value)}
                  placeholder="3"
                  className="form-input"
                />
              </Field>
              <Field label="본사 광고비 부담 (%)">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={state.hqAdvertisingShare}
                  onChange={(e) => update('hqAdvertisingShare', e.target.value)}
                  placeholder="70"
                  className="form-input"
                />
              </Field>
              <Field label="영업지역 보호 정책" className="sm:col-span-2">
                <input
                  type="text"
                  value={state.territoryProtection}
                  onChange={(e) => update('territoryProtection', e.target.value)}
                  placeholder="예: 반경 500m 이내 직영·가맹점 중복 출점 제한"
                  className="form-input"
                />
              </Field>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.trademarkRegistered}
                onChange={(e) => update('trademarkRegistered', e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
              />
              <span className="text-gray-700">상표권이 본사 명의로 등록되어 있습니다.</span>
            </label>
          </CardContent>
        </Card>

        {/* 담당자 정보 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="가맹 담당자"
              helper="amakers 알림과 대시보드 안내가 이 연락처로 전달됩니다."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="담당자명" required>
                <input
                  type="text"
                  value={state.managerName}
                  onChange={(e) => update('managerName', e.target.value)}
                  className="form-input"
                  required
                />
              </Field>
              <Field label="직책 / 부서">
                <input
                  type="text"
                  value={state.managerRole}
                  onChange={(e) => update('managerRole', e.target.value)}
                  placeholder="가맹사업부 / 본부장"
                  className="form-input"
                />
              </Field>
              <Field label="이메일" required>
                <input
                  type="email"
                  value={state.managerEmail}
                  onChange={(e) => update('managerEmail', e.target.value)}
                  className="form-input"
                  required
                />
              </Field>
              <Field label="휴대전화" required>
                <input
                  type="tel"
                  value={state.managerPhone}
                  onChange={(e) => update('managerPhone', e.target.value)}
                  className="form-input"
                  required
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 광고 등급 선호 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="시작 광고 등급 (선택)"
              helper="언제든 변경 가능합니다. 기본은 무료 등록입니다."
            />
            <div className="space-y-2">
              {TIERS.map((t) => (
                <label
                  key={t.key}
                  className={
                    'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors ' +
                    (state.tier === t.key
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 bg-white hover:border-gray-300')
                  }
                >
                  <input
                    type="radio"
                    name="tier"
                    value={t.key}
                    checked={state.tier === t.key}
                    onChange={() => update('tier', t.key)}
                    className="mt-1 h-4 w-4 shrink-0 accent-gray-900"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{t.label}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{t.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 동의 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-2 p-6">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.agreedPrivacy}
                onChange={(e) => update('agreedPrivacy', e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
              />
              <span className="text-gray-700">
                [필수] 개인정보 처리방침에 동의합니다. amakers는 본사 검수와 대시보드 제공을 위해
                담당자 정보를 처리합니다.
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.agreedTerms}
                onChange={(e) => update('agreedTerms', e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
              />
              <span className="text-gray-700">
                [필수] amakers 본사 회원 이용약관에 동의합니다.
              </span>
            </label>
          </CardContent>
        </Card>
      </div>

      {/* Sticky summary */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div>
              <div className="text-xs text-gray-500">등록 요약</div>
              <div className="mt-2 space-y-1.5 text-sm">
                <Row label="법인명" value={state.companyName || '-'} />
                <Row label="브랜드명" value={state.brandName || '-'} />
                <Row
                  label="업종"
                  value={
                    CATEGORIES.find((c) => c.key === state.category)?.label ?? '-'
                  }
                />
                <Row label="담당자" value={state.managerName || '-'} />
                <Row label="이메일" value={state.managerEmail || '-'} />
                <Row
                  label="사진"
                  value={`대표 ${state.heroPhotoUploaded ? '✓' : '×'} · 매장 ${state.storePhotoCount}장`}
                />
                <Row
                  label="메뉴"
                  value={`${state.menuItems.filter((m) => m.name.trim()).length}개 등록`}
                />
                <Row
                  label="시작 등급"
                  value={TIERS.find((t) => t.key === state.tier)?.label.split(' (')[0] ?? '-'}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-1" disabled={!isValid}>
              <Send className="h-4 w-4" />
              본사 등록 제출
            </Button>

            <p className="flex items-start gap-1.5 text-xs text-gray-500">
              <Shield className="mt-0.5 h-3 w-3 shrink-0" />
              제출된 회사 정보는 검수 외 용도로 사용되지 않으며 영업일 3일 이내 답변드립니다.
            </p>
          </CardContent>
        </Card>
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

function SectionHeader({ title, helper }: { title: string; helper?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {helper && <p className="mt-0.5 text-xs text-gray-500">{helper}</p>}
    </div>
  )
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={'block text-sm ' + (className ?? '')}>
      <span className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function UploadRow({
  label,
  note,
  checked,
  onChange,
}: {
  label: string
  note: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2 font-medium text-gray-900">
          <FileUp className="h-4 w-4 text-gray-400" />
          {label}
        </div>
        <div className="mt-1 text-xs text-gray-500">{note}</div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className="text-xs text-gray-600">{checked ? '보유' : '미보유'}</span>
      </div>
    </label>
  )
}

function PhotoUploadGrid({
  count,
  max,
  onChange,
}: {
  count: number
  max: number
  onChange: (c: number) => void
}) {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < count
        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (filled) onChange(Math.max(0, count - 1))
              else onChange(Math.min(max, count + 1))
            }}
            className={
              'group relative flex aspect-square items-center justify-center rounded-xl border-2 border-dashed text-xs transition-colors ' +
              (filled
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300')
            }
          >
            {filled ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-5 w-5" />
                <div className="mt-1">{i + 1}</div>
                <div className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] text-rose-500 opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-3 w-3" />
                </div>
              </div>
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </button>
        )
      })}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-1.5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="max-w-[60%] text-right text-xs font-medium text-gray-900">{value}</span>
    </div>
  )
}
