'use client'

import { useState } from 'react'
import { Building2, CheckCircle2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/mock-data'

interface StoreApplication {
  id: string
  storeName: string
  region: string
  district: string
  status: string
  createdAt: string
  // Extended fields stored locally but not shown in mypage list
  brandName: string
  address: string
  area: string
  category: string
  openedAt: string
  description: string
}

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']

export function RegisterForm() {
  const [form, setForm] = useState({
    storeName: '',
    brandName: '',
    region: '',
    district: '',
    address: '',
    area: '',
    category: '',
    openedAt: '',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.storeName.trim()) { setError('매장명을 입력해 주세요.'); return }
    if (!form.region) { setError('지역을 선택해 주세요.'); return }
    if (!form.district.trim()) { setError('시/군/구를 입력해 주세요.'); return }
    if (!form.address.trim()) { setError('상세 주소를 입력해 주세요.'); return }
    if (!form.category) { setError('업종을 선택해 주세요.'); return }

    const now = new Date()
    const createdAt = now.toLocaleDateString('ko-KR')

    const application: StoreApplication = {
      id: `app-${Date.now()}`,
      storeName: form.storeName.trim(),
      brandName: form.brandName.trim(),
      region: form.region,
      district: form.district.trim(),
      address: form.address.trim(),
      area: form.area.trim(),
      category: form.category,
      openedAt: form.openedAt,
      description: form.description.trim(),
      status: 'pending',
      createdAt,
    }

    try {
      const raw = window.localStorage.getItem('bestplace:store-applications')
      const existing: StoreApplication[] = raw ? JSON.parse(raw) : []
      existing.push(application)
      window.localStorage.setItem('bestplace:store-applications', JSON.stringify(existing))
      setSubmitted(true)
    } catch {
      setError('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-lg font-bold text-gray-900">신청이 완료되었습니다</h2>
        <p className="mt-2 text-sm text-gray-600">
          매장 등록 신청이 접수되었습니다. 검토 후 마이페이지에서 진행 상황을 확인하실 수 있습니다.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a
            href="/mypage"
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            마이페이지에서 확인
          </a>
          <a
            href="/stores"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            매장 둘러보기
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">매장 기본 정보</h2>
        </div>

        <div className="space-y-4">
          {/* 매장명 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="storeName">
              매장명 <span className="text-red-500">*</span>
            </label>
            <input
              id="storeName"
              name="storeName"
              type="text"
              value={form.storeName}
              onChange={handleChange}
              placeholder="예) 치킨다이스 강남점"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          {/* 브랜드명 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="brandName">
              브랜드명
            </label>
            <input
              id="brandName"
              name="brandName"
              type="text"
              value={form.brandName}
              onChange={handleChange}
              placeholder="예) 치킨다이스 (본사 브랜드명)"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          {/* 업종 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="category">
              업종 <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
            >
              <option value="">업종 선택</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* 개업일 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="openedAt">
              개업일
            </label>
            <input
              id="openedAt"
              name="openedAt"
              type="date"
              value={form.openedAt}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-900">위치 정보</h2>

        <div className="space-y-4">
          {/* 지역 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="region">
                시/도 <span className="text-red-500">*</span>
              </label>
              <select
                id="region"
                name="region"
                value={form.region}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-0"
              >
                <option value="">시/도 선택</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="district">
                시/군/구 <span className="text-red-500">*</span>
              </label>
              <input
                id="district"
                name="district"
                type="text"
                value={form.district}
                onChange={handleChange}
                placeholder="예) 강남구"
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
              />
            </div>
          </div>

          {/* 상세 주소 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="address">
              상세 주소 <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="예) 테헤란로 142 1층"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
            />
          </div>

          {/* 매장 면적 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="area">
              매장 면적 (평)
            </label>
            <input
              id="area"
              name="area"
              type="number"
              min="1"
              value={form.area}
              onChange={handleChange}
              placeholder="예) 20"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-900">추가 정보</h2>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="description">
            매장 소개 (선택)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="매장의 특징이나 운영 현황을 자유롭게 적어 주세요."
            className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 active:bg-gray-950"
      >
        매장 등록 신청하기
      </button>

      <p className="text-center text-xs text-gray-400">
        신청 내역은 마이페이지 › 매장 등록 신청 내역에서 확인할 수 있습니다.
      </p>
    </form>
  )
}
