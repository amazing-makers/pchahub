import type { EpisodeCategory } from './mock-data'

export interface SeriesEpisodeRef {
  episodeId: string
  order: number
}

export interface MockSeries {
  id: string
  title: string
  subtitle: string
  description: string
  category: EpisodeCategory
  thumbnailColors: [string, string]
  episodeRefs: SeriesEpisodeRef[]
  tags: string[]
  publishedAt: string
  totalDuration: string
  featured: boolean
}

export const SERIES: MockSeries[] = [
  {
    id: 'sr1',
    title: '치킨 창업 완전정복',
    subtitle: '성공부터 실패까지 — 치킨 가맹의 모든 것',
    description:
      '한국에서 가장 많이 창업하는 업종, 치킨. 교촌의 성공 방정식과 굽네의 성장 전략, 그리고 중소 치킨 브랜드의 폐업 사례까지. 치킨 가맹을 고민한다면 이 시리즈가 먼저다.',
    category: 'success',
    thumbnailColors: ['#B45309', '#EAB308'],
    episodeRefs: [
      { episodeId: 'e1', order: 1 },
      { episodeId: 'e8', order: 2 },
      { episodeId: 'e3', order: 3 },
    ],
    tags: ['치킨', '가맹', '교촌', '굽네', '성공', '실패'],
    publishedAt: '2026-04-01',
    totalDuration: '1시간 02분',
    featured: true,
  },
  {
    id: 'sr2',
    title: '권리금의 모든 것',
    subtitle: '분쟁, 회수, 협상 — 권리금을 알아야 창업한다',
    description:
      '권리금 분쟁은 창업자가 가장 많이 겪는 법적 문제다. 실제 분쟁에서 80% 이상을 회수한 점주 인터뷰와 권리금 시세 데이터를 한 시리즈에 담았다.',
    category: 'failure',
    thumbnailColors: ['#DC2626', '#991B1B'],
    episodeRefs: [
      { episodeId: 'e8', order: 1 },
      { episodeId: 'e2', order: 2 },
    ],
    tags: ['권리금', '분쟁', '법률', '계약서'],
    publishedAt: '2026-03-15',
    totalDuration: '48분',
    featured: true,
  },
  {
    id: 'sr3',
    title: '1인 운영의 경제학',
    subtitle: '혼자 운영하면 정말 남는 게 있을까?',
    description:
      '인건비를 줄이려고 1인 운영을 선택하는 창업자들이 늘고 있다. 카페, 분식, 음료 — 1인 운영이 가능한 업종과 그 한계를 데이터로 분석한다.',
    category: 'trend',
    thumbnailColors: ['#10B981', '#047857'],
    episodeRefs: [
      { episodeId: 'e6', order: 1 },
      { episodeId: 'e5', order: 2 },
      { episodeId: 'e7', order: 3 },
    ],
    tags: ['1인운영', '인건비', '카페', '분식', '매출'],
    publishedAt: '2026-04-20',
    totalDuration: '54분',
    featured: false,
  },
  {
    id: 'sr4',
    title: '2026 자영업 트렌드 리포트',
    subtitle: '올해 창업 시장을 읽는 핵심 키워드',
    description:
      '디저트 트렌드의 변화, AI 카운터 도입, 배달 플랫폼 재편까지. 2026년 자영업 시장의 구조적 변화를 현장 데이터와 전문가 인터뷰로 풀어낸다.',
    category: 'trend',
    thumbnailColors: ['#F59E0B', '#D97706'],
    episodeRefs: [
      { episodeId: 'e4', order: 1 },
      { episodeId: 'e7', order: 2 },
    ],
    tags: ['트렌드', 'AI', '디저트', '배달', '2026'],
    publishedAt: '2026-05-01',
    totalDuration: '37분',
    featured: true,
  },
  {
    id: 'sr5',
    title: '브랜드 인사이드 — 성장의 비밀',
    subtitle: '본사가 직접 말하는 가맹 성장의 공식',
    description:
      '교촌, 굽네, 죠스떡볶이. 수백 개의 가맹점을 운영하는 브랜드들이 공개하는 성공 공식. 가맹 본사의 내부 전략을 이 시리즈에서 처음 공개한다.',
    category: 'brand',
    thumbnailColors: ['#3B82F6', '#1D4ED8'],
    episodeRefs: [
      { episodeId: 'e3', order: 1 },
      { episodeId: 'e1', order: 2 },
    ],
    tags: ['브랜드', '가맹본사', '전략', '성장'],
    publishedAt: '2026-02-10',
    totalDuration: '43분',
    featured: false,
  },
]

export function seriesById(id: string): MockSeries | undefined {
  return SERIES.find((s) => s.id === id)
}

export const FEATURED_SERIES = SERIES.filter((s) => s.featured)
