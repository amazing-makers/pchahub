// Real photos used as store image placeholders until store owners
// upload their own. Photo pools curated per F&B category — these are
// real store/restaurant interior + food shots from Unsplash.

const U = 'https://images.unsplash.com/photo-'
const Q = '?w=1200&q=80&auto=format&fit=crop'
const QS = '?w=600&q=80&auto=format&fit=crop'

interface CategoryImages {
  hero: string
  gallery: string[]
}

const BY_CATEGORY: Record<string, CategoryImages> = {
  chicken: {
    hero: U + '1562967914-608f82629710' + Q,
    gallery: [
      U + '1562967914-608f82629710' + QS,
      U + '1626082927389-6cd097cdc6ec' + QS,
      U + '1599487488170-d11ec9c172f0' + QS,
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1559925393-8be0ec4767c8' + QS,
    ],
  },
  cafe: {
    hero: U + '1554118811-1e0d58224f24' + Q,
    gallery: [
      U + '1554118811-1e0d58224f24' + QS,
      U + '1453614512568-c4024d13c247' + QS,
      U + '1521017432531-fbd92d768814' + QS,
      U + '1568992687947-868a62a9f521' + QS,
      U + '1509042239860-f550ce710b93' + QS,
    ],
  },
  korean: {
    hero: U + '1583224964978-2257b960c3d3' + Q,
    gallery: [
      U + '1583224964978-2257b960c3d3' + QS,
      U + '1582578598774-a377d4b32223' + QS,
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1559925393-8be0ec4767c8' + QS,
      U + '1635363638580-c2809d049eee' + QS,
    ],
  },
  japanese: {
    hero: U + '1579871494447-9811cf80d66c' + Q,
    gallery: [
      U + '1579871494447-9811cf80d66c' + QS,
      U + '1611143669185-af224c5e3252' + QS,
      U + '1535007813616-79dc02ba4021' + QS,
      U + '1569718212165-3a8278d5f624' + QS,
      U + '1554118811-1e0d58224f24' + QS,
    ],
  },
  snack: {
    hero: U + '1635322966219-b75ed372eb01' + Q,
    gallery: [
      U + '1635322966219-b75ed372eb01' + QS,
      U + '1635363638580-c2809d049eee' + QS,
      U + '1626804475297-41608ea09aeb' + QS,
      U + '1582578598774-a377d4b32223' + QS,
      U + '1517248135467-4c7edcad34c4' + QS,
    ],
  },
  dessert: {
    hero: U + '1551024601-bec78aea704b' + Q,
    gallery: [
      U + '1551024601-bec78aea704b' + QS,
      U + '1488477181946-6428a0291777' + QS,
      U + '1565958011703-44f9829ba187' + QS,
      U + '1521017432531-fbd92d768814' + QS,
      U + '1486427944299-d1955d23e34d' + QS,
    ],
  },
  beverage: {
    hero: U + '1502741338009-cac2772e18bc' + Q,
    gallery: [
      U + '1502741338009-cac2772e18bc' + QS,
      U + '1546173159-315724a31696' + QS,
      U + '1556679343-c7306c1976bc' + QS,
      U + '1453614512568-c4024d13c247' + QS,
    ],
  },
  bar: {
    hero: U + '1514933651103-005eec06c04b' + Q,
    gallery: [
      U + '1514933651103-005eec06c04b' + QS,
      U + '1572116469696-31de0f17cc34' + QS,
      U + '1551024709-8f23befc6f87' + QS,
      U + '1517248135467-4c7edcad34c4' + QS,
    ],
  },
}

const FALLBACK: CategoryImages = {
  hero: U + '1517248135467-4c7edcad34c4' + Q,
  gallery: [U + '1517248135467-4c7edcad34c4' + QS],
}

export function storePhotoSet(storeId: string, category: string): { hero: string; gallery: string[] } {
  const cat = BY_CATEGORY[category] ?? FALLBACK
  const seed = storeId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const start = seed % cat.gallery.length
  const gallery =
    cat.gallery.length <= 1
      ? cat.gallery
      : [...cat.gallery.slice(start), ...cat.gallery.slice(0, start)]
  return { hero: cat.hero, gallery }
}
