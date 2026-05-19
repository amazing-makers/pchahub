'use client'

import { Fragment, useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, MessageSquare, Phone, Search, X } from 'lucide-react'
import { Badge, Card } from '@amakers/ui'

type InquiryStatus = 'new' | 'replied' | 'closed'

interface Inquiry {
  id: string
  name: string
  region: string
  capital: string
  motive: string
  phone: string
  question: string
  createdAt: string
  status: InquiryStatus
}

const ALL_INQUIRIES: Inquiry[] = [
  {
    id: 'i101',
    name: '김재훈',
    region: '서울',
    capital: '5,000 ~ 7,000만원',
    motive: '창업 검토 · 견적',
    phone: '010-1234-5678',
    question: '강남구 쪽 입지와 초기 투자비용이 궁금합니다.',
    createdAt: '2026-05-10 14:22',
    status: 'new',
  },
  {
    id: 'i100',
    name: '박서연',
    region: '경기',
    capital: '7,000만 ~ 1억',
    motive: '입지 추천',
    phone: '010-9876-5432',
    question: '판교 / 분당 인근 가맹 개설 가능 여부 문의드립니다.',
    createdAt: '2026-05-09 11:08',
    status: 'replied',
  },
  {
    id: 'i099',
    name: '정민호',
    region: '부산',
    capital: '3,000 ~ 5,000만원',
    motive: '브랜드 정보 문의',
    phone: '010-5555-7777',
    question: '부산 해운대 상권 현황과 가맹비 상세가 궁금합니다.',
    createdAt: '2026-05-07 18:40',
    status: 'closed',
  },
  {
    id: 'i098',
    name: '최유진',
    region: '대구',
    capital: '5,000 ~ 7,000만원',
    motive: '창업 준비',
    phone: '010-2222-3333',
    question: '대구 동성로 근처 창업 관련 문의입니다. 인테리어 지원 여부도 알고 싶습니다.',
    createdAt: '2026-05-06 09:15',
    status: 'new',
  },
  {
    id: 'i097',
    name: '이승우',
    region: '인천',
    capital: '1억 이상',
    motive: '복수 점포 검토',
    phone: '010-8888-9999',
    question: '인천 송도 및 청라 두 곳 동시 개설 가능 여부 문의합니다.',
    createdAt: '2026-05-04 16:30',
    status: 'replied',
  },
  {
    id: 'i096',
    name: '한지수',
    region: '광주',
    capital: '3,000만원 이하',
    motive: '가맹비 문의',
    phone: '010-3333-4444',
    question: '광주 첫 창업인데 가맹비 할인 프로그램이 있는지 궁금합니다.',
    createdAt: '2026-05-03 13:45',
    status: 'new',
  },
  {
    id: 'i095',
    name: '오준혁',
    region: '대전',
    capital: '7,000만 ~ 1억',
    motive: '매장 운영 교육',
    phone: '010-6666-7777',
    question: '본사에서 운영 교육을 얼마나 지원하는지, 기간과 내용이 궁금합니다.',
    createdAt: '2026-05-02 10:00',
    status: 'replied',
  },
  {
    id: 'i094',
    name: '강민정',
    region: '서울',
    capital: '5,000 ~ 7,000만원',
    motive: '창업 검토',
    phone: '010-1111-2222',
    question: '홍대/합정 상권에 가맹점 입점 가능한지 알고 싶습니다.',
    createdAt: '2026-04-30 17:20',
    status: 'closed',
  },
]

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: '신규',
  replied: '답변 완료',
  closed: '종결',
}

const STATUS_VARIANT: Record<InquiryStatus, 'warning' | 'success' | 'default'> = {
  new: 'warning',
  replied: 'success',
  closed: 'default',
}

const STATUS_TABS: { key: 'all' | InquiryStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'new', label: '신규' },
  { key: 'replied', label: '답변 완료' },
  { key: 'closed', label: '종결' },
]

