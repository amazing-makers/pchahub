// Curated avatars + meeting covers + post hero images for the community.
// Uses Unsplash hotlinks under the Unsplash License.

const U = 'https://images.unsplash.com/photo-'
const QL = '?w=1200&q=80&auto=format&fit=crop'
const QS = '?w=200&q=80&auto=format&fit=crop'

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

// ── User avatar pool ────────────────────────────────────────────────────────

const AVATAR_IDS: string[] = [
  '1507003211169-0a1dd7228f2d',
  '1500648767791-00dcc994a43e',
  '1438761681033-6461ffad8d80',
  '1494790108377-be9c29b29330',
  '1472099645785-5658abf4ff4e',
  '1534528741775-53994a69daeb',
  '1573497019418-b400bb3ab074',
  '1531427186611-ecfd6d936c79',
  '1521119989659-a83eee488004',
  '1573496359142-b8d87734a5a2',
  '1463453091185-61582044d556',
  '1564564321837-a57b7070ac4f',
]

export function userAvatarFor(userId: string): string {
  return U + (pick(AVATAR_IDS, userId) ?? AVATAR_IDS[0]!) + QS
}

// ── Meeting cover pools ─────────────────────────────────────────────────────

const MEETING_POOL: Record<string, string[]> = {
  offline: [
    '1517248135467-4c7edcad34c4',     // restaurant table group
    '1559339352-11d035aa65de',        // workshop interior
    '1565650834520-0b48a5c83f43',     // event venue
    '1543269865-cbf427effbad',        // workshop group
    '1494346480775-936a9f0d0877',     // casual gathering
    '1538333581680-29dd4752ddf2',     // restaurant gathering
  ],
  online: [
    '1611926653458-09294b3142bf',     // online meeting screens
    '1611162617213-7d7a39e9b1d7',     // remote work setup
    '1519389950473-47ba0277781c',     // laptop meeting
    '1519389950473-47ba0277781c',
  ],
  hybrid: [
    '1683721003111-070bcc053d8b',     // hybrid screens
    '1517248135467-4c7edcad34c4',     // restaurant group
    '1611926653458-09294b3142bf',     // online element
  ],
}

const MEETING_FALLBACK = '1517248135467-4c7edcad34c4'

export function meetingCoverFor(meetingId: string, type: string): string {
  const pool = MEETING_POOL[type] ?? MEETING_POOL.offline ?? []
  return U + (pick(pool, meetingId) ?? MEETING_FALLBACK) + QL
}

// ── Post hero pools ─────────────────────────────────────────────────────────

const POST_POOL: Record<string, string[]> = {
  experience: [
    '1517248135467-4c7edcad34c4',
    '1538333581680-29dd4752ddf2',
    '1565650834520-0b48a5c83f43',
    '1559339352-11d035aa65de',
    '1494346480775-936a9f0d0877',
    '1453614512568-c4024d13c247',
  ],
  tip: [
    '1453614512568-c4024d13c247',
    '1525610553991-2bede1a236e2',
    '1683721003111-070bcc053d8b',
    '1611162617213-7d7a39e9b1d7',
  ],
  news: [
    '1495020689067-958852a7765e',
    '1504711434969-e33886168f5c',
    '1576267423048-15c0040fec78',
  ],
}

// ── Recipe (food) + Festival (expo/event) pools ─────────────────────────────

const DRINK_POOL: string[] = [
  '1461023058943-07fcbe16d735', // coffee latte
  '1495474472287-4d71bcdd2085', // coffee cup
  '1509042239860-f550ce710b93', // latte art
]
const DISH_POOL: string[] = [
  '1513104890138-7c749659a591', // pizza/dish
  '1498654896293-37aacf113fd9', // burger/dish
  '1551183053-bf91a1d81141',    // pasta
  '1504674900247-0877df9cc836', // plated food
  '1540189549336-e6e99c3679fe', // burger meal
  '1467003909585-2f8a72700288', // korean dish
  '1565299624946-b28f40a0ae38', // food plate
]

/** 카페/음료 레시피는 음료 사진, 그 외(분식·한식·양식·치킨/주점)는 요리 사진. */
export function recipeCoverFor(recipeId: string, category?: string): string {
  const pool = category === '카페' || category === '음료' ? DRINK_POOL : DISH_POOL
  return U + (pick(pool, recipeId) ?? pool[0]!) + QL
}

const FESTIVAL_POOL: string[] = [
  '1540575467063-178a50c2df87', // conference hall
  '1505373877841-8d25f7d46678', // expo crowd
  '1511578314322-379afb476865', // event audience
  '1492684223066-81342ee5ff30', // festival crowd
  '1559223607-a43c990c692c',    // booth / hall
  '1556761175-5973dc0f32e7',    // business expo
  '1515187029135-18ee286d815b', // trade show booth
  '1531058020387-3be344556be6', // exhibition
  '1475721027785-f74eccf877e2', // seminar
  '1524178232363-1fb2b075b655', // co-working / meetup
]

export function festivalCoverFor(festivalId: string): string {
  return U + (pick(FESTIVAL_POOL, festivalId) ?? FESTIVAL_POOL[0]!) + QL
}

/** Posts only get a hero image about ~60% of the time, based on id hash.
 *  Question/discussion posts have no hero (text-only). */
export function postHeroFor(postId: string, category: string): string | undefined {
  if (category === 'question' || category === 'discussion') return undefined
  const pool = POST_POOL[category] ?? POST_POOL.experience ?? []
  if (pool.length === 0) return undefined
  // 약 60% 확률로 hero 부여
  if (hash(postId) % 5 < 2) return undefined
  const id = pick(pool, postId) ?? pool[0]!
  return U + id + QL
}
