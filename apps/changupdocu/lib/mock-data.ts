// Mock data for changupdocu — franchise documentaries + magazine.

import { authorAvatarFor, coverPhotoFor, magazineCoverFor } from './media-images'

export type EpisodeCategory = 'success' | 'failure' | 'brand' | 'trend' | 'interview'

export interface MockEpisode {
  id: string
  title: string
  subtitle: string
  category: EpisodeCategory
  /** YouTube-style video duration string */
  duration: string
  /** Thumbnail gradient colors */
  thumbnailColors: string[]
  /** Brand context (optional) */
  brand?: string
  /** 1-2 sentence summary shown on cards */
  hook: string
  /** Multi-paragraph description for detail page */
  description: string[]
  /** Key insights or chapter list */
  chapters: Array<{ time: string; title: string }>
  publishedAt: string
  views: number
  likes: number
  tags: string[]
  featured: boolean
  trending: boolean
  /**
   * Real YouTube video URL (공개 영상만). undefined면 자체 플레이어 플레이스홀더.
   * 예: 'https://www.youtube.com/watch?v=XXXXXXXXXX'
   */
  youtubeUrl?: string
  /** Real thumbnail image — auto-filled. */
  thumbnailImage: string
}

export interface MockArticle {
  id: string
  title: string
  subtitle: string
  authorName: string
  authorRole: string
  authorAvatarColor: string
  /** Category tag like '분석' or '인터뷰' */
  category: string
  /** Cover gradient colors */
  coverColors: string[]
  /** 1-2 sentence excerpt for cards */
  excerpt: string
  /** Read time in minutes */
  readTime: number
  publishedAt: string
  /** Multi-paragraph body */
  body: string[]
  /** Key takeaways at end */
  keyPoints: string[]
  tags: string[]
  featured: boolean
  /** Real cover image — auto-filled. */
  coverImage: string
  /** Real author avatar — auto-filled. */
  authorAvatar: string
}

export const CATEGORY_LABEL: Record<EpisodeCategory, string> = {
  success: '성공 다큐',
  failure: '실패 다큐',
  brand: '브랜드 다큐',
  trend: '트렌드',
  interview: '인터뷰',
}

export const CATEGORY_COLOR: Record<EpisodeCategory, string> = {
  success: '#10B981',
  failure: '#DC2626',
  brand: '#3B82F6',
  trend: '#F59E0B',
  interview: '#8B5CF6',
}

type RawEpisode = Omit<MockEpisode, 'thumbnailImage'>

