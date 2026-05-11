// Mock data for jangsanote — owner community.

export type ChannelType = 'category' | 'region' | 'general'

export interface MockChannel {
  key: string
  type: ChannelType
  label: string
  description: string
  memberCount: number
  postCount: number
  icon?: string
}

export interface MockUser {
  id: string
  handle: string
  /** "5년차 카페 점주" etc. */
  role: string
  avatarColor: string
  /** Trust / verification badge. */
  badge?: 'verified' | 'expert' | 'hq' | null
  postCount: number
  helpfulCount: number
}

export interface MockComment {
  id: string
  authorId: string
  content: string
  createdAt: string
  likes: number
  replyToId?: string
}

export type PostCategory = 'experience' | 'question' | 'tip' | 'news' | 'discussion'

export interface MockPost {
  id: string
  title: string
  excerpt: string
  content: string[]
  authorId: string
  channelType: ChannelType
  channelKey: string
  category: PostCategory
  tags: string[]
  anonymous: boolean
  pinned: boolean
  hot: boolean
  createdAt: string
  views: number
  likes: number
  commentCount: number
  comments: MockComment[]
}

export const CATEGORY_LABEL: Record<PostCategory, string> = {
  experience: '운영 후기',
  question: '질문',
  tip: '팁·노하우',
  news: '시장 동향',
  discussion: '토론',
}

export const CHANNELS: MockChannel[] = [
  // 업종방
  { key: 'chicken', type: 'category', label: '치킨방', description: '치킨 가맹점·자영업', memberCount: 1240, postCount: 386 },
  { key: 'cafe', type: 'category', label: '카페방', description: '카페·디저트 카페 운영', memberCount: 1860, postCount: 524 },
  { key: 'korean', type: 'category', label: '한식방', description: '한식·도시락·국밥', memberCount: 720, postCount: 218 },
  { key: 'japanese', type: 'category', label: '일식방', description: '일식·라멘·스시', memberCount: 410, postCount: 102 },
  { key: 'snack', type: 'category', label: '분식방', description: '분식·간식', memberCount: 580, postCount: 162 },
  { key: 'dessert', type: 'category', label: '디저트방', description: '디저트·베이커리', memberCount: 380, postCount: 96 },
  { key: 'beverage', type: 'category', label: '음료방', description: '주스·스무디·차', memberCount: 290, postCount: 64 },
  { key: 'bar', type: 'category', label: '주점방', description: '주점·이자카야·포차', memberCount: 340, postCount: 128 },
  // 지역방
  { key: 'seoul', type: 'region', label: '서울방', description: '서울 자영업·점주', memberCount: 2480, postCount: 612 },
  { key: 'gyeonggi', type: 'region', label: '경기·인천방', description: '수도권 동남·서북', memberCount: 1920, postCount: 488 },
  { key: 'busan', type: 'region', label: '부산방', description: '부산·울산·경남', memberCount: 820, postCount: 246 },
  { key: 'daegu', type: 'region', label: '대구방', description: '대구·경북', memberCount: 540, postCount: 154 },
  { key: 'daejeon', type: 'region', label: '대전방', description: '대전·세종·충청', memberCount: 380, postCount: 102 },
  { key: 'gwangju', type: 'region', label: '광주방', description: '광주·전라', memberCount: 320, postCount: 88 },
  // 자유
  { key: 'general', type: 'general', label: '자유게시판', description: '주제 자유 토론', memberCount: 3680, postCount: 924 },
]

