// Mock data for pchahub homepage. Will be replaced with real DB queries
// once Supabase is connected. Brand names are fictional to avoid trademark
// issues; figures are illustrative and not based on actual KFA disclosures.

import { brandImageSet, type BrandMenuImage } from './brand-images'
import v2Raw from './v2-brands.json'
import v2LocalPaths from './v2-local-paths.json'
import v2KftcEnrich from '../../../packages/listings/data/v2-kftc-enrichments.json'
import v2ExtrasRaw from '../../../packages/listings/data/myfranchise-extras.json'

export interface MockCategory {
  key: string
  label: string
  brandCount: number
}

export interface MockBrand {
  id: string
  name: string
  category: string
  categoryLabel: string
  /** Hex color used as a flat logo placeholder until real logos exist. */
  logoColor: string
  description: string
  storeCount: number
  /** Initial startup cost in 만원 (10,000 KRW). */
  startupCost: number
  /** Monthly royalty in 만원. */
  monthlyRoyalty: number
  /** Verified by KFA / 협회 등록 정보공개서 reference. */
  hqVerified: boolean
  /** Brand is actively recruiting new franchisees. */
  recruiting: boolean
  /** Paid ad placement (top-of-list). */
  featured: boolean
  /** Rough new-store growth rate this year (%). */
  growthRate: number
  /** HQ headquarters region (시·도). Used for /brands region filter. */
  hqRegion: string
  /** Hero image URL — real photo for brand card / detail page. */
  heroImage: string
  // ── 본사가 직접 등록하는 미디어 자산 ───────────────────────
  /** Brand logo. Inline SVG data URI by default; replaced with HQ-uploaded
   *  logo (Supabase Storage `brands/{id}/logo.svg|png`) once HQ registers. */
  logo: string
  /** Storefront + interior photos (2 images). HQ-uploaded after registration. */
  storeImages: string[]
  /** Menu/product photos (4 images, first is signature). */
  menuImages: BrandMenuImage[]
  /** Promo video (YouTube/Vimeo embed URL). Empty until HQ uploads. */
  videoUrl?: string
  // ── 실 API(KFTC) 전용 필드 ──────────────────────────────
  /** KFTC 법인명 (실API 브랜드). 없으면 name 기반 표시. */
  corpNm?: string
  /** 평균 연매출 (만원). getBrandFrcsStats avrgSlsAmt. */
  avgAnnualSales?: number
  /** 가맹사업 시작연도. getBrandBrandStats jngBizStrtDate. */
  jngBizStartYear?: number
  /** 계약 종료(폐점) 수. getBrandFrcsStats ctrtEndCnt. */
  closedCount?: number
  /** 신규 가맹점 등록 수. getBrandFrcsStats newFrcsRgsCnt. */
  newOpenCount?: number
  /** 가맹금 (만원). getBrandFntnStats jngBzmnJngAmt. */
  fntnFranchiseFee?: number
  /** 교육비 (만원). getBrandFntnStats jngBzmnEduAmt. */
  fntnEducationFee?: number
  /** 보증금 (만원). getBrandFntnStats jngBzmnAssrncAmt. */
  fntnDeposit?: number
  /** 기타 (만원). getBrandFntnStats jngBzmnEtcAmt. */
  fntnOtherFees?: number
}

export const CATEGORIES: MockCategory[] = [
  { key: 'chicken',     label: '치킨',       brandCount: 32 },
  { key: 'cafe',        label: '카페',       brandCount: 31 },
  { key: 'korean',      label: '한식',       brandCount: 32 },
  { key: 'japanese',    label: '일식',       brandCount: 28 },
  { key: 'snack',       label: '분식',       brandCount: 31 },
  { key: 'dessert',     label: '디저트',     brandCount: 28 },
  { key: 'bar',         label: '주점',       brandCount: 27 },
  { key: 'western',     label: '서양식',     brandCount: 27 },
  { key: 'pizza',       label: '피자',       brandCount: 27 },
  { key: 'chinese',     label: '중식',       brandCount: 26 },
  { key: 'bakery',      label: '제과제빵',   brandCount: 3  },
  { key: 'fastfood',    label: '패스트푸드', brandCount: 3  },
  { key: 'convenience', label: '편의점',     brandCount: 6  },
  { key: 'pcbang',      label: 'PC방',       brandCount: 3  },
  { key: 'education',   label: '교육·유아',  brandCount: 4  },
  { key: 'study',       label: '스터디카페', brandCount: 4  },
  { key: 'laundry',     label: '빨래방',     brandCount: 3  },
  { key: 'life',        label: '생활서비스', brandCount: 2  },
  { key: 'leisure',     label: '여가·오락',  brandCount: 1  },
]

// RAW_BRANDS 객체에는 brand identity·핵심 metric만. 사진/Media·KFTC 보강 자료·hqRegion은
// _CURATED 변환 단계에서 채워지므로 RawBrand에서 Omit.
type RawBrand = Omit<MockBrand,
  | 'heroImage'
  | 'logo'
  | 'storeImages'
  | 'menuImages'
  | 'videoUrl'
  | 'hqRegion'
  | 'corpNm'
  | 'avgAnnualSales'
  | 'jngBizStartYear'
  | 'closedCount'
  | 'newOpenCount'
  | 'fntnFranchiseFee'
  | 'fntnEducationFee'
  | 'fntnDeposit'
  | 'fntnOtherFees'
> & { hqRegion?: string }

