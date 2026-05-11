// Real cover photos used for documentary thumbnails + magazine article
// covers until editorial team uploads custom artwork.
// Pools curated for: success stories (smiling owners, busy shops), failure
// stories (closing shops, empty interiors), brand/trend pieces, interviews.

const U = 'https://images.unsplash.com/photo-'
const Q = '?w=1600&q=80&auto=format&fit=crop'

const SUCCESS = [
  U + '1559925393-8be0ec4767c8' + Q, // busy restaurant
  U + '1517248135467-4c7edcad34c4' + Q, // korean restaurant
  U + '1554118811-1e0d58224f24' + Q, // cafe interior bright
  U + '1559329007-40df8a9345d8' + Q, // korean food
]

const FAILURE = [
  U + '1567521464027-f127ff144326' + Q, // empty alley
  U + '1582719188393-bb71ca45dbb9' + Q, // empty retail
  U + '1497366754035-f200968a6e72' + Q, // empty lobby
  U + '1582719188393-bb71ca45dbb9' + Q, // empty retail
]

const BRAND = [
  U + '1521017432531-fbd92d768814' + Q, // dessert
  U + '1453614512568-c4024d13c247' + Q, // cafe trendy
  U + '1568992687947-868a62a9f521' + Q, // cafe modern
  U + '1495474472287-4d71bcdd2085' + Q, // cafe close-up
]

const TREND = [
  U + '1577415124269-fc1140a69e91' + Q, // urban modern
  U + '1497366216548-37526070297c' + Q, // open office
  U + '1503602642458-232111445657' + Q, // urban storefront
  U + '1488477181946-6428a0291777' + Q, // pastry trend
]

const INTERVIEW = [
  U + '1507003211169-0a1dd7228f2d' + Q, // person portrait 1
  U + '1500648767791-00dcc994a43e' + Q, // person portrait 2
  U + '1438761681033-6461ffad8d80' + Q, // person portrait 3
  U + '1494790108377-be9c29b29330' + Q, // person portrait 4
]

const POOL_BY_CATEGORY: Record<string, string[]> = {
  success: SUCCESS,
  failure: FAILURE,
  brand: BRAND,
  trend: TREND,
  interview: INTERVIEW,
}

/** Stable cover photo per episode/article by id + category. */
export function coverPhotoFor(id: string, category: string): string {
  const pool = POOL_BY_CATEGORY[category] ?? BRAND
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return pool[seed % pool.length]
}

/** Magazine article cover pool (mixed editorial photos). */
const MAGAZINE_POOL = [...SUCCESS, ...BRAND, ...TREND, ...INTERVIEW]

export function magazineCoverFor(id: string): string {
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return MAGAZINE_POOL[seed % MAGAZINE_POOL.length]
}

/** Author avatar photos for byline (real headshot URLs). */
const AVATARS = [
  U + '1507003211169-0a1dd7228f2d' + '?w=200&q=80&auto=format&fit=crop',
  U + '1500648767791-00dcc994a43e' + '?w=200&q=80&auto=format&fit=crop',
  U + '1438761681033-6461ffad8d80' + '?w=200&q=80&auto=format&fit=crop',
  U + '1494790108377-be9c29b29330' + '?w=200&q=80&auto=format&fit=crop',
  U + '1472099645785-5658abf4ff4e' + '?w=200&q=80&auto=format&fit=crop',
  U + '1534528741775-53994a69daeb' + '?w=200&q=80&auto=format&fit=crop',
]

export function authorAvatarFor(name: string): string {
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATARS[seed % AVATARS.length]
}