export const USERS: MockUser[] = [
  { id: 'u1', handle: '강남치킨3년차', role: '치킨 가맹점주 · 3년차', avatarColor: '#EA580C', badge: 'verified', postCount: 38, helpfulCount: 412 },
  { id: 'u2', handle: '안양카페점주', role: '카페 가맹점주 · 2년차', avatarColor: '#92400E', badge: 'verified', postCount: 24, helpfulCount: 286 },
  { id: 'u3', handle: '예비창업자73', role: '창업 검토자', avatarColor: '#3B82F6', badge: null, postCount: 12, helpfulCount: 38 },
  { id: 'u4', handle: '15년차자영업', role: '다업종 점주 · 15년차', avatarColor: '#7C3AED', badge: 'expert', postCount: 142, helpfulCount: 2840 },
  { id: 'u5', handle: '프차분석가', role: '프랜차이즈 분석가', avatarColor: '#10B981', badge: 'expert', postCount: 86, helpfulCount: 1620 },
  { id: 'u6', handle: '인테리어해본점주', role: '시공·운영 경험자', avatarColor: '#64748B', badge: 'verified', postCount: 22, helpfulCount: 318 },
  { id: 'u7', handle: '워킹맘예비창업', role: '예비 점주', avatarColor: '#EC4899', badge: null, postCount: 8, helpfulCount: 26 },
  { id: 'u8', handle: '법률조언가', role: '가맹사업법 변호사', avatarColor: '#A78BFA', badge: 'expert', postCount: 64, helpfulCount: 1480 },
  { id: 'u9', handle: '한식점주김', role: '한식 점주 · 4년차', avatarColor: '#16A34A', badge: 'verified', postCount: 18, helpfulCount: 162 },
  { id: 'u10', handle: '익명점주123', role: '익명', avatarColor: '#94A3B8', badge: null, postCount: 4, helpfulCount: 18 },
  { id: 'u11', handle: '본사관계자', role: '본사 직원 · 검증', avatarColor: '#0EA5E9', badge: 'hq', postCount: 32, helpfulCount: 384 },
  { id: 'u12', handle: '광주분식', role: '분식 점주 · 5년차', avatarColor: '#F59E0B', badge: 'verified', postCount: 26, helpfulCount: 218 },
  { id: 'u13', handle: '심야주점운영', role: '주점 점주 · 7년차', avatarColor: '#DC2626', badge: 'verified', postCount: 16, helpfulCount: 142 },
]

const C = (authorId: string, content: string, createdAt: string, likes: number): MockComment => ({
  id: `c-${Math.random().toString(36).slice(2, 9)}`,
  authorId,
  content,
  createdAt,
  likes,
})

