'use client'

import { useState } from 'react'
import { CheckCircle2, FileUp, ImagePlus, Plus, Send, Shield, Trash2, X } from 'lucide-react'
import { Button, Card, CardContent } from '@amakers/ui'
import { CATEGORIES } from '@/lib/mock-data'

interface PortfolioDraft {
  title: string
  category: string
  area: string
  budget: string
  durationDays: string
}

interface FormState {
  companyName: string
  bizNumber: string
  ceoName: string
  region: string
  address: string
  foundedYear: string
  projectCount: string
  avgPricePerPyeong: string
  budgetRange: string
  tagline: string
  bio: string
  specialties: string[]
  highlights: string[]
  includes: string[]
  hasBizCert: boolean
  hasInsurance: boolean
  hasConstructionLicense: boolean
  hasPortfolio: boolean
  studioPhotoUploaded: boolean
  portfolioPhotoCount: number
  portfolioDrafts: PortfolioDraft[]
  warranty: '3개월' | '6개월' | '12개월' | '24개월'
  durationGuarantee: boolean
  managerName: string
  managerRole: string
  managerEmail: string
  managerPhone: string
  agreedPrivacy: boolean
  agreedTerms: boolean
}

const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

const HIGHLIGHT_OPTIONS = [
  '본사 가이드라인 통과 보장',
  '평균 시공 일수 30일 이내',
  '시공 일수 보장제 (지연 시 배상)',
  '주방 동선 컨설팅 포함',
  '인스타그램 자산 제작 포함',
  'SNS 콘텐츠 라이브러리 제공',
  '자체 가구 공방 운영',
  '지역 자재상 직거래',
  '6개월 이상 무상 AS',
]

const INCLUDE_OPTIONS = [
  '디자인 컨설팅',
  '평면 도면',
  '3D 시뮬레이션',
  '시공',
  '감리',
  '간판',
  '가구',
  '조명',
  '주방 설비',
  '전기·배관 공사',
  '사진 자산',
]