const RAW_BRANDS: RawBrand[] = [
  {
    id: 'b1',
    name: '호치킨',
    category: 'chicken',
    categoryLabel: '치킨',
    logoColor: '#F97316',
    description: '숯불 훈제 오리지널 치킨 · 가성비 두마리 전문',
    storeCount: 84,
    startupCost: 5500,
    monthlyRoyalty: 50,
    hqVerified: true,
    recruiting: true,
    featured: true,
    growthRate: 28,
  },
  {
    id: 'b2',
    name: '텐퍼센트스페셜티커피',
    category: 'cafe',
    categoryLabel: '카페',
    logoColor: '#92400E',
    description: '스페셜티 원두 저가 커피 · 소형 매장 특화',
    storeCount: 312,
    startupCost: 4200,
    monthlyRoyalty: 30,
    hqVerified: true,
    recruiting: true,
    featured: true,
    growthRate: 45,
  },
  {
    id: 'b3',
    name: '육칠이',
    category: 'korean',
    categoryLabel: '한식',
    logoColor: '#16A34A',
    description: '가성비 삼겹살 · 목살 구이 한식 전문점',
    storeCount: 56,
    startupCost: 6800,
    monthlyRoyalty: 80,
    hqVerified: true,
    recruiting: true,
    featured: true,
    growthRate: 12,
  },
  {
    id: 'b4',
    name: '백소정',
    category: 'korean',
    categoryLabel: '한식',
    logoColor: '#0EA5E9',
    description: '한식 정식 전문점 · 깔끔한 한상차림',
    storeCount: 22,
    startupCost: 9500,
    monthlyRoyalty: 120,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 35,
  },
  {
    id: 'b5',
    name: '헬키푸키',
    category: 'snack',
    categoryLabel: '분식',
    logoColor: '#DC2626',
    description: '건강 분식 · 찰떡볶이 전문 브랜드',
    storeCount: 138,
    startupCost: 3800,
    monthlyRoyalty: 35,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 8,
  },
  {
    id: 'b6',
    name: '과일에반하다.프루타',
    category: 'dessert',
    categoryLabel: '디저트',
    logoColor: '#EC4899',
    description: '프리미엄 과일 빙수 · 아이스크림 전문점',
    storeCount: 41,
    startupCost: 7200,
    monthlyRoyalty: 70,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 22,
  },
  {
    id: 'b7',
    name: '슬로우캘리',
    category: 'snack',
    categoryLabel: '분식',
    logoColor: '#10B981',
    description: '건강 샐러드 · 그레인볼 전문 패스트푸드',
    storeCount: 67,
    startupCost: 3500,
    monthlyRoyalty: 25,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 18,
  },
  {
    id: 'b8',
    name: '숯토리',
    category: 'bar',
    categoryLabel: '주점',
    logoColor: '#7C3AED',
    description: '숯불 삼겹살 · 참숯 직화 구이 전문 주점',
    storeCount: 29,
    startupCost: 8500,
    monthlyRoyalty: 100,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 5,
  },
  {
    id: 'b9',
    name: '기영이숯불두마리치킨',
    category: 'chicken',
    categoryLabel: '치킨',
    logoColor: '#EAB308',
    description: '숯불 두마리 치킨 · 가성비 치킨 브랜드',
    storeCount: 18,
    startupCost: 6200,
    monthlyRoyalty: 60,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 55,
  },
  {
    id: 'b10',
    name: '동경에서먹었던규동',
    category: 'japanese',
    categoryLabel: '일식',
    logoColor: '#A16207',
    description: '도쿄 스타일 규동 · 일식 덮밥 전문점',
    storeCount: 94,
    startupCost: 5800,
    monthlyRoyalty: 45,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 14,
  },
  {
    id: 'b11',
    name: '9504 양평칼국수',
    category: 'korean',
    categoryLabel: '한식',
    logoColor: '#B45309',
    description: '양평식 칼국수 · 바지락 육수 전통 방식',
    storeCount: 33,
    startupCost: 7500,
    monthlyRoyalty: 90,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 6,
  },
  {
    id: 'b12',
    name: '국민매운찜갈비',
    category: 'korean',
    categoryLabel: '한식',
    logoColor: '#991B1B',
    description: '매운 찜갈비 · 국민 한식 갈비찜 전문점',
    storeCount: 47,
    startupCost: 6500,
    monthlyRoyalty: 55,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 19,
  },

  // ── 제과제빵 ─────────────────────────────────────────────────
  {
    id: 'b13',
    name: '파리바게뜨',
    category: 'bakery',
    categoryLabel: '제과제빵',
    logoColor: '#D97706',
    description: 'SPC그룹 대표 베이커리 · 전국 3,400여 개 가맹점 · 글로벌 10개국 진출',
    storeCount: 3446,
    startupCost: 31380,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: true,
    growthRate: 3,
    hqRegion: '서울',
  },
  {
    id: 'b14',
    name: '뚜레쥬르',
    category: 'bakery',
    categoryLabel: '제과제빵',
    logoColor: '#B45309',
    description: 'CJ푸드빌 운영 프리미엄 베이커리 · 1997년 창업 · 전국 1,300여 개 매장',
    storeCount: 1323,
    startupCost: 22000,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 2,
    hqRegion: '서울',
  },
  {
    id: 'b15',
    name: '던킨',
    category: 'bakery',
    categoryLabel: '제과제빵',
    logoColor: '#F97316',
    description: '도넛·베이글·커피 전문 글로벌 브랜드 · SPC그룹 국내 운영 · 가맹비 880만원',
    storeCount: 661,
    startupCost: 27187,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 4,
    hqRegion: '서울',
  },

  // ── 패스트푸드 ───────────────────────────────────────────────
  {
    id: 'b16',
    name: '롯데리아',
    category: 'fastfood',
    categoryLabel: '패스트푸드',
    logoColor: '#DC2626',
    description: '1979년 1호점 · 롯데GRS 운영 · 로열티 없음 · 연 평균 매출 7.8억원',
    storeCount: 1300,
    startupCost: 41898,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 2,
    hqRegion: '서울',
  },
  {
    id: 'b17',
    name: '버거킹',
    category: 'fastfood',
    categoryLabel: '패스트푸드',
    logoColor: '#B91C1C',
    description: '1984년 한국 진출 · 직화 그릴 버거 · 연 평균 매출 12억원 · 가맹 모집 중',
    storeCount: 490,
    startupCost: 66200,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 5,
    hqRegion: '서울',
  },
  {
    id: 'b18',
    name: 'KFC',
    category: 'fastfood',
    categoryLabel: '패스트푸드',
    logoColor: '#991B1B',
    description: '2023년부터 가맹사업 개시 · 오리지널 레시피 후라이드치킨 · 2024 역대 최대실적',
    storeCount: 224,
    startupCost: 45000,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 8,
    hqRegion: '서울',
  },

  // ── 편의점 ───────────────────────────────────────────────────
  {
    id: 'b19',
    name: 'CU',
    category: 'convenience',
    categoryLabel: '편의점',
    logoColor: '#7C3AED',
    description: 'BGF리테일 운영 · 전국 18,458개 점포 · 국내 편의점 점포수 1위',
    storeCount: 18458,
    startupCost: 9500,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 3,
    hqRegion: '서울',
  },
  {
    id: 'b20',
    name: 'GS25',
    category: 'convenience',
    categoryLabel: '편의점',
    logoColor: '#0284C7',
    description: 'GS리테일 운영 · 전국 17,989개 점포 · 편의점 매출 1위 · PB상품 강점',
    storeCount: 17989,
    startupCost: 9200,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 3,
    hqRegion: '서울',
  },

  // ── PC방 ─────────────────────────────────────────────────────
  {
    id: 'b21',
    name: '아이센스PC방',
    category: 'pcbang',
    categoryLabel: 'PC방',
    logoColor: '#6366F1',
    description: '국내 PC방 프랜차이즈 점포수 1위 · 241개 가맹점 · 2017년 창업 · 24시간 운영',
    storeCount: 241,
    startupCost: 12540,
    monthlyRoyalty: 30,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 12,
    hqRegion: '경기',
  },
  {
    id: 'b22',
    name: '아이비스PC방',
    category: 'pcbang',
    categoryLabel: 'PC방',
    logoColor: '#4F46E5',
    description: '프리미엄 PC·인테리어 · 235개 가맹점 · 고사양 게이밍 특화 PC방 프랜차이즈',
    storeCount: 235,
    startupCost: 17600,
    monthlyRoyalty: 30,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 9,
    hqRegion: '서울',
  },

  // ── 교육·유아 ────────────────────────────────────────────────
  {
    id: 'b23',
    name: '구몬학습',
    category: 'education',
    categoryLabel: '교육·유아',
    logoColor: '#0284C7',
    description: '글로벌 48개국 진출 방문학습지 · 국내 교사 12,000명 · 회원 180만명 보유',
    storeCount: 2553,
    startupCost: 3617,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 5,
    hqRegion: '서울',
  },
  {
    id: 'b24',
    name: '해법수학교실',
    category: 'education',
    categoryLabel: '교육·유아',
    logoColor: '#0369A1',
    description: '전국 누적 26,000교실 돌파 · 월 신규 교실 50개 이상 개원 · 소자본 창업 가능',
    storeCount: 2553,
    startupCost: 3617,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 6,
    hqRegion: '서울',
  },

  // ── 스터디카페 ───────────────────────────────────────────────
  {
    id: 'b25',
    name: '작심스터디카페',
    category: 'study',
    categoryLabel: '스터디카페',
    logoColor: '#0891B2',
    description: '스터디카페 월매출 1위 브랜드 · 338개 가맹점 · 24시간 운영 · 무인화 시스템',
    storeCount: 338,
    startupCost: 19910,
    monthlyRoyalty: 20,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 22,
    hqRegion: '서울',
  },
  {
    id: 'b26',
    name: '토즈스터디센터',
    category: 'study',
    categoryLabel: '스터디카페',
    logoColor: '#0E7490',
    description: '스터디카페·회의실 복합 공간 · 217개 가맹점 · 개인 집중석·그룹룸 운영',
    storeCount: 217,
    startupCost: 18000,
    monthlyRoyalty: 20,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 15,
    hqRegion: '서울',
  },

  // ── 빨래방 ───────────────────────────────────────────────────
  {
    id: 'b27',
    name: '크린토피아',
    category: 'laundry',
    categoryLabel: '빨래방',
    logoColor: '#0D9488',
    description: '국내 세탁 프랜차이즈 1위 · 3,126개 가맹점 · 20년 이상 운영 · 세탁편의점 특화',
    storeCount: 3126,
    startupCost: 2369,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 4,
    hqRegion: '서울',
  },
  {
    id: 'b28',
    name: '워시엔조이',
    category: 'laundry',
    categoryLabel: '빨래방',
    logoColor: '#0F766E',
    description: '가맹비·로열티 없는 코인세탁 프랜차이즈 · 700+ 가맹점 · 폐업률 0.3%',
    storeCount: 700,
    startupCost: 7000,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 8,
    hqRegion: '경기',
  },

  // ── 생활서비스 ───────────────────────────────────────────────
  {
    id: 'b29',
    name: '다이소',
    category: 'life',
    categoryLabel: '생활서비스',
    logoColor: '#7C3AED',
    description: '균일가 생활용품 전문점 · 전국 497개 가맹점 · 월 매출 3,000만원+ · 100평 기준',
    storeCount: 497,
    startupCost: 37240,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 6,
    hqRegion: '서울',
  },
  {
    id: 'b30',
    name: '올리브영',
    category: 'life',
    categoryLabel: '생활서비스',
    logoColor: '#16A34A',
    description: 'CJ올리브네트웍스 운영 헬스·뷰티 전문점 · 1,298개 매장 · 월 평균 매출 1.4억원',
    storeCount: 1298,
    startupCost: 30000,
    monthlyRoyalty: 0,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 7,
    hqRegion: '서울',
  },

  // ── 여가·오락 ────────────────────────────────────────────────
  {
    id: 'b31',
    name: '셜록홈즈',
    category: 'leisure',
    categoryLabel: '여가·오락',
    logoColor: '#92400E',
    description: '방탈출카페 대표 프랜차이즈 · 5년 이상 운영 · 전국 40개 가맹점 · 스토리 특화',
    storeCount: 40,
    startupCost: 12204,
    monthlyRoyalty: 50,
    hqVerified: true,
    recruiting: true,
    featured: false,
    growthRate: 18,
    hqRegion: '서울',
  },

  // ════════════════════════════════════════════════════════════
  // 사진 미등록 브랜드 (실제 데이터 기반, 사진 등록 후 상단 노출)
  // ════════════════════════════════════════════════════════════

  // ── 치킨 추가 ────────────────────────────────────────────────
  {
    id: 'b32', name: '교촌치킨', category: 'chicken', categoryLabel: '치킨',
    logoColor: '#B45309',
    description: '간장·허니·레드 3대 소스 · 1991년 창업 국내 대표 치킨 프랜차이즈',
    storeCount: 1297, startupCost: 24000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 3, hqRegion: '서울',
  },
  {
    id: 'b33', name: 'bhc치킨', category: 'chicken', categoryLabel: '치킨',
    logoColor: '#EA580C',
    description: '뿌링클·맛초킹으로 유명 · 2014년 독립 이후 연 매출 1조 돌파 · 전국 2,080개',
    storeCount: 2080, startupCost: 18000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 5, hqRegion: '서울',
  },
  {
    id: 'b34', name: 'BBQ치킨', category: 'chicken', categoryLabel: '치킨',
    logoColor: '#D97706',
    description: '황금올리브 오리지널 · 1995년 창업 · 해외 57개국 진출 · 전국 2,072개 매장',
    storeCount: 2072, startupCost: 19000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 4, hqRegion: '경기',
  },
  {
    id: 'b35', name: '굽네치킨', category: 'chicken', categoryLabel: '치킨',
    logoColor: '#92400E',
    description: '오븐 직화구이 저칼로리 치킨 · 웰빙 트렌드 특화 · 전국 1,094개 가맹점',
    storeCount: 1094, startupCost: 14000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 6, hqRegion: '서울',
  },
  {
    id: 'b36', name: '네네치킨', category: 'chicken', categoryLabel: '치킨',
    logoColor: '#F97316',
    description: '달콤한 양념치킨 원조 · 1999년 창업 · 전국 1,400개 가맹점 운영 중',
    storeCount: 1400, startupCost: 16000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 4, hqRegion: '서울',
  },

  // ── 카페 추가 ────────────────────────────────────────────────
  {
    id: 'b37', name: '이디야커피', category: 'cafe', categoryLabel: '카페',
    logoColor: '#1D4ED8',
    description: '국내 카페 프랜차이즈 점포수 1위 · 전국 3,600개 · 합리적 가격의 생활 커피',
    storeCount: 3600, startupCost: 8000, monthlyRoyalty: 30,
    hqVerified: true, recruiting: true, featured: false, growthRate: 6, hqRegion: '서울',
  },
  {
    id: 'b38', name: '메가MGC커피', category: 'cafe', categoryLabel: '카페',
    logoColor: '#15803D',
    description: '2020년 창업 저가 스페셜티 · 전국 2,700개 돌파 · 가장 빠르게 성장 중인 카페',
    storeCount: 2700, startupCost: 5500, monthlyRoyalty: 20,
    hqVerified: true, recruiting: true, featured: false, growthRate: 18, hqRegion: '서울',
  },
  {
    id: 'b39', name: '투썸플레이스', category: 'cafe', categoryLabel: '카페',
    logoColor: '#BE185D',
    description: 'CJ 프리미엄 디저트 카페 · 케이크·마카롱 특화 · 전국 1,800개 매장',
    storeCount: 1800, startupCost: 22000, monthlyRoyalty: 50,
    hqVerified: true, recruiting: true, featured: false, growthRate: 7, hqRegion: '서울',
  },
  {
    id: 'b40', name: '빽다방', category: 'cafe', categoryLabel: '카페',
    logoColor: '#7C3AED',
    description: '백종원 대표 저가 커피 · 전국 1,600개 · 1,500원대 아메리카노로 화제',
    storeCount: 1600, startupCost: 4500, monthlyRoyalty: 20,
    hqVerified: true, recruiting: true, featured: false, growthRate: 12, hqRegion: '서울',
  },
  {
    id: 'b41', name: '할리스', category: 'cafe', categoryLabel: '카페',
    logoColor: '#991B1B',
    description: '1998년 국내 1세대 스페셜티 카페 · 전국 570개 · 럭셔리 카페 분위기 특화',
    storeCount: 570, startupCost: 25000, monthlyRoyalty: 50,
    hqVerified: true, recruiting: true, featured: false, growthRate: 3, hqRegion: '서울',
  },

  // ── 한식 추가 ────────────────────────────────────────────────
  {
    id: 'b42', name: '본죽', category: 'korean', categoryLabel: '한식',
    logoColor: '#15803D',
    description: '죽 전문 프랜차이즈 1위 · 전국 1,200개 · 건강죽·이유식·도시락 운영',
    storeCount: 1200, startupCost: 4500, monthlyRoyalty: 30,
    hqVerified: true, recruiting: true, featured: false, growthRate: 3, hqRegion: '서울',
  },
  {
    id: 'b43', name: '한솥도시락', category: 'korean', categoryLabel: '한식',
    logoColor: '#CA8A04',
    description: '1993년 창업 도시락 원조 · 전국 769개 · 저렴하고 든든한 한식 도시락 특화',
    storeCount: 769, startupCost: 5500, monthlyRoyalty: 25,
    hqVerified: true, recruiting: true, featured: false, growthRate: 4, hqRegion: '서울',
  },
  {
    id: 'b44', name: '놀부부대찌개&철판구이', category: 'korean', categoryLabel: '한식',
    logoColor: '#DC2626',
    description: '부대찌개 전문 프랜차이즈 · 전국 300개 · 1991년 창업 · 인기 한식 외식 브랜드',
    storeCount: 300, startupCost: 9000, monthlyRoyalty: 60,
    hqVerified: true, recruiting: true, featured: false, growthRate: 2, hqRegion: '서울',
  },

  // ── 분식 추가 ────────────────────────────────────────────────
  {
    id: 'b45', name: '엽기떡볶이', category: 'snack', categoryLabel: '분식',
    logoColor: '#DC2626',
    description: '2001년 창업 매운맛 떡볶이 원조 · 전국 560개 · 중독성 강한 엽기 소스 특화',
    storeCount: 560, startupCost: 7000, monthlyRoyalty: 40,
    hqVerified: true, recruiting: true, featured: false, growthRate: 10, hqRegion: '서울',
  },
  {
    id: 'b46', name: '명랑핫도그', category: 'snack', categoryLabel: '분식',
    logoColor: '#F59E0B',
    description: '치즈 핫도그 열풍 주도 · 소자본 창업 가능 · 전국 750개 · 푸드코트 특화',
    storeCount: 750, startupCost: 2500, monthlyRoyalty: 15,
    hqVerified: true, recruiting: true, featured: false, growthRate: 15, hqRegion: '서울',
  },
  {
    id: 'b47', name: '신전떡볶이', category: 'snack', categoryLabel: '분식',
    logoColor: '#B91C1C',
    description: '밀떡볶이·쌀떡볶이 동시 운영 · 전국 700개 · 학교 앞 분식 대표 브랜드',
    storeCount: 700, startupCost: 3500, monthlyRoyalty: 20,
    hqVerified: true, recruiting: true, featured: false, growthRate: 8, hqRegion: '경기',
  },
  {
    id: 'b48', name: '죠스떡볶이', category: 'snack', categoryLabel: '분식',
    logoColor: '#EA580C',
    description: '백종원의 죠스푸드 대표 브랜드 · 전국 640개 · 분식·포차 복합 메뉴 운영',
    storeCount: 640, startupCost: 4500, monthlyRoyalty: 25,
    hqVerified: true, recruiting: true, featured: false, growthRate: 6, hqRegion: '서울',
  },

  // ── 디저트 추가 ────────────────────────────────────────────────
  {
    id: 'b49', name: '배스킨라빈스', category: 'dessert', categoryLabel: '디저트',
    logoColor: '#DB2777',
    description: '31가지 아이스크림으로 유명 · SPC 운영 · 전국 1,700개 · 글로벌 아이스크림 1위',
    storeCount: 1700, startupCost: 16000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 4, hqRegion: '서울',
  },
  {
    id: 'b50', name: '나뚜루', category: 'dessert', categoryLabel: '디저트',
    logoColor: '#7C3AED',
    description: '롯데웰푸드 운영 천연재료 아이스크림 · 전국 300개 · 프리미엄 젤라또 특화',
    storeCount: 300, startupCost: 12000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 2, hqRegion: '서울',
  },

  // ── 서양식 추가 ────────────────────────────────────────────────
  {
    id: 'b51', name: 'VIPS', category: 'western', categoryLabel: '서양식',
    logoColor: '#1D4ED8',
    description: 'CJ푸드빌 패밀리 레스토랑 · 스테이크·샐러드바 · 전국 90개 프리미엄 매장',
    storeCount: 90, startupCost: 50000, monthlyRoyalty: 100,
    hqVerified: true, recruiting: true, featured: false, growthRate: 3, hqRegion: '서울',
  },
  {
    id: 'b52', name: '아웃백스테이크하우스', category: 'western', categoryLabel: '서양식',
    logoColor: '#92400E',
    description: '호주 스타일 스테이크 레스토랑 · 1997년 한국 1호점 · 전국 90개 프리미엄 매장',
    storeCount: 90, startupCost: 80000, monthlyRoyalty: 100,
    hqVerified: true, recruiting: true, featured: false, growthRate: 2, hqRegion: '서울',
  },

  // ── 피자 추가 ────────────────────────────────────────────────
  {
    id: 'b53', name: '도미노피자', category: 'pizza', categoryLabel: '피자',
    logoColor: '#1D4ED8',
    description: '글로벌 배달 피자 1위 · 국내 500개 · 30분 배달 보장으로 신뢰 구축',
    storeCount: 500, startupCost: 32000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 5, hqRegion: '서울',
  },
  {
    id: 'b54', name: '피자알볼로', category: 'pizza', categoryLabel: '피자',
    logoColor: '#DC2626',
    description: '국내 피자 프랜차이즈 1위 · 직접 배달 시스템 · 전국 600개 · 고매출 모델',
    storeCount: 600, startupCost: 8000, monthlyRoyalty: 40,
    hqVerified: true, recruiting: true, featured: false, growthRate: 10, hqRegion: '서울',
  },

  // ── 중식 추가 ────────────────────────────────────────────────
  {
    id: 'b55', name: '홍콩반점0410', category: 'chinese', categoryLabel: '중식',
    logoColor: '#B91C1C',
    description: '백종원 대표 중식 프랜차이즈 · 짜장면·짬뽕·탕수육 · 전국 700개',
    storeCount: 700, startupCost: 5500, monthlyRoyalty: 30,
    hqVerified: true, recruiting: true, featured: false, growthRate: 8, hqRegion: '서울',
  },

  // ── 편의점 추가 ────────────────────────────────────────────────
  {
    id: 'b56', name: '세븐일레븐', category: 'convenience', categoryLabel: '편의점',
    logoColor: '#DC2626',
    description: '코리아세븐(롯데) 운영 · 전국 12,152개 · 글로벌 세븐일레븐 네트워크 연계',
    storeCount: 12152, startupCost: 9000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 2, hqRegion: '서울',
  },

  // ── 교육·유아 추가 ────────────────────────────────────────────
  {
    id: 'b57', name: '눈높이(대교)', category: 'education', categoryLabel: '교육·유아',
    logoColor: '#0369A1',
    description: '1986년 창업 방문학습지 선두 · 전국 3,000+ 교사 · 초등 전과목 학습 특화',
    storeCount: 3000, startupCost: 2000, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 3, hqRegion: '서울',
  },
  {
    id: 'b58', name: '빨간펜(교원)', category: 'education', categoryLabel: '교육·유아',
    logoColor: '#DC2626',
    description: '교원 그룹 방문학습지 · 누적회원 621만명 · 유아~초등 전학년 커리큘럼',
    storeCount: 800, startupCost: 2500, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 2, hqRegion: '서울',
  },

  // ── 스터디카페 추가 ────────────────────────────────────────────
  {
    id: 'b59', name: '르하임스터디카페', category: 'study', categoryLabel: '스터디카페',
    logoColor: '#0E7490',
    description: '스터디카페 가맹점수 1위 · 225개 가맹점 · 프리미엄 인테리어 · 무인 운영',
    storeCount: 225, startupCost: 18000, monthlyRoyalty: 15,
    hqVerified: true, recruiting: true, featured: false, growthRate: 10, hqRegion: '서울',
  },
  {
    id: 'b60', name: '초심스터디카페', category: 'study', categoryLabel: '스터디카페',
    logoColor: '#0284C7',
    description: '소자본 스터디카페 · 184개 가맹점 · 24시간 무인운영 · 수험생 특화',
    storeCount: 184, startupCost: 15000, monthlyRoyalty: 15,
    hqVerified: true, recruiting: true, featured: false, growthRate: 8, hqRegion: '경기',
  },

  // ── PC방 추가 ────────────────────────────────────────────────
  {
    id: 'b61', name: '크라우드PC방', category: 'pcbang', categoryLabel: 'PC방',
    logoColor: '#4338CA',
    description: '76개 가맹점 · 창업비 17,710만원 · 고성능 게이밍 장비 · 월매출 2,907만원',
    storeCount: 76, startupCost: 17710, monthlyRoyalty: 25,
    hqVerified: true, recruiting: true, featured: false, growthRate: 7, hqRegion: '서울',
  },

  // ── 빨래방 추가 ────────────────────────────────────────────────
  {
    id: 'b62', name: '세탁특공대', category: 'laundry', categoryLabel: '빨래방',
    logoColor: '#0F766E',
    description: '앱 기반 비대면 모바일 세탁 서비스 · 전국 500개 협력점 · 소자본 창업',
    storeCount: 500, startupCost: 500, monthlyRoyalty: 0,
    hqVerified: true, recruiting: true, featured: false, growthRate: 20, hqRegion: '서울',
  },

  // ── 주점 추가 ────────────────────────────────────────────────
  {
    id: 'b63', name: '봉구비어', category: 'bar', categoryLabel: '주점',
    logoColor: '#F59E0B',
    description: '치킨&맥주 컨셉 주점 · 소자본 창업 · 전국 300개 · 배달·홀 병행 운영',
    storeCount: 300, startupCost: 8000, monthlyRoyalty: 30,
    hqVerified: true, recruiting: true, featured: false, growthRate: 9, hqRegion: '서울',
  },

  // ── 일식 추가 ────────────────────────────────────────────────
  {
    id: 'b64', name: '원할머니보쌈족발', category: 'japanese', categoryLabel: '일식',
    logoColor: '#B45309',
    description: '1983년 창업 보쌈·족발 원조 · 전국 502개 · 40년 브랜드 신뢰도',
    storeCount: 502, startupCost: 8500, monthlyRoyalty: 60,
    hqVerified: true, recruiting: true, featured: false, growthRate: 3, hqRegion: '서울',
  },
]