export function InquiriesClient() {
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ALL_INQUIRIES.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false
      if (q && !i.name.includes(q) && !i.region.includes(q) && !i.motive.toLowerCase().includes(q)) return false
      return true
    })
  }, [statusFilter, search])

  const counts = useMemo(() => ({
    all: ALL_INQUIRIES.length,
    new: ALL_INQUIRIES.filter((i) => i.status === 'new').length,
    replied: ALL_INQUIRIES.filter((i) => i.status === 'replied').length,
    closed: ALL_INQUIRIES.filter((i) => i.status === 'closed').length,
  }), [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <h1 className="text-h3 font-bold text-gray-900">가맹 문의 전체</h1>
            </div>
            <a href="/hq/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              ← 대시보드
            </a>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            총 {ALL_INQUIRIES.length}건 · 신규 {counts.new}건
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8 space-y-4">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status tabs */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors ' +
                  (statusFilter === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800')
                }
              >
                {tab.label}
                <span className="ml-1.5 text-gray-400">
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="이름·지역·동기 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs text-gray-500">
            {filtered.length}건 표시
          </span>
        </div>

        {/* Table */}
        <Card className="border-gray-200 shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-500">
              조건에 맞는 문의가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-5 py-3 font-medium">신청자</th>
                    <th className="px-5 py-3 font-medium hidden sm:table-cell">연락처</th>
                    <th className="px-5 py-3 font-medium">지역</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">자본</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">동기</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">문의 내용</th>
                    <th className="px-5 py-3 font-medium">신청일</th>
                    <th className="px-5 py-3 font-medium">상태</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((i) => (
                    <Fragment key={i.id}>
                      <tr
                        className={'border-t border-gray-100 transition-colors ' + (expandedId === i.id ? 'bg-blue-50/40' : 'hover:bg-gray-50/60 cursor-pointer')}
                        onClick={() => setExpandedId(expandedId === i.id ? null : i.id)}
                      >
                        <td className="px-5 py-3 font-medium text-gray-900">{i.name}</td>
                        <td className="px-5 py-3 text-gray-700 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {i.phone}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-700">{i.region}</td>
                        <td className="px-5 py-3 text-gray-700 hidden md:table-cell">{i.capital}</td>
                        <td className="px-5 py-3 text-gray-700 hidden md:table-cell">{i.motive}</td>
                        <td className="max-w-xs px-5 py-3 text-gray-600 hidden lg:table-cell">
                          <p className="line-clamp-1 text-xs">{i.question}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">{i.createdAt}</td>
                        <td className="px-5 py-3">
                          <Badge variant={STATUS_VARIANT[i.status]}>{STATUS_LABEL[i.status]}</Badge>
                        </td>
                        <td className="px-5 py-3 text-right text-gray-400">
                          {expandedId === i.id
                            ? <ChevronUp className="h-4 w-4 inline" />
                            : <ChevronDown className="h-4 w-4 inline" />}
                        </td>
                      </tr>
                      {expandedId === i.id && (
                        <tr key={`${i.id}-detail`} className="border-t border-gray-100 bg-blue-50/30">
                          <td colSpan={9} className="px-5 py-5">
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">신청자 정보</div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex gap-2"><span className="text-gray-500 w-14 shrink-0">이름</span><span className="font-medium text-gray-900">{i.name}</span></div>
                                  <div className="flex gap-2"><span className="text-gray-500 w-14 shrink-0">연락처</span><a href={`tel:${i.phone}`} className="text-blue-600 hover:underline">{i.phone}</a></div>
                                  <div className="flex gap-2"><span className="text-gray-500 w-14 shrink-0">지역</span><span className="text-gray-800">{i.region}</span></div>
                                  <div className="flex gap-2"><span className="text-gray-500 w-14 shrink-0">자본</span><span className="text-gray-800">{i.capital}</span></div>
                                  <div className="flex gap-2"><span className="text-gray-500 w-14 shrink-0">동기</span><span className="text-gray-800">{i.motive}</span></div>
                                </div>
                              </div>
                              <div className="sm:col-span-1 lg:col-span-2">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">문의 내용</div>
                                <p className="rounded-lg bg-white border border-gray-200 px-4 py-3 text-sm text-gray-800 leading-relaxed">
                                  {i.question}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <a
                                    href={`tel:${i.phone}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Phone className="h-3.5 w-3.5" />
                                    전화하기
                                  </a>
                                  <span className="inline-flex items-center text-xs text-gray-400">
                                    접수: {i.createdAt} · 상태: {STATUS_LABEL[i.status]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <p className="text-xs text-gray-400 text-right">
          * Supabase 연결 후 실시간 데이터로 전환됩니다.
        </p>
      </div>
    </main>
  )
}
