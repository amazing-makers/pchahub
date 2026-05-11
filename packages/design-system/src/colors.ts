export type PlatformKey =
  | 'pchahub'
  | 'openrun'
  | 'gongganhansu'
  | 'themyungdang'
  | 'themanual'
  | 'jangsanote'
  | 'bestplace'
  | 'changupdocu'
  | 'pchabridge'

export interface PlatformBrand {
  primary: string
  name: string
  role: string
  domain: string
}

export const platformColors: Record<PlatformKey, PlatformBrand> = {
  pchahub: {
    primary: '#4F46E5',
    name: '프차허브',
    role: '프랜차이즈',
    domain: 'pchahub.kr',
  },
  openrun: {
    primary: '#F97316',
    name: '오픈런',
    role: '마케팅',
    domain: 'openrun.kr',
  },
  gongganhansu: {
    primary: '#64748B',
    name: '공간의한수',
    role: '인테리어',
    domain: 'gongganhansu.kr',
  },
  themyungdang: {
    primary: '#10B981',
    name: '더명당',
    role: '부동산',
    domain: 'themyungdang.kr',
  },
  themanual: {
    primary: '#3B82F6',
    name: '더메뉴얼',
    role: '매뉴얼/교육',
    domain: 'themanual.kr',
  },
  jangsanote: {
    primary: '#F59E0B',
    name: '장사노트',
    role: '커뮤니티',
    domain: 'jangsanote.kr',
  },
  bestplace: {
    primary: '#EAB308',
    name: '베스트플레이스',
    role: '베스트/시상',
    domain: 'bestplace.kr',
  },
  changupdocu: {
    primary: '#F43F5E',
    name: '창업다큐',
    role: '미디어',
    domain: 'changupdocu.kr',
  },
  pchabridge: {
    primary: '#8B5CF6',
    name: '프차브릿지',
    role: '투자/M&A',
    domain: 'pchabridge.kr',
  },
}

export const semanticColors = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const

export const grayColors = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
} as const
