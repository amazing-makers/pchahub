'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, FileText, ImagePlus, Send, Shield, Trash2, Upload } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { LISTING_CATEGORIES, type ListingType } from '@/lib/mock-data'
import { showToast } from '@/hooks/use-toast'

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`
  }
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}

interface FormState {
  listingType: ListingType
  title: string
  region: string
  district: string
  fullAddress: string
  area: string
  floor: string
  buildingType: string
  deposit: string
  monthlyRent: string
  rightFee: string
  salePrice: string
  availableFrom: string
  currentBusiness: string
  monthlyRevenue: string
  revenueWillVerify: boolean
  transferorMessage: string
  fitCategories: string[]
  tags: string[]
  photoCount: number
  hasLease: boolean
  hasRevenueDoc: boolean
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  ownerType: 'direct' | 'agent'
  agencyName: string
  agreedPrivacy: boolean
  agreedTerms: boolean
}

const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산',
  '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

const BUILDING_TYPES = ['상가', '신축 상가', '오피스 빌딩', '단독 상가', '주상복합', '근린생활시설']

const FLOOR_OPTIONS = ['지하 2층', '지하 1층', '1층', '1.5층', '2층', '3층', '4층 이상', '1-2층', '1-3층']

const TAG_OPTIONS = [
  '역세권', '오피스 상권', '학원가', '주거지 인근', '관광 상권', 'SNS 상권',
  '대로변', '코너', '신축', '엘리베이터', '주차 가능', '인테리어 양호',
  '주방 설비', '광장 면', '단독 건물', '대형 아파트 단지',
]

const TYPE_LABEL_FORM: Record<ListingType, { label: string; sub: string }> = {
  transfer: { label: '양도', sub: '운영 중인 매장 양도' },
  new: { label: '신규 임대', sub: '비어있는 상가 임대' },
  sale: { label: '매각', sub: '건물·상가 매각' },
}

export function PostForm({ defaultName, defaultEmail }: { defaultName: string; defaultEmail: string }) {
  // Photo upload state — files kept outside FormState to avoid JSON serialisation
  const [photoFiles, setPhotoFiles] = useState<File[]>([])

  const [state, setState] = useState<FormState>({
    listingType: 'new',
    title: '',
    region: '',
    district: '',
    fullAddress: '',
    area: '',
    floor: '1층',
    buildingType: '상가',
    deposit: '',
    monthlyRent: '',
    rightFee: '',
    salePrice: '',
    availableFrom: '',
    currentBusiness: '',
    monthlyRevenue: '',
    revenueWillVerify: false,
    transferorMessage: '',
    fitCategories: [],
    tags: [],
    photoCount: 0,
    hasLease: false,
    hasRevenueDoc: false,
    ownerName: defaultName,
    ownerPhone: '',
    ownerEmail: defaultEmail,
    ownerType: 'direct',
    agencyName: '',
    agreedPrivacy: false,
    agreedTerms: false,
  })
  const [submitted, setSubmitted] = useState(false)
  // Track whether the user has clicked submit (to show validation errors)
  const [showErrors, setShowErrors] = useState(false)

  const isSale = state.listingType === 'sale'
  const isTransfer = state.listingType === 'transfer'

  // Individual validation checks
  const errors = {
    title:      !state.title.trim(),
    region:     !state.region.trim(),
    district:   !state.district.trim(),
    address:    !state.fullAddress.trim(),
    area:       !state.area.trim(),
    price:      isSale ? !state.salePrice.trim() : (!state.deposit.trim() || !state.monthlyRent.trim()),
    ownerName:  !state.ownerName.trim(),
    ownerPhone: !state.ownerPhone.trim(),
    ownerEmail: !state.ownerEmail.trim(),
    photo:      photoFiles.length < 3,
    category:   !isSale && state.fitCategories.length === 0,
    lease:      !state.hasLease,
    privacy:    !state.agreedPrivacy,
    terms:      !state.agreedTerms,
  }
  const isValid = !Object.values(errors).some(Boolean)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      setShowErrors(true)
      // Scroll to first error
      const firstError = document.querySelector('[data-field-error]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      showToast('필수 항목을 모두 입력해 주세요.', 'error')
      return
    }
    try {
      const raw = window.localStorage.getItem('themyungdang:listings-submitted')
      const prev: object[] = raw ? (JSON.parse(raw) as object[]) : []
      const entry = {
        id: `lst-${Date.now()}`,
        listingType: state.listingType,
        title: state.title,
        region: state.region,
        district: state.district,
        area: state.area,
        ownerName: state.ownerName,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      window.localStorage.setItem(
        'themyungdang:listings-submitted',
        JSON.stringify([entry, ...prev]),
      )
    } catch { /* ignore */ }
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
            <h2 className="mt-4 text-h3 font-bold text-gray-900">매물 등록 접수 완료</h2>
            <p className="mt-3 text-gray-600">
              운영팀에서 영업일 2일 이내 매물 실사를 진행한 뒤 본인 확인 뱃지와 함께 노출됩니다.
              실사 일정·결과는 등록자 연락처로 전달됩니다.
            </p>
            <div className="mt-6 inline-block rounded-lg bg-gray-50 px-4 py-3 text-left text-sm">
              <div className="text-gray-500">담당자 연락처</div>
              <div className="mt-0.5 font-medium text-gray-900">
                {state.ownerName} · {state.ownerPhone}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <a href="/listings">
                <Button size="lg" variant="outline">매물 목록으로</Button>
              </a>
              <a href="/mypage">
                <Button size="lg">마이페이지로</Button>
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
        {/* 유형 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader title="매물 유형" />
            <div className="grid grid-cols-3 gap-2">
              {(['new', 'transfer', 'sale'] as const).map((t) => (
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
                    <div className="text-sm font-semibold text-gray-900">{TYPE_LABEL_FORM[t].label}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{TYPE_LABEL_FORM[t].sub}</div>
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
            <Field
              label="매물 제목"
              required
              error={showErrors && errors.title ? '매물 제목을 입력하세요.' : undefined}
              hint="상권명이나 특징을 함께 적으면 검색에 잘 노출됩니다."
            >
              <input
                type="text"
                value={state.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="예: 강남역 도보 5분 1층 코너 매물"
                className={`form-input ${showErrors && errors.title ? 'form-input-error' : ''}`}
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="지역 (시·도)"
                required
                error={showErrors && errors.region ? '지역을 선택하세요.' : undefined}
              >
                <select
                  value={state.region}
                  onChange={(e) => update('region', e.target.value)}
                  className={`form-input ${showErrors && errors.region ? 'form-input-error' : ''}`}
                >
                  <option value="">선택</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field
                label="시·군·구"
                required
                error={showErrors && errors.district ? '구/군을 입력하세요.' : undefined}
              >
                <input
                  type="text"
                  value={state.district}
                  onChange={(e) => update('district', e.target.value)}
                  placeholder="예: 강남구"
                  className={`form-input ${showErrors && errors.district ? 'form-input-error' : ''}`}
                />
              </Field>
              <Field
                label="도로명 주소"
                required
                className="sm:col-span-2"
                error={showErrors && errors.address ? '도로명 주소를 입력하세요.' : undefined}
              >
                <input
                  type="text"
                  value={state.fullAddress}
                  onChange={(e) => update('fullAddress', e.target.value)}
                  placeholder="예: 서울특별시 강남구 강남대로 396"
                  className={`form-input ${showErrors && errors.address ? 'form-input-error' : ''}`}
                />
              </Field>
              <Field
                label="면적 (평)"
                required
                error={showErrors && errors.area ? '면적을 입력하세요.' : undefined}
              >
                <input
                  type="number"
                  value={state.area}
                  onChange={(e) => update('area', e.target.value)}
                  placeholder="28"
                  inputMode="numeric"
                  className={`form-input ${showErrors && errors.area ? 'form-input-error' : ''}`}
                />
              </Field>
              <Field label="층">
                <select
                  value={state.floor}
                  onChange={(e) => update('floor', e.target.value)}
                  className="form-input"
                >
                  {FLOOR_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </Field>
              <Field label="건물 형태">
                <select
                  value={state.buildingType}
                  onChange={(e) => update('buildingType', e.target.value)}
                  className="form-input"
                >
                  {BUILDING_TYPES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
              <Field label="입주 가능 시점">
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

        {/* 비용 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="비용 정보" helper="단위: 만원" />
            {isSale ? (
              <Field
                label="매각가 (만원)"
                required
                error={showErrors && errors.price ? '매각가를 입력하세요.' : undefined}
              >
                <input
                  type="number"
                  value={state.salePrice}
                  onChange={(e) => update('salePrice', e.target.value)}
                  placeholder="380000"
                  inputMode="numeric"
                  className={`form-input ${showErrors && errors.price ? 'form-input-error' : ''}`}
                />
              </Field>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                <Field
                  label="보증금 (만원)"
                  required
                  error={showErrors && errors.price && !state.deposit.trim() ? '보증금을 입력하세요.' : undefined}
                >
                  <input
                    type="number"
                    value={state.deposit}
                    onChange={(e) => update('deposit', e.target.value)}
                    placeholder="5000"
                    inputMode="numeric"
                    className={`form-input ${showErrors && errors.price && !state.deposit.trim() ? 'form-input-error' : ''}`}
                  />
                </Field>
                <Field
                  label="월세 (만원)"
                  required
                  error={showErrors && errors.price && !state.monthlyRent.trim() ? '월세를 입력하세요.' : undefined}
                >
                  <input
                    type="number"
                    value={state.monthlyRent}
                    onChange={(e) => update('monthlyRent', e.target.value)}
                    placeholder="280"
                    inputMode="numeric"
                    className={`form-input ${showErrors && errors.price && !state.monthlyRent.trim() ? 'form-input-error' : ''}`}
                  />
                </Field>
                {isTransfer && (
                  <Field label="권리금 (만원)">
                    <input
                      type="number"
                      value={state.rightFee}
                      onChange={(e) => update('rightFee', e.target.value)}
                      placeholder="0 = 없음"
                      className="form-input"
                    />
                  </Field>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 양도 추가 정보 */}
        {isTransfer && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <SectionHeader
                title="양도 추가 정보"
                helper="현재 운영 중인 업종과 매출 정보를 제공하면 문의 전환율이 높아집니다."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="현재 업종">
                  <input
                    type="text"
                    value={state.currentBusiness}
                    onChange={(e) => update('currentBusiness', e.target.value)}
                    placeholder="예: 카페, 한식"
                    className="form-input"
                  />
                </Field>
                <Field label="월 매출 (만원)">
                  <input
                    type="number"
                    value={state.monthlyRevenue}
                    onChange={(e) => update('monthlyRevenue', e.target.value)}
                    placeholder="2280"
                    className="form-input"
                  />
                </Field>
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={state.revenueWillVerify}
                  onChange={(e) => update('revenueWillVerify', e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
                />
                <span className="text-gray-700">
                  매출 자료(POS 캡처·세무 자료)를 운영팀에 제출하여 <strong>매출 검증 뱃지</strong>를 받겠습니다.
                </span>
              </label>
              <Field label="양도인의 한 마디">
                <textarea
                  value={state.transferorMessage}
                  onChange={(e) => update('transferorMessage', e.target.value)}
                  placeholder="매장 운영 노하우, 주요 단골 비중, 매장의 강점 등을 적어주세요."
                  className="form-input min-h-[120px] resize-y"
                  rows={4}
                />
              </Field>
            </CardContent>
          </Card>
        )}

        {/* 적합 업종 */}
        {!isSale && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-3 p-6">
              <SectionHeader
                title="적합 업종"
                helper="이 매물에 어울리는 업종을 1개 이상 선택하세요. 가맹 본사 검색에 사용됩니다."
              />
              <div className="flex flex-wrap gap-2">
                {LISTING_CATEGORIES.map((c) => {
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
        )}

        {/* 입지 태그 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader title="입지 특성 태그" />
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

        {/* 사진 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="매물 사진 (최소 3장, 권장 5장 이상)"
              helper="외관·내부·주방·화장실·주변 사진을 골고루 등록하면 문의 전환율이 평균 2배 증가합니다."
            />
            <PhotoUploadDnD files={photoFiles} onChange={setPhotoFiles} />
            {photoFiles.length > 0 && photoFiles.length < 3 && (
              <p className="text-xs text-rose-500">최소 3장 이상 등록이 필요합니다.</p>
            )}
          </CardContent>
        </Card>

        {/* 자료 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="실사 자료"
              helper="운영팀의 본인 확인과 매물 검증에 사용됩니다."
            />
            <UploadRow
              icon={FileText}
              label="임대차계약서 또는 매매계약서 (필수)"
              note="본인 확인 매물 등록을 위한 필수 자료입니다."
              checked={state.hasLease}
              onChange={(v) => update('hasLease', v)}
            />
            {isTransfer && (
              <UploadRow
                icon={FileText}
                label="최근 3개월 매출 자료"
                note="POS 캡처 또는 세무 자료 (검증 뱃지 발급)"
                checked={state.hasRevenueDoc}
                onChange={(v) => update('hasRevenueDoc', v)}
              />
            )}
          </CardContent>
        </Card>

        {/* 등록자 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="등록자 정보" />
            <div className="grid grid-cols-2 gap-2">
              {(['direct', 'agent'] as const).map((t) => (
                <label
                  key={t}
                  className={
                    'flex cursor-pointer items-center justify-center rounded-xl border-2 p-3 transition-colors ' +
                    (state.ownerType === t
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 bg-white hover:border-gray-300')
                  }
                >
                  <input
                    type="radio"
                    name="ownerType"
                    value={t}
                    checked={state.ownerType === t}
                    onChange={() => update('ownerType', t)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {t === 'direct' ? '직접 등록 (점주·소유주)' : '중개사 등록'}
                  </span>
                </label>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {state.ownerType === 'agent' && (
                <Field label="공인중개사명" className="sm:col-span-2">
                  <input
                    type="text"
                    value={state.agencyName}
                    onChange={(e) => update('agencyName', e.target.value)}
                    placeholder="예: 강남상권공인중개"
                    className="form-input"
                  />
                </Field>
              )}
              <Field
                label="이름"
                required
                error={showErrors && errors.ownerName ? '이름을 입력하세요.' : undefined}
              >
                <input
                  type="text"
                  value={state.ownerName}
                  onChange={(e) => update('ownerName', e.target.value)}
                  className={`form-input ${showErrors && errors.ownerName ? 'form-input-error' : ''}`}
                />
              </Field>
              <Field
                label="휴대전화"
                required
                error={showErrors && errors.ownerPhone ? '연락처를 입력하세요.' : undefined}
              >
                <input
                  type="tel"
                  value={state.ownerPhone}
                  onChange={(e) => update('ownerPhone', formatPhone(e.target.value))}
                  placeholder="010-0000-0000"
                  inputMode="numeric"
                  className={`form-input ${showErrors && errors.ownerPhone ? 'form-input-error' : ''}`}
                />
              </Field>
              <Field
                label="이메일"
                required
                className="sm:col-span-2"
                error={showErrors && errors.ownerEmail ? '이메일을 입력하세요.' : undefined}
              >
                <input
                  type="email"
                  value={state.ownerEmail}
                  onChange={(e) => update('ownerEmail', e.target.value)}
                  className={`form-input ${showErrors && errors.ownerEmail ? 'form-input-error' : ''}`}
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
                <Row label="유형" value={TYPE_LABEL_FORM[state.listingType].label} />
                <Row label="제목" value={state.title || '-'} />
                <Row label="지역" value={[state.region, state.district].filter(Boolean).join(' ') || '-'} />
                <Row label="면적" value={state.area ? `${state.area}평` : '-'} />
                <Row
                  label="비용"
                  value={
                    isSale
                      ? state.salePrice
                        ? `매각가 ${state.salePrice}만`
                        : '-'
                      : state.deposit && state.monthlyRent
                        ? `보 ${state.deposit} / 월 ${state.monthlyRent}만`
                        : '-'
                  }
                />
                <Row label="업종" value={isSale ? '-' : `${state.fitCategories.length}개`} />
                <Row label="사진" value={`${photoFiles.length}장`} />
                <Row label="계약서" value={state.hasLease ? '보유 ✓' : '미보유'} />
              </div>
            </div>

            {/* Validation summary — shown after first submit attempt */}
            {showErrors && !isValid && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700">
                <p className="font-semibold">아직 완료되지 않은 항목이 있습니다:</p>
                <ul className="mt-1.5 space-y-0.5 pl-3 list-disc">
                  {errors.title      && <li>매물 제목</li>}
                  {errors.region     && <li>지역 (시·도)</li>}
                  {errors.district   && <li>시·군·구</li>}
                  {errors.address    && <li>도로명 주소</li>}
                  {errors.area       && <li>면적</li>}
                  {errors.price      && <li>비용 정보</li>}
                  {errors.ownerName  && <li>등록자 이름</li>}
                  {errors.ownerPhone && <li>연락처</li>}
                  {errors.ownerEmail && <li>이메일</li>}
                  {errors.photo      && <li>매물 사진 3장 이상</li>}
                  {errors.category   && <li>적합 업종 1개 이상</li>}
                  {errors.lease      && <li>임대차 계약서 (필수)</li>}
                  {errors.privacy    && <li>개인정보 처리방침 동의</li>}
                  {errors.terms      && <li>매물 등록 약관 동의</li>}
                </ul>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full gap-1">
              <Send className="h-4 w-4" />
              매물 등록 제출
            </Button>

            <p className="flex items-start gap-1.5 text-xs text-gray-500">
              <Shield className="mt-0.5 h-3 w-3 shrink-0" />
              운영팀 실사 후 본인 확인 뱃지와 함께 노출됩니다. 등록은 무료이며 거래 성사 시에만 표준 수수료가 발생합니다.
            </p>
          </CardContent>
        </Card>
      </div>

    </form>
  )
}

function PhotoUploadDnD({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const MAX_FILES  = 10
  const ACCEPTED   = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    const valid = Array.from(incoming).filter(f => ACCEPTED.includes(f.type))
    onChange([...files, ...valid].slice(0, MAX_FILES))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, onChange])

  const remove = (idx: number) => onChange(files.filter((_, i) => i !== idx))

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      {/* Drag zone */}
      <div
        onDragEnter={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? 'border-indigo-400 bg-indigo-50'
            : files.length >= MAX_FILES
              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              : 'border-gray-200 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <Upload className={`h-8 w-8 ${dragging ? 'text-indigo-500' : 'text-gray-400'}`} />
        <div>
          <p className="text-sm font-semibold text-gray-700">
            {dragging ? '여기에 놓으세요' : '사진을 드래그하거나 클릭해서 업로드'}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            JPG · PNG · WEBP · HEIC · 최대 {MAX_FILES}장 · 파일당 10MB 이하
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          onChange={e => addFiles(e.target.files)}
          disabled={files.length >= MAX_FILES}
        />
      </div>

      {/* Thumbnails */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {files.map((file, idx) => {
            const url = URL.createObjectURL(file)
            return (
              <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`첨부 사진 ${idx + 1} 미리보기`} className="h-full w-full object-cover" onLoad={() => URL.revokeObjectURL(url)} />
                {idx === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    대표
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="삭제"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )
          })}
          {files.length < MAX_FILES && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-400"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {files.length}/{MAX_FILES}장 등록됨 · 첫 번째 사진이 대표 이미지로 표시됩니다.
      </p>
    </div>
  )
}

function UploadRow({
  icon: Icon,
  label,
  note,
  checked,
  onChange,
}: {
  icon: typeof FileText
  label: string
  note: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2 font-medium text-gray-900">
          <Icon className="h-4 w-4 text-gray-400" />
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
  error,
  hint,
  children,
}: {
  label: string
  required?: boolean
  className?: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className={'block ' + (className ?? '')} {...(error ? { 'data-field-error': '' } : {})}>
      <label className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
        <div className="mt-1">{children}</div>
      </label>
      {error && <p className="field-error">{error}</p>}
      {!error && hint && <p className="field-hint">{hint}</p>}
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
