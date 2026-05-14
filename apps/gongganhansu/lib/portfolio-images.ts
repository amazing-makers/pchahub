// Curated F&B-store interior photos for portfolio and contractor pages.
// Uses Unsplash hotlinks under the Unsplash License. When contractors upload
// their own work via Supabase Storage these placeholders are overridden.

const U = 'https://images.unsplash.com/photo-'
const Q = '?w=1600&q=80&auto=format&fit=crop'
const QS = '?w=800&q=80&auto=format&fit=crop'

// ── Category interior pools (interior shots, NOT food close-ups) ────────────

const INTERIOR_POOL: Record<string, string[]> = {
  cafe: [
    '1453614512568-c4024d13c247',
    '1525610553991-2bede1a236e2',
    '1481833761820-0509d3217039',
    '1521017432531-fbd92d768814',
    '1511081692775-05d0f180a065',
    '1542372147193-a7aca54189cd',
    '1509042239860-f550ce710b93',
    '1534234757579-8ad69d218ad4',
  ],
  korean: [
    '1559339352-11d035aa65de',
    '1565650834520-0b48a5c83f43',
    '1494346480775-936a9f0d0877',
    '1517248135467-4c7edcad34c4',
    '1538333581680-29dd4752ddf2',
  ],
  japanese: [
    '1583354608715-177553a4035e',
    '1613274554329-70f997f5789f',
    '1667388969250-1c7220bf3f37',
    '1508424757105-b6d5ad9329d0',
    '1551632436-cbf8dd35adfa',
  ],
  chicken: [
    '1517248135467-4c7edcad34c4',
    '1538333581680-29dd4752ddf2',
    '1551632436-cbf8dd35adfa',
    '1494346480775-936a9f0d0877',
    '1559339352-11d035aa65de',
  ],
  snack: [
    '1494346480775-936a9f0d0877',
    '1538333581680-29dd4752ddf2',
    '1517248135467-4c7edcad34c4',
    '1565650834520-0b48a5c83f43',
  ],
  dessert: [
    '1525610553991-2bede1a236e2',
    '1481833761820-0509d3217039',
    '1453614512568-c4024d13c247',
    '1521017432531-fbd92d768814',
    '1534234757579-8ad69d218ad4',
  ],
  beverage: [
    '1453614512568-c4024d13c247',
    '1525610553991-2bede1a236e2',
    '1521017432531-fbd92d768814',
    '1481833761820-0509d3217039',
  ],
  bar: [
    '1656516030074-afa7d20431ff',
    '1715598752362-a85baa74e843',
    '1697843898689-b6f6b27481ed',
    '1675419092955-3dfff1351e01',
    '1632838874745-042652fa5d8e',
    '1570563212019-1e165124c33f',
    '1587586938813-86ecb4fff35d',
  ],
}

const FALLBACK_ID = '1517248135467-4c7edcad34c4'

// ── Contractor / studio shots ───────────────────────────────────────────────

const CONTRACTOR_HEROES: string[] = [
  '1497366811353-6870744d04b2',  // bright studio
  '1497366216548-37526070297c',  // open office
  '1503602642458-232111445657',  // commercial fitout
  '1559339352-11d035aa65de',     // restaurant interior
  '1583354608715-177553a4035e',  // industrial interior
  '1551632436-cbf8dd35adfa',     // dining hall
  '1508424757105-b6d5ad9329d0',  // shop interior
  '1494346480775-936a9f0d0877',  // cafe space
]

// ── Deterministic picking ───────────────────────────────────────────────────

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

/** Stable rotation so the same portfolio always gets the same photos.
 *  Hero rotates within the category pool by portfolio ID. */
export function portfolioPhotoSet(
  id: string,
  category: string,
): { hero: string; gallery: string[] } {
  const pool = INTERIOR_POOL[category] ?? []
  const [heroId] = pickByHash(pool.length > 0 ? pool : [FALLBACK_ID], `${id}-hero`, 1)
  const galleryIds = pickByHash(pool.length > 0 ? pool : [FALLBACK_ID], `${id}-gal`, 6)
  return {
    hero: U + (heroId ?? FALLBACK_ID) + Q,
    gallery: galleryIds.map((gid) => U + gid + QS),
  }
}

/** Contractor hero — rotates per contractor ID. */
export function contractorHero(contractorId: string): string {
  const [id] = pickByHash(CONTRACTOR_HEROES, contractorId, 1)
  return U + (id ?? CONTRACTOR_HEROES[0]!) + Q
}