/** Brand HQ region map. Used by the /brands region filter and brand detail
 *  page. Real KFA disclosure address per brand will replace this once Supabase
 *  is connected. */
const BRAND_HQ_REGION: Record<string, string> = {
  b1: '서울', b2: '서울', b3: '경기', b4: '서울',
  b5: '경기', b6: '서울', b7: '인천', b8: '서울',
  b9: '경기', b10: '서울', b11: '부산', b12: '서울',
  // 실제 브랜드 (hqRegion은 RawBrand에서 직접 지정)
}

// Real franchise assets downloaded from myfranchise.kr (logos, store photos,
// YouTube video URLs). These override the generated Unsplash placeholders for
// each brand. The fictional brand names remain; only the visual assets are real.
const REAL_ASSETS: Record<string, {
  logo?: string
  heroImage?: string
  storeImages?: string[]
  menuImage0?: string
  videoUrl?: string
}> = {
  b1: {
    logo: '/brands/b1/logo.png',
    heroImage: '/brands/b1/store-0.jpg',
    storeImages: ['/brands/b1/store-0.jpg'],
    videoUrl: 'https://youtu.be/xREdAvKl7vs',
  },
  b2: {
    logo: '/brands/b2/logo.png',
    heroImage: '/brands/b2/store-0.png',
    storeImages: ['/brands/b2/store-0.png', '/brands/b2/store-1.jpg', '/brands/b2/store-2.jpg'],
    videoUrl: 'https://youtu.be/raHzxE5YVJk',
  },
  b3: {
    logo: '/brands/b3/logo.jpg',
    heroImage: '/brands/b3/store-0.jpg',
    storeImages: ['/brands/b3/store-0.jpg'],
    videoUrl: 'https://youtu.be/gIMV4welBTo',
  },
  b4: {
    logo: '/brands/b4/logo.jpg',
    heroImage: '/brands/b4/store-0.jpg',
    storeImages: ['/brands/b4/store-0.jpg', '/brands/b4/store-1.jpg', '/brands/b4/store-2.jpg'],
    menuImage0: '/brands/b4/menu-0.jpg',
    videoUrl: 'https://youtu.be/206IwNJrt7o',
  },
  b5: {
    logo: '/brands/b5/logo.jpg',
    heroImage: '/brands/b5/store-0.png',
    storeImages: ['/brands/b5/store-0.png', '/brands/b5/store-1.png', '/brands/b5/store-2.png'],
    menuImage0: '/brands/b5/menu-0.png',
    videoUrl: 'https://youtu.be/gzXumPG0oCc',
  },
  b6: {
    logo: '/brands/b6/logo.jpg',
    heroImage: '/brands/b6/store-0.png',
    storeImages: ['/brands/b6/store-0.png'],
    videoUrl: 'https://youtu.be/wxIFJcdjiow',
  },
  b7: {
    logo: '/brands/b7/logo.jpg',
    heroImage: '/brands/b7/store-0.png',
    storeImages: ['/brands/b7/store-0.png', '/brands/b7/store-1.png', '/brands/b7/store-2.png'],
    menuImage0: '/brands/b7/menu-0.png',
    videoUrl: 'https://youtu.be/LZVoPg0O4Js',
  },
  b8: {
    logo: '/brands/b8/logo.jpg',
    heroImage: '/brands/b8/store-0.png',
    storeImages: ['/brands/b8/store-0.png', '/brands/b8/store-1.png', '/brands/b8/store-2.png'],
    menuImage0: '/brands/b8/menu-0.png',
    videoUrl: 'https://youtu.be/KP4fCb6ZGr0',
  },
  b9: {
    logo: '/brands/b9/logo.jpg',
    heroImage: '/brands/b9/store-0.jpg',
    storeImages: ['/brands/b9/store-0.jpg', '/brands/b9/store-1.jpg'],
    videoUrl: 'https://youtube.com/shorts/hTTglsPt4NY',
  },
  b10: {
    logo: '/brands/b10/logo.jpg',
    heroImage: '/brands/b10/store-0.png',
    storeImages: ['/brands/b10/store-0.png', '/brands/b10/store-1.jpg', '/brands/b10/store-2.jpg'],
    videoUrl: 'https://www.youtube.com/watch?v=1DBsPRKRCdE',
  },
  b11: {
    logo: '/brands/b11/logo.png',
    heroImage: '/brands/b11/store-0.jpg',
    storeImages: ['/brands/b11/store-0.jpg', '/brands/b11/store-1.jpg', '/brands/b11/store-2.jpg'],
    menuImage0: '/brands/b11/menu-0.jpg',
    videoUrl: 'https://youtube.com/shorts/VftGCEL41gQ',
  },
  b12: {
    logo: '/brands/b12/logo.jpg',
    heroImage: '/brands/b12/store-0.jpg',
    storeImages: ['/brands/b12/store-0.jpg', '/brands/b12/store-1.jpg', '/brands/b12/store-2.jpg'],
    menuImage0: '/brands/b12/menu-0.jpg',
    videoUrl: 'https://youtu.be/ciMResgiMSY',
  },

  // ── 실제 브랜드 (Unsplash img-proxy) ──────────────────────────────
  b13: { // 파리바게뜨
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1509440159596-0249088772ff',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1563729784474-d77dbb933a9e',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1556742393-d75f468bfcb0',
    ],
    menuImage0: '/api/img-proxy?url=https://images.unsplash.com/photo-1549931319-a545dcf3bc73',
  },
  b14: { // 뚜레쥬르
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1555507036-ab1f4038808a',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1509440159596-0249088772ff',
    ],
    menuImage0: '/api/img-proxy?url=https://images.unsplash.com/photo-1608198093002-ad4e005484ec',
  },
  b15: { // 던킨
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1551024601-bec78aea704b',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1551024601-bec78aea704b',
    ],
    menuImage0: '/api/img-proxy?url=https://images.unsplash.com/photo-1506459225024-1428097a7e18',
  },
  b16: { // 롯데리아
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1565299507177-b0ac66763828',
    ],
    menuImage0: '/api/img-proxy?url=https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
  },
  b17: { // 버거킹
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1550317138-10000687a72b',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1550317138-10000687a72b',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1586816001966-79b736744398',
    ],
    menuImage0: '/api/img-proxy?url=https://images.unsplash.com/photo-1550317138-10000687a72b',
  },
  b18: { // KFC
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58',
    ],
    menuImage0: '/api/img-proxy?url=https://images.unsplash.com/photo-1562967914-608f82629710',
  },
  b19: { // CU
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1604719312566-8912e9c8a213',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1604719312566-8912e9c8a213',
    ],
  },
  b20: { // GS25
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1604719312566-8912e9c8a213',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1604719312566-8912e9c8a213',
    ],
  },
  b21: { // 아이센스PC방
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1542751371-adc38448a05e',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1542751371-adc38448a05e',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89',
    ],
  },
  b22: { // 아이비스PC방
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    ],
  },
  b23: { // 구몬학습
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    ],
  },
  b24: { // 해법수학교실
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    ],
  },
  b25: { // 작심스터디카페
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1497366216548-37526070297c',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1497366216548-37526070297c',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    ],
  },
  b26: { // 토즈스터디센터
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    ],
  },
  b27: { // 크린토피아
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1582735689369-4fe89db7114c',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1582735689369-4fe89db7114c',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1545173168-9f1947eebb7f',
    ],
  },
  b28: { // 워시엔조이
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1545173168-9f1947eebb7f',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1545173168-9f1947eebb7f',
    ],
  },
  b29: { // 다이소
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    ],
  },
  b30: { // 올리브영
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
      '/api/img-proxy?url=https://images.unsplash.com/photo-1512290923902-8a9f81dc236c',
    ],
  },
  b31: { // 셜록홈즈
    heroImage: '/api/img-proxy?url=https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    storeImages: [
      '/api/img-proxy?url=https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    ],
  },
}

