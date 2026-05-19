'use client'

import { useState } from 'react'
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  Filter,
  Search,
  ShieldAlert,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { Badge, Button, Card } from '@amakers/ui'

type Role = 'user' | 'hq' | 'franchisee' | 'admin' | 'moderator'
type BizStatus = 'verified' | 'pending' | 'none'

interface MockUser {
  id: string
  name: string
  email: string
  role: Role
  bizStatus: BizStatus
  isFranchisee: boolean
  isHQ: boolean
  createdAt: string
  lastActiveAt: string
}

const MOCK_USERS: MockUser[] = [
  {
    id: 'u001',
    name: '김지수',
    email: 'jisu@example.com',
    role: 'user',
    bizStatus: 'none',
    isFranchisee: false,
    isHQ: false,
    createdAt: '2026-05-18',
    lastActiveAt: '방금 전',
  },
  {
    id: 'u002',
    name: '이준혁',
    email: 'junho@example.com',
    role: 'hq',
    bizStatus: 'pending',
    isFranchisee: false,
    isHQ: true,
    createdAt: '2026-05-17',
    lastActiveAt: '23분 전',
  },
  {
    id: 'u003',
    name: '박서연',
    email: 'seo@example.com',
    role: 'franchisee',
    bizStatus: 'verified',
    isFranchisee: true,
    isHQ: false,
    createdAt: '2026-05-12',
    lastActiveAt: '1시간 전',
  },
  {
    id: 'u004',
    name: '최민준',
    email: 'minjun@example.com',
    role: 'hq',
    bizStatus: 'verified',
    isFranchisee: false,
    isHQ: true,
    createdAt: '2026-04-28',
    lastActiveAt: '2일 전',
  },
  {
    id: 'u005',
    name: '정다은',
    email: 'daeeun@example.com',
    role: 'user',
    bizStatus: 'none',
    isFranchisee: false,
    isHQ: false,
    createdAt: '2026-04-20',
    lastActiveAt: '5일 전',
  },
  {
    id: 'u006',
    name: '한동훈',
    email: 'dong@example.com',
    role: 'hq',
    bizStatus: 'pending',
    isFranchisee: false,
    isHQ: true,
    createdAt: '2026-05-16',
    lastActiveAt: '3시간 전',
  },
  {
    id: 'u007',
    name: '오지민',
    email: 'jimin@example.com',
    role: 'moderator',
    bizStatus: 'none',
    isFranchisee: false,
    isHQ: false,
    createdAt: '2026-03-01',
    lastActiveAt: '오늘',
  },
  {
    id: 'u008',
    name: '남기현',
    email: 'gihyun@example.com',
    role: 'franchisee',
    bizStatus: 'pending',
    isFranchisee: true,
    isHQ: false,
    createdAt: '2026-05-10',
    lastActiveAt: '어제',
  },
]

const ROLE_LABEL: Record<Role, string> = {
  user: '일반',
  hq: '본사',
  franchisee: '가맹점',
  admin: '관리자',
  moderator: '운영자',
}

const ROLE_VARIANT: Record<Role, 'default' | 'success' | 'warning' | 'error'> = {
  user: 'default',
  hq: 'success',
  franchisee: 'warning',
  admin: 'error',
  moderator: 'default',
}

const BIZ_LABEL: Record<BizStatus, string> = {
  verified: '인증 완료',
  pending: '검토 중',
  none: '-',
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')
  const [bizFilter, setBizFilter] = useState<BizStatus | 'all'>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = MOCK_USERS.filter((u) => {
    const q = search.toLowerCase()
    const matchesSearch = !q || u.name.includes(q) || u.email.includes(q)
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesBiz = bizFilter === 'all' || u.bizStatus === bizFilter
    return matchesSearch && matchesRole && matchesBiz
  })

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((u) => u.id)))
    }
  }

  const pendingHq = MOCK_USERS.filter((u) => u.role === 'hq' && u.bizStatus === 'pending')

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Users className="h-5 w-5 text-gray-500" />
            사용자 관리
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            전체 {MOCK_USERS.length}명 · HQ 사업자 미확인 {pendingHq.length}건
          </p>
        </div>
      </div>

      {/* HQ 사업자 미확인 알림 */}
      {pendingHq.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <div className="divide-y divide-amber-100">
            {pendingHq.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                <Building2 className="h-4 w-4 shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1 text-sm">
                  <span className="font-semibold text-amber-900">{u.name}</span>
                  <span className="ml-1 text-amber-700">({u.email})</span>
                  <span className="ml-1 text-amber-600">— 사업자 등록번호 미확인</span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                    <UserCheck className="mr-1 inline h-3 w-3" />
                    승인
                  </button>
                  <button className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="이름 또는 이메일 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
        </div>

        {/* Role filter */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
            className="h-9 appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          >
            <option value="all">모든 역할</option>
            <option value="user">일반</option>
            <option value="hq">본사</option>
            <option value="franchisee">가맹점</option>
            <option value="moderator">운영자</option>
            <option value="admin">관리자</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Biz filter */}
        <div className="relative">
          <select
            value={bizFilter}
            onChange={(e) => setBizFilter(e.target.value as BizStatus | 'all')}
            className="h-9 appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          >
            <option value="all">사업자 전체</option>
            <option value="verified">인증 완료</option>
            <option value="pending">검토 중</option>
            <option value="none">미등록</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        </div>

        {(search || roleFilter !== 'all' || bizFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setRoleFilter('all'); setBizFilter('all') }}
            className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm text-gray-500 hover:bg-gray-50"
          >
            <X className="h-3.5 w-3.5" /> 초기화
          </button>
        )}

        <span className="ml-auto text-sm text-gray-400">
          {filtered.length}명 표시
        </span>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5">
          <span className="text-sm font-medium text-blue-900">{selected.size}명 선택됨</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <ShieldAlert className="mr-1 h-3.5 w-3.5" />
              역할 변경
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <BadgeCheck className="mr-1 h-3.5 w-3.5" />
              사업자 일괄 승인
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size > 0 && selected.size === filtered.length}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 font-medium">사용자</th>
                <th className="px-4 py-3 font-medium">역할</th>
                <th className="px-4 py-3 font-medium">사업자</th>
                <th className="px-4 py-3 font-medium">가입일</th>
                <th className="px-4 py-3 font-medium">최근 활동</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ROLE_VARIANT[u.role]}>{ROLE_LABEL[u.role]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {u.bizStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <BadgeCheck className="h-3.5 w-3.5" /> {BIZ_LABEL[u.bizStatus]}
                      </span>
                    ) : u.bizStatus === 'pending' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                        <Filter className="h-3.5 w-3.5" /> {BIZ_LABEL[u.bizStatus]}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">{BIZ_LABEL[u.bizStatus]}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.createdAt}</td>
                  <td className="px-4 py-3 text-gray-500">{u.lastActiveAt}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {u.bizStatus === 'pending' && (
                        <button className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                          승인
                        </button>
                      )}
                      <button className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
                        수정
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                    조건에 맞는 사용자가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
