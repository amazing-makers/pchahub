export interface RoadmapStage {
  id: string
  order: number // 1-6
  title: string
  subtitle: string
  duration: string // '2-4주' etc
  colorClass: string // tailwind bg color like 'bg-blue-500'
  textColorClass: string // 'text-blue-600'
  borderColorClass: string // 'border-blue-200'
  bgLightClass: string // 'bg-blue-50'
  skills: string[] // 5-7 skills/knowledge items
  milestone: string // achievement that marks completion
  resources: Array<{ type: '강의' | '가이드' | '멘토링'; label: string; href: string }>
}

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 'preparation',
    order: 1,
    title: '창업 준비',
    subtitle: '브랜드 선택·시장조사·자금 계획',
    duration: '2-4주',
    colorClass: 'bg-blue-500',
    textColorClass: 'text-blue-600',
    borderColorClass: 'border-blue-200',
    bgLightClass: 'bg-blue-50',
    skills: [
      '관심 업종 및 브랜드 후보 10개 선정',
      '정보공개서 열람 및 핵심 항목 해석',
      '경쟁 브랜드 상권·수익 구조 비교',
      '초기 창업 자금 및 운전 자금 계산',
      '금융 대출 한도 및 정부 지원금 파악',
      '개인 리스크 허용 범위 및 투자 기준 설정',
    ],
    milestone: '브랜드 후보 3개로 압축 완료 및 자금 조달 계획서 작성',
    resources: [
      { type: '강의', label: '정보공개서 완전 정복', href: '/courses?category=disclosure' },
      { type: '가이드', label: '창업 자금 계획 가이드', href: '/knowhow?tag=funding' },
      { type: '멘토링', label: '창업 전략 멘토 상담', href: '/mentors?specialty=startup' },
    ],
  },
  {
    id: 'contract',
    order: 2,
    title: '계약 & 법무',
    subtitle: '가맹 계약서 검토·임대차 계약',
    duration: '1-2주',
    colorClass: 'bg-purple-500',
    textColorClass: 'text-purple-600',
    borderColorClass: 'border-purple-200',
    bgLightClass: 'bg-purple-50',
    skills: [
      '가맹 계약서 핵심 조항(위약금·영업지역) 분석',
      '불공정 약관 식별 및 협상 포인트 파악',
      '임대차 계약 핵심 조건(권리금·보증금·임대료) 검토',
      '상가 임대차 보호법 적용 요건 확인',
      '사업자 등록 유형 선택(개인·법인) 및 세무 전략',
      '계약 전 변호사·세무사 검토 체크리스트 작성',
    ],
    milestone: '가맹계약서 서명 완료 및 임대차계약 체결',
    resources: [
      { type: '강의', label: '가맹 계약서 조항별 해설', href: '/courses?category=contract' },
      { type: '가이드', label: '임대차 협상 체크리스트', href: '/knowhow?tag=lease' },
      { type: '멘토링', label: '법무·계약 전문 멘토', href: '/mentors?specialty=legal' },
    ],
  },
  {
    id: 'interior',
    order: 3,
    title: '인테리어 & 설비',
    subtitle: '공간 설계·시공 관리',
    duration: '4-8주',
    colorClass: 'bg-orange-500',
    textColorClass: 'text-orange-600',
    borderColorClass: 'border-orange-200',
    bgLightClass: 'bg-orange-50',
    skills: [
      '본사 지정 인테리어 기준(CI·SI) 이해',
      '인테리어 업체 견적 비교 및 계약 체결',
      '시공 단계별 체크포인트(전기·배관·설비)',
      '주방 동선 설계 및 조리 장비 배치 최적화',
      'POS·키오스크·CCTV 등 운영 IT 설비 설치',
      '시공 완료 후 스나그리스트(하자) 점검 방법',
    ],
    milestone: '인테리어 시공 완료·설비 설치 완료·본사 현장 검수 통과',
    resources: [
      { type: '강의', label: '매장 인테리어 공사 관리법', href: '/courses?category=interior' },
      { type: '가이드', label: '주방 설비 선정 가이드', href: '/knowhow?tag=equipment' },
      { type: '멘토링', label: '인테리어·설비 경험 멘토', href: '/mentors?specialty=interior' },
    ],
  },
  {
    id: 'menu',
    order: 4,
    title: '메뉴 & 레시피',
    subtitle: '메뉴 구성·원가 계산',
    duration: '2-3주',
    colorClass: 'bg-green-500',
    textColorClass: 'text-green-600',
    borderColorClass: 'border-green-200',
    bgLightClass: 'bg-green-50',
    skills: [
      '본사 레시피 교육 수료 및 표준 조리법 습득',
      '재료별 원가율 계산 및 목표 식재료비 설정',
      '메뉴별 마진 분석 및 주력·보조 메뉴 구분',
      '발주·재고 관리 시스템 사용법 익히기',
      '조리 위생 기준(HACCP) 이해 및 실습',
      '계절 한정 메뉴 및 프로모션 기획 방법',
    ],
    milestone: '본사 교육 수료증 취득 및 메뉴별 원가표 작성 완료',
    resources: [
      { type: '강의', label: '원가 계산 & 메뉴 엔지니어링', href: '/courses?category=menu' },
      { type: '가이드', label: '식자재 발주 관리 노하우', href: '/knowhow?tag=inventory' },
      { type: '멘토링', label: '메뉴·레시피 전문 멘토', href: '/mentors?specialty=recipe' },
    ],
  },
  {
    id: 'marketing',
    order: 5,
    title: '마케팅 & 오픈',
    subtitle: 'SNS 사전 마케팅·오픈 이벤트',
    duration: '2-4주',
    colorClass: 'bg-pink-500',
    textColorClass: 'text-pink-600',
    borderColorClass: 'border-pink-200',
    bgLightClass: 'bg-pink-50',
    skills: [
      '오픈 D-30 SNS 계정 개설 및 사전 홍보 콘텐츠 제작',
      '네이버 플레이스·카카오맵 매장 등록 및 정보 입력',
      '배달 플랫폼(배민·쿠팡이츠) 입점 설정',
      '오픈 이벤트 기획(사은품·할인 프로모션)',
      '지역 맘카페·커뮤니티·인플루언서 협업 전략',
      '오픈 당일 응대 매뉴얼 및 비상 대응 계획 수립',
    ],
    milestone: '그랜드 오픈 완료 및 첫 주 매출 목표 달성',
    resources: [
      { type: '강의', label: '매장 SNS 마케팅 완벽 가이드', href: '/courses?category=marketing' },
      { type: '가이드', label: '오픈 이벤트 기획 체크리스트', href: '/knowhow?tag=opening' },
      { type: '멘토링', label: '마케팅·오픈 경험 멘토', href: '/mentors?specialty=marketing' },
    ],
  },
  {
    id: 'operations',
    order: 6,
    title: '운영 & 성장',
    subtitle: '직원 교육·고객 관리·재무',
    duration: '지속',
    colorClass: 'bg-teal-500',
    textColorClass: 'text-teal-600',
    borderColorClass: 'border-teal-200',
    bgLightClass: 'bg-teal-50',
    skills: [
      '직원 채용·온보딩·급여 관리 체계 구축',
      '월별 손익계산서 작성 및 재무 현황 파악',
      '고객 불만 처리 프로세스 및 리뷰 관리 전략',
      '시간대별·요일별 매출 분석 및 인력 배치 최적화',
      '본사 정기 점검 대비 위생·운영 기준 유지',
      '리뉴얼·메뉴 추가·분점 출점 시기 판단 기준',
    ],
    milestone: '월 순이익 목표 달성 및 분점 출점 또는 재계약 의사 결정',
    resources: [
      { type: '강의', label: '점주 재무·회계 기초 강의', href: '/courses?category=accounting' },
      { type: '가이드', label: '직원 관리·노무 노하우', href: '/knowhow?tag=staffing' },
      { type: '멘토링', label: '운영 베테랑 점주 멘토링', href: '/mentors?specialty=operations' },
    ],
  },
]
