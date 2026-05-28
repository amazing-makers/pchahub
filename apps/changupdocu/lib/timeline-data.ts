export interface TimelinePhase {
  id: string
  order: number
  phase: string
  duration: string
  colorClass: string
  bgLightClass: string
  textColorClass: string
  borderColorClass: string
  title: string
  description: string
  tasks: Array<{ task: string; critical: boolean; tip?: string }>
  commonMistakes: string[]
}

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: 'preparation',
    order: 1,
    phase: '준비기',
    duration: '1-3개월',
    colorClass: 'bg-blue-500',
    bgLightClass: 'bg-blue-50',
    textColorClass: 'text-blue-700',
    borderColorClass: 'border-blue-200',
    title: '시장조사·브랜드 선택·자금 계획',
    description:
      '창업의 성패를 가르는 준비 단계입니다. 충분한 시장조사와 자금 계획 없이 서두르면 나중에 돌이킬 수 없는 선택을 하게 됩니다.',
    tasks: [
      {
        task: '관심 업종 3개 이상 시장 조사 (상권, 경쟁 현황, 객단가)',
        critical: true,
        tip: '직접 발로 뛰며 오전·오후·저녁 각각 방문해 유동인구를 세어보세요.',
      },
      {
        task: '공정거래위원회 가맹사업 정보공개서 3개 브랜드 이상 열람·비교',
        critical: true,
        tip: '정보공개서는 공정위 가맹사업정보제공시스템(franchise.ftc.go.kr)에서 무료로 열람 가능합니다.',
      },
      {
        task: '개인 자금 한도 및 대출 가능 금액 파악 (순수 창업 자금 = 자기자본 + 대출)',
        critical: true,
      },
      {
        task: '본사 IR(설명회) 및 가맹 상담 2곳 이상 참석',
        critical: false,
        tip: '설명회에서 듣는 말과 정보공개서의 수치를 반드시 교차 확인하세요.',
      },
      {
        task: '기존 가맹점주 직접 방문 인터뷰 (본사 소개 점포 외 임의로 선택)',
        critical: true,
        tip: '본사가 소개한 점포만 방문하지 말고, 지도에서 임의로 3곳 이상 방문하세요.',
      },
      {
        task: '희망 입지 후보 3곳 이상 발굴 및 유동인구·임대료 조사',
        critical: false,
      },
      {
        task: '사업계획서 초안 작성 (1년차 손익예상, 월별 현금흐름)',
        critical: false,
        tip: '낙관 시나리오 하나만 작성하지 말고, 최악의 경우(매출 목표의 60%)도 시뮬레이션하세요.',
      },
      {
        task: '가족·배우자와 창업 계획 공유 및 동의 확보',
        critical: false,
      },
    ],
    commonMistakes: [
      '설명회에서 들은 평균 매출을 그대로 믿고 수익 계산. 실제 하위 20%·상위 20% 점포 매출 차이를 확인하지 않음.',
      '자기자본이 20% 미만인 상태에서 전액 대출로 창업 — 초기 이자 부담이 손익분기점을 올림.',
      '주변에 비슷한 업종이 없어서 괜찮다고 판단 — 비슷한 업종이 없는 건 수요가 없다는 신호일 수도 있음.',
    ],
  },
  {
    id: 'contract',
    order: 2,
    phase: '계약기',
    duration: '2-4주',
    colorClass: 'bg-purple-500',
    bgLightClass: 'bg-purple-50',
    textColorClass: 'text-purple-700',
    borderColorClass: 'border-purple-200',
    title: '가맹계약 검토·임대차 계약',
    description:
      '계약서에 도장 찍기 전, 전문가 검토가 필수입니다. 계약 조건 하나하나가 수년간의 운영을 제약합니다.',
    tasks: [
      {
        task: '가맹계약서 법무사·변호사 또는 가맹거래사에게 검토 의뢰',
        critical: true,
        tip: '한국공정거래조정원 가맹분쟁조정협의회에서 무료 법률 상담을 받을 수 있습니다.',
      },
      {
        task: '정보공개서 제공일로부터 14일 이후에만 계약 체결 (법적 의무)',
        critical: true,
      },
      {
        task: '임대차 계약서 검토 — 임대 기간, 계약 갱신 요구권, 원상복구 조항 확인',
        critical: true,
        tip: '상가건물 임대차보호법상 임차인은 10년간 계약 갱신 요구권을 행사할 수 있습니다.',
      },
      {
        task: '가맹금·인테리어 비용·교육비 등 초기 비용 전체 목록 서면 확인',
        critical: true,
      },
      {
        task: '로열티·물류비·광고분담금 등 월 고정 지출 항목 계산',
        critical: false,
        tip: '매출의 몇 %인지가 아니라 최저 보장 금액이 있는지 확인하세요.',
      },
      {
        task: '계약 해지 조건 및 위약금 조항 파악',
        critical: false,
      },
    ],
    commonMistakes: [
      '정보공개서를 받은 당일 또는 며칠 안에 계약 — 14일 숙려 기간을 건너뜀.',
      '구두로 약속받은 인테리어 지원·매출 보장 조건이 계약서에 없음.',
      '임대차 계약 시 건물주가 "갱신은 당연히 해준다"는 말만 믿고 갱신 조항을 서면화하지 않음.',
    ],
  },
  {
    id: 'construction',
    order: 3,
    phase: '구축기',
    duration: '1-3개월',
    colorClass: 'bg-orange-500',
    bgLightClass: 'bg-orange-50',
    textColorClass: 'text-orange-700',
    borderColorClass: 'border-orange-200',
    title: '인테리어·설비·인허가',
    description:
      '공사는 예상보다 늦어지고, 비용은 예상보다 초과되는 경우가 대부분입니다. 일정과 예산에 10~20% 버퍼를 두세요.',
    tasks: [
      {
        task: '인테리어 업체 3곳 이상 견적 비교 (본사 지정 업체 포함)',
        critical: true,
        tip: '본사 지정 업체가 강제되는 경우 계약서에 명시되어 있어야 합니다. 강요가 불법인지 확인하세요.',
      },
      {
        task: '공사 일정 계획 수립 (착공일 ~ 완공일, 검수일, 오픈일)',
        critical: true,
      },
      {
        task: '인허가 필요 항목 확인 — 식품영업허가, 소방완비증명, 영업신고 등',
        critical: true,
        tip: '관할 구청 위생과에 방문해 인허가 체크리스트를 받으세요. 인허가 없이 오픈하면 즉시 영업정지입니다.',
      },
      {
        task: '주방 설비 발주 및 납기 확인 (냉장고·가스·후드 등 납기 4-8주 소요)',
        critical: true,
        tip: '설비 납기를 늦게 발주하면 공사 완료 후 오픈이 2-4주 지연되는 경우가 흔합니다.',
      },
      {
        task: '간판·사인물 제작·설치 (구청 옥외광고물 허가 필요)',
        critical: false,
      },
      {
        task: '결제 단말기·POS·CCTV 등 IT 설비 계획 및 발주',
        critical: false,
        tip: '카드 단말기는 오픈 최소 1주 전에 개통 신청해야 합니다.',
      },
      {
        task: '소방시설 점검 및 소방완비증명 취득',
        critical: true,
      },
      {
        task: '인테리어 공사 현장 진도 주 1회 이상 직접 확인',
        critical: false,
      },
      {
        task: '공사 완료 후 하자 점검 및 보완 요청 목록 작성',
        critical: false,
        tip: '준공 검수 시 꼼꼼히 확인하지 않으면 오픈 후 하자 보수 요청이 어려워집니다.',
      },
    ],
    commonMistakes: [
      '인허가 신청을 오픈 직전에 시작 — 처리 기간(7~14 영업일)을 고려하지 않아 오픈이 지연됨.',
      '인테리어 공사비가 초과될 때 "어차피 한 번 하는 것"이라며 추가 승인 — 예산 20% 초과가 흔함.',
      '설비 납기 확인 없이 발주 → 오픈일에 냉장고·에어컨이 없는 상황 발생.',
    ],
  },
  {
    id: 'opening',
    order: 4,
    phase: '오픈기',
    duration: '2-4주',
    colorClass: 'bg-pink-500',
    bgLightClass: 'bg-pink-50',
    textColorClass: 'text-pink-700',
    borderColorClass: 'border-pink-200',
    title: '사전마케팅·직원교육·오픈이벤트',
    description:
      '오픈 초기 2주가 장기 매출의 기준점을 만듭니다. 첫 방문 고객의 경험이 재방문과 입소문을 결정합니다.',
    tasks: [
      {
        task: '오픈 2주 전부터 SNS·카카오맵·네이버플레이스 채널 개설 및 사전 예고 콘텐츠 업로드',
        critical: true,
        tip: '네이버 플레이스 등록은 오픈 최소 2주 전에 신청해야 오픈일에 노출됩니다.',
      },
      {
        task: '직원 채용 완료 및 오픈 전 3~5일 교육·리허설',
        critical: true,
      },
      {
        task: '오픈 이벤트 기획 (할인, 무료 증정, 방문 인증 이벤트 등)',
        critical: false,
        tip: '이벤트 예산을 전체 개업 비용의 1-2%로 잡고 집행하세요.',
      },
      {
        task: '소프트 오픈(가오픈) 1-3일 진행 — 실제 운영 리허설',
        critical: true,
        tip: '소프트 오픈 때 발견한 운영 문제를 그랜드 오픈 전에 수정할 수 있습니다.',
      },
      {
        task: '초도 식자재·소모품 재고 수량 결정 및 발주',
        critical: true,
      },
      {
        task: '오픈 후 1주 일별 매출·객수·인기 메뉴 데이터 기록',
        critical: false,
        tip: '첫 주 데이터가 이후 재고 발주·인력 배치의 기준이 됩니다.',
      },
      {
        task: '본사 슈퍼바이저 오픈 지원 일정 확인 및 요청',
        critical: false,
      },
    ],
    commonMistakes: [
      '네이버 플레이스·카카오맵 등록을 오픈 당일 또는 이후에 신청 — 오픈 초기 온라인 검색 유입을 놓침.',
      '소프트 오픈 없이 바로 그랜드 오픈 — 서비스 혼선이 첫 고객 인상에 영향을 미침.',
      '오픈 이벤트에 예산을 과잉 집행하고 이후 운전자금 부족 상황 초래.',
    ],
  },
  {
    id: 'growth',
    order: 5,
    phase: '성장기',
    duration: '지속',
    colorClass: 'bg-green-500',
    bgLightClass: 'bg-green-50',
    textColorClass: 'text-green-700',
    borderColorClass: 'border-green-200',
    title: '운영 최적화·재투자',
    description:
      '오픈 이후가 진짜 창업입니다. 데이터 기반으로 운영을 최적화하고, 재투자 타이밍을 놓치지 않는 것이 장기 생존의 핵심입니다.',
    tasks: [
      {
        task: '월별 손익계산서 직접 작성 및 원가율·인건비율·임대료율 추적',
        critical: true,
        tip: '매출 대비 식자재비 30%, 인건비 30%, 임대료 10% 이하를 목표로 관리하세요.',
      },
      {
        task: '네이버플레이스·배달앱 리뷰 48시간 이내 답글 운영',
        critical: true,
        tip: '사장 답글 응답률 90% 이상 유지하면 검색 노출 순위에도 긍정적 영향을 줍니다.',
      },
      {
        task: '분기별 메뉴 리뷰 — 판매 하위 20% 메뉴 폐기 또는 리뉴얼',
        critical: false,
      },
      {
        task: '직원 근태·급여·4대보험 관리 체계 구축',
        critical: true,
        tip: '직원 1명이라도 4대보험 미가입 시 과태료 대상이 됩니다.',
      },
      {
        task: '손익분기점 달성 후 재투자 계획 수립 (추가 점포, 설비 업그레이드 등)',
        critical: false,
      },
      {
        task: '본사 슈퍼바이저·점주 모임을 통한 우수 운영 사례 벤치마킹',
        critical: false,
        tip: '같은 브랜드 내 매출 상위 점포의 운영 방식을 직접 견학 요청해 보세요.',
      },
      {
        task: '계약 갱신 시점(오픈 후 1~2년 전) 미리 임대인과 갱신 협의 시작',
        critical: false,
        tip: '갱신 협의는 계약 만료 6개월 전부터 시작하면 협상력이 높습니다.',
      },
    ],
    commonMistakes: [
      '손익 관리를 감각에 맡기고 월별 숫자를 들여다보지 않음 — 원가율이 10%p 올라가도 모르는 경우가 많음.',
      '리뷰 답글을 방치 — 부정 리뷰가 누적되어 온라인 평판이 무너지기까지 6개월이 걸리지 않음.',
      '손익분기점 도달 전에 두 번째 매장 계획 — 운전자금 부족으로 첫 번째 매장까지 위태로워짐.',
    ],
  },
]

export const TOTAL_MIN_WEEKS = 18 // 준비기 4주 + 계약기 2주 + 구축기 4주 + 오픈기 2주 + 최소 성장 6주
export const TOTAL_MAX_WEEKS = 48 // 준비기 12주 + 계약기 4주 + 구축기 12주 + 오픈기 4주 + 성장 16주