export function ContractorForm() {
  const [state, setState] = useState<FormState>({
    companyName: '',
    bizNumber: '',
    ceoName: '',
    region: '',
    address: '',
    foundedYear: '',
    projectCount: '',
    avgPricePerPyeong: '',
    budgetRange: '',
    tagline: '',
    bio: '',
    specialties: [],
    highlights: [],
    includes: [],
    hasBizCert: false,
    hasInsurance: false,
    hasConstructionLicense: false,
    hasPortfolio: false,
    studioPhotoUploaded: false,
    portfolioPhotoCount: 0,
    portfolioDrafts: [{ title: '', category: '', area: '', budget: '', durationDays: '' }],
    warranty: '6개월',
    durationGuarantee: false,
    managerName: '',
    managerRole: '',
    managerEmail: '',
    managerPhone: '',
    agreedPrivacy: false,
    agreedTerms: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const required = [
    state.companyName,
    state.bizNumber,
    state.ceoName,
    state.region,
    state.tagline,
    state.managerName,
    state.managerEmail,
    state.managerPhone,
  ]
  const allRequired = required.every((v) => v.trim().length > 0)
  const hasCategory = state.specialties.length >= 1
  const hasStudioPhoto = state.studioPhotoUploaded
  const hasBizDocs = state.hasBizCert && state.hasConstructionLicense
  const isValid =
    allRequired && hasCategory && hasStudioPhoto && hasBizDocs && state.agreedPrivacy && state.agreedTerms

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
            <h2 className="mt-4 text-h3 font-bold text-gray-900">시공사 등록 접수 완료</h2>
            <p className="mt-3 text-gray-600">
              운영팀에서 영업일 3일 이내 자격 + 포트폴리오 검수를 진행합니다. 인증 시공사 뱃지가 발급되면
              담당자 이메일로 대시보드 접속 안내가 전달됩니다.
            </p>
            <div className="mt-6 inline-block rounded-lg bg-gray-50 px-4 py-3 text-left text-sm">
              <div className="text-gray-500">담당자 이메일</div>
              <div className="mt-0.5 font-medium text-gray-900">{state.managerEmail}</div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <a href="/contractors">
                <Button size="lg" variant="outline">시공사 둘러보기</Button>
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

  const toggleSpecialty = (k: string) =>
    setState((p) => ({
      ...p,
      specialties: p.specialties.includes(k)
        ? p.specialties.filter((x) => x !== k)
        : [...p.specialties, k],
    }))

  const toggleListValue = (key: 'highlights' | 'includes', v: string) =>
    setState((p) => ({
      ...p,
      [key]: p[key].includes(v) ? p[key].filter((x) => x !== v) : [...p[key], v],
    }))

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        {/* 회사 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="회사 정보" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="회사명" required>
                <input
                  type="text"
                  value={state.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  placeholder="예: 한수디자인"
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
                  className="form-input"
                  required
                />
              </Field>
              <Field label="설립 연도">
                <input
                  type="number"
                  value={state.foundedYear}
                  onChange={(e) => update('foundedYear', e.target.value)}
                  placeholder="2020"
                  className="form-input"
                />
              </Field>
              <Field label="활동 지역" required>
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
              <Field label="총 시공 건수">
                <input
                  type="number"
                  value={state.projectCount}
                  onChange={(e) => update('projectCount', e.target.value)}
                  placeholder="184"
                  className="form-input"
                />
              </Field>
              <Field label="사무실 주소" className="sm:col-span-2">
                <input
                  type="text"
                  value={state.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="서울특별시 강남구 ..."
                  className="form-input"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 단가 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="단가 + 예산" helper="평당 단가는 표준 인테리어 기준" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="평당 단가 (만원)">
                <input
                  type="number"
                  value={state.avgPricePerPyeong}
                  onChange={(e) => update('avgPricePerPyeong', e.target.value)}
                  placeholder="95"
                  className="form-input"
                />
              </Field>
              <Field label="예산 범위 (자유 텍스트)">
                <input
                  type="text"
                  value={state.budgetRange}
                  onChange={(e) => update('budgetRange', e.target.value)}
                  placeholder="3,000만 ~ 1억 5천만원"
                  className="form-input"
                />
              </Field>
              <Field label="기본 AS 기간">
                <select
                  value={state.warranty}
                  onChange={(e) => update('warranty', e.target.value as FormState['warranty'])}
                  className="form-input"
                >
                  {(['3개월', '6개월', '12개월', '24개월'] as const).map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </Field>
              <Field label="시공 일수 보장">
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={state.durationGuarantee}
                    onChange={(e) => update('durationGuarantee', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span>지연 시 일당 배상</span>
                </label>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 전문 카테고리 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="전문 카테고리"
              helper="1개 이상 선택. 본사·점주의 카테고리 검색에 사용됩니다."
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = state.specialties.includes(c.key)
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggleSpecialty(c.key)}
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

        {/* 소개 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="브랜드 소개" />
            <Field label="한 줄 소개 (50자 내외)" required>
              <input
                type="text"
                value={state.tagline}
                onChange={(e) => update('tagline', e.target.value)}
                placeholder="예: F&B 카페·디저트 매장 시공 전문"
                className="form-input"
                required
              />
            </Field>
            <Field label="상세 소개 (2-3 문단)">
              <textarea
                value={state.bio}
                onChange={(e) => update('bio', e.target.value)}
                placeholder="시공 경력, 전문 분야, 강점을 자세히 적어주세요."
                className="form-input min-h-[140px]"
                rows={5}
              />
            </Field>
          </CardContent>
        </Card>

        {/* 강점 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader title="강점" helper="해당되는 항목을 모두 선택" />
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_OPTIONS.map((h) => {
                const active = state.highlights.includes(h)
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => toggleListValue('highlights', h)}
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
          </CardContent>
        </Card>

        {/* 기본 포함 항목 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader
              title="기본 포함 항목"
              helper="평당 단가에 기본으로 포함되는 항목"
            />
            <div className="flex flex-wrap gap-2">
              {INCLUDE_OPTIONS.map((h) => {
                const active = state.includes.includes(h)
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => toggleListValue('includes', h)}
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
          </CardContent>
        </Card>

        {/* 사진 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="스튜디오 · 포트폴리오 사진"
              helper="실제 시공 사진이 많을수록 견적 요청이 늘어납니다."
            />
            <div>
              <div className="text-xs font-medium text-gray-700">스튜디오 대표 사진 (필수)</div>
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
                    <div className="mt-2 text-sm font-medium">스튜디오 사진 업로드 완료</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImagePlus className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2 text-sm">스튜디오 또는 대표 시공 사진을 업로드하세요</div>
                  </div>
                )}
              </button>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-700">
                포트폴리오 사진 (최대 12장, 권장 6장 이상)
              </div>
              <PhotoUploadGrid
                count={state.portfolioPhotoCount}
                max={12}
                onChange={(c) => update('portfolioPhotoCount', c)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 포트폴리오 사례 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader
              title="대표 시공 사례"
              helper="3건 이상 등록하면 인증 뱃지 발급 우선 검토 대상"
            />
            <div className="space-y-3">
              {state.portfolioDrafts.map((d, idx) => (
                <div key={idx} className="rounded-xl border border-gray-100 bg-white p-3">
                  <div className="grid gap-2 sm:grid-cols-[1.5fr_1fr_70px_90px_90px_auto]">
                    <input
                      type="text"
                      value={d.title}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          portfolioDrafts: p.portfolioDrafts.map((it, i) =>
                            i === idx ? { ...it, title: e.target.value } : it,
                          ),
                        }))
                      }
                      placeholder="시공 이름 (예: 데일리브루 홍대점)"
                      className="form-input"
                    />
                    <select
                      value={d.category}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          portfolioDrafts: p.portfolioDrafts.map((it, i) =>
                            i === idx ? { ...it, category: e.target.value } : it,
                          ),
                        }))
                      }
                      className="form-input"
                    >
                      <option value="">업종</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={d.area}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          portfolioDrafts: p.portfolioDrafts.map((it, i) =>
                            i === idx ? { ...it, area: e.target.value } : it,
                          ),
                        }))
                      }
                      placeholder="평수"
                      className="form-input"
                    />
                    <input
                      type="number"
                      value={d.budget}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          portfolioDrafts: p.portfolioDrafts.map((it, i) =>
                            i === idx ? { ...it, budget: e.target.value } : it,
                          ),
                        }))
                      }
                      placeholder="예산(만)"
                      className="form-input"
                    />
                    <input
                      type="number"
                      value={d.durationDays}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          portfolioDrafts: p.portfolioDrafts.map((it, i) =>
                            i === idx ? { ...it, durationDays: e.target.value } : it,
                          ),
                        }))
                      }
                      placeholder="일수"
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setState((p) => ({
                          ...p,
                          portfolioDrafts: p.portfolioDrafts.filter((_, i) => i !== idx),
                        }))
                      }
                      className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 text-rose-500 hover:bg-rose-50"
                      disabled={state.portfolioDrafts.length <= 1}
                      aria-label="사례 제거"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    portfolioDrafts: [
                      ...p.portfolioDrafts,
                      { title: '', category: '', area: '', budget: '', durationDays: '' },
                    ],
                  }))
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Plus className="h-4 w-4" />
                시공 사례 추가
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 자격 자료 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <SectionHeader title="자격 자료" helper="인증 시공사 뱃지 발급용" />
            <UploadRow
              label="사업자등록증 (필수)"
              note="검수에 사용. 외부 공개 안 됨."
              checked={state.hasBizCert}
              onChange={(v) => update('hasBizCert', v)}
            />
            <UploadRow
              label="건설업 등록증 (필수)"
              note="실내건축 공사업 면허 또는 동등 자격"
              checked={state.hasConstructionLicense}
              onChange={(v) => update('hasConstructionLicense', v)}
            />
            <UploadRow
              label="시공 보증보험"
              note="건설공제조합 또는 등가 보증증서"
              checked={state.hasInsurance}
              onChange={(v) => update('hasInsurance', v)}
            />
            <UploadRow
              label="포트폴리오 PDF"
              note="대표 시공 5건 이상이 포함된 자료"
              checked={state.hasPortfolio}
              onChange={(v) => update('hasPortfolio', v)}
            />
          </CardContent>
        </Card>

        {/* 담당자 */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <SectionHeader title="담당자" />
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
              <Field label="직책">
                <input
                  type="text"
                  value={state.managerRole}
                  onChange={(e) => update('managerRole', e.target.value)}
                  placeholder="대표 / 매출 영업"
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
                  placeholder="010-0000-0000"
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
                [필수] 개인정보 처리방침에 동의합니다.
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
                [필수] 시공사 회원 약관에 동의합니다. 시공 분쟁 발생 시 amakers 표준 절차를 따릅니다.
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
                <Row label="회사" value={state.companyName || '-'} />
                <Row label="지역" value={state.region || '-'} />
                <Row
                  label="평당 단가"
                  value={state.avgPricePerPyeong ? `${state.avgPricePerPyeong}만` : '-'}
                />
                <Row label="전문 카테고리" value={`${state.specialties.length}개`} />
                <Row label="포트폴리오 사례" value={`${state.portfolioDrafts.filter((d) => d.title).length}건`} />
                <Row
                  label="사진"
                  value={`스튜디오 ${state.studioPhotoUploaded ? '✓' : '×'} · 추가 ${state.portfolioPhotoCount}장`}
                />
                <Row label="필수 자격" value={hasBizDocs ? '완료 ✓' : '미완료'} />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-1" disabled={!isValid}>
              <Send className="h-4 w-4" />
              시공사 등록 제출
            </Button>

            <p className="flex items-start gap-1.5 text-xs text-gray-500">
              <Shield className="mt-0.5 h-3 w-3 shrink-0" />
              운영팀의 자격·포트폴리오 검수 후 인증 시공사 뱃지가 발급됩니다. 기본 등록은 무료입니다.
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
