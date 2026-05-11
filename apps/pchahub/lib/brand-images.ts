// Photo URL library used until real brand photos are uploaded.
// Unsplash photo IDs grouped by category — each entry is a real photo of
// the matching food/store type, used as a stand-in for brand-supplied images.
//
// Adding a real brand: replace getImagesFor(category) usage with the
// brand-supplied URLs stored in the DB.

const U = 'https://images.unsplash.com/photo-'
const Q = '?w=1200&q=80&auto=format&fit=crop'
const QS = '?w=600&q=80&auto=format&fit=crop'

interface CategoryImages {
  hero: string
  menu: string[]
  store: string[]
}

/** Real Unsplash photos keyed by MockBrand.category. */
const BY_CATEGORY: Record<string, CategoryImages> = {
  chicken: {
    hero: U + '1562967914-608f82629710' + Q,
    menu: [
      U + '1562967914-608f82629710' + QS,
      U + '1626082927389-6cd097cdc6ec' + QS,
      U + '1606755962773-d324e1d0788d' + QS,
      U + '1599487488170-d11ec9c172f0' + QS,
    ],
    store: [
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1559925393-8be0ec4767c8' + QS,
    ],
  },
  cafe: {
    hero: U + '1554118811-1e0d58224f24' + Q,
    menu: [
      U + '1509042239860-f550ce710b93' + QS,
      U + '1495474472287-4d71bcdd2085' + QS,
      U + '1461023058943-07fcbe16d735' + QS,
      U + '1442975631115-c4f7b05b8a2c' + QS,
    ],
    store: [
      U + '1453614512568-c4024d13c247' + QS,
      U + '1521017432531-fbd92d768814' + QS,
    ],
  },
  korean: {
    hero: U + '1583224964978-2257b960c3d3' + Q,
    menu: [
      U + '1583224964978-2257b960c3d3' + QS,
      U + '1582578598774-a377d4b32223' + QS,
      U + '1635363638580-c2809d049eee' + QS,
      U + '1626804475297-41608ea09aeb' + QS,
    ],
    store: [
      U + '1517248135467-4c7edcad34c4' + QS,
      U + '1554118811-1e0d58224f24' + QS,
    ],
  },
  japanese: {
    hero: U + '1579871494447-9811cf80d66c' + Q,
    menu: [
      U + '1579871494447-9811cf80d66c' + QS,
      U + '1611143669185-af224c5e3252' + QS,
      U + '1569718212165-3a8278d5f624' + QS,
      U + '1617196034796-73dfa7b1fd56' + QS,
    ],
    store: [
      U + '1554118811-1e0d58224f24' + QS,
      U + '1535007813616-79dc02ba4021' + QS,
    ],
  },
  snack: {
    hero: U + '1635322966219-b75ed372eb01' + Q,
    menu: [
      U + '1635322966219-b75ed372eb01' + QS,
      U + '1635363638580-c2809d049eee' + QS,
      U + '1626804475297-41608ea09aeb' + QS,
      U + '1582578598774-a377d4b32223' + QS,
    ],
    store: [
      U + '1517248135467-4c7edcad34c4' + QS,
    ],
  },
  dessert: {
    hero: U + '1551024601-bec78aea704b' + Q,
    menu: [
      U + '1551024601-bec78aea704b' + QS,
      U + '1488477181946-6428a0291777' + QS,
      U + '1565958011703-44f9829ba187' + QS,
      U + '1486427944299-d1955d23e34d' + QS,
    ],
    store: [
      U + '1521017432531-fbd92d768814' + QS,
    ],
  },
  beverage: {
    hero: U + '1502741338009-cac2772e18bc' + Q,
    menu: [
      U + '1502741338009-cac2772e18bc' + QS,
      U + '1546173159-315724a31696' + QS,
      U + '1556679343-c7306c1976bc' + QS,
      U + '1497534446932-c925b458314e' + QS,
    ],
    store: [
      U + '1453614512568-c4024d13c247' + QS,
    ],
  },
  bar: {
    hero: U + '1514933651103-005eec06c04b' + Q,
    menu: [
      U + '1514933651103-005eec06c04b' + QS,
      U + '1572116469696-31de0f17cc34' + QS,
      U + '1551024709-8f23befc6f87' + QS,
      U + '1546069901-ba9599a7e63c' + QS,
    ],
    store: [
      U + '1517248135467-4c7edcad34c4' + QS,
    ],
  },
  convenience: {
    hero: U + '1604719312566-8912e9227c6a' + Q,
    menu: [U + '1604719312566-8912e9227c6a' + QS],
    store: [U + '1604719312566-8912e9227c6a' + QS],
  },
  education: {
    hero: U + '1503676260728-1c00da094a0b' + Q,
    menu: [U + '1503676260728-1c00da094a0b' + QS],
    store: [U + '1503676260728-1c00da094a0b' + QS],
  },
}

const FALLBACK: CategoryImages = {
  hero: U + '1517248135467-4c7edcad34c4' + Q,
  menu: [U + '1517248135467-4c7edcad34c4' + QS],
  store: [U + '1517248135467-4c7edcad34c4' + QS],
}

export function getImagesFor(category: string): CategoryImages {
  return BY_CATEGORY[category] ?? FALLBACK
}

/** Stable shuffle so the same brand always gets the same picks. */
export function brandImageSet(brandId: string, category: string) {
  const cat = getImagesFor(category)
  const seed = brandId
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rotate = <T>(arr: T[], by: number) =>
    arr.length <= 1 ? arr : [...arr.slice(by % arr.length), ...arr.slice(0, by % arr.length)]
  return {
    hero: cat.hero,
    menu: rotate(cat.menu, seed),
    store: rotate(cat.store, seed),
  }
}

/** Korean store / commercial space photos used for /listings. */
export const LISTING_PHOTOS = [
  U + '1582037928769-181f2644cf99' + Q, // commercial corner
  U + '1486325212027-8081e485255e' + Q, // office building ground floor
  U + '1565538810643-b5bdb714032a' + Q, // street corner shop
  U + '1582719188393-bb71ca45dbb9' + Q, // empty retail interior
  U + '1604014237800-1c9102c219da' + Q, // korean storefront
  U + '1567521464027-f127ff144326' + Q, // commercial alley
  U + '1556760544-74068565f05c' + Q, // commercial space
  U + '1554435493-93422e8220c8' + Q, // shop front
  U + '1551522435-a13afa10a9d7' + Q, // street level retail
  U + '1567779032717-43d918a07d0a' + Q, // shop interior empty
]

export function listingPhotoSet(listingId: string): string[] {
  const seed = listingId
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const start = seed % LISTING_PHOTOS.length
  return [
    LISTING_PHOTOS[start],
    LISTING_PHOTOS[(start + 3) % LISTING_PHOTOS.length],
    LISTING_PHOTOS[(start + 7) % LISTING_PHOTOS.length],
  ]
}
