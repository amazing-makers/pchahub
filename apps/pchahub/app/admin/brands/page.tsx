'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Search,
  X,
  XCircle,
} from 'lucide-react'
import { Badge, Card } from '@amakers/ui'

type ApprovalStatus = 'pending' | 'approved' | 'rejected'

interface MockBrandRequest {
  id: string
  name: string
  category: string
  hqName: string
  contact: string
  email: string
  bizRegNo: string
  storeCount: number
  submittedAt: string
  status: ApprovalStatus
  disclosureUrl?: string
  note?: string
}

const MOCK_BRANDS: MockBrandRequest[] = [
  {
    id: 'br001',
    name: '카페봄봄',
    category: '카페·디저트',
    hqName: '(주)봄봄에프앤비',
    contact: '02-1234-5678',
    email: 'cafe@bom.kr',
    bizRegNo: '123-45-67890',
    storeCount: 28,
    submittedAt: '2026-05-17',
    status: 'pending',
    disclosureUrl: 'https://franchise.ftc.go.kr',
  },
  {
    id: 'br002',
    name: '삼촌치킨',
    category: '치킨',
    hqName: '삼촌에프씨(주)',
    contact: '031-234-5678',
    email: 'info@samchon.co.kr',
    bizRegNo: '234-56-78901',
    storeCount: 145,
    submittedAt: '2026-05-16',
    status: 'pending',
    disclosureUrl: 'https://franchise.ftc.go.kr',
  },
  {
    id: 'br003',
    name: '피자베이스',
    category: '피자',
    hqName: '(주)베이스푸드',
    contact: '02-9876-5432',
    email: 'hello@pizzabase.kr',
    bizRegNo: '345-67-89012',
    storeCount: 62,
    submittedAt: '2026-05-15',
    status: 'pending',
  },
  {
    id: 'br004',
    name: '달달스터디',
    category: '스터디카페',
    hqName: '달달프랜차이즈(주)',
    contact: '010-1111-2222',
    email: 'study@daldalcafe.kr',
    bizRegNo: '456-78-90123',
    storeCount: 41,
    submittedAt: '2026-05-14',
    status: 'approved',
  },
  {
    id: 'br005',
    name: '우리세탁소',
    category: '빨래방',
    hqName: '(주)우리클린',
    contact: '02-5555-6666',
    email: 'clean@urilaundry.kr',
    bizRegNo: '567-89-01234',
    storeCount: 19,
    submittedAt: '2026-05-13',
    status: 'rejected',
    note: '정보공개서 첨부 누락',
  },
  {
    id: 'br006',
    name: '미래학원',
    category: '교육·유아',
    hqName: '미래교육(주)',
    contact: '02-7777-8888',
    email: 'edu@mirae.kr',
    bizRegNo: '678-90-12345',
    storeCount: 87,
    submittedAt: '2026-05-11',
    status: 'approved',
  },
]

const STATUS_LABEL: Record<ApprovalStatus, string> = {
  pending: '검토 중',
  approved: '승인됨',
  rejected: '반려됨',
}

const STATUS_VARIANT: Record<ApprovalStatus, 'default' | 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
}

export default function AdminBrandsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')

  const categories = Array.from(new Set(MOCK_BRANDS.map((b) => b.category)))

  const filtered = MOCK_BRANDS.filter((b) => {
    const q = search.toLowerCase()
    const matchesSearch = !q || b.name.includes(q) || b.hqName.includes(q) || b.email.includes(q)
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    const matchesCat = categoryFilter === 'all' || b.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCat
  })

  const pendingCount = MOCK_BRANDS.filter((b) => b.status === 'pending').length

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Building2 className="h-5 w-5 text-gray-500" />
            브랜드 승인 관리
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            전체 {MOCK_BRANDS.length}건 · 검토 대기 {pendingCount}건
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="브랜드명 또는 이메일 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApprovalStatus | 'all')}
            className="h-9 appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-8 text-sm focus:outline-none"
          >
            <option value="all">모든 상태</option>
            <option value="pending">검토 중</option>
            <option value="approved">승인됨</option>
            <option value="rejected">반려됨</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-8 text-sm focus:outline-none"
          >
            <option value="all">모든 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        </div>

        {(search || statusFilter !== 'all' || categoryFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all') }}
            className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm text-gray-500 hover:bg-gray-50"
          >
            <X className="h-3.5 w-3.5" /> 초기화
          </button>
        )}

        <span className="ml-auto text-sm text-gray-400">{filtered.length}건</span>
      </div>

      {/* Table */}
      <Card className="border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-5 py-3 font-medium">브랜드</th>
                <th className="px-5 py-3 font-medium">카테고리</th>
                <th className="px-5 py-3 font-medium">법인명</th>
                <th className="px-5 py-3 font-medium">사업자번호</th>
                <th className="px-5 py-3 font-medium">매장수</th>
                <th className="px-5 py-3 font-medium">신청일</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium">정보공개서</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{b.name}</div>
                    <div className="text-xs text-gray-400">{b.email}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{b.category}</td>
                  <td className="px-5 py-3 text-gray-700">{b.hqName}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">{b.bizRegNo}</td>
                  <td className="px-5 py-3 text-gray-700">{b.storeCount}개</td>
                  <td className="px-5 py-3 text-gray-500">{b.submittedAt}</td>
                  <td className="px-5 py-3">
                    <div>
                      <Badge variant={STATUS_VARIANT[b.status]}>{STATUS_LABEL[b.status]}</Badge>
                      {b.note && (
                        <div className="mt-0.5 text-[10px] text-rose-600">{b.note}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {b.disclosureUrl ? (
                      <a
                        href={b.disclosureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                      >
                        열기 <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">없음</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {b.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                          <CheckCircle2 className="h-3 w-3" /> 승인
                        </button>
                        <button
                          onClick={() => { setRejectingId(b.id); setRejectNote('') }}
                          className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
                        >
                          <XCircle className="h-3 w-3" /> 반려
                        </button>
                      </div>
                    ) : (
                      <a
                        href={`/brands/${b.id}`}
                        className="inline-flex items-center gap-0.5 text-xs font-medium text-gray-500 hover:text-gray-900"
                      >
                        보기 <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm text-gray-400">
                    조건에 맞는 브랜드가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reject modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">반려 사유 입력</h3>
            <p className="mt-1 text-sm text-gray-500">
              입력한 사유가 신청 업체에게 이메일로 전송됩니다.
            </p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="예: 정보공개서 첨부 누락, 사업자번호 불일치 등"
              rows={4}
              className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRejectingId(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                disabled={!rejectNote.trim()}
                onClick={() => setRejectingId(null)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                반려 처리
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
