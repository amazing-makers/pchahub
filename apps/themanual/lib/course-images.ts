// Real photos for course thumbnails + mentor avatars
// until contributors upload custom artwork.

const U = 'https://images.unsplash.com/photo-'
const QL = '?w=1200&q=80&auto=format&fit=crop'
const QS = '?w=200&q=80&auto=format&fit=crop'

/** Course thumbnail pool — business/restaurant/workshop themed by category. */
const COURSE_POOL: Record<string, string[]> = {
  gateway: [
    U + '1450101499163-c8848c66ca85' + QL, // business notebook
    U + '1517245386807-bb43f82c33c4' + QL, // study desk
  ],
  ops: [
    U + '1559925393-8be0ec4767c8' + QL, // restaurant operations
    U + '1517248135467-4c7edcad34c4' + QL, // korean restaurant
    U + '1554118811-1e0d58224f24' + QL, // cafe ops
  ],
  marketing: [
    U + '1556761175-5973dc0f32e7' + QL, // marketing whiteboard
    U + '1551836022-d5d88e9218df' + QL, // SNS phone
    U + '1611926653458-09294b3142bf' + QL, // online marketing
  ],
  finance: [
    U + '1554224155-6726b3ff858f' + QL, // financial calc
    U + '1450101499163-c8848c66ca85' + QL, // notebook + coffee
  ],
  legal: [
    U + '1450101499163-c8848c66ca85' + QL, // contracts
    U + '1505664194779-8beaceb93744' + QL, // law books
  ],
  interior: [
    U + '1453614512568-c4024d13c247' + QL, // cafe interior
    U + '1497366811353-6870744d04b2' + QL, // studio space
  ],
  staff: [
    U + '1521737604893-d14cc237f11d' + QL, // team meeting
    U + '1543269865-cbf427effbad' + QL, // group workshop
  ],
  digital: [
    U + '1611926653458-09294b3142bf' + QL, // digital screens
    U + '1554224155-6726b3ff858f' + QL, // laptop + numbers
  ],
}

const FALLBACK = [U + '1450101499163-c8848c66ca85' + QL]

export function courseThumbnailFor(courseId: string, category: string): string {
  const pool = COURSE_POOL[category] ?? FALLBACK
  const seed = courseId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return pool[seed % pool.length]
}

/** Mentor headshot pool — professional portraits. */
const MENTOR_AVATARS = [
  U + '1507003211169-0a1dd7228f2d' + QS,
  U + '1500648767791-00dcc994a43e' + QS,
  U + '1438761681033-6461ffad8d80' + QS,
  U + '1494790108377-be9c29b29330' + QS,
  U + '1472099645785-5658abf4ff4e' + QS,
  U + '1534528741775-53994a69daeb' + QS,
  U + '1573497019418-b400bb3ab074' + QS,
  U + '1531427186611-ecfd6d936c79' + QS,
]

export function mentorAvatarFor(mentorId: string): string {
  const seed = mentorId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return MENTOR_AVATARS[seed % MENTOR_AVATARS.length]
}
