// Real commercial real-estate photos used as listing image placeholders
// until owner-uploaded photos are stored in Supabase. Unsplash photo IDs
// curated for: storefront, retail interior, corner shop, office floor,
// commercial street.

const U = 'https://images.unsplash.com/photo-'
const Q = '?w=1200&q=80&auto=format&fit=crop'

/** Korean storefront / commercial space photo pool. */
const POOL = [
  U + '1582037928769-181f2644cf99' + Q, // commercial corner
  U + '1486325212027-8081e485255e' + Q, // ground floor office
  U + '1565538810643-b5bdb714032a' + Q, // street corner shop
  U + '1582719188393-bb71ca45dbb9' + Q, // empty retail interior
  U + '1604014237800-1c9102c219da' + Q, // korean storefront
  U + '1567521464027-f127ff144326' + Q, // commercial alley
  U + '1556760544-74068565f05c' + Q, // commercial space
  U + '1554435493-93422e8220c8' + Q, // shop front
  U + '1551522435-a13afa10a9d7' + Q, // street level retail
  U + '1567779032717-43d918a07d0a' + Q, // shop interior empty
  U + '1497366216548-37526070297c' + Q, // open office
  U + '1497366811353-6870744d04b2' + Q, // workspace
  U + '1497366754035-f200968a6e72' + Q, // bright lobby
  U + '1497366858526-0766cadbe8fa' + Q, // commercial ceiling
  U + '1568992687947-868a62a9f521' + Q, // cafe interior empty
]

/**
 * Stable photo set per listing — same listing id always returns same photos.
 * Returns 4 photos: hero + 3 interior shots.
 */
export function listingPhotoSet(listingId: string): string[] {
  const seed = listingId
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const start = seed % POOL.length
  return [
    POOL[start],
    POOL[(start + 4) % POOL.length],
    POOL[(start + 8) % POOL.length],
    POOL[(start + 11) % POOL.length],
  ]
}

/** Region-level hero shots for /areas/[key]. */
const REGION_HEROES: Record<string, string> = {
  gangnam: U + '1538485399081-7c8978c47957' + Q,
  hongdae: U + '1538485399081-7c8978c47957' + Q,
  pangyo: U + '1577415124269-fc1140a69e91' + Q,
  songdo: U + '1577415124269-fc1140a69e91' + Q,
  seomyeon: U + '1538485399081-7c8978c47957' + Q,
  dongseongro: U + '1538485399081-7c8978c47957' + Q,
  chungjangro: U + '1538485399081-7c8978c47957' + Q,
  dunsan: U + '1538485399081-7c8978c47957' + Q,
}

export function areaHeroPhoto(areaKey: string): string {
  return REGION_HEROES[areaKey] ?? POOL[0]
}
