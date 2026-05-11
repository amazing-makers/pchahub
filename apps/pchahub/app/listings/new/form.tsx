'use client'

import { useState } from 'react'
import { CheckCircle2, ImagePlus, Plus, Send, Shield, Trash2 } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { CATEGORIES } from '@/lib/mock-data'

interface FormState {
  listingType: '양도' | '신규임대'
  title: string
  region: string
  district: string
  fullAddress: string
  area: string
  rightFee: string
  deposit: string
  monthlyRent: string
  availableFrom: string
  previousBusiness: string
  transferorMessage: string
  fitCategories: string[]
  tags: string[]
  photoCount: number
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  agreedPrivacy: boolean
  agreedTerms: boolean
}

const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산',
  '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

const TAG_OPTIONS = [
  '오피스 상권', '학원가', '주거지 인근', '관광 상권', '역세권',
  '대로변', '코너', '신축', '1층', '2층', '지하 1층', '1.5층',
  '주차 가능', '인테리어 양호', 'SNS 상권',
]

export function ListingForm() {
  const [state, setState] = useState<FormState>({
    listingType: '신규임대',
    title: '',
    region: '',
    district: '',
    fullAddress: '',
    area: '',
    rightFee: '',
    deposit: '',
    monthlyRent: '',
    availableFrom: '',
    previousBusiness: '',
    transferorMessage: '',
    fitCategories: [],
    tags: [],
    photoCount: 0,
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    agreedPrivacy: false,
    agreedTerms: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const required = [
    state.title,
    state.region,
    state.district,
    state.area,
    state.deposit,
    state.monthlyRent,
    state.ownerName,
    state.ownerPhone,
    state.ownerEmail,
  ]
  const allRequired = required.every((v) => v.trim().length > 0)
  const hasPhoto = state.photoCount >= 1
  const hasCategory = state.fitCategories.length >= 1
  const isValid = allRequired && hasPhoto && hasCategory && state.agreedPrivacy && state.agreedTerms

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
            <h2 className="mt-4 text-h3 font-bold text-gray-900">매물 등록이 접수되었습니다</h2>
            <p className="mt-3 text-gray-600">
              운영팀에서 영업일 2일 이내 매물을 실사한 뒤 노출 여부를 알려드립니다. 실사 결과와 노출 일정은
              담당자 연락처로 안내됩니다.
            </p>
            <div className="mt-6 inline-block rounded-lg bg-gray-50 px-4 py-3 text-left text-sm">
              <div className="text-gray-500">담당자 연락처</div>
              <div className="mt-0.5 font-medium text-gray-900">{state.ownerName} · {state.ownerPhone}</div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <a href="/listings">
                <Button size="lg" variant="outline">
                  매물 목록으로
                </Button>
              </a>
              <a href="/">
                <Button size="lg">홈으로</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((p) => ({ ...p, [key]: value }))

  const toggleCategory = (key: string) => {
    setState((p) => ({
      ...p,
      fitCategories: p.fitCategories.includes(key)
        ? p.fitCategories.filter((k) => k !== key)
        : [...p.fitCategories, key],
    }))
  }

  const toggleTag = (tag: string) => {
    setState((p) => ({
      ...p,
      tags: p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : [...p.tags, tag],
    }))
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        {/* 매물 유형 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="매물 유형" />
            <div className="grid grid-cols-2 gap-2">
              {(['양도', '신규임대'] as const).map((t) => (
                <label
                  key={t}
                  className={
                    'flex cursor-pointer items-center justify-center rounded-xl border-2 p-4 transition-colors ' +
                    (state.listingType === t
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 bg-white hover:border-gray-300')
                  }
                >
                  <input
                    type="radio"
                    name="listingType"
                    value={t}
                    checked={state.listingType === t}
                    onChange={() => update('listingType', t)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{t}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {t === '양도' ? '운영 중인 매장 양도' : '신규 임대 가능 상가'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="기본 정보" />
            <Field label="매물 제목" required>
              <input
                type="text"
                value={state.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="예: 강남역 도보 5분 1층 매물"
                className="form-input"
                required
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="지역 (시·도)" required>
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
              <Field label="구·시 (시군구)" required>
                <input
                  type="text"
                  value={state.district}
                  onChange={(e) => update('district', e.target.value)}
                  placeholder="예: 강남구, 분당구"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="도로명 주소" className="sm:col-span-2">
                <input
                  type="text"
                  value={state.fullAddress}
                  onChange={(e) => update('fullAddress', e.target.value)}
                  placeholder="예: 서울특별시 강남구 강남대로 396"
                  className="form-input"
                />
              </Field>
              <Field label="매장 면적 (평)" required>
                <input
                  type="number"
                  value={state.area}
                  onChange={(e) => update('area', e.target.value)}
                  placeholder="28"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="입점 가능 시점">
                <input
                  type="date"
                  value={state.availableFrom}
                  onChange={(e) => update('availableFrom', e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 비용 정보 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="비용 정보" helper="단위: 만원" />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="보증금 (만원)" required>
                <input
                  type="number"
                  value={state.deposit}
                  onChange={(e) => update('deposit', e.target.value)}
                  placeholder="5000"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="월세 (만원)" required>
                <input
                  type="number"
                  value={state.monthlyRent}
                  onChange={(e) => update('monthlyRent', e.target.value)}
                  placeholder="280"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="권리금 (만원)">
                <input
                  type="number"
                  value={state.rightFee}
                  onChange={(e) => update('rightFee', e.target.value)}
                  placeholder="0 = 없음"
                  className="form-input"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 양도 정보 */}
        {state.listingType === '양도' && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <SectionHeader
                title="양도 추가 정보"
                helper="양도 매물에만 필요한 추가 정보입니다."
              />
              <Field label="이전 업종">
                <input
                  type="text"
                  value={state.previousBusiness}
                  onChange={(e) => update('previousBusiness', e.target.value)}
                  placeholder="예: 카페, 한식, 분식"
                  className="form-input"
                />
              </Field>
              <Field label="양도인의 한 마디">
                <textarea
                  value={state.transferorMessage}
                  onChange={(e) => update('transferorMessage', e.target.value)}
                  placeholder="매장 운영 노하우, 주요 단골 비중, 매장의 강점 등을 자유롭게 적어주세요."
                  className="form-input min-h-[120px]"
                  rows={4}
                />
              </Field>
            </CardContent>
          </Card>
        )}

        {/* 추천 업종 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="입점 가능 업종"
              helper="이 매물에 적합한 업종을 1개 이상 선택하세요. 가맹 본사의 입지 검색에 사용됩니다."
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = state.fitCategories.includes(c.key)
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggleCategory(c.key)}
                    className={
                      'rounded-full px-3 py-1.5 text-sm transition-colors ' +
                      (active
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                    }
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 입지 태그 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="입지 태그"
              helper="검색 노출에 도움되는 태그를 선택하세요."
            />
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((t) => {
                const active = state.tags.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={
                      'rounded-full px-3 py-1.5 text-sm transition-colors ' +
                      (active
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300')
                    }
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 매물 사진 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="매물 사진"
              helper="최소 1장, 최대 8장. 매장 외관, 내부, 도면을 골고루 등록해주세요."
            />
            <PhotoUploadGrid
              count={state.photoCount}
              onChange={(c) => update('photoCount', c)}
            />
          </CardContent>
        </Card>

        {/* 담당자 정보 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="등록자 연락처"
              helper="실사 일정과 문의가 이 연락처로 전달됩니다. 외부에 공개되지 않습니다."
            />
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
                [필수] 개인정보 처리방침에 동의합니다. amakers는 매물 실사와 거래 진행을 위해 등록자 정보를 처리합니다.
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
                [필수] 매물 등록 약관에 동의합니다. 허위 매물 등록 시 영구 등록 제한 + 법적 책임이 발생할 수 있습니다.
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
                <Row label="유형" value={state.listingType} />
                <Row label="제목" value={state.title || '-'} />
                <Row label="지역" value={[state.region, state.district].filter(Boolean).join(' ') || '-'} />
                <Row label="면적" value={state.area ? `${state.area}평` : '-'} />
                <Row
                  label="보증금/월세"
                  value={
                    state.deposit && state.monthlyRent
                      ? `${state.deposit} / ${state.monthlyRent} 만`
                      : '-'
                  }
                />
                <Row label="업종" value={`${state.fitCategories.length}개 선택`} />
                <Row label="사진" value={`${state.photoCount}장`} />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-1" disabled={!isValid}>
              <Send className="h-4 w-4" />
              매물 등록 제출
            </Button>

            <p className="flex items-start gap-1.5 text-xs text-gray-500">
              <Shield className="mt-0.5 h-3 w-3 shrink-0" />
              모든 매물은 운영팀의 실사를 거쳐 노출됩니다. 등록은 무료이며 거래 성사 시에만 표준 수수료가 발생합니다.
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

function PhotoUploadGrid({ count, onChange }: { count: number; onChange: (c: number) => void }) {
  const max = 8
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < count
        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (filled) {
                onChange(Math.max(0, count - 1))
              } else {
                onChange(Math.min(max, count + 1))
              }
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
                <CheckCircle2 className="mx-auto h-6 w-6" />
                <div className="mt-1">{i + 1}번 사진</div>
                <div className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-rose-500 opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-3 w-3" />
                  제거
                </div>
              </div>
            ) : (
              <div className="text-center">
                {i === 0 ? <ImagePlus className="mx-auto h-6 w-6" /> : <Plus className="mx-auto h-5 w-5" />}
                <div className="mt-1">{i === 0 ? '대표 사진' : '+'}</div>
              </div>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-1.5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="max-w-[60%] text-right text-xs font-medium text-gray-900">{value}</span>
    </div>
  )
}