// ── V2 카탈로그 헬퍼 ─────────────────────────────────────────────────────────

function proxyUrl(url: string): string {
  return `/api/img-proxy?url=${encodeURIComponent(url)}`
}

type V2Entry = {
  regNum: string; name: string; bizStr: string; category: string
  logo: string; thumbnail: string; photos: string[]; videos: string[]; score: number
}

const V2_CAT_LABELS: Record<string, string> = {
  korean: '한식', cafe: '카페', chicken: '치킨', japanese: '일식',
  snack: '분식', dessert: '디저트', bar: '주점', western: '서양식',
  pizza: '피자', chinese: '중식', convenience: '편의점',
  bakery: '제과제빵', fastfood: '패스트푸드', pcbang: 'PC방',
  education: '교육·유아', study: '스터디카페', laundry: '빨래방',
  life: '생활서비스', leisure: '여가·오락',
}

const V2_CAT_COLORS: Record<string, string> = {
  korean: '#16A34A', cafe: '#92400E', chicken: '#F97316', japanese: '#0EA5E9',
  snack: '#DC2626', dessert: '#EC4899', bar: '#7C3AED', western: '#6366F1',
  pizza: '#F59E0B', chinese: '#EF4444', convenience: '#0EA5E9',
  bakery: '#D97706', fastfood: '#DC2626', pcbang: '#6366F1',
  education: '#0284C7', study: '#0891B2', laundry: '#0D9488',
  life: '#7C3AED', leisure: '#DB2777',
}