const RAW_EPISODES: RawEpisode[] = [
  {
    id: 'e1',
    title: '강남에서 5년, 한솥도시락 가맹의 진짜 손익',
    subtitle: '월 매출 4,200만원의 매장이 실제로 가져가는 돈은',
    category: 'success',
    duration: '24분 18초',
    thumbnailColors: ['#10B981', '#34D399'],
    brand: '한솥도시락',
    hook: '강남역 인근 한솥도시락 점주가 5년 운영 끝에 보여주는 매출과 비용의 모든 것.',
    description: [
      '강남역 인근에서 한솥도시락 가맹점을 5년째 운영 중인 김민호 점주의 매장은 월 매출 평균 4,200만원으로 같은 브랜드 매장 평균보다 +35% 높은 곳입니다.',
      '카메라가 매장에 6주 동안 머무르며 매출·비용·인력 흐름을 모두 기록했습니다. 단순한 성공담이 아니라 식자재 32%·인건비 24%·임대료 8%·로열티 5%·기타 6% 같은 매장 운영의 실제 숫자를 펼쳐 보여줍니다.',
      '5년 운영 끝에 본사와 합의해 만든 점심 메뉴 패키지, 단골 관리 노하우, 인력 시급 협상까지 한 점주가 만든 매출 +35%의 구체적인 출처를 따라갑니다.',
    ],
    chapters: [
      { time: '0:00', title: '점주 김민호 — 자영업 18년차의 선택' },
      { time: '3:22', title: '매장 둘러보기 — 강남역 5분 거리' },
      { time: '7:48', title: '월 매출 4,200만원의 비용 구조' },
      { time: '12:30', title: '본사와의 5년 관계' },
      { time: '17:15', title: '단골이 매출의 65%인 이유' },
      { time: '21:40', title: '점주가 예비 창업자에게 — 5가지 조언' },
    ],
    publishedAt: '2026-05-02',
    views: 184200,
    likes: 4820,
    tags: ['성공', '한식', '강남', '5년차'],
    featured: true,
    trending: true,
  },
  {
    id: 'e2',
    title: '본사 폐업 후 점주들이 한 일',
    subtitle: '브랜드가 사라진 매장 12곳의 6개월 추적',
    category: 'failure',
    duration: '31분 42초',
    thumbnailColors: ['#DC2626', '#EF4444'],
    hook: '본사 부도 → 점주 협의회 결성 → 새 브랜드 전환까지. 12개 매장의 생존 기록.',
    description: [
      '2025년 6월, 카페 가맹 본사 한 곳이 부도를 냈습니다. 전국 53개 매장 점주들은 다음 날 아침부터 매장을 어떻게 운영할지 결정해야 했습니다.',
      '카메라가 추적한 12개 매장 중 6개월 후 8개는 생존했습니다. 어떤 점주는 새 브랜드로 전환했고, 어떤 점주는 독립 매장으로 갔고, 어떤 점주는 폐업했습니다. 각자의 6개월이 어떻게 다른지 기록했습니다.',
      '본사 부도 시점에 점주가 반드시 알아야 할 4가지 행동, 점주 협의회 결성 절차, 식자재·임대차 계약·POS 시스템의 처분 등 실용적인 정보까지 다룹니다.',
    ],
    chapters: [
      { time: '0:00', title: '부도 당일 — 점주들의 첫 24시간' },
      { time: '5:12', title: '점주 협의회 결성 — 매장 12개의 연대' },
      { time: '11:40', title: '브랜드 전환을 선택한 4명' },
      { time: '18:20', title: '독립 매장으로 간 3명' },
      { time: '24:10', title: '폐업을 선택한 5명' },
      { time: '28:30', title: '6개월 후 — 누가 살아남았나' },
    ],
    publishedAt: '2026-04-15',
    views: 248600,
    likes: 6280,
    tags: ['실패', '본사부도', '카페', '점주협의회'],
    featured: true,
    trending: true,
  },
  {
    id: 'e3',
    title: '굽네치킨이 빠르게 성장한 5가지 이유',
    subtitle: '오븐구이 콘셉트로 틈새를 찾은 본사 분석',
    category: 'brand',
    duration: '18분 50초',
    thumbnailColors: ['#F97316', '#FB923C'],
    brand: '굽네치킨',
    hook: '오븐구이 콘셉트로 치킨 시장 틈새를 찾은 굽네치킨. 본사 운영팀이 직접 풀어주는 성장의 진짜 이유.',
    description: [
      '굽네치킨은 튀김 기름 없이 오븐구이 콘셉트로 기름진 치킨 시장의 틈새를 찾아 빠르게 성장했습니다. 본사 운영팀이 카메라 앞에서 직접 5가지 핵심 요인을 설명합니다.',
      '인테리어 단가 조정, SNS 마케팅 자원 투자, 가맹 점주 선별 기준, 본사 SV 인력 배치, 메뉴 회전 주기까지 — 본사 입장에서 본 성장 비결을 솔직하게 풀어냅니다.',
    ],
    chapters: [
      { time: '0:00', title: '본사 대표 인터뷰 — 첫 매장에서 80호점까지' },
      { time: '4:15', title: '이유 1: 인테리어 단가 30% 절감' },
      { time: '7:32', title: '이유 2: SNS 콘텐츠 본사 직접 운영' },
      { time: '10:45', title: '이유 3: 점주 선별 기준' },
      { time: '13:50', title: '이유 4: SV 인력 비율 조정' },
      { time: '16:20', title: '이유 5: 분기 메뉴 회전' },
    ],
    publishedAt: '2026-03-28',
    views: 142000,
    likes: 3640,
    tags: ['브랜드', '치킨', '본사', '성장'],
    featured: true,
    trending: false,
  },
  {
    id: 'e4',
    title: '2026 디저트 트렌드: 휘낭시에 이후',
    subtitle: '마카롱-크로플-휘낭시에 다음은',
    category: 'trend',
    duration: '15분 20초',
    thumbnailColors: ['#EC4899', '#F472B6'],
    hook: '디저트 트렌드 주기가 짧아지고 있다. 다음 1년의 트렌드와 진입 전략.',
    description: [
      '디저트 트렌드 주기가 점점 짧아지고 있습니다. 마카롱 → 크로플 → 휘낭시에로 이어진 4년의 트렌드 흐름을 데이터로 정리합니다.',
      '검색량·SNS 노출량·매장 오픈율·폐점율 4가지 지표를 추적해 다음 12개월의 디저트 트렌드를 예측합니다. 트렌드 진입 시점과 진입 시 고려사항을 함께 분석했습니다.',
    ],
    chapters: [
      { time: '0:00', title: '디저트 트렌드 4년사' },
      { time: '4:15', title: '검색량 + SNS 노출 데이터 분석' },
      { time: '8:30', title: '다음 트렌드 후보 5가지' },
      { time: '12:10', title: '진입 시점 + 리스크' },
    ],
    publishedAt: '2026-04-20',
    views: 96400,
    likes: 2480,
    tags: ['트렌드', '디저트', '데이터'],
    featured: false,
    trending: true,
  },
  {
    id: 'e5',
    title: '죠스떡볶이 5년차 점주 인터뷰',
    subtitle: '학원가 분식의 일상과 손익',
    category: 'interview',
    duration: '12분 48초',
    thumbnailColors: ['#DC2626', '#F87171'],
    brand: '죠스떡볶이',
    hook: '대구 동성로 죠스떡볶이 점주의 일하는 모습 + 5년치 손익 + 후배 점주들에게 하고 싶은 말.',
    description: [
      '대구 동성로에서 분식 가맹점을 5년째 운영 중인 최서윤 점주의 매장을 카메라가 하루 종일 따라다닙니다.',
      '오픈 준비부터 점심 피크, 학생 객수, 폐점 정리까지 한 매장의 하루를 보여주고, 5년치 손익 데이터와 후배 점주들에게 전하는 솔직한 조언을 듣습니다.',
    ],
    chapters: [
      { time: '0:00', title: '오전 9시 — 오픈 준비' },
      { time: '2:30', title: '점심 피크 11:30 - 13:30' },
      { time: '6:15', title: '5년치 손익 데이터' },
      { time: '9:50', title: '후배 점주에게 하고 싶은 말' },
    ],
    publishedAt: '2026-04-08',
    views: 78200,
    likes: 1820,
    tags: ['인터뷰', '분식', '대구', '학원가'],
    featured: false,
    trending: false,
  },
  {
    id: 'e6',
    title: '카페 1인 운영의 진짜 한계',
    subtitle: '월매출 1,800만원에서 더 안 올라가는 이유',
    category: 'failure',
    duration: '19분 15초',
    thumbnailColors: ['#92400E', '#A16207'],
    brand: '이디야커피',
    hook: '1인 운영 카페가 매출 1,800만원에서 천장을 만나는 이유를 데이터로 보여줍니다.',
    description: [
      '1인 카페 운영은 인건비 0원이라는 장점이 있지만 매출 천장이 존재합니다. 안양 평촌 카페 점주의 1년치 데이터를 분석해 매출 1,800만원이라는 천장의 정확한 원인을 찾습니다.',
      '본인 시간 한계, 피크 시간대 동시 처리량, 인력 채용 vs 자동화 결정 등 1인 운영자가 부딪히는 모든 변수를 추적합니다.',
    ],
    chapters: [
      { time: '0:00', title: '1인 카페의 매출 천장이란' },
      { time: '4:20', title: '시간대별 객수 + 처리 한계' },
      { time: '9:15', title: '인력 1명 추가의 손익 계산' },
      { time: '14:00', title: '자동화 vs 인력 — 어떤 게 답인가' },
    ],
    publishedAt: '2026-03-22',
    views: 168400,
    likes: 4120,
    tags: ['실패분석', '1인운영', '카페', '데이터'],
    featured: false,
    trending: true,
  },
  {
    id: 'e7',
    title: '본사 SV 인력 부족이 만드는 점주 갈등',
    subtitle: '3개 본사 비교 분석',
    category: 'trend',
    duration: '22분 36초',
    thumbnailColors: ['#7C3AED', '#A78BFA'],
    hook: '본사 SV 1인당 매장 30개를 넘어가면 점주 불만이 폭증한다. 3개 본사 비교 데이터.',
    description: [
      'SV(슈퍼바이저)는 본사와 점주를 잇는 핵심 인력입니다. 본사 SV 인력 비율이 어느 선을 넘으면 점주 불만이 폭증하는지 3개 본사를 비교 분석했습니다.',
      'SV 1인당 매장 비율 + 점주 만족도 점수 + 매장 폐점율을 결합 분석해 본사 운영의 적정 SV 비율을 도출합니다.',
    ],
    chapters: [
      { time: '0:00', title: 'SV의 역할이란' },
      { time: '4:00', title: '3개 본사 비교' },
      { time: '11:30', title: '적정 SV 비율의 데이터적 근거' },
      { time: '18:00', title: '본사가 SV 인력을 늘리지 않는 이유' },
    ],
    publishedAt: '2026-03-12',
    views: 92800,
    likes: 2340,
    tags: ['트렌드', '본사', 'SV', '데이터'],
    featured: false,
    trending: false,
  },
  {
    id: 'e8',
    title: '권리금 분쟁 — 점주가 80% 회수한 8개월',
    subtitle: '카페 양도 후 분쟁의 시작과 끝',
    category: 'success',
    duration: '17분 22초',
    thumbnailColors: ['#0EA5E9', '#22D3EE'],
    hook: '8천만원 권리금 분쟁 8개월 끝에 80% 회수한 점주의 실제 자료와 과정.',
    description: [
      '서울 강북에서 카페를 양도한 점주가 권리금 8,000만원 회수 분쟁에 빠졌습니다. 본사·임대인·전 점주 사이 3자 갈등을 8개월 끝에 80% 회수한 과정을 자료와 함께 추적합니다.',
      '양도 계약서 작성 시점부터 분쟁 발생, 가맹사업분쟁조정위원회 신청, 최종 합의까지 모든 단계를 보여줍니다.',
    ],
    chapters: [
      { time: '0:00', title: '양도 계약 — 8천만원 권리금' },
      { time: '3:15', title: '분쟁의 시작' },
      { time: '8:40', title: '가맹사업분쟁조정위 신청' },
      { time: '13:00', title: '8개월 후 — 80% 회수' },
    ],
    publishedAt: '2026-02-28',
    views: 134000,
    likes: 3280,
    tags: ['성공', '권리금', '분쟁', '8개월'],
    featured: false,
    trending: false,
  },
]

