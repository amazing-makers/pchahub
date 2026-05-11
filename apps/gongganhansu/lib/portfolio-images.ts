// Real interior/space photos used as portfolio image placeholders
// until contractor-uploaded photos are stored in Supabase.
// Unsplash photo IDs curated for: cafe, restaurant interior, bar,
// commercial fitout — categorized by F&B category.

const U = 'https://images.unsplash.com/photo-'
const Q = '?w=1600&q=80&auto=format&fit=crop'
const QS = '?w=800&q=80&auto=format&fit=crop'

interface CategoryPhotoSet {
  hero: string
  gallery: string[]
}

/** Curated photo pools per category — interior shots, not food. */
const BY_CATEGORY: Record<string, CategoryPhotoSet> = {
  cafe: {
    hero: U + '1453614512568-c4024d13c247' + Q,
    gallery: [
      U + '1453614512568-c4024d13c247' + QS,
      U + '1521017432531-fbd92d768814' + QS,
      U + '1554118811-1e0d58224f24' + QS,
      U + '1495474472287-4d71bcdd2085' + QS,
      U + '1559925393-8be0ec4767c8' + QS,
      U + '1568992687947-868a62a9f521' + QS,
    ],
  },
  korean: {
    hero: U + '1517248135467-4c7edcad34c4' + Q,
    gallery: [
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1559925393-8be0ec4767c8' + QS,
      U + '1554118811-1e0d58224f24' + QS,
      U + '1565299507177-b0ac66763828' + QS,
      U + '1559329007-40df8a9345d8' + QS,
      U + '1582719188393-bb71ca45dbb9' + QS,
    ],
  },
  japanese: {
    hero: U + '1535007813616-79dc02ba4021' + Q,
    gallery: [
      U + '1535007813616-79dc02ba4021' + QS,
      U + '1554118811-1e0d58224f24' + QS,
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1559925393-8be0ec4767c8' + QS,
      U + '1582719188393-bb71ca45dbb9' + QS,
    ],
  },
  chicken: {
    hero: U + '1559925393-8be0ec4767c8' + Q,
    gallery: [
      U + '1559925393-8be0ec4767c8' + QS,
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1554118811-1e0d58224f24' + QS,
      U + '1503602642458-232111445657' + QS,
    ],
  },
  snack: {
    hero: U + '1517248135467-4c7edcad34c4' + Q,
    gallery: [
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1559925393-8be0ec4767c8' + QS,
      U + '1582719188393-bb71ca45dbb9' + QS,
      U + '1503602642458-232111445657' + QS,
    ],
  },
  dessert: {
    hero: U + '1521017432531-fbd92d768814' + Q,
    gallery: [
      U + '1521017432531-fbd92d768814' + QS,
      U + '1568992687947-868a62a9f521' + QS,
      U + '1453614512568-c4024d13c247' + QS,
      U + '1495474472287-4d71bcdd2085' + QS,
      U + '1554118811-1e0d58224f24' + QS,
      U + '1559925393-8be0ec4767c8' + QS,
    ],
  },
  beverage: {
    hero: U + '1453614512568-c4024d13c247' + Q,
    gallery: [
      U + '1453614512568-c4024d13c247' + QS,
      U + '1521017432531-fbd92d768814' + QS,
      U + '1554118811-1e0d58224f24' + QS,
      U + '1495474472287-4d71bcdd2085' + QS,
    ],
  },
  bar: {
    hero: U + '1514933651103-005eec06c04b' + Q,
    gallery: [
      U + '1514933651103-005eec06c04b' + QS,
      U + '1572116469696-31de0f17cc34' + QS,
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1554118811-1e0d58224f24' + QS,
    ],
  },
}

const FALLBACK: CategoryPhotoSet = {
  hero: U + '1517248135467-4c7edcad34c4' + Q,
  gallery: [U + '1517248135467-4c7edcad34c4' + QS],
}

/** Stable rotation so the same portfolio always gets the same photos. */
export function portfolioPhotoSet(id: string, category: string): { hero: string; gallery: string[] } {
  const cat = BY_CATEGORY[category] ?? FALLBACK
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const start = seed % cat.gallery.length
  const gallery =
    cat.gallery.length <= 1
      ? cat.gallery
      : [...cat.gallery.slice(start), ...cat.gallery.slice(0, start)]
  return {
    hero: cat.hero,
    gallery,
  }
}

/** Contractor hero shots — real interior/studio photos. */
const CONTRACTOR_HEROES = [
  U + '1497366811353-6870744d04b2' + Q, // bright office / studio
  U + '1497366216548-37526070297c' + Q, // open office
  U + '1497366858526-0766cadbe8fa' + Q, // commercial ceiling
  U + '1497366754035-f200968a6e72' + Q, // bright lobby
  U + '1503676260728-1c00da094a0b' + Q, // classroom / studio
  U + '1577415124269-fc1140a69e91' + Q, // new building
  U + '1577415124269-fc1140a69e91' + Q, // new building
  U + '1503602642458-232111445657' + Q, // shop interior empty
]

export function contractorHero(contractorId: string): string {
  const seed = contractorId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CONTRACTOR_HEROES[seed % CONTRACTOR_HEROES.length]
}