const V2_BIZ_DESC: Record<string, string> = {
  '한식': '정통 한식 프랜차이즈', '커피': '카페 · 커피 전문점', '주점': '주점 프랜차이즈',
  '일식': '일식 전문 프랜차이즈', '치킨': '치킨 전문 프랜차이즈', '패스트푸드': '패스트푸드 · 간편식',
  '분식': '분식 전문 프랜차이즈', '아이스크림/빙수': '아이스크림 · 빙수 디저트',
  '기타 외식': '외식 프랜차이즈', '서양식': '서양식 레스토랑', '피자': '피자 전문점',
  '중식': '중식 전문 프랜차이즈', '제과제빵': '제과 · 베이커리', '스터디카페': '스터디카페',
  '편의점': '편의점 프랜차이즈', 'PC방': 'PC방 프랜차이즈', '교육·유아': '교육 · 유아 프랜차이즈',
  '빨래방': '코인세탁 · 빨래방', '생활서비스': '생활 편의 서비스', '여가·오락': '여가 · 오락 프랜차이즈',
}

const V2_REGIONS = ['서울', '서울', '서울', '경기', '경기', '경기', '부산', '인천', '대구', '대전']

const _CURATED: MockBrand[] = RAW_BRANDS.map((b) => {
  const imgs = brandImageSet({
    brandId: b.id,
    category: b.category,
    brandName: b.name,
    logoColor: b.logoColor,
  })
  const real = REAL_ASSETS[b.id]
  return {
    ...b,
    hqRegion: b.hqRegion ?? BRAND_HQ_REGION[b.id] ?? '서울',
    heroImage: real?.heroImage ?? imgs.hero,
    logo: real?.logo ?? imgs.logo,
    storeImages: real?.storeImages ?? imgs.storeImages,
    menuImages: real?.menuImage0
      ? [
          { url: real.menuImage0, name: imgs.menuImages[0]?.name ?? '시그니처 메뉴', signature: true },
          ...imgs.menuImages.slice(1),
        ]
      : imgs.menuImages,
    videoUrl: real?.videoUrl,
  }
})

