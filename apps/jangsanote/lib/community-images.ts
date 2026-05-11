// Real photos used for user avatars + meeting covers + post hero images
// until user uploads/community photos are stored in Supabase.

const U = 'https://images.unsplash.com/photo-'
const QL = '?w=1200&q=80&auto=format&fit=crop'
const QS = '?w=200&q=80&auto=format&fit=crop'

/** Diverse avatar headshots for user identities. */
const AVATARS = [
  U + '1507003211169-0a1dd7228f2d' + QS,
  U + '1500648767791-00dcc994a43e' + QS,
  U + '1438761681033-6461ffad8d80' + QS,
  U + '1494790108377-be9c29b29330' + QS,
  U + '1472099645785-5658abf4ff4e' + QS,
  U + '1534528741775-53994a69daeb' + QS,
  U + '1573497019418-b400bb3ab074' + QS,
  U + '1531427186611-ecfd6d936c79' + QS,
  U + '1521119989659-a83eee488004' + QS,
  U + '1573496359142-b8d87734a5a2' + QS,
  U + '1463453091185-61582044d556' + QS,
  U + '1610057099431-d73a1c9d2f2f' + QS,
  U + '1564564321837-a57b7070ac4f' + QS,
]

export function userAvatarFor(userId: string): string {
  const seed = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATARS[seed % AVATARS.length]
}

/** Meeting cover photos by type — offline meetups, online webinars, hybrid. */
const MEETING_POOL: Record<string, string[]> = {
  offline: [
    U + '1517248135467-4c7edcad34c4' + QL, // group meeting / restaurant
    U + '1559925393-8be0ec4767c8' + QL, // people gathered
    U + '1582719188393-bb71ca45dbb9' + QL, // casual gathering
    U + '1543269865-cbf427effbad' + QL, // workshop group
    U + '1556761175-5973dc0f32e7' + QL, // event venue
    U + '1591115765373-5207764f72e7' + QL, // people talking
  ],
  online: [
    U + '1611926653458-09294b3142bf' + QL, // online meeting screen
    U + '1591115765373-5207764f72e7' + QL, // zoom-like
    U + '1576267423048-15c0040fec78' + QL, // laptop meeting
    U + '1587825140708-dfaf72ae4b04' + QL, // remote work
  ],
  hybrid: [
    U + '1517248135467-4c7edcad34c4' + QL,
    U + '1591115765373-5207764f72e7' + QL,
    U + '1559925393-8be0ec4767c8' + QL,
  ],
}

export function meetingCoverFor(meetingId: string, type: string): string {
  const pool = MEETING_POOL[type] ?? MEETING_POOL.offline
  const seed = meetingId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return pool[seed % pool.length]
}

/** Optional post hero photo by category — mostly used for 운영 후기 (experience) posts. */
const POST_POOL: Record<string, string[]> = {
  experience: [
    U + '1559925393-8be0ec4767c8' + QL,
    U + '1517248135467-4c7edcad34c4' + QL,
    U + '1554118811-1e0d58224f24' + QL,
    U + '1582578598774-a377d4b32223' + QL,
    U + '1559329007-40df8a9345d8' + QL,
  ],
  tip: [
    U + '1554118811-1e0d58224f24' + QL,
    U + '1568992687947-868a62a9f521' + QL,
  ],
  news: [
    U + '1495020689067-958852a7765e' + QL,
    U + '1504711434969-e33886168f5c' + QL,
  ],
}

/** Posts only get a hero image ~50% of the time, based on id parity + category. */
export function postHeroFor(postId: string, category: string): string | undefined {
  // 質문/토론은 사진 없는 편 (질문성 글)
  if (category === 'question' || category === 'discussion') return undefined
  const pool = POST_POOL[category] ?? POST_POOL.experience
  const seed = postId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  // 약 60% 확률로 hero 부여
  if (seed % 5 < 2) return undefined
  return pool[seed % pool.length]
}
