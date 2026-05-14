// Curated photo library for brands and listings.
//
// Approach
// --------
// Each franchise brand in mock-data.ts is fictional (to avoid trademark issues),
// but we still want store/menu photography that matches the brand category so
// the platform looks credible. We curate Unsplash photo IDs per food category
// (chicken/cafe/korean/japanese/snack/dessert/beverage/bar) and pick a stable
// subset per brand using a deterministic hash of the brand ID.
//
// Once a real HQ uploads its own assets via /for-brands/register, they will be
// served from Supabase Storage at `brands/{brandId}/...` and override the
// curated pool entries.
//
// All Unsplash photos are used under the Unsplash License (commercial use
// allowed, attribution appreciated but not required).
// https://unsplash.com/license

/**
 * Build a hotlink to an Unsplash image with reasonable sizing/cropping.
 * Keeps photo IDs short in source code while letting next/image (or plain <img>)
 * negotiate format/quality.
 */
function unsplash(id: string, w = 900, h = 600): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`
}

// ── Category photo pools ────────────────────────────────────────────────────
// Each pool has 8+ curated photo IDs. Use [].length when picking so adding more
// later is automatic. Brand-level selection is deterministic (see pickByHash).

type Category =
  | 'chicken'
  | 'cafe'
  | 'korean'
  | 'japanese'
  | 'snack'
  | 'dessert'
  | 'beverage'
  | 'bar'
  | 'convenience'
  | 'education'

/** Hero/product close-up shots — appetizing food photography per category. */
const HERO_POOL: Record<Category, string[]> = {
  chicken: [
    '1569058242253-92a9c755a0ec',
    '1562967916-eb82221dfb92',
    '1586793783658-261cddf883ef',
    '1638439430466-b2bb7fdc1d67',
    '1562967914-608f82629710',
    '1615322681853-52a81fb318ac',
    '1588923930957-81c81fd6262b',
    '1600555379765-f82335a7b1b0',
  ],
  cafe: [
    '1509042239860-f550ce710b93',
    '1542372147193-a7aca54189cd',
    '1511081692775-05d0f180a065',
    '1453614512568-c4024d13c247',
    '1521017432531-fbd92d768814',
    '1481833761820-0509d3217039',
    '1525610553991-2bede1a236e2',
    '1534234757579-8ad69d218ad4',
  ],
  korean: [
    '1569718212165-3a8278d5f624',
    '1498654896293-37aacf113fd9',
    '1496116218417-1a781b1c416c',
    '1661366394743-fe30fe478ef7',
    '1590301157890-4810ed352733',
    '1526318896980-cf78c088247c',
    '1532347231146-80afc9e3df2b',
    '1609501676725-7186f017a4b7',
  ],
  japanese: [
    '1608731002187-d3448d224d18',
    '1606064067674-e1d15f7a31b7',
    '1711588313680-1e09aa4d6751',
    '1678712704636-7d46073de37d',
    '1553016251-8e3a3946b08d',
    '1701819313872-fd59bad7acfa',
    '1676128923106-1f4bf988f347',
    '1737587539310-f60aed20fd78',
  ],
  snack: [
    '1679581083909-daf9604102ac',
    '1679581083578-94eae6e8d7a4',
    '1753011767259-c6d57777fce2',
    '1746240071934-1be6c9c94fdf',
    '1601899998044-5bfc57f832a5',
    '1714782378970-e1063453baf7',
    '1605321995625-c77c7204cd70',
    '1747228469031-c5fc60b9d9f9',
  ],
  dessert: [
    '1588195538326-c5b1e9f80a1b',
    '1568827999250-3f6afff96e66',
    '1605807646983-377bc5a76493',
    '1530648672449-81f6c723e2f1',
    '1516054575922-f0b8eeadec1a',
    '1576618148423-df549bcb6972',
    '1525203135335-74d272fc8d9c',
    '1575919361890-69028a013637',
  ],
  beverage: [
    '1622597467836-f3285f2131b8',
    '1622597468158-27733896a49d',
    '1622597468666-27cb9cae0e45',
    '1622597468620-656aa1f981ea',
    '1588465967258-636b1c445f4e',
    '1599418252078-96ef957f74ee',
    '1652454108552-8eb851ff8156',
    '1621797350487-c8996f886ab1',
  ],
  bar: [
    '1656516030074-afa7d20431ff',
    '1715598752362-a85baa74e843',
    '1652517816501-a884c3ad929e',
    '1587586938813-86ecb4fff35d',
    '1697843898689-b6f6b27481ed',
    '1675419092955-3dfff1351e01',
    '1632838874745-042652fa5d8e',
    '1570563212019-1e165124c33f',
  ],
  convenience: [
    '1517248135467-4c7edcad34c4',
    '1583354608715-177553a4035e',
    '1494346480775-936a9f0d0877',
  ],
  education: [
    '1517248135467-4c7edcad34c4',
    '1559339352-11d035aa65de',
    '1565650834520-0b48a5c83f43',
  ],
}

/**
 * Store interior/exterior photography — used for storefront/interior slots on
 * the brand detail page. Falls back to a generic restaurant interior pool when
 * a category-specific pool is too thin.
 */
const STORE_INTERIOR_POOL: string[] = [
  '1517248135467-4c7edcad34c4',
  '1667388969250-1c7220bf3f37',
  '1508424757105-b6d5ad9329d0',
  '1551632436-cbf8dd35adfa',
  '1583354608715-177553a4035e',
  '1494346480775-936a9f0d0877',
  '1613274554329-70f997f5789f',
  '1559339352-11d035aa65de',
  '1565650834520-0b48a5c83f43',
  '1538333581680-29dd4752ddf2',
]

// ── Deterministic picking ───────────────────────────────────────────────────

/** Tiny string hash so the same brandId always picks the same photos. */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pickByHash<T>(pool: T[], seed: string, count: number): T[] {
  if (pool.length === 0) return []
  const start = hash(seed) % pool.length
  const out: T[] = []
  for (let i = 0; i < count; i++) {
    const item = pool[(start + i) % pool.length]
    if (item !== undefined) out.push(item)
  }
  return out
}

// ── Public API ──────────────────────────────────────────────────────────────

export interface BrandMenuImage {
  url: string
  name: string
  signature?: boolean
}

export interface BrandImageSet {
  /** Inline SVG data URI — initial + brand color. Used when HQ has not uploaded a logo. */
  logo: string
  /** Single hero image used on cards and at the top of the brand detail page. */
  hero: string
  /** 2 store photos (exterior + interior style). */
  storeImages: string[]
  /** 4 menu photos with optional signature flag on the first one. */
  menuImages: BrandMenuImage[]
  /** Optional brand video URL (YouTube/Vimeo embed). Empty by default until HQ uploads. */
  videoUrl?: string
}

/**
 * Resolve the curated photo set for a brand. Stable across reloads — same
 * (brandId, category) always returns the same set.
 *
 * In a real deployment, this function would first check Supabase Storage for
 * HQ-uploaded assets and only fall back to the curated pool if none exist.
 */
export function brandImageSet(args: {
  brandId: string
  category: string
  brandName: string
  logoColor: string
}): BrandImageSet {
  const { brandId, category, brandName, logoColor } = args
  const cat = (category as Category) in HERO_POOL ? (category as Category) : 'cafe'
  const heroPool = HERO_POOL[cat]

  const [heroId] = pickByHash(heroPool, `${brandId}-hero`, 1)
  const storeIds = pickByHash(STORE_INTERIOR_POOL, `${brandId}-store`, 2)
  const menuIds = pickByHash(heroPool, `${brandId}-menu`, 4)

  return {
    logo: makeInitialLogo(brandName, logoColor),
    hero: heroId ? unsplash(heroId, 1200, 800) : '',
    storeImages: storeIds.map((id) => unsplash(id, 900, 600)),
    menuImages: menuIds.map((id, i) => ({
      url: unsplash(id, 600, 600),
      name: i === 0 ? '시그니처 메뉴' : `대표 메뉴 ${i + 1}`,
      signature: i === 0,
    })),
    // Mock video URLs left empty by default — HQ uploads via /for-brands/register.
    videoUrl: undefined,
  }
}

// ── SVG logo generator (initial + brand color) ──────────────────────────────

/**
 * Generate an inline SVG logo from a brand name and color. Falls back when HQ
 * has not uploaded a real logo. Encoded as a data URI so it can be used in any
 * <img src=""> directly.
 */
export function makeInitialLogo(brandName: string, color: string): string {
  // First Hangul/letter char as the initial
  const initial = brandName.trim().charAt(0) || '?'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.75"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="44" fill="url(#g)"/>
    <text x="100" y="118" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
      font-size="110" font-weight="800" fill="white" text-anchor="middle"
      dominant-baseline="middle">${escapeXml(initial)}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ── Listing image helper (used by /listings) ────────────────────────────────

/**
 * 4-photo set per listing. Uses restaurant interior pool keyed by listing ID
 * so each listing has a stable but visually distinct image set.
 */
export function listingPhotoSet(listingId: string): string[] {
  const ids = pickByHash(STORE_INTERIOR_POOL, listingId, 4)
  return ids.map((id) => unsplash(id, 900, 600))
}

/** Single brand hero (convenience wrapper used a few legacy places). */
export function brandHeroPhoto(brandId: string, category: string): string {
  const cat = (category as Category) in HERO_POOL ? (category as Category) : 'cafe'
  const [id] = pickByHash(HERO_POOL[cat], `${brandId}-hero`, 1)
  return id ? unsplash(id, 1200, 800) : ''
}
