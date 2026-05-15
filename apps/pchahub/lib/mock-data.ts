// Mock data for pchahub homepage. Will be replaced with real DB queries
// once Supabase is connected. Brand names are fictional to avoid trademark
// issues; figures are illustrative and not based on actual KFA disclosures.

import { brandImageSet, type BrandMenuImage } from './brand-images'
import v2Raw from './v2-brands.json'
import v2LocalPaths from './v2-local-paths.json'
import v2KftcEnrich from '../../../packages/listings/data/v2-kftc-enrichments.json'

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
  { key: 'chicken', label: '치킨', brandCount: 27 },
  { key: 'cafe', label: '카페', brandCount: 26 },
  { key: 'korean', label: '한식', brandCount: 29 },
  { key: 'japanese', label: '일식', brandCount: 26 },
  { key: 'snack', label: '분식', brandCount: 27 },
  { key: 'dessert', label: '디저트', brandCount: 26 },
  { key: 'bar', label: '주점', brandCount: 26 },
  { key: 'western', label: '서양식', brandCount: 25 },
  { key: 'pizza', label: '피자', brandCount: 25 },
  { key: 'chinese', label: '중식', brandCount: 25 },
  { key: 'convenience', label: '편의점', brandCount: 3 },
]

type RawBrand = Omit<MockBrand, 'heroImage' | 'hqRegion'> & { hqRegion?: string }

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
]

/** Brand HQ region map. Used by the /brands region filter and brand detail
 *  page. Real KFA disclosure address per brand will replace this once Supabase
 *  is connected. */
const BRAND_HQ_REGION: Record<string, string> = {
  b1: '서울',
  b2: '서울',
  b3: '경기',
  b4: '서울',
  b5: '경기',
  b6: '서울',
  b7: '인천',
  b8: '서울',
  b9: '경기',
  b10: '서울',
  b11: '부산',
  b12: '서울',
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
}

const V2_CAT_COLORS: Record<string, string> = {
  korean: '#16A34A', cafe: '#92400E', chicken: '#F97316', japanese: '#0EA5E9',
  snack: '#DC2626', dessert: '#EC4899', bar: '#7C3AED', western: '#6366F1',
  pizza: '#F59E0B', chinese: '#EF4444', convenience: '#0EA5E9',
}

const V2_BIZ_DESC: Record<string, string> = {
  '한식': '정통 한식 프랜차이즈', '커피': '카페 · 커피 전문점', '주점': '주점 프랜차이즈',
  '일식': '일식 전문 프랜차이즈', '치킨': '치킨 전문 프랜차이즈', '패스트푸드': '패스트푸드 · 간편식',
  '분식': '분식 전문 프랜차이즈', '아이스크림/빙수': '아이스크림 · 빙수 디저트',
  '기타 외식': '외식 프랜차이즈', '서양식': '서양식 레스토랑', '피자': '피자 전문점',
  '중식': '중식 전문 프랜차이즈', '제과제빵': '제과 · 베이커리', '스터디카페': '스터디카페',
  '편의점': '편의점 프랜차이즈',
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

const _V2: MockBrand[] = (v2Raw as V2Entry[]).map((b, i) => {
  const id = `v${1000 + i}`
  const local = (v2LocalPaths as Record<string, { logo?: string; heroImage?: string; storeImages?: string[] }>)[id]
  const logoUrl = b.logo || b.thumbnail
  const hero = b.photos[0] ?? b.thumbnail
  const kftc = _KFTC_ENRICH[b.regNum]
  return {
    id,
    name: b.name,
    category: b.category,
    categoryLabel: V2_CAT_LABELS[b.category] ?? b.bizStr,
    logoColor: V2_CAT_COLORS[b.category] ?? '#6366F1',
    description: V2_BIZ_DESC[b.bizStr] ?? `${b.bizStr} 프랜차이즈`,
    // KFTC 정부 공시 데이터가 있으면 우선, 없으면 score 기반 추정값 fallback
    storeCount: kftc?.storeCount ?? Math.max(5, Math.round(b.score / 100)),
    startupCost: kftc?.startupCost ?? 0,
    monthlyRoyalty: 0,
    hqVerified: kftc != null, // KFTC 매칭된 브랜드는 정보공개서 검증됨
    recruiting: false,
    featured: false,
    growthRate: Math.max(1, Math.round(b.score / 200)),
    hqRegion: V2_REGIONS[i % V2_REGIONS.length] ?? '서울',
    heroImage: local?.heroImage ?? (hero ? proxyUrl(hero) : ''),
    logo: local?.logo ?? (logoUrl ? proxyUrl(logoUrl) : ''),
    storeImages: local?.storeImages ?? b.photos.map(proxyUrl),
    menuImages: [],
    videoUrl: b.videos[0] ?? undefined,
    // KFTC 실 API 필드 (mock-brand-detail.ts·디테일 페이지가 자동 사용)
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
// - /brands/...   = public/brands/v*|b* 로컬 파일 (큐레이션·V2 카탈로그)
// - /api/img-proxy = myfranchise.kr CDN 프록시 (V2 로컬 다운로드 실패 fallback)
// 그 외 (Unsplash placeholder URL 등)는 매장과 무관한 stock 사진 → 표시 금지.
export function hasRealPhoto(brand: MockBrand): boolean {
  const h = brand.heroImage
  return h.startsWith('/brands/') || h.startsWith('/api/img-proxy')
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
