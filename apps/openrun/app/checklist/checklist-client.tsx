'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'

const STORAGE_KEY = 'openrun:checklist-v1'

interface ChecklistItem {
  id: string
  text: string
  tip?: string
}

interface Phase {
  id: string
  label: string
  period: string
  color: string
  items: ChecklistItem[]
}

const PHASES: Phase[] = [
  {
    id: 'p1',
    label: 'D-30 ~ D-21',
    period: '공간·계약 마무리',
    color: '#7C3AED',
    items: [
      { id: 'p1-1', text: '임대차 계약서 특약 사항 최종 확인 및 서명' },
      { id: 'p1-2', text: '인테리어 시공 완료 일정 재확인', tip: '지연 대비 플랜 B(가오픈 연기 기준일) 설정' },
      { id: 'p1-3', text: '간판·외부 사인물 제작 발주' },
      { id: 'p1-4', text: '본사 점포 개설 팀과 최종 일정 조율' },
      { id: 'p1-5', text: '집기·주방 설비 발주 및 납품 일정 확인' },
      { id: 'p1-6', text: 'POS 시스템 계약·납품 일정 확인' },
      { id: 'p1-7', text: '사업자 등록증 발급 완료' },
      { id: 'p1-8', text: '식품위생 영업 신고·허가 접수', tip: '처리 기간 7~14일 소요 — 일정 내 반드시 완료' },
    ],
  },
  {
    id: 'p2',
    label: 'D-20 ~ D-15',
    period: '직원 채용·교육',
    color: '#DC2626',
    items: [
      { id: 'p2-1', text: '오픈 필요 인원 채용 완료 (정규직·아르바이트)' },
      { id: 'p2-2', text: '본사 교육 일정 확인 및 직원 등록' },
      { id: 'p2-3', text: '유니폼·명찰 발주' },
      { id: 'p2-4', text: '식품위생 교육 이수 확인 (조리 담당자 필수)' },
      { id: 'p2-5', text: '직원 계좌 등록·4대 보험 취득 신고' },
      { id: 'p2-6', text: '아르바이트 채용 공고 마감 및 최종 확정' },
      { id: 'p2-7', text: '비상 연락망 구성 (본사·직원·배달앱 CS)' },
    ],
  },
  {
    id: 'p3',
    label: 'D-14 ~ D-8',
    period: 'SNS·마케팅 세팅',
    color: '#0891B2',
    items: [
      { id: 'p3-1', text: 'SNS 계정 개설 및 프로필 세팅 (인스타그램·스레드)' },
      { id: 'p3-2', text: '네이버 플레이스 정보 등록 (주소·영업시간·메뉴·사진)', tip: '검색 노출까지 3~5일 소요' },
      { id: 'p3-3', text: '카카오맵·구글 지도 정보 등록' },
      { id: 'p3-4', text: '배달앱 입점 신청 (배민·쿠팡이츠)', tip: '심사 3~7일 소요 — 오픈 전 승인 필수' },
      { id: 'p3-5', text: '오픈 D-카운트다운 SNS 스토리 연재 시작' },
      { id: 'p3-6', text: '프리오픈 이벤트 기획 (시식·할인 쿠폰·추첨)' },
      { id: 'p3-7', text: '지역 맘카페·당근마켓 사전 홍보 게시' },
      { id: 'p3-8', text: '오픈 현수막·현장 사인물 설치 확인' },
      { id: 'p3-9', text: '구글 비즈니스 프로필 등록' },
    ],
  },
  {
    id: 'p4',
    label: 'D-7 ~ D-1',
    period: '최종 점검·리허설',
    color: '#D97706',
    items: [
      { id: 'p4-1', text: '프리오픈 1회 이상 실시 (지인 초청 시식)' },
      { id: 'p4-2', text: '전 메뉴 레시피·조리법 최종 확인' },
      { id: 'p4-3', text: '매장 청소·위생 상태 최종 점검' },
      { id: 'p4-4', text: '오픈 당일 스태프 배치 계획 확정' },
      { id: 'p4-5', text: 'POS 카드·현금·배달앱 결제 테스트' },
      { id: 'p4-6', text: 'SNS 오픈 공지 예약 게시 (D-Day 아침 7시)' },
      { id: 'p4-7', text: '비품·소모품 재고 최종 확인 (테이크아웃 컵·포장재 등)' },
      { id: 'p4-8', text: '본사에 오픈 준비 완료 보고' },
    ],
  },
  {
    id: 'p5',
    label: 'D-Day',
    period: '오픈 당일',
    color: '#059669',
    items: [
      { id: 'p5-1', text: '오전 스태프 미팅 — 역할·동선 최종 확인' },
      { id: 'p5-2', text: '오픈 기념 SNS 라이브·스토리 업로드' },
      { id: 'p5-3', text: '첫 손님 응대 — 인상·반응·불편사항 메모' },
      { id: 'p5-4', text: '방문 고객 구글·네이버 리뷰 작성 안내' },
      { id: 'p5-5', text: '당일 매출·시간대별 객수 기록' },
      { id: 'p5-6', text: '돌발 상황 대응 — 본사 핫라인 즉시 연락' },
      { id: 'p5-7', text: '마감 후 팀 브리핑 — 당일 이슈 공유' },
    ],
  },
  {
    id: 'p6',
    label: 'D+1 ~ D+7',
    period: '오픈 후 1주 마무리',
    color: '#4F46E5',
    items: [
      { id: 'p6-1', text: '일별 매출·객수 집계 및 기록' },
      { id: 'p6-2', text: 'SNS 첫 주 도달·저장·팔로우 분석' },
      { id: 'p6-3', text: '네이버 플레이스·구글 리뷰 모니터링 및 댓글 응답' },
      { id: 'p6-4', text: '직원 피드백 수렴 — 운영상 개선점 도출' },
      { id: 'p6-5', text: '메뉴·가격 조정 필요 여부 검토' },
      { id: 'p6-6', text: '배달앱 첫 주 주문·리뷰 관리' },
      { id: 'p6-7', text: '본사에 오픈 1주 리포트 제출' },
      { id: 'p6-8', text: '2주차 마케팅 계획 수립 (SNS 콘텐츠 캘린더)' },
    ],
  },
]

