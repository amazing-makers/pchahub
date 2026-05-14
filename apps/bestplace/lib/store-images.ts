// Curated store photo library — Unsplash hotlinks under the Unsplash License.
//
// Each store gets a stable photo set keyed by storeId so the same store always
// shows the same hero and gallery. When the store owner uploads real photos
// via the store registration flow they will override this curated set.

const U = 'https://images.unsplash.com/photo-'
const Q = '?w=1200&q=80&auto=format&fit=crop'
const QS = '?w=600&q=80&auto=format&fit=crop'

// ── Category photo pools (food + interior, validated Unsplash IDs) ─────────

const CATEGORY_PHOTOS: Record<string, string[]> = {
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
}

// Interior shots used to round out the gallery so it doesn't look like only
// food close-ups. Mixed in after the category-flavored hero/menu shots.
const INTERIOR_POOL: string[] = [
  '1517248135467-4c7edcad34c4',
  '1667388969250-1c7220bf3f37',
  '1508424757105-b6d5ad9329d0',
  '1551632436-cbf8dd35adfa',
  '1583354608715-177553a4035e',
  '1494346480775-936a9f0d0877',
  '1613274554329-70f997f5789f',
  '1559339352-11d035aa65de',
]

const FALLBACK_HERO = '1517248135467-4c7edcad34c4'

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

/**
 * Resolve the curated store photo set. Hero rotates within the category pool
 * (per-store stable) so two chicken stores get distinct hero images.
 */
export function storePhotoSet(
  storeId: string,
  category: string,
): { hero: string; gallery: string[] } {
  const catPool = CATEGORY_PHOTOS[category] ?? []
  const [heroId] = pickByHash(catPool.length > 0 ? catPool : [FALLBACK_HERO], `${storeId}-hero`, 1)
  const menuIds = pickByHash(catPool, `${storeId}-menu`, 3)
  const interiorIds = pickByHash(INTERIOR_POOL, `${storeId}-int`, 2)

  return {
    hero: U + (heroId ?? FALLBACK_HERO) + Q,
    gallery: [
      ...menuIds.map((id) => U + id + QS),
      ...interiorIds.map((id) => U + id + QS),
    ],
  }
}
