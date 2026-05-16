'use client'

import { useState } from 'react'
import { CheckCircle2, FileUp, ImagePlus, Plus, Send, Shield, Trash2 } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { BRANDS } from '@/lib/mock-data'

interface FormState {
  brandId: string
  brandNameOverride: string
  storeName: string
  region: string
  district: string
  fullAddress: string
  area: string
  openedYear: string
  monthlyVisitors: string
  highlights: string[]
  customHighlight: string
  studioPhotoUploaded: boolean
  galleryCount: number
  hasBrandCert: boolean
  hasBizCert: boolean
  ownerName: string
  ownerRole: string
  ownerPhone: string
  ownerEmail: string
  agreedPrivacy: boolean
  agreedTerms: boolean
}

const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

const HIGHLIGHT_OPTIONS = [
  '신축 매장',
  '주방 동선 효율 우수',
  '심야 운영',
  '주차 가능',
  '인스타 활발',
  '주거 단지 인근',
  '오피스 점심 강세',
  '학원가 인근',
  '대로변',
  '코너',
  '단골 비중 60% 이상',
  '본사 가이드라인 모범',
]

export function StoreForm() {
  const [state, setState] = useState<FormState>({
    brandId: '',
    brandNameOverride: '',
    storeName: '',
    region: '',
    district: '',
    fullAddress: '',
    area: '',
    openedYear: '',
    monthlyVisitors: '',
    highlights: [],
    customHighlight: '',
    studioPhotoUploaded: false,
    galleryCount: 0,
    hasBrandCert: false,
    hasBizCert: false,
    ownerName: '',
    ownerRole: '점주',
    ownerPhone: '',
    ownerEmail: '',
    agreedPrivacy: false,
    agreedTerms: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const required = [
    state.storeName,
    state.region,
    state.district,
    state.fullAddress,
    state.area,
    state.ownerName,
    state.ownerPhone,
    state.ownerEmail,
  ]
  const allRequired = required.every((v) => v.trim().length > 0)
  const hasBrand = state.brandId !== '' || state.brandNameOverride.trim() !== ''
  const hasPhoto = state.studioPhotoUploaded && state.galleryCount >= 4
  const hasCert = state.hasBrandCert && state.hasBizCert
  const isValid = allRequired && hasBrand && hasPhoto && hasCert && state.agreedPrivacy && state.agreedTerms

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    try {
      const raw = window.localStorage.getItem('bestplace:store-applications')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: `sa-${Date.now()}`,
        storeName: state.storeName,
        brandId: state.brandId,
        region: state.region,
        district: state.district,
        fullAddress: state.fullAddress,
        area: state.area,
        ownerName: state.ownerName,
        ownerPhone: state.ownerPhone,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      window.localStorage.setItem('bestplace:store-applications', JSON.stringify([entry, ...prev]))
    } catch {
      // ignore
    }

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
            <h2 className="mt-4 text-h3 font-bold text-gray-900">매장 등록 접수 완료</h2>
            <p className="mt-3 text-gray-600">
              운영팀에서 영업일 2일 이내 본사 인증 + 매장 정보를 검수합니다. 검증이 완료되면 인증 매장 뱃지와
              함께 노출되고, 분기·연간 어워드 후보로 자동 등록됩니다.
            </p>
            <div className="mt-6 inline-block rounded-lg bg-gray-50 px-4 py-3 text-left text-sm">
              <div className="text-gray-500">담당자 연락처</div>
              <div className="mt-0.5 font-medium text-gray-900">
                {state.ownerName} · {state.ownerPhone}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <a href="/stores">
                <Button size="lg" variant="outline">매장 목록으로</Button>
              </a>
              <a href="/awards">
                <Button size="lg">어워드 보기</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((p) => ({ ...p, [key]: value }))

  const toggleHighlight = (h: string) =>
    setState((p) => ({
      ...p,
      highlights: p.highlights.includes(h) ? p.highlights.filter((x) => x !== h) : [...p.highlights, h],
    }))

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        {/* 브랜드 선택 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="가맹 브랜드"
              helper="등록된 브랜드 중 선택하거나, 미등록 브랜드는 직접 입력하세요."
            />
            <Field label="브랜드 선택">
              <select
                value={state.brandId}
                onChange={(e) => update('brandId', e.target.value)}
                className="form-input"
              >
                <option value="">미등록 브랜드 (직접 입력)</option>
                {BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} ({b.categoryLabel})</option>
                ))}
              </select>
            </Field>
            {state.brandId === '' && (
              <Field label="브랜드명 직접 입력" required>
                <input
                  type="text"
                  value={state.brandNameOverride}
                  onChange={(e) => update('brandNameOverride', e.target.value)}
                  placeholder="가맹 브랜드 이름"
                  className="form-input"
                  required
                />
              </Field>
            )}
          </CardContent>
        </Card>

        {/* 매장 정보 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="매장 기본 정보" />
            <Field label="매장 이름" required>
              <input
                type="text"
                value={state.storeName}
                onChange={(e) => update('storeName', e.target.value)}
                placeholder="예: 치킨다이스 강남역점"
                className="form-input"
                required
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="지역" required>
                <select
                  value={state.region}
                  onChange={(e) => update('region', e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">선택</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="시·군·구" required>
                <input
                  type="text"
                  value={state.district}
                  onChange={(e) => update('district', e.target.value)}
                  placeholder="예: 강남구"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="도로명 주소" required className="sm:col-span-2">
                <input
                  type="text"
                  value={state.fullAddress}
                  onChange={(e) => update('fullAddress', e.target.value)}
                  placeholder="예: 서울특별시 강남구 강남대로 396"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="매장 면적 (평)" required>
                <input
                  type="number"
                  value={state.area}
                  onChange={(e) => update('area', e.target.value)}
                  placeholder="32"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="오픈 연도">
                <input
                  type="number"
                  value={state.openedYear}
                  onChange={(e) => update('openedYear', e.target.value)}
                  placeholder="2024"
                  className="form-input"
                />
              </Field>
              <Field label="월 평균 방문객 수" className="sm:col-span-2">
                <input
                  type="number"
                  value={state.monthlyVisitors}
                  onChange={(e) => update('monthlyVisitors', e.target.value)}
                  placeholder="18400"
                  className="form-input"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 강점 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader title="매장 강점" helper="어워드 심사에 사용됩니다." />
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_OPTIONS.map((h) => {
                const active = state.highlights.includes(h)
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => toggleHighlight(h)}
                    className={
                      'rounded-full px-3 py-1.5 text-sm transition-colors ' +
                      (active
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                    }
                  >
                    {h}
                  </button>
                )
              })}
            </div>
            <Field label="추가 강점 (자유 텍스트, 50자 내외)">
              <input
                type="text"
                value={state.customHighlight}
                onChange={(e) => update('customHighlight', e.target.value)}
                placeholder="예: 인근 학교 4곳 대상 학원 단체 식사 제공"
                className="form-input"
              />
            </Field>
          </CardContent>
        </Card>

        {/* 사진 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="매장 사진"
              helper="대표 사진 1장 (필수) + 매장·메뉴·인테리어 사진 4장 이상 (필수)"
            />
            <div>
              <div className="text-xs font-medium text-gray-700">대표 사진 (필수)</div>
              <button
                type="button"
                onClick={() => update('studioPhotoUploaded', !state.studioPhotoUploaded)}
                className={
                  'mt-2 flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed transition-colors ' +
                  (state.studioPhotoUploaded
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300')
                }
              >
                {state.studioPhotoUploaded ? (
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8" />
                    <div className="mt-2 text-sm font-medium">대표 사진 업로드 완료</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImagePlus className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2 text-sm">매장 외관 또는 대표 인테리어 사진</div>
                  </div>
                )}
              </button>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-700">
                추가 사진 (최소 4장, 최대 10장)
              </div>
              <PhotoUploadGrid
                count={state.galleryCount}
                max={10}
                onChange={(c) => update('galleryCount', c)}
              />
              {state.galleryCount > 0 && state.galleryCount < 4 && (
                <p className="mt-2 text-xs text-rose-500">최소 4장 이상 등록해주세요.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 인증 자료 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader title="인증 자료" helper="검증 매장 뱃지 + 어워드 후보 등록용" />
            <UploadRow
              label="본사 가맹 인증서 (필수)"
              note="가맹계약서 또는 본사 발급 매장 인증서"
              checked={state.hasBrandCert}
              onChange={(v) => update('hasBrandCert', v)}
            />
            <UploadRow
              label="사업자등록증 (필수)"
              note="외부 공개 안 됨. 검수 전용."
              checked={state.hasBizCert}
              onChange={(v) => update('hasBizCert', v)}
            />
          </CardContent>
        </Card>

        {/* 등록자 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="등록자 정보" />
            <Field label="등록자 역할">
              <select
                value={state.ownerRole}
                onChange={(e) => update('ownerRole', e.target.value)}
                className="form-input"
              >
                <option value="점주">점주 본인</option>
                <option value="매니저">매니저</option>
                <option value="본사">본사 직원</option>
              </select>
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="이름" required>
                <input
                  type="text"
                  value={state.ownerName}
                  onChange={(e) => update('ownerName', e.target.value)}
                  className="form-input"
                  required
                />
              </Field>
              <Field label="휴대전화" required>
                <input
                  type="tel"
                  value={state.ownerPhone}
                  onChange={(e) => update('ownerPhone', e.target.value)}
                  placeholder="010-0000-0000"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="이메일" required className="sm:col-span-2">
                <input
                  type="email"
                  value={state.ownerEmail}
                  onChange={(e) => update('ownerEmail', e.target.value)}
                  className="form-input"
                  required
                />
              </Field>
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
                [필수] 개인정보 처리방침에 동의합니다. amakers는 매장 검수와 어워드 심사 안내를 위해 등록자 정보를 처리합니다.
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
                [필수] 매장 등록 약관 + 어워드 심사 약관에 동의합니다.
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
                <Row
                  label="브랜드"
                  value={
                    state.brandId
                      ? BRANDS.find((b) => b.id === state.brandId)?.name ?? '-'
                      : state.brandNameOverride || '-'
                  }
                />
                <Row label="매장명" value={state.storeName || '-'} />
                <Row label="지역" value={[state.region, state.district].filter(Boolean).join(' ') || '-'} />
                <Row label="면적" value={state.area ? `${state.area}평` : '-'} />
                <Row label="강점" value={`${state.highlights.length}개`} />
                <Row
                  label="사진"
                  value={`대표 ${state.studioPhotoUploaded ? '✓' : '×'} · 추가 ${state.galleryCount}장`}
                />
                <Row label="인증 자료" value={hasCert ? '완료 ✓' : '미완료'} />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-1" disabled={!isValid}>
              <Send className="h-4 w-4" />
              매장 등록 제출
            </Button>

            <p className="flex items-start gap-1.5 text-xs text-gray-500">
              <Shield className="mt-0.5 h-3 w-3 shrink-0" />
              본사 인증 후 검증 매장 뱃지와 함께 노출되며, 분기·연간 어워드 자동 후보 등록됩니다.
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
    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-1.5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="max-w-[60%] text-right text-xs font-medium text-gray-900">{value}</span>
    </div>
  )
}
