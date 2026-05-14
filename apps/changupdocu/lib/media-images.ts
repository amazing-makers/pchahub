// Curated documentary thumbnails + magazine covers + author avatars.
// Uses Unsplash hotlinks under the Unsplash License.
//
// Pool design:
//  - success: busy/thriving restaurants and shops
//  - failure: empty interiors, closing shops, transition spaces
//  - brand: dessert/cafe/elevated F&B
//  - trend: urban-modern lifestyle / market scenes
//  - interview: people / portraits

const U = 'https://images.unsplash.com/photo-'
const Q = '?w=1600&q=80&auto=format&fit=crop'
const QS = '?w=200&q=80&auto=format&fit=crop'

const SUCCESS: string[] = [
  '1517248135467-4c7edcad34c4',
  '1538333581680-29dd4752ddf2',
  '1565650834520-0b48a5c83f43',
  '1569718212165-3a8278d5f624',
  '1498654896293-37aacf113fd9',
  '1494346480775-936a9f0d0877',
]

const FAILURE: string[] = [
  '1641159930908-e9eb9ccdc002',
  '1664817550935-79d3b6255a82',
  '1690986379988-57717535ce05',
  '1684804505273-e0daf7f4d9dd',
  '1517055813639-0ae179305650',
]

const BRAND: string[] = [
  '1453614512568-c4024d13c247',
  '1525610553991-2bede1a236e2',
  '1481833761820-0509d3217039',
  '1521017432531-fbd92d768814',
  '1509042239860-f550ce710b93',
  '1588195538326-c5b1e9f80a1b',
]

const TREND: string[] = [
  '1683721003111-070bcc053d8b',
  '1611926653458-09294b3142bf',
  '1611162617213-7d7a39e9b1d7',
  '1519389950473-47ba0277781c',
  '1622782914767-404fb9ab3f57',
]

const INTERVIEW: string[] = [
  '1507003211169-0a1dd7228f2d',
  '1500648767791-00dcc994a43e',
  '1438761681033-6461ffad8d80',
  '1494790108377-be9c29b29330',
  '1472099645785-5658abf4ff4e',
  '1534528741775-53994a69daeb',
]

const POOL_BY_CATEGORY: Record<string, string[]> = {
  success: SUCCESS,
  failure: FAILURE,
  brand: BRAND,
  trend: TREND,
  interview: INTERVIEW,
}

const FALLBACK_COVER = BRAND[0]!

// ── Deterministic picking ───────────────────────────────────────────────────

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(pool: T[], seed: string): T | undefined {
  if (pool.length === 0) return undefined
  return pool[hash(seed) % pool.length]
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Stable cover photo per episode/article by id + category. */
export function coverPhotoFor(id: string, category: string): string {
  const pool = POOL_BY_CATEGORY[category] ?? BRAND
  const photoId = pick(pool, id) ?? FALLBACK_COVER
  return U + photoId + Q
}

/** Magazine article cover pool (mixed editorial photos). */
const MAGAZINE_POOL: string[] = [...SUCCESS, ...BRAND, ...TREND, ...INTERVIEW]

export function magazineCoverFor(id: string): string {
  const photoId = pick(MAGAZINE_POOL, id) ?? FALLBACK_COVER
  return U + photoId + Q
}

/** Author byline avatar. */
const AUTHOR_AVATARS: string[] = [
  '1507003211169-0a1dd7228f2d',
  '1500648767791-00dcc994a43e',
  '1438761681033-6461ffad8d80',
  '1494790108377-be9c29b29330',
  '1472099645785-5658abf4ff4e',
  '1534528741775-53994a69daeb',
]

export function authorAvatarFor(name: string): string {
  const id = pick(AUTHOR_AVATARS, name) ?? AUTHOR_AVATARS[0]!
  return U + id + QS
}