export const POSTS: MockPost[] = [
  {
    id: 'p1',
    title: '치킨 가맹 5년차, 매출 40% 떨어진 이유 분석해봤습니다',
    excerpt:
      '재작년 대비 매출이 40% 떨어졌습니다. 본사 탓도 있지만 제 운영 패턴 점검도 필요했어요. 4가지 원인 정리해서 공유합니다.',
    content: [
      '강남 인근에서 치킨 가맹 5년째 운영 중인 점주입니다. 재작년 대비 월 평균 매출이 40% 정도 떨어진 상태이고, 이번 분기는 처음으로 적자가 났습니다.',
      '본사 갈등도 있지만 그것만은 아니라고 생각해서 4가지 원인을 정리해봤습니다. 1) 동일 카테고리 신규 매장 6개가 1km 내에 들어왔습니다. 본사가 영업지역 보호 조항 해석을 느슨하게 해서 막을 수가 없었어요.',
      '2) 배달앱 의존도가 높았는데 작년부터 수수료 + 광고비 비중이 23%까지 올라갔습니다. 3) 점심 객수를 늘려보려고 점심 신메뉴 출시했는데 회전율이 안 따라줘서 오히려 직원 1명 추가 인건비만 늘었어요.',
      '4) 단골 SNS 마케팅을 본사에 의존했는데 신메뉴 출시 외엔 본사 노출이 미미했습니다. 결론적으로 본사 책임은 50% 정도이고 나머지는 제 운영 책임이라고 봅니다.',
      '비슷한 처지의 점주 분들 어떻게 대응하고 계신지 듣고 싶습니다.',
    ],
    authorId: 'u1',
    channelType: 'category',
    channelKey: 'chicken',
    category: 'experience',
    tags: ['매출부진', '5년차', '치킨', '솔직후기'],
    anonymous: false,
    pinned: true,
    hot: true,
    createdAt: '2026-05-08T09:24:00',
    views: 8420,
    likes: 312,
    commentCount: 4,
    comments: [
      C('u4', '비슷한 상황이었는데 결국 인건비 + 광고비 2개를 줄였습니다. 본인 시간 늘리는 방식이긴 한데 단기엔 어쩔 수 없어요.', '2026-05-08T10:12:00', 48),
      C('u5', '본사 매장 거리 제한 조항 다시 한 번 검토해보세요. 2024년 가맹사업법 개정 후 본사 책임 범위가 명시적으로 늘어났습니다.', '2026-05-08T11:05:00', 64),
      C('u11', '본사 직원입니다. 영업지역 보호 조항 해석은 본사마다 다른데, 점주 협의회에서 공식 요청 보내시면 검토 안 할 수 없습니다. 시도해보세요.', '2026-05-08T12:48:00', 36),
      C('u1', '댓글 감사합니다. 협의회 통해 본사에 공식 요청 보내려고 합니다. 결과 나오면 후속 글 올리겠습니다.', '2026-05-08T14:20:00', 22),
    ],
  },
  {
    id: 'p2',
    title: '본사가 광고비 분담률 5%로 인상한답니다. 어떻게 대응해야 할까요',
    excerpt:
      '기존 3% → 5%. 한 매장 기준 월 50만원 → 80만원으로 늘어납니다. 협의회는 항의했지만 본사는 다른 본사와 동일 수준이라고만 합니다.',
    content: [
      '치킨 가맹점주입니다. 본사에서 다음 분기부터 광고비 분담률을 매출의 3%에서 5%로 인상하겠다고 통보가 왔습니다.',
      '저희 매장 기준 월 50만원에서 80만원으로 늘어나는데, 본사는 "다른 치킨 본사도 5% 수준이라 정상화"라고만 설명하고 있어요. 점주 협의회에서 항의했지만 본사 답변이 미흡합니다.',
      '경험 있는 분들 어떻게 대응하셨는지 듣고 싶습니다. 또 이게 가맹사업법상 점주가 받아들여야 하는 일방적 인상인지도 궁금합니다.',
    ],
    authorId: 'u3',
    channelType: 'category',
    channelKey: 'chicken',
    category: 'question',
    tags: ['광고비', '본사', '분담금', '협상'],
    anonymous: false,
    pinned: false,
    hot: true,
    createdAt: '2026-05-07T15:30:00',
    views: 3240,
    likes: 142,
    commentCount: 3,
    comments: [
      C('u8', '가맹사업법상 광고비 분담금은 계약서에 명시된 한도 내에서만 인상 가능합니다. 계약서 다시 확인하시고 한도 초과면 법적 거부 가능합니다.', '2026-05-07T16:12:00', 86),
      C('u4', '저희 본사도 비슷하게 인상했는데 협의회 통해 4%로 합의 봤습니다. 일방적으로 받아들이지 마시고 협상하세요.', '2026-05-07T17:24:00', 42),
      C('u1', '광고비 분담이 5%면 점주 입장에선 무거운데, 본사 광고 노출이 그만큼 늘어나는지 사후 검증할 수 있는지가 핵심입니다. 본사에 광고 운영 지표 요청해보세요.', '2026-05-07T18:48:00', 28),
    ],
  },
  {
    id: 'p3',
    title: '강남역 코너 매물 시세 — 권리금 추이',
    excerpt:
      '강남역 코너 매물의 권리금이 2022년 → 2025년 사이 어떻게 변했는지 정리. 매물 5개 케이스 비교.',
    content: [
      '강남역 인근 코너 매물 5개의 권리금 변화를 정리해봤습니다. 2022년 평균 9,200만원 → 2025년 평균 7,800만원으로 약 15% 하락했습니다.',
      '카테고리별로 보면 카페·식음료 권리금은 안정적인 반면 의류·서비스 매장은 더 큰 폭으로 떨어졌습니다. 임대료는 같은 기간 평당 22만원 → 25만원으로 13% 인상되어서, 권리금이 떨어진 건 임대료 부담 증가의 반영으로 볼 수 있을 것 같습니다.',
      '강남역 매물 검토하시는 분들 참고 자료로 공유합니다. 더 자세한 매물 정보는 더명당에서 확인하실 수 있습니다.',
    ],
    authorId: 'u5',
    channelType: 'region',
    channelKey: 'seoul',
    category: 'news',
    tags: ['강남역', '권리금', '시세', '서울'],
    anonymous: false,
    pinned: false,
    hot: true,
    createdAt: '2026-05-05T12:08:00',
    views: 5640,
    likes: 218,
    commentCount: 2,
    comments: [
      C('u4', '권리금 하락은 사실인데 그만큼 매물 거래가 줄어든 영향도 큽니다. 거래량 데이터까지 보면 더 입체적입니다.', '2026-05-05T13:48:00', 42),
      C('u3', '예비창업자 입장에서 정말 도움 되는 자료입니다. 강남 권리금이 정점 지나고 있는 신호로 보입니다.', '2026-05-05T15:22:00', 24),
    ],
  },
  {
    id: 'p4',
    title: '1인 카페 운영 1년차, 매출 1,800만원의 손익',
    excerpt:
      '월 매출 1,800만원, 인건비 0원, 임대료 230만원, 식자재 32%. 순이익 700만원 나옵니다. 솔직 손익 공유.',
    content: [
      '안양에서 1인 카페 운영 1년차입니다. 매출이 안정화되어서 1년 손익 정리해서 공유합니다.',
      '월 평균 매출 1,800만원. 비용 구조는 식자재 580만원(32%), 임대료 230만원, 유틸리티 80만원, 본사 로열티 30만원, 마케팅 60만원, 기타 120만원. 인건비는 본인만 운영해서 0원입니다.',
      '월 순이익 약 700만원. 다만 본인 시간이 하루 11-12시간 들어가서 시급으로 환산하면 그리 좋지 않습니다. 1인 운영의 장단점이 명확합니다.',
      '비슷한 1인 카페 운영하시는 분들 매출 + 손익 공유 부탁드립니다.',
    ],
    authorId: 'u2',
    channelType: 'category',
    channelKey: 'cafe',
    category: 'experience',
    tags: ['1인운영', '카페', '손익', '저자본'],
    anonymous: false,
    pinned: false,
    hot: true,
    createdAt: '2026-05-04T18:45:00',
    views: 4220,
    likes: 186,
    commentCount: 2,
    comments: [
      C('u3', '식자재 32%는 비교적 잘 관리되시는 편이에요. 제가 봤던 1인 카페들은 35-40% 사이가 많았습니다.', '2026-05-04T19:18:00', 28),
      C('u4', '본인 시간 시급 환산은 진짜 중요한 포인트입니다. 자영업자들이 잘 안 보는 숫자라 본인 burnout 가는 경로가 됩니다.', '2026-05-04T20:32:00', 38),
    ],
  },
  {
    id: 'p5',
    title: '본사 인테리어 강제 재시공, 점주 협의회 입장은?',
    excerpt:
      '재계약 갱신 시 인테리어 재시공 의무화. 평당 110만원, 30평 매장 3,300만원. 합리적일까요?',
    content: [
      '계약 갱신 시점에 본사가 인테리어 재시공을 의무화했습니다. 평당 110만원으로 30평 매장 기준 3,300만원입니다.',
      '시공 5년이 지났고 본사가 신규 인테리어 컨셉을 도입하긴 했는데, 단가가 시장 평균(평당 70-80만원)보다 30-40% 비쌉니다.',
      '점주 협의회는 비용 분담을 요구하고 있는데 본사 답변이 미온적입니다. 비슷한 상황 겪어보신 분들 어떻게 해결하셨나요?',
    ],
    authorId: 'u10',
    channelType: 'general',
    channelKey: 'general',
    category: 'discussion',
    tags: ['인테리어', '재시공', '본사갈등', '계약갱신'],
    anonymous: true,
    pinned: false,
    hot: true,
    createdAt: '2026-05-03T11:20:00',
    views: 3840,
    likes: 168,
    commentCount: 2,
    comments: [
      C('u8', '재시공 의무화는 가맹사업법상 점주가 부담하는 비용에 한도가 있습니다. 본사 단가가 시장가의 50% 이상이면 분쟁 신청 가능합니다.', '2026-05-03T12:08:00', 92),
      C('u4', '본사 지정 시공 단가가 비싸면 본사 마진율을 요구하는 게 협상 카드입니다. 본사가 시공 마진을 가져가는 경우가 많아요.', '2026-05-03T13:32:00', 56),
    ],
  },
  {
    id: 'p6',
    title: '주말 매출 부진할 때 했던 7가지 — 효과 있었던 것 정리',
    excerpt:
      '주말 매출이 평일의 50% 수준이었습니다. 6개월 시도해 본 7가지 중 효과 있었던 4가지 정리.',
    content: [
      '오피스 상권 카페라 주말 매출이 평일의 50% 수준이었습니다. 6개월 동안 7가지 시도해봤고 효과 있던 4가지 + 효과 없던 3가지 정리합니다.',
      '효과 있던 것: 1) 주말 한정 디저트 + 음료 세트 (객단가 25% 상승), 2) 인근 학원·체육관 제휴 쿠폰, 3) 인스타그램 주말 한정 콘텐츠 시리즈, 4) 토요일만 영업시간 1시간 연장.',
      '효과 없던 것: 1) 배달앱 주말 광고 강화 (CPM 너무 비쌌음), 2) 무료 시음 이벤트 (단골 전환 X), 3) 주말 가족 단위 프로모션 (오피스 상권 특성상 가족 객수 자체가 적음).',
      '결국 객단가 + 단골 충성도 + 노출 빈도가 답이었습니다. 비슷한 고민하시는 분들께 도움 되길.',
    ],
    authorId: 'u2',
    channelType: 'general',
    channelKey: 'tips',
    category: 'tip',
    tags: ['주말매출', '카페', '마케팅', '실전'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-05-02T14:18:00',
    views: 6210,
    likes: 248,
    commentCount: 2,
    comments: [
      C('u9', '한식 매장도 비슷한 시도 했는데 토요일 1시간 연장이 가장 효과적이었습니다. 주말 점심 객수가 평일보다 늦어요.', '2026-05-02T15:12:00', 32),
      C('u3', '이런 실제 시도 + 결과 데이터 너무 좋습니다. 창업 전에 미리 알 수 있어서 큰 도움 됩니다.', '2026-05-02T16:48:00', 18),
    ],
  },
  {
    id: 'p7',
    title: '분식 가맹 3년차 — 진짜 마진은 얼마인지',
    excerpt:
      '월매출 1,400만원의 분식 매장 실제 손익. 본사 말과 실제 차이 분석.',
    content: [
      '광주에서 분식 가맹 3년차 운영 중입니다. 본사 정보공개서에는 매장당 평균 월매출 1,800만원, 영업이익률 18%로 적혀 있는데 실제는 다릅니다.',
      '저희 매장 기준 월매출 1,400만원, 영업이익률 12% 정도입니다. 본사 평균보다 매출이 낮은 이유는 학원가가 아닌 주거지 인근이라는 입지 차이가 큽니다.',
      '본사 통계는 학원가 + 상권 중심 매장 기준이고, 주거지 매장은 그보다 20-30% 낮은 매출이 일반적입니다. 본사 자료 그대로 믿지 마시고 입지별 평균을 따로 받으세요.',
    ],
    authorId: 'u12',
    channelType: 'category',
    channelKey: 'snack',
    category: 'experience',
    tags: ['분식', '3년차', '실제마진', '입지'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-05-01T10:08:00',
    views: 2680,
    likes: 118,
    commentCount: 1,
    comments: [
      C('u4', '본사 평균은 가장 매출 좋은 매장 기준으로 책정되는 경우가 많아요. 실제 평균 알고 싶으면 점주 협의회에 요청하면 받을 수 있습니다.', '2026-05-01T11:20:00', 38),
    ],
  },
  {
    id: 'p8',
    title: '한식 점심 객수 떨어지는데 점심 메뉴 개편이 답일까',
    excerpt:
      '오피스 상권 한식 매장. 점심 객수가 6개월 사이 30% 떨어졌습니다. 메뉴 개편하면 회복될까요?',
    content: [
      '여의도 오피스 상권에서 한식 매장 운영 중입니다. 점심 객수가 6개월 사이 30% 정도 떨어졌습니다.',
      '신메뉴 개편을 본사에 요청 중인데, 본사 답변이 "본사 가이드라인 변경 어려움"입니다. 자체적으로 점심 한정 메뉴를 만드는 방법도 있지만 본사 정책상 어렵습니다.',
      '비슷한 상황 겪으셨던 분들 어떻게 해결하셨는지 듣고 싶습니다.',
    ],
    authorId: 'u9',
    channelType: 'category',
    channelKey: 'korean',
    category: 'question',
    tags: ['한식', '점심객수', '메뉴개편', '본사'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-04-30T16:42:00',
    views: 1820,
    likes: 64,
    commentCount: 1,
    comments: [
      C('u4', '본사 정책상 어려우면 점심 한정 사이드 메뉴만 추가하는 것도 방법이에요. 메인은 그대로 두고 사이드로 객단가 올리기.', '2026-04-30T17:32:00', 22),
    ],
  },
  {
    id: 'p9',
    title: '야간 인력 시급 너무 비싸요. 야간 자동화 사례 공유',
    excerpt:
      '심야 시간대 시급이 1.5배. 인력 부담 줄이는 자동화 5가지 시도 후기.',
    content: [
      '서울 종로에서 주점 7년차 운영 중입니다. 심야 인력 시급이 일반 시간대보다 1.5배인데, 사람 구하기도 어려워서 자동화 5가지 시도해봤습니다.',
      '효과 있는 것: 1) 셀프 주문 키오스크 도입 — 야간 1인 직원 운영 가능, 2) 카드 결제 + 영수증 자동 출력, 3) 본사 정수기 + 셀프 음료 코너.',
      '효과 미미한 것: 1) 자동 안주 조리 기계 (메뉴 다양성 떨어짐), 2) 무인 출입 시스템 (취객 대응 어려움).',
      '결국 사람이 1명은 필요하고 그 1명의 부담을 줄이는 자동화가 답이었습니다.',
    ],
    authorId: 'u13',
    channelType: 'category',
    channelKey: 'bar',
    category: 'tip',
    tags: ['주점', '야간', '인건비', '자동화'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-04-29T22:18:00',
    views: 2140,
    likes: 96,
    commentCount: 1,
    comments: [
      C('u1', '치킨 매장도 심야 매출 비중이 30% 이상이라 비슷한 고민이었어요. 키오스크는 정말 큰 효과를 봤습니다.', '2026-04-29T23:42:00', 28),
    ],
  },
  {
    id: 'p10',
    title: '정보공개서에 안 나오는 본사 폐점율 알아보는 법',
    excerpt:
      '정보공개서의 매장 수 변화로 폐점율을 역산하는 4단계 방법.',
    content: [
      '본사가 정보공개서에 폐점율을 직접 공개하지는 않지만, 매장 수 변화로 역산할 수 있습니다.',
      '1단계: 작년 말 매장 수 + 신규 오픈 - 올해 말 매장 수 = 폐점 수, 2단계: 폐점 수 / 작년 말 매장 수 = 폐점율.',
      '예: 작년 100개 → 신규 30개 → 올해 110개라면, 폐점 수 = 100 + 30 - 110 = 20개, 폐점율 = 20/100 = 20%. 업계 평균은 약 10-15%이고, 25% 이상이면 본사 운영에 문제가 있다고 봐야 합니다.',
      '3단계: 5년 누적 폐점율도 같은 방식으로 계산. 4단계: 협회 등록 정보공개서를 5년치 모아서 비교.',
    ],
    authorId: 'u5',
    channelType: 'general',
    channelKey: 'tips',
    category: 'tip',
    tags: ['정보공개서', '폐점율', '본사검증', '분석'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-04-28T13:08:00',
    views: 4280,
    likes: 184,
    commentCount: 0,
    comments: [],
  },
  {
    id: 'p11',
    title: '부산 서면 신축 상가 매물 어떤가요',
    excerpt:
      '서면 1.5층 매물 검토 중입니다. 보증금 6,000만원, 월세 350만원, 권리금 5,500만원. 적정 시세인가요?',
    content: [
      '부산 서면에서 매물 검토 중입니다. 1.5층 26평 매장이고 권리금 5,500만원, 보증금 6,000만원, 월세 350만원입니다.',
      '카테고리는 주점 또는 일식을 생각하고 있고, 본사 추천 매물은 아닙니다. 서면 시세 잘 아시는 분들 판단 부탁드립니다.',
    ],
    authorId: 'u3',
    channelType: 'region',
    channelKey: 'busan',
    category: 'question',
    tags: ['부산', '서면', '매물', '시세'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-04-27T19:32:00',
    views: 1620,
    likes: 42,
    commentCount: 1,
    comments: [
      C('u13', '서면 1.5층 평균보다 권리금이 약간 높은 편이긴 한데 주점·일식 입지로는 적정합니다. 야간 유동인구가 많은 자리면 그 정도 권리금은 정당화됩니다.', '2026-04-27T20:48:00', 24),
    ],
  },
  {
    id: 'p12',
    title: '점주들이 본사에 가장 자주 받는 5가지 통보',
    excerpt:
      '15년간 다업종 운영하면서 본사로부터 받은 5가지 통보 유형. 점주가 알아둬야 할 대응.',
    content: [
      '다업종 15년 운영하면서 본사로부터 받은 통보를 정리해봤습니다.',
      '1) 광고비 분담률 인상: 매년 또는 격년으로. 평균 0.5-1.5% 인상폭, 2) 인테리어 재시공 의무화: 5-7년 주기. 평당 80-130만원, 3) 식자재 단가 인상: 분기별 또는 반기. 평균 3-5% 인상폭.',
      '4) 영업지역 보호 완화 (신규 매장 출점): 본사 입장에선 확장이지만 점주 입장에선 매출 감소, 5) 정보공개서 갱신 시 본사 책임 범위 축소: 약관 문구 변경.',
      '이 5가지는 거의 모든 가맹 사업에서 발생합니다. 점주는 각 통보에 대해 1) 계약서 한도 확인, 2) 협의회 통한 협상, 3) 가맹사업법상 점주 권리 행사 순으로 대응할 수 있습니다.',
    ],
    authorId: 'u4',
    channelType: 'general',
    channelKey: 'general',
    category: 'discussion',
    tags: ['본사', '통보', '대응', '15년경험'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-04-26T11:12:00',
    views: 7820,
    likes: 412,
    commentCount: 1,
    comments: [
      C('u8', '5가지 모두 가맹사업법상 점주 보호 조항이 있는 영역입니다. 본사 통보 받으면 일단 계약서 + 가맹사업법 시행령 확인이 우선입니다.', '2026-04-26T12:48:00', 64),
    ],
  },
  {
    id: 'p13',
    title: '본사 SV가 너무 자주 바뀝니다. 정상인가요',
    excerpt:
      '2년 사이 본사 슈퍼바이저가 4명 바뀌었습니다. 본사 인력 부족 신호인가요?',
    content: [
      '카페 가맹 운영 중인데 본사 슈퍼바이저가 2년 사이 4명 바뀌었습니다. 매번 새 SV가 매장 운영 방식을 새로 파악하는 데 시간이 걸리고, 본사 정책 전달이 일관성 없게 느껴집니다.',
      '본사 인력이 부족한 신호일까요? 다른 본사도 이 정도 SV 교체가 정상인가요?',
    ],
    authorId: 'u3',
    channelType: 'general',
    channelKey: 'general',
    category: 'question',
    tags: ['본사SV', '인력', '의문'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-04-25T15:42:00',
    views: 1840,
    likes: 58,
    commentCount: 1,
    comments: [
      C('u11', '본사 인사 관점에서 SV는 평균 2-3년 근속이 일반적입니다. 2년 4명은 본사 SV 교육·복지 체계가 부실하다는 신호입니다.', '2026-04-25T16:38:00', 42),
    ],
  },
  {
    id: 'p14',
    title: '오픈 6개월차 카페 — 단골 만드는 SNS 콘텐츠 전략',
    excerpt:
      '오픈 6개월 동안 인스타 팔로워 0 → 4,800명. 단골 전환율 12%. 효과 있던 콘텐츠 5가지.',
    content: [
      '서울 마포에서 오픈 6개월차 카페입니다. 인스타그램으로 단골을 만들어 본 후기 공유합니다.',
      '효과 있던 콘텐츠 5가지: 1) 매장 내부 + 메뉴 비주얼 (가장 기본), 2) 점장 (저) 등장 짧은 영상 — 인간미가 단골 전환의 핵심, 3) 단골과의 짧은 인터뷰 (동의 받고), 4) 신메뉴 개발 비하인드, 5) 영업 외 시간의 인사이드 (청소·세팅 등).',
      '효과 없던 것: 본사가 만들어준 광고 콘텐츠 그대로 사용. 본사 톤은 너무 일반적이라 차별화 안 됩니다.',
      '5번 인사이드 콘텐츠가 의외로 가장 반응이 좋았어요. 일하는 모습 자체가 콘텐츠가 됩니다.',
    ],
    authorId: 'u2',
    channelType: 'category',
    channelKey: 'cafe',
    category: 'tip',
    tags: ['카페', 'SNS', '단골', '오픈'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-04-24T17:08:00',
    views: 3640,
    likes: 168,
    commentCount: 1,
    comments: [
      C('u4', '점장 본인 등장은 정말 효과 큽니다. 무명 자영업자가 신뢰를 쌓는 가장 빠른 방법이에요.', '2026-04-24T18:22:00', 28),
    ],
  },
  {
    id: 'p15',
    title: '권리금 분쟁 후기 — 결국 80% 회수했습니다',
    excerpt:
      '카페 양도 후 권리금 회수 분쟁. 본사·임대인·전 점주 3자 갈등. 8개월 끝에 80% 회수.',
    content: [
      '카페 매장 양도 후 권리금 8,000만원 중 회수 분쟁이 있었습니다. 8개월 만에 80%, 6,400만원 회수한 후기 공유합니다.',
      '핵심은 1) 양도 계약서에 본사 동의 조항 명시, 2) 임대인의 임대차 갱신 보장, 3) 전 점주의 매장 운영 정보 인수인계 명문화 등이었습니다. 모든 게 문서로 남아 있어서 협상에 유리했습니다.',
      '권리금 회수는 끈기와 자료 싸움입니다. 분쟁 발생 시 가맹사업분쟁조정위원회 활용도 추천드립니다.',
    ],
    authorId: 'u6',
    channelType: 'general',
    channelKey: 'general',
    category: 'experience',
    tags: ['권리금', '분쟁', '회수', '양도'],
    anonymous: false,
    pinned: false,
    hot: false,
    createdAt: '2026-04-23T13:32:00',
    views: 4820,
    likes: 232,
    commentCount: 1,
    comments: [
      C('u8', '문서 남기는 게 정말 중요합니다. 양도 계약서에 본사 동의가 명시되지 않으면 분쟁 시 본사 책임 주장하기 어려워요.', '2026-04-23T14:48:00', 36),
    ],
  },
]

export const PINNED_POSTS = POSTS.filter((p) => p.pinned)
export const HOT_POSTS = POSTS.filter((p) => p.hot).sort((a, b) => b.likes - a.likes)

export function postsByChannel(channelType: ChannelType, channelKey: string): MockPost[] {
  return POSTS.filter((p) => p.channelType === channelType && p.channelKey === channelKey).sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  )
}

export function popularPosts(limit = 5): MockPost[] {
  return [...POSTS].sort((a, b) => b.views - a.views).slice(0, limit)
}

export function channelsByType(type: ChannelType): MockChannel[] {
  return CHANNELS.filter((c) => c.type === type)
}

export function userById(id: string): MockUser | undefined {
  return USERS.find((u) => u.id === id)
}

export function channelLabel(type: ChannelType, key: string): string {
  const channel = CHANNELS.find((c) => c.type === type && c.key === key)
  return channel?.label ?? key
}
