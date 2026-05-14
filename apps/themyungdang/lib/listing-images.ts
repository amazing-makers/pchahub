// Curated listing photo library — Unsplash hotlinks under Unsplash License.
//
// A franchise property listing wants photography that suggests "actual store
// space": storefronts, commercial interiors, and a small amount of category-
// flavored interior shots (so a café listing leans café, a chicken listing
// leans casual-restaurant interior). When the owner uploads real photos via
// Supabase Storage they override the curated set.

function unsplash(id: string, w = 900, h = 600): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`
}

// ── Storefront + empty commercial space pool ────────────────────────────────
// Used for every listing as the base photo set. Photos depict actual retail
// fronts, empty leasable spaces, and transitional commercial interiors.

const STOREFRONT_POOL: string[] = [
  '1605513524006-063ed6ed31e7',
  '1599012307536-78ccb4253705',
  '1707649631051-2ddf02989c54',
  '1548245507-ba038c548ced',
  '1575081838238-d06e716afa28',
  '1597571488081-de05dde5dc2b',
  '1588848567248-8203ed798b4e',
  '1636499406283-46e409c6f19e',
  '1642345335843-5d216041d9d5',
]

const EMPTY_SPACE_POOL: string[] = [
  '1641159930908-e9eb9ccdc002',
  '1664817550935-79d3b6255a82',
  '1690986379988-57717535ce05',
  '1684804505273-e0daf7f4d9dd',
  '1517055813639-0ae179305650',
]

// ── Category-flavored interior photography ──────────────────────────────────
// Tilts the 4-photo listing set toward the dominant fit category. These reuse
// the same Unsplash IDs as the pchahub brand pool but are sized for listings.

const CATEGORY_INTERIOR_POOL: Record<string, string[]> = {
  chicken: ['1517248135467-4c7edcad34c4', '1538333581680-29dd4752ddf2', '1551632436-cbf8dd35adfa'],
  cafe: ['1453614512568-c4024d13c247', '1525610553991-2bede1a236e2', '1481833761820-0509d3217039'],
  korean: ['1559339352-11d035aa65de', '1565650834520-0b48a5c83f43', '1494346480775-936a9f0d0877'],
  japanese: ['1583354608715-177553a4035e', '1613274554329-70f997f5789f', '1667388969250-1c7220bf3f37'],
  snack: ['1494346480775-936a9f0d0877', '1538333581680-29dd4752ddf2'],
  dessert: ['1525610553991-2bede1a236e2', '1481833761820-0509d3217039', '1453614512568-c4024d13c247'],
  beverage: ['1453614512568-c4024d13c247', '1525610553991-2bede1a236e2'],
  bar: ['1656516030074-afa7d20431ff', '1697843898689-b6f6b27481ed', '1675419092955-3dfff1351e01'],
}

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
 * 4-photo set per listing — storefront + empty space + 2 category-flavored
 * interior shots. Stable across reloads.
 *
 * When `fitCategories[0]` is provided we tilt photos #3 and #4 toward that
 * category so a café listing actually looks café-ish.
 */
export function listingPhotoSet(listingId: string, fitCategories?: string[]): string[] {
  const cat = fitCategories?.[0]
  const interiorPool = (cat && CATEGORY_INTERIOR_POOL[cat]) || []

  const [storefront] = pickByHash(STOREFRONT_POOL, `${listingId}-front`, 1)
  const [empty] = pickByHash(EMPTY_SPACE_POOL, `${listingId}-empty`, 1)
  const flavored = pickByHash(
    interiorPool.length > 0 ? interiorPool : STOREFRONT_POOL,
    `${listingId}-int`,
    2,
  )

  return [
    storefront ? unsplash(storefront, 1200, 800) : '',
    empty ? unsplash(empty, 900, 600) : '',
    ...flavored.map((id) => unsplash(id, 900, 600)),
  ].filter(Boolean)
}

/** Region/area hero — uses a wider crop of a storefront pool image. */
export function areaHeroPhoto(areaKey: string): string {
  const [id] = pickByHash(STOREFRONT_POOL, `area-${areaKey}`, 1)
  return id ? unsplash(id, 1400, 500) : ''
}