// V2 브랜드 KFTC 보강 데이터 (정부 공정거래위원회 공시) — regNum 키
type V2Enrichment = {
  storeCount?: number
  newOpenCount?: number
  closedCount?: number
  avgAnnualSales?: number
  fntnFranchiseFee?: number
  fntnDeposit?: number
  fntnEducationFee?: number
  fntnOtherFees?: number
  startupCost?: number
  jngBizStartYear?: number
  corpNm?: string
}
const _KFTC_ENRICH = (v2KftcEnrich as { enrichments?: Record<string, V2Enrichment> }).enrichments ?? {}

// V2 브랜드 인테리어·메뉴 사진 (마이프차 출처, 카테고리별 분류) — regNum 키
type V2ExtraBrand = {
  regNum: string
  name: string
  found?: boolean
  photos?: { menu?: string[]; interior?: string[]; store?: string[]; other?: string[] }
  menuItems?: Array<{ name?: string; price?: number; image?: string }>
}
const _EXTRAS_BY_REGNUM: Record<string, V2ExtraBrand> = (() => {
  const m: Record<string, V2ExtraBrand> = {}
  const list = (v2ExtrasRaw as { brands?: V2ExtraBrand[] }).brands ?? []
  for (const b of list) {
    if (b.regNum && b.found) m[b.regNum] = b
  }
  return m
})()