const TOTAL_ITEMS = PHASES.flatMap((p) => p.items).length

export function ChecklistClient() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>)
    } catch { /* ignore */ }
    setMounted(true)
  }, [])

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }

  const reset = () => {
    setChecked({})
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  const doneCount = Object.values(checked).filter(Boolean).length
  const pct = Math.round((doneCount / TOTAL_ITEMS) * 100)

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-700">전체 진행률</div>
            <div className="mt-0.5 text-xs text-gray-400">{doneCount} / {TOTAL_ITEMS}개 완료</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--brand-primary)' }}>
              {mounted ? `${pct}%` : '—'}
            </span>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-50"
            >
              <RotateCcw className="h-3 w-3" /> 초기화
            </button>
          </div>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: mounted ? `${pct}%` : '0%', background: 'var(--brand-primary)' }}
          />
        </div>
        {pct === 100 && (
          <p className="mt-3 text-center text-sm font-semibold" style={{ color: 'var(--brand-primary)' }}>
            🎉 모든 항목 완료! 성공적인 오픈을 응원합니다.
          </p>
        )}
      </div>

      {/* Phases */}
      {PHASES.map((phase) => {
        const phaseDone = phase.items.filter((i) => checked[i.id]).length
        return (
          <div key={phase.id}>
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                style={{ background: phase.color }}
              >
                {phase.label.split('~')[0]?.trim().replace('D', 'D').split(' ')[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{phase.period}</div>
                <div className="text-xs text-gray-400">{phase.label} &nbsp;·&nbsp; {phaseDone}/{phase.items.length}개 완료</div>
              </div>
            </div>
            <Card className="border-gray-200">
              <CardContent className="divide-y divide-gray-50 p-0">
                {phase.items.map((item) => {
                  const done = mounted ? !!checked[item.id] : false
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
                    >
                      {done
                        ? <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 h-[18px] w-[18px]" style={{ color: phase.color }} />
                        : <Circle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gray-300" />
                      }
                      <div className="min-w-0 flex-1">
                        <span className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {item.text}
                        </span>
                        {item.tip && !done && (
                          <p className="mt-0.5 text-xs text-amber-600">{item.tip}</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )
      })}

      {/* CTA */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>
              오픈런 캠페인
            </div>
            <h2 className="mt-2 text-lg font-bold">체크리스트 완성, 마케팅은 오픈런이 책임집니다</h2>
            <p className="mt-1 text-sm text-gray-300">
              SNS·광고·PR 통합 운영으로 오픈 30일 효과를 365일로 연장합니다.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand-primary)' }}
          >
            캠페인 의뢰하기
          </a>
        </div>
      </div>
    </div>
  )
}
