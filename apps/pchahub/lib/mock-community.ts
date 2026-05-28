// Curated community content for pchahub. Larger discussions live on
// jangsanote.kr; pchahub surfaces just enough to support franchise decisions.

export interface MockDiscussion {
  id: string
  title: string
  excerpt: string
  category: 'experience' | 'question' | 'tip' | 'news'
  categoryLabel: string
  author: string
  /** ISO date */
  createdAt: string
  views: number
  comments: number
  /** Optionally tagged with a brand id. */
  brandId?: string
  /** Cover image URL for card display */
  coverImage?: string
}

export const DISCUSSIONS: MockDiscussion[] = [
  {
    id: 'd1',
    title: '저자본 카페 창업 — 4천만원으로 1년 회수한 경험',
    excerpt:
      '권리금 없는 자리를 찾는 데 두 달이 걸렸습니다. 대신 보증금과 인테리어로 비용을 묶어두고 마케팅을 매출 비례로...',
    category: 'experience',
    categoryLabel: '창업 후기',
    author: '안양카페점주',
    createdAt: '2026-04-15',
    views: 1842,
    comments: 38,
    brandId: 'b2',
    coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'd2',
    title: '치킨 프랜차이즈 가맹비 정말 의무인가요?',
    excerpt:
      '브랜드마다 가맹비가 천차만별인데, 본사 입장에선 거의 무조건 받아가는 비용이라고 들었습니다. 협상 여지가 있을지...',
    category: 'question',
    categoryLabel: '질문',
    author: '예비창업자73',
    createdAt: '2026-04-12',
    views: 924,
    comments: 21,
    brandId: 'b1',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'd3',
    title: '본사 시스템이 부실한 브랜드 알아보는 방법',
    excerpt:
      '슈퍼바이저 방문 빈도, 본사 사옥 직접 방문, 기존 점주 인터뷰 — 가맹 전에 반드시 확인하세요. 제 경험 공유합니다.',
    category: 'tip',
    categoryLabel: '팁',
    author: '15년차자영업',
    createdAt: '2026-04-08',
    views: 3210,
    comments: 67,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'd4',
    title: '2026년 1분기 프랜차이즈 매출 동향 — 카페와 디저트 강세',
    excerpt:
      '협회 발표 자료를 정리해봤습니다. 카페가 전년 동기 대비 +12%, 디저트가 +18%로 강세. 치킨은 정체, 한식은...',
    category: 'news',
    categoryLabel: '시장 동향',
    author: '프차분석가',
    createdAt: '2026-04-05',
    views: 5640,
    comments: 92,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'd5',
    title: '인테리어 비용 — 본사 지정 vs 직접 발주, 무엇이 유리한가',
    excerpt:
      '본사 지정 시공은 평당 100만원 이상인데 직접 발주하면 70만원 정도에 가능합니다. 하지만 본사 기준 통과 어려움이...',
    category: 'tip',
    categoryLabel: '팁',
    author: '인테리어해본점주',
    createdAt: '2026-04-02',
    views: 2156,
    comments: 44,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'd6',
    title: '여성 1인 운영 가능한 프랜차이즈 추천',
    excerpt:
      '체력 부담 적고, 인력 없이도 운영 가능한 브랜드를 찾고 있습니다. 배달 비중이 낮으면서 객단가가 낮아 회전이...',
    category: 'question',
    categoryLabel: '질문',
    author: '워킹맘예비창업',
    createdAt: '2026-03-28',
    views: 1422,
    comments: 29,
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'd7',
    title: '본사 폐업 시 점주들은 어떻게 되나요?',
    excerpt:
      '본사가 부도나면 보증금, 가맹비, 브랜드 사용권은 어떻게 되는지 정리해봤습니다. 가맹사업법상 권리...',
    category: 'tip',
    categoryLabel: '팁',
    author: '법률조언가',
    createdAt: '2026-03-20',
    views: 4180,
    comments: 73,
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'd8',
    title: '월매출 1,500만원 매장의 실제 손익 분석',
    excerpt:
      '월매출 1,500만원이면 영업이익이 얼마나 남을까요? 임대료, 인건비, 식자재, 로열티, 광고비 모두 빼고 계산해봤...',
    category: 'experience',
    categoryLabel: '창업 후기',
    author: '강남치킨3년차',
    createdAt: '2026-03-15',
    views: 7240,
    comments: 128,
    brandId: 'b1',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=640&q=80',
  },
]

export interface MockQuestion {
  id: string
  q: string
  a: string
  brandId?: string
  /** "5년차 점주", "본사 관계자", "변리사" 같은 답변자 자기소개 */
  answeredBy: string
  helpful: number
}

export const QUESTIONS: MockQuestion[] = [
  {
    id: 'q1',
    q: '가맹계약 갱신 시 인테리어 재공사 의무가 있나요?',
    a: '대부분의 본사는 갱신 시점에 인테리어 재공사를 요구합니다. 다만 가맹사업법상 점주가 부담해야 하는 재공사 비용에는 상한선이 있고, 본사가 일방적으로 강요할 수 없습니다.',
    answeredBy: '가맹사업법 자문 변호사',
    helpful: 89,
  },
  {
    id: 'q2',
    q: '본사가 제시한 평균 매출, 어디까지 믿어야 할까요?',
    a: '정보공개서에 기재된 평균 매출은 협회 검증을 거친 수치라 통계적 신뢰는 있습니다. 다만 "평균"이라 본인 입지가 평균 이하라면 매출도 평균보다 낮을 수 있습니다. 본사가 추천한 입지의 상권 분석 보고서를 추가로 요청하세요.',
    answeredBy: '15년차 컨설턴트',
    helpful: 64,
  },
  {
    id: 'q3',
    q: '본사 직영점이 적은 브랜드는 피해야 하나요?',
    a: '필수는 아니지만 직영점이 거의 없는 브랜드는 본사가 운영 노하우를 충분히 검증하지 못했을 가능성이 있습니다. 직영점 3개 이상, 가맹점 50개 이상을 안전선으로 보는 게 일반적입니다.',
    answeredBy: '프차업계 분석가',
    helpful: 52,
  },
  {
    id: 'q4',
    q: '경쟁 브랜드 한 자리에 동시 출점, 막을 수 있나요?',
    a: '가맹계약서에 "영업지역 보호" 조항이 있다면 본사는 일정 반경 내 신규 매장을 출점할 수 없습니다. 보호 반경(보통 500m~1km)이 명시되어 있는지 확인하세요.',
    answeredBy: '점주 협의회 회장',
    helpful: 71,
  },
  {
    id: 'q5',
    q: '인테리어 비용 분쟁이 가장 많이 일어나는 이유는?',
    a: '본사 지정 시공이 의무인 경우, 단가가 시장 평균보다 20-30% 높게 책정되는 경우가 있습니다. 견적서를 사전에 받고 정보공개서에 명시된 비용 범위와 일치하는지 확인하세요.',
    answeredBy: '소비자원 분쟁조정 위원',
    helpful: 47,
  },
  {
    id: 'q6',
    q: '월 로열티가 매출 비례인 브랜드는 어떻게 봐야 하나요?',
    a: '매출이 잘 나오면 로열티 부담이 커지지만, 안 나오면 적게 냅니다. 안정성을 원하면 고정 로열티, 매출 가변성을 감수하면 비례 로열티가 유리합니다. 본사 입장에서는 비례형이 인센티브 정렬에 좋습니다.',
    answeredBy: '회계사 / 창업 컨설턴트',
    helpful: 38,
  },
]