const _V2: MockBrand[] = (v2Raw as V2Entry[]).map((b, i) => {
  const id = `v${1000 + i}`
  const local = (v2LocalPaths as Record<string, { logo?: string; heroImage?: string; storeImages?: string[] }>)[id]
  const logoUrl = b.logo || b.thumbnail
  const hero = b.photos[0] ?? b.thumbnail
  const kftc = _KFTC_ENRICH[b.regNum]
  const extras = _EXTRAS_BY_REGNUM[b.regNum]

  // 인테리어 사진 우선, 없으면 기존 store fallback
  const interiorImages = extras?.photos?.interior?.length
    ? extras.photos.interior
    : (local?.storeImages ?? b.photos.map(proxyUrl))

  // 메뉴 사진 + 이름 + 가격 — 마이프차에서 받은 실제 데이터 보존
  const menuImages: BrandMenuImage[] = (extras?.menuItems ?? [])
    .filter((m): m is { name?: string; price?: number; image: string } =>
      typeof m.image === 'string' && m.image.length > 0,
    )
    .map((m, idx) => ({
      url: m.image,
      name: m.name ?? '',
      signature: idx === 0,
      priceWon: typeof m.price === 'number' && m.price > 0 ? m.price : undefined,
    }))

  return {
    id,
    name: b.name,
    category: b.category,
    categoryLabel: V2_CAT_LABELS[b.category] ?? b.bizStr,
    logoColor: V2_CAT_COLORS[b.category] ?? '#6366F1',
    description: V2_BIZ_DESC[b.bizStr] ?? `${b.bizStr} 프랜차이즈`,
    storeCount: kftc?.storeCount ?? Math.max(5, Math.round(b.score / 100)),
    startupCost: kftc?.startupCost ?? 0,
    monthlyRoyalty: 0,
    hqVerified: kftc != null,
    recruiting: false,
    featured: false,
    growthRate: Math.max(1, Math.round(b.score / 200)),
    hqRegion: V2_REGIONS[i % V2_REGIONS.length] ?? '서울',
    heroImage: extras?.photos?.interior?.[0] ?? local?.heroImage ?? (hero ? proxyUrl(hero) : ''),
    logo: local?.logo ?? (logoUrl ? proxyUrl(logoUrl) : ''),
    storeImages: interiorImages,
    menuImages,
    videoUrl: b.videos[0] ?? undefined,
    corpNm: kftc?.corpNm,
    avgAnnualSales: kftc?.avgAnnualSales,
    jngBizStartYear: kftc?.jngBizStartYear,
    closedCount: kftc?.closedCount,
    newOpenCount: kftc?.newOpenCount,
    fntnFranchiseFee: kftc?.fntnFranchiseFee,
    fntnEducationFee: kftc?.fntnEducationFee,
    fntnDeposit: kftc?.fntnDeposit,
    fntnOtherFees: kftc?.fntnOtherFees,
  }
})

