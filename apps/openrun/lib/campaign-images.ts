// Real photos for portfolio case thumbnails + testimonial avatars
// until campaign-specific creatives are uploaded.

const U = 'https://images.unsplash.com/photo-'
const QL = '?w=1200&q=80&auto=format&fit=crop'
const QS = '?w=200&q=80&auto=format&fit=crop'

/** Industry-themed photos for portfolio cases. */
const INDUSTRY_POOL: Record<string, string[]> = {
  치킨: [
    U + '1562967914-608f82629710' + QL,
    U + '1626082927389-6cd097cdc6ec' + QL,
    U + '1599487488170-d11ec9c172f0' + QL,
  ],
  카페: [
    U + '1554118811-1e0d58224f24' + QL,
    U + '1453614512568-c4024d13c247' + QL,
    U + '1521017432531-fbd92d768814' + QL,
  ],
  한식: [
    U + '1583224964978-2257b960c3d3' + QL,
    U + '1517248135467-4c7edcad34c4' + QL,
  ],
  일식: [
    U + '1579871494447-9811cf80d66c' + QL,
    U + '1611143669185-af224c5e3252' + QL,
  ],
  분식: [
    U + '1635322966219-b75ed372eb01' + QL,
    U + '1582578598774-a377d4b32223' + QL,
  ],
  디저트: [
    U + '1551024601-bec78aea704b' + QL,
    U + '1488477181946-6428a0291777' + QL,
  ],
  음료: [
    U + '1502741338009-cac2772e18bc' + QL,
    U + '1546173159-315724a31696' + QL,
  ],
  주점: [
    U + '1514933651103-005eec06c04b' + QL,
    U + '1572116469696-31de0f17cc34' + QL,
  ],
}

const FALLBACK = [U + '1517248135467-4c7edcad34c4' + QL]

export function caseImageFor(caseId: string, industry: string): string {
  const pool = INDUSTRY_POOL[industry] ?? FALLBACK
  const seed = caseId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return pool[seed % pool.length]
}

/** Testimonial avatar — owner headshots. */
const TESTIMONIAL_AVATARS = [
  U + '1507003211169-0a1dd7228f2d' + QS,
  U + '1500648767791-00dcc994a43e' + QS,
  U + '1438761681033-6461ffad8d80' + QS,
  U + '1494790108377-be9c29b29330' + QS,
  U + '1472099645785-5658abf4ff4e' + QS,
  U + '1534528741775-53994a69daeb' + QS,
  U + '1573497019418-b400bb3ab074' + QS,
  U + '1531427186611-ecfd6d936c79' + QS,
]

export function testimonialAvatarFor(testimonialId: string): string {
  const seed = testimonialId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return TESTIMONIAL_AVATARS[seed % TESTIMONIAL_AVATARS.length]
}