export const EPISODES: MockEpisode[] = RAW_EPISODES.map((e) => ({
  ...e,
  thumbnailImage: coverPhotoFor(e.id, e.category),
}))

type RawArticle = Omit<MockArticle, 'coverImage' | 'authorAvatar'>

const RAW_ARTICLES: RawArticle[] = [
  {
    id: 'a1',
    title: '월매출 3,000만원이 되기까지 — 한 점주의 회계 분석',
    subtitle: '매출 변화의 각 시점에 무엇이 일어났는가',
    authorName: '이상훈',
    authorRole: '회계사 + 자영업 세무 전문',
    authorAvatarColor: '#10B981',
    category: '분석',
    coverColors: ['#10B981', '#22C55E'],
    excerpt:
      '월 1,200만원에서 3,000만원까지 18개월. 변곡점마다 점주가 한 결정을 회계 관점에서 풀어봅니다.',
    readTime: 12,
    publishedAt: '2026-05-04',
    body: [
      '경기 수원에서 한식 도시락 가맹점을 운영하는 김민호 점주는 오픈 첫 달 매출이 1,180만원이었습니다. 18개월 후, 같은 매장의 월 매출은 3,040만원이 되었습니다. 그 사이에 어떤 결정이 있었는지를 회계 관점에서 추적합니다.',
      '첫 변곡점은 오픈 4개월차. 점심 객수가 평일 평균 42명에서 정체되어 있었습니다. 점주는 본사에 점심 한정 세트 메뉴를 제안했고, 본사가 받아들이면서 객수가 67명까지 늘었습니다. 객단가는 동일했지만 회전율 +60%가 매출 +24%를 만들었습니다.',
      '두 번째 변곡점은 8개월차. 배달 비중을 20%에서 40%로 의도적으로 늘렸습니다. 배달앱 광고비가 매출의 5%로 늘었지만, 매장 객수와 별개로 매출 흐름이 안정화되었습니다.',
      '세 번째 변곡점은 14개월차. 인력 1명을 정규로 채용했습니다. 인건비 +280만원/월이었지만 점주 자신의 시간 +40시간/월이 만들어졌고, 그 시간을 마케팅과 매장 개선에 쓰면서 매출이 또 한 단계 올랐습니다.',
      '회계 관점에서 보면 매출 성장은 단순한 객수 증가가 아니라 회전율·채널 다양화·인력 투자라는 3가지 변수의 누적 조합이었습니다.',
    ],
    keyPoints: [
      '오픈 4개월차: 점심 한정 세트 → 회전율 +60%',
      '오픈 8개월차: 배달 비중 20% → 40%로 의도적 확장',
      '오픈 14개월차: 인력 1명 채용 → 점주 시간 자산화',
      '매출 성장은 단일 변수가 아닌 누적 조합',
    ],
    tags: ['분석', '한식', '회계', '매출'],
    featured: true,
  },
  {
    id: 'a2',
    title: '가맹사업법 2026 개정 영향 분석',
    subtitle: '점주와 본사의 권리·의무가 어떻게 바뀌나',
    authorName: '정민철',
    authorRole: '가맹사업법 전문 변호사',
    authorAvatarColor: '#7C3AED',
    category: '법률',
    coverColors: ['#7C3AED', '#A78BFA'],
    excerpt:
      '2026년 시행 가맹사업법 개정안. 영업지역 보호·인테리어 강제 시공·정보공개서 의무 강화 3가지 변화.',
    readTime: 8,
    publishedAt: '2026-04-22',
    body: [
      '2026년 1월 1일부터 시행된 가맹사업법 개정안은 점주 보호 측면에서 의미 있는 변화를 가져왔습니다. 3가지 핵심 변화를 정리합니다.',
      '첫째, 영업지역 보호 조항이 강화되었습니다. 본사가 동일 카테고리 매장을 보호 반경 내에 출점할 때 점주 측 동의 절차가 명시적으로 추가되었고, 위반 시 영업 손실 보전 의무가 신설되었습니다.',
      '둘째, 인테리어 재시공 강제에 한도가 생겼습니다. 계약 갱신 시 본사가 재시공을 요구할 수 있는 평당 단가에 시장 평균 ±20% 한도가 설정되었고, 점주가 직접 발주를 선택할 수 있는 항목이 명시되었습니다.',
      '셋째, 정보공개서 갱신 의무가 강화되었습니다. 본사 폐점율, SV 인력 수, 점주 만족도를 매년 의무 공개하도록 변경되었습니다. 본사의 운영 투명성을 높이는 변화입니다.',
      '점주 입장에서 이 3가지 변화는 분쟁 시 활용 가능한 법적 근거가 늘어났음을 의미합니다. 다만 본사도 새로운 보호 조항을 만들고 있으니, 갱신 시점에 계약서를 새로 검토하시는 게 좋습니다.',
    ],
    keyPoints: [
      '영업지역 보호 강화 — 출점 동의 + 손실 보전',
      '인테리어 재시공 한도 신설 — 시장 평균 ±20%',
      '정보공개서 의무 항목 추가 — 폐점율·SV 비율·만족도',
      '점주의 법적 분쟁 자료가 풍부해짐',
    ],
    tags: ['법률', '개정안', '점주', '본사'],
    featured: true,
  },
  {
    id: 'a3',
    title: '본사 SV 인력 부족이 만드는 점주 갈등',
    subtitle: 'SV 1인당 매장 비율의 임계점은',
    authorName: '김민호',
    authorRole: '15년차 가맹 컨설턴트',
    authorAvatarColor: '#3B82F6',
    category: '분석',
    coverColors: ['#3B82F6', '#60A5FA'],
    excerpt:
      'SV 1인당 매장 30개를 넘는 본사에서 점주 불만이 폭증한다. 3개 본사 비교 데이터로 확인.',
    readTime: 10,
    publishedAt: '2026-04-12',
    body: [
      'SV(슈퍼바이저)는 본사와 점주를 잇는 핵심 인력입니다. SV가 부실하면 본사의 정책이 점주에게 일관성 없게 전달되고, 점주 갈등이 폭증합니다.',
      '3개 본사를 비교한 데이터를 보면 임계점이 명확합니다. SV 1인당 매장 30개 이하: 점주 만족도 평균 4.2/5, 30-50개: 3.4/5, 50개 이상: 2.6/5. 매장 폐점율도 비례해서 증가합니다.',
      '본사 입장에서 SV는 비용 항목이라 줄이려는 인센티브가 있지만, 장기적으로는 점주 이탈로 더 큰 비용이 발생합니다. 정보공개서에는 SV 인력 수가 공개되지 않지만, 점주 협의회를 통해 확인 가능한 정보입니다.',
      '예비 가맹점주는 가맹 계약 전에 본사의 SV 인력 비율을 반드시 확인하시고, 가능하다면 SV가 정기 방문 약속한 빈도가 계약서에 명시되어 있는지 확인하세요.',
    ],
    keyPoints: [
      'SV 1인당 매장 30개가 만족도의 임계점',
      'SV 부족 → 점주 만족도 하락 → 폐점율 증가의 인과',
      'SV 인력 수는 공식 공개되지 않지만 협의회로 확인 가능',
      '가맹 계약 전 SV 방문 빈도를 계약서에 명시 요청',
    ],
    tags: ['분석', '본사', 'SV', '데이터'],
    featured: false,
  },
  {
    id: 'a4',
    title: '1인 매장의 매출 천장 — 데이터로 본 한계',
    subtitle: '인건비 0원의 장점과 매출 1,800만원의 천장',
    authorName: '박지영',
    authorRole: '5년차 카페 다점포 점주',
    authorAvatarColor: '#92400E',
    category: '운영',
    coverColors: ['#92400E', '#A16207'],
    excerpt:
      '1인 운영 카페·분식·디저트의 평균 매출 천장은 1,800만원. 그 한계의 정확한 원인과 돌파법.',
    readTime: 9,
    publishedAt: '2026-03-30',
    body: [
      '1인 운영 매장은 인건비 0원이라는 강력한 장점이 있습니다. 하지만 거기에는 매출 천장이 존재합니다. 안양 평촌 카페 점주의 1년치 데이터를 분석해보면 매출 1,800만원이라는 천장이 명확히 보입니다.',
      '천장의 원인은 3가지입니다. 1) 본인 시간 한계 — 일 11-12시간 운영으로는 평일 점심 + 저녁 동시 피크를 못 받습니다. 2) 동시 처리량 한계 — 피크 시간대 동시 객수가 8-10명을 넘기면 회전이 막힙니다. 3) 마케팅 시간 부재 — 운영에 매여 마케팅 시간이 없어 신규 객수 유입이 정체됩니다.',
      '돌파 방법도 3가지입니다. 1) 인력 1명 채용 — 인건비 280만원이 더해지지만 점주 시간 자산화로 매출이 +800만원까지 가능. 2) 자동화 — 셀프 키오스크·POS 자동화로 동시 처리량 +30%. 3) 메뉴 단순화 — 회전율 우선 메뉴 구성으로 피크 시간 처리량 +40%.',
      '결국 1인 운영을 유지할지, 인력을 채용해 매출 +1,000만원을 노릴지는 점주의 선택입니다. 데이터로 보면 매출 2,000만원 미만은 1인이 유리하고, 2,500만원 이상은 인력 채용이 유리합니다.',
    ],
    keyPoints: [
      '1인 운영의 매출 천장은 평균 1,800만원',
      '천장의 원인: 시간·동시처리량·마케팅 시간 부재',
      '돌파법: 인력 채용 / 자동화 / 메뉴 단순화',
      '손익분기: 매출 2,500만원 이상에서 인력 채용 유리',
    ],
    tags: ['운영', '1인운영', '카페', '데이터'],
    featured: false,
  },
  {
    id: 'a5',
    title: 'AI 카운터가 자영업을 바꾸고 있다',
    subtitle: '셀프 키오스크·자동 발주·고객 분석까지',
    authorName: '강현우',
    authorRole: '디지털 마케팅 디렉터',
    authorAvatarColor: '#EC4899',
    category: '트렌드',
    coverColors: ['#EC4899', '#F472B6'],
    excerpt:
      '카페·분식 매장의 30%가 AI 카운터로 전환 중. 도입 비용과 효과를 정리.',
    readTime: 7,
    publishedAt: '2026-04-04',
    body: [
      '2025년 하반기부터 카페·분식 매장의 AI 카운터 도입이 빠르게 늘고 있습니다. 셀프 주문 키오스크 + 자동 발주 시스템 + 고객 데이터 분석을 통합한 솔루션이 보편화되고 있습니다.',
      '도입 비용은 매장당 평균 800만 ~ 1,500만원입니다. 인력 1명 감축 시점부터 회수가 시작되어 평균 14개월에 손익분기를 넘습니다.',
      '효과는 인건비 절감보다 데이터에 있습니다. 시간대별 객수, 메뉴별 인기, 단골 재방문 주기 같은 데이터가 자동으로 쌓여 메뉴 운영을 정교하게 할 수 있습니다.',
      '단점은 고령 고객층의 진입 장벽입니다. 50대 이상 객수가 30%를 넘는 매장은 도입을 신중히 검토하시는 게 좋습니다.',
    ],
    keyPoints: [
      '도입 비용 800만 ~ 1,500만원 / 14개월 손익분기',
      '주된 가치는 인건비 절감보다 데이터 자산화',
      '메뉴·시간대별 객수 데이터로 운영 정교화',
      '고령 객수 30% 이상 매장은 신중한 검토 필요',
    ],
    tags: ['트렌드', 'AI', '자동화', '카페'],
    featured: false,
  },
  {
    id: 'a6',
    title: '권리금 거래의 진짜 시세 — 2024-2026 추이',
    subtitle: '서울 5개 상권의 평균 권리금 변화',
    authorName: '정민호',
    authorRole: '부동산 컨설턴트',
    authorAvatarColor: '#0EA5E9',
    category: '시장',
    coverColors: ['#0EA5E9', '#22D3EE'],
    excerpt:
      '강남·홍대·연남·여의도·종로 5개 상권의 권리금이 24개월 사이 어떻게 변했는지 데이터 분석.',
    readTime: 11,
    publishedAt: '2026-03-18',
    body: [
      '서울 5대 상권의 권리금이 2024년 1월부터 2026년 4월까지 어떻게 변했는지 거래 데이터 240건을 분석했습니다.',
      '강남: 평균 권리금 9,200만 → 7,800만원으로 -15% 하락. 임대료는 평당 22만 → 25만으로 +14% 상승. 권리금 하락은 임대료 상승의 반영입니다.',
      '홍대·연남: 권리금 5,200만 → 5,500만으로 +6% 상승. 트렌드 상권의 강세가 유지되었습니다.',
      '여의도: 권리금 3,800만 → 3,200만으로 -16% 하락. 오피스 상권의 점심 객수 축소가 영향을 미쳤습니다.',
      '종로: 권리금 4,200만 → 4,500만으로 +7% 상승. 관광 상권 회복으로 안정세입니다.',
    ],
    keyPoints: [
      '강남: 권리금 -15%, 임대료 +14%',
      '홍대·연남: 권리금 +6% — 트렌드 상권 강세',
      '여의도: -16% — 오피스 점심 객수 축소',
      '종로: +7% — 관광 회복',
    ],
    tags: ['시장', '권리금', '부동산', '서울'],
    featured: false,
  },
]

export const ARTICLES: MockArticle[] = RAW_ARTICLES.map((a) => ({
  ...a,
  coverImage: magazineCoverFor(a.id),
  authorAvatar: authorAvatarFor(a.authorName),
}))

export const FEATURED_EPISODES = EPISODES.filter((e) => e.featured)
export const TRENDING_EPISODES = EPISODES.filter((e) => e.trending).sort(
  (a, b) => b.views - a.views,
)
export const FEATURED_ARTICLES = ARTICLES.filter((a) => a.featured)

export function episodeById(id: string): MockEpisode | undefined {
  return EPISODES.find((e) => e.id === id)
}

export function articleById(id: string): MockArticle | undefined {
  return ARTICLES.find((a) => a.id === id)
}

export function episodesByCategory(category: EpisodeCategory): MockEpisode[] {
  return EPISODES.filter((e) => e.category === category).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  )
}

export function recentEpisodes(limit = 6): MockEpisode[] {
  return [...EPISODES]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit)
}

export function recentArticles(limit = 5): MockArticle[] {
  return [...ARTICLES]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit)
}