export const BRANDS: MockBrand[] = [..._CURATED, ..._V2]

export const FEATURED_BRANDS = BRANDS.filter((b) => b.featured)
export const RECRUITING_BRANDS = BRANDS.filter((b) => b.recruiting && !b.featured)

// 진짜 매장 사진을 가진 브랜드만 true.
// - /brands/...        = public/brands/v*|b* (큐레이션·V2 카탈로그 원본)
// - /brand-assets/...  = public/brand-assets/v{regNum}/{menu|interior} (V2 인테리어·메뉴 분류)
// - /api/img-proxy     = myfranchise.kr CDN 프록시 (로컬 다운로드 실패 fallback)
// 그 외 (Unsplash placeholder URL 등)는 매장과 무관한 stock 사진 → 표시 금지.
export function hasRealPhoto(brand: MockBrand): boolean {
  const h = brand.heroImage
  return h.startsWith('/brands/') || h.startsWith('/brand-assets/') || h.startsWith('/api/img-proxy')
}

// 추천순 comparator — 진짜 사진 있는 브랜드 우선, 같은 그룹 내에서는 성장률
// 내림차순. 모든 브랜드 리스트 페이지의 기본 정렬에 사용. growth-desc 같은
// 명시적 sort는 이 comparator를 무시.
export function compareBrandsRecommended(a: MockBrand, b: MockBrand): number {
  const ar = hasRealPhoto(a) ? 0 : 1
  const br = hasRealPhoto(b) ? 0 : 1
  if (ar !== br) return ar - br
  return b.growthRate - a.growthRate
}

/** Brands currently trending — combined signal of recent growth + store base. */
export const TRENDING_BRANDS = [...BRANDS]
  .sort((a, b) => b.growthRate * Math.log(b.storeCount + 1) - a.growthRate * Math.log(a.storeCount + 1))
  .slice(0, 6)
