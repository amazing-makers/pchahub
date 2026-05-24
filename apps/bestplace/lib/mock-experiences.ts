export type CampaignType = 'experience' | 'press' | 'sns'
export type CampaignStatus = 'open' | 'closed' | 'ongoing' | 'completed'

export const CAMPAIGN_TYPE_LABEL: Record<CampaignType, string> = {
  experience: '체험단',
  press: '기자단',
  sns: 'SNS서포터즈',
}

export const CAMPAIGN_TYPE_COLOR: Record<CampaignType, string> = {
  experience: '#8B5CF6',
  press: '#0EA5E9',
  sns: '#EC4899',
}

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  open: '모집중',
  closed: '모집마감',
  ongoing: '활동중',
  completed: '완료',
}

export const CAMPAIGN_STATUS_COLOR: Record<CampaignStatus, string> = {
  open: '#16A34A',
  closed: '#DC2626',
  ongoing: '#2563EB',
  completed: '#6B7280',
}

export interface Campaign {
  id: string
  title: string
  storeId: string
  storeName: string
  brandId: string
  brandName: string
  category: string
  categoryLabel: string
  region: string
  district: string
  type: CampaignType
  status: CampaignStatus
  applicationDeadline: string
  activityPeriod: string
  totalSlots: number
  appliedCount: number
  requirements: string[]
  benefits: string[]
  missions: string[]
  description: string
  thumbnailColor: string
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    title: '설빙 성수점 여름 신메뉴 체험단 모집',
    storeId: 's6',
    storeName: '설빙 성수점',
    brandId: 'b6',
    brandName: '설빙',
    category: 'dessert',
    categoryLabel: '디저트',
    region: '서울',
    district: '성동구',
    type: 'experience',
    status: 'open',
    applicationDeadline: '2026-06-05',
    activityPeriod: '2026-06-10 ~ 2026-06-20',
    totalSlots: 10,
    appliedCount: 34,
    requirements: ['인스타그램 팔로워 500명 이상', '방문 후 블로그 또는 인스타 포스팅 가능자', '20~40대 선호'],
    benefits: ['여름 신메뉴 2인분 무료 제공 (5만원 상당)', '포토존 우선 이용', '포스팅 후 리워드 쿠폰'],
    missions: ['방문 당일 인스타그램 스토리 1회 이상 업로드', '블로그 또는 릴스 후기 포스팅 (방문 후 5일 이내)', '#설빙성수 #베스트플레이스체험단 태그 필수'],
    description: '2026 여름 신메뉴 출시에 앞서 성수점을 직접 방문해 체험해주실 분을 모집합니다. 베스트플레이스 어워드 수상 매장을 직접 경험하고 솔직한 후기를 남겨주세요.',
    thumbnailColor: '#EC4899',
  },
  {
    id: 'c2',
    title: '메가커피 홍대입구점 신메뉴 기자단',
    storeId: 's2',
    storeName: '메가커피 홍대입구점',
    brandId: 'b2',
    brandName: '메가커피',
    category: 'cafe',
    categoryLabel: '카페',
    region: '서울',
    district: '마포구',
    type: 'press',
    status: 'open',
    applicationDeadline: '2026-06-08',
    activityPeriod: '2026-06-13 ~ 2026-06-25',
    totalSlots: 5,
    appliedCount: 18,
    requirements: ['개인 블로그 운영 중 (월 방문자 200 이상)', '음료·카페 콘텐츠 경험 보유', '기사체 작성 가능자'],
    benefits: ['음료 3종 풀세트 무료 제공', '취재 전용 포토 키트 지원', '우수 기사 베스트플레이스 메인 노출'],
    missions: ['매장 방문 취재 후 기사형 리뷰 1편 작성 (800자 이상)', '사진 5장 이상 첨부', '포스팅 URL 제출 (방문 후 7일 이내)'],
    description: '메가커피 홍대입구점 신메뉴 출시 기념 기자단을 모집합니다. 2026 베스트 카페 1위 수상 매장의 신메뉴를 가장 먼저 체험하고 깊이 있는 기사로 담아주세요.',
    thumbnailColor: '#7C3AED',
  },
  {
    id: 'c3',
    title: '교촌치킨 강남역점 SNS서포터즈 4기',
    storeId: 's1',
    storeName: '교촌치킨 강남역점',
    brandId: 'b1',
    brandName: '교촌치킨',
    category: 'chicken',
    categoryLabel: '치킨',
    region: '서울',
    district: '강남구',
    type: 'sns',
    status: 'open',
    applicationDeadline: '2026-06-10',
    activityPeriod: '2026-06-15 ~ 2026-07-15',
    totalSlots: 8,
    appliedCount: 52,
    requirements: ['인스타그램 팔로워 1,000명 이상', '음식 관련 콘텐츠 계정 선호', '릴스 제작 가능자'],
    benefits: ['교촌 2인 세트 무료 (월 2회)', '서포터즈 전용 굿즈 키트', '우수 콘텐츠 공식 계정 공유'],
    missions: ['월 2회 이상 인스타그램 피드 포스팅', '릴스 또는 스토리 월 4회 이상', '#교촌치킨강남역점 #베스트플레이스 필수 태그'],
    description: '교촌치킨 강남역점 공식 SNS서포터즈 4기를 모집합니다. 2026 베스트 치킨 대상 수상 매장을 함께 알리고 혜택도 챙겨가세요.',
    thumbnailColor: '#B45309',
  },
  {
    id: 'c4',
    title: '역전할머니맥주 서면점 주말 체험단',
    storeId: 's8',
    storeName: '역전할머니맥주 서면점',
    brandId: 'b8',
    brandName: '역전할머니맥주',
    category: 'bar',
    categoryLabel: '주점',
    region: '부산',
    district: '부산진구',
    type: 'experience',
    status: 'open',
    applicationDeadline: '2026-06-07',
    activityPeriod: '2026-06-14 ~ 2026-06-21',
    totalSlots: 6,
    appliedCount: 27,
    requirements: ['20세 이상', '부산·경남 거주자 우대', '음식·주류 콘텐츠 관심자'],
    benefits: ['안주+음료 4인 세트 무료 (7만원 상당)', '주말 예약 우선권', '방문 기념 굿즈'],
    missions: ['방문 당일 인스타그램 또는 블로그 포스팅', '#역전할머니맥주서면 #베스트플레이스체험단 태그', '평점 4점 이상 구글·네이버 리뷰 작성'],
    description: '부산 서면 야간 상권 대표 주점 역전할머니맥주 서면점 체험단입니다. 2026 베스트 주점 1위 수상 매장을 직접 경험해보세요.',
    thumbnailColor: '#7C3AED',
  },
  {
    id: 'c5',
    title: '봉추찜닭 부산서면점 점심 기자단',
    storeId: 's11',
    storeName: '봉추찜닭 부산서면점',
    brandId: 'b11',
    brandName: '봉추찜닭',
    category: 'korean',
    categoryLabel: '한식',
    region: '부산',
    district: '부산진구',
    type: 'press',
    status: 'ongoing',
    applicationDeadline: '2026-05-20',
    activityPeriod: '2026-05-25 ~ 2026-06-10',
    totalSlots: 4,
    appliedCount: 4,
    requirements: ['블로그 운영자 (네이버·티스토리)', '음식 관련 포스팅 최근 3개월 내 3편 이상', '부산 지역 방문 가능자'],
    benefits: ['찜닭 2인 세트 무료', '포스팅 원고료 5만원', '베스트플레이스 기자단 인증 배지'],
    missions: ['방문 취재 후 블로그 리뷰 1편 (사진 8장 이상, 1,000자 이상)', '네이버 지도·카카오맵 리뷰 작성', 'URL 제출 방문 후 10일 이내'],
    description: '2026 베스트 한식 1위 봉추찜닭 서면점의 점심 메뉴를 취재해주실 기자단을 모집합니다. 실제 점심 객층이 많이 찾는 이유를 깊이 있게 다뤄주세요.',
    thumbnailColor: '#B45309',
  },
  {
    id: 'c6',
    title: '하코야 송도점 이자카야 SNS서포터즈',
    storeId: 's4',
    storeName: '하코야 송도점',
    brandId: 'b4',
    brandName: '하코야',
    category: 'japanese',
    categoryLabel: '일식',
    region: '인천',
    district: '연수구',
    type: 'sns',
    status: 'open',
    applicationDeadline: '2026-06-12',
    activityPeriod: '2026-06-18 ~ 2026-07-18',
    totalSlots: 5,
    appliedCount: 11,
    requirements: ['인스타그램 팔로워 500명 이상', '음식·여행 콘텐츠 선호', '인천·경기 거주자 우대'],
    benefits: ['이자카야 코스 2인 무료 (월 1회)', '셰프 특선 메뉴 사전 체험 기회', 'SNS 서포터즈 전용 명함'],
    missions: ['월 2회 이상 인스타그램 피드 게시', '#하코야송도 #베스트플레이스 태그 필수', '스토리 2회/월 이상'],
    description: '2026 베스트 일식 1위 하코야 송도점 SNS서포터즈를 모집합니다. 이자카야+다이닝 복합 공간의 매력을 콘텐츠로 담아주세요.',
    thumbnailColor: '#0EA5E9',
  },
  {
    id: 'c7',
    title: '설빙 강남역점 프리미엄 빙수 체험단',
    storeId: 's15',
    storeName: '설빙 강남역점',
    brandId: 'b6',
    brandName: '설빙',
    category: 'dessert',
    categoryLabel: '디저트',
    region: '서울',
    district: '강남구',
    type: 'experience',
    status: 'completed',
    applicationDeadline: '2026-04-30',
    activityPeriod: '2026-05-05 ~ 2026-05-15',
    totalSlots: 8,
    appliedCount: 8,
    requirements: ['20~35세 선호', '인스타그램 팔로워 300명 이상'],
    benefits: ['프리미엄 빙수 2인 무료', '포토부스 이용권'],
    missions: ['인스타그램 피드 포스팅', '#설빙강남역점 태그'],
    description: '완료된 체험단 캠페인입니다.',
    thumbnailColor: '#EC4899',
  },
  {
    id: 'c8',
    title: '마루가메제면 광화문점 점심 기자단',
    storeId: 's12',
    storeName: '마루가메제면 광화문점',
    brandId: 'b12',
    brandName: '마루가메제면',
    category: 'japanese',
    categoryLabel: '일식',
    region: '서울',
    district: '종로구',
    type: 'press',
    status: 'open',
    applicationDeadline: '2026-06-15',
    activityPeriod: '2026-06-20 ~ 2026-07-05',
    totalSlots: 3,
    appliedCount: 7,
    requirements: ['블로그 or 브런치 운영자', '오피스 점심 문화 관련 콘텐츠 관심자', '서울 종로·광화문 방문 가능'],
    benefits: ['우동 단품 + 세트 전 메뉴 무료 체험', '포스팅 원고료 3만원', '베스트플레이스 기자단 뱃지'],
    missions: ['점심 시간 방문 취재 후 기사형 리뷰 작성 (사진 5장, 700자 이상)', '네이버 플레이스 리뷰 작성', 'URL 제출'],
    description: '광화문 오피스 상권 점심 강자 마루가메제면의 회전율 비결을 취재해주실 기자단을 모집합니다.',
    thumbnailColor: '#991B1B',
  },
]

export function campaignById(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id)
}

export function openCampaigns(limit?: number): Campaign[] {
  const open = CAMPAIGNS.filter((c) => c.status === 'open')
  return limit ? open.slice(0, limit) : open
}

export function campaignsByType(type: CampaignType): Campaign[] {
  return CAMPAIGNS.filter((c) => c.type === type)
}
