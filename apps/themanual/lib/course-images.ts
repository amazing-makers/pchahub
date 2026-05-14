// Curated course thumbnails + mentor avatars — Unsplash hotlinks under the
// Unsplash License. Each course gets a stable thumbnail keyed by courseId so
// reloads don't reshuffle the catalog. When an instructor uploads a custom
// thumbnail they will override this curated set.

const U = 'https://images.unsplash.com/photo-'
const QL = '?w=1200&h=800&q=80&auto=format&fit=crop'
const QS = '?w=200&h=200&q=80&auto=format&fit=crop'

// ── Per-category thumbnail pools ────────────────────────────────────────────
// Each pool has 3+ photos tilted toward the topic so a finance course gets a
// finance-feeling thumbnail, a marketing course gets a marketing thumbnail.

const COURSE_POOL: Record<string, string[]> = {
  // 가맹창업 입문 — business/notebook/learning vibe
  gateway: [
    '1588872657578-7efd1f1555ed',
    '1593642702821-c8da6771f0c6',
    '1516387938699-a93567ec168e',
    '1487017159836-4e23ece2e4cf',
    '1507206130118-b5907f817163',
  ],
  // 매장 운영 — restaurant/café operations
  ops: [
    '1509042239860-f550ce710b93',
    '1525610553991-2bede1a236e2',
    '1453614512568-c4024d13c247',
    '1481833761820-0509d3217039',
    '1517248135467-4c7edcad34c4',
  ],
  // 마케팅 — SNS/digital marketing
  marketing: [
    '1683721003111-070bcc053d8b',
    '1611926653458-09294b3142bf',
    '1611162617213-7d7a39e9b1d7',
    '1519389950473-47ba0277781c',
    '1622782914767-404fb9ab3f57',
  ],
  // 회계·세무 — finance/calculator
  finance: [
    '1626266061368-46a8f578ddd6',
    '1554224155-8d04cb21cd6c',
    '1611125832047-1d7ad1e8e48f',
    '1574607383077-47ddc2dc51c4',
    '1587145820266-a5951ee6f620',
  ],
  // 법률·계약 — contracts/books
  legal: [
    '1453928582365-b6ad33cbcf64',
    '1488521787991-ed7bbaae773c',
    '1450101499163-c8848c66ca85',
    '1454165804606-c3d57bc86b40',
    '1505664194779-8beaceb93744',
  ],
  // 인테리어·시공 — cafe/restaurant interiors
  interior: [
    '1538333581680-29dd4752ddf2',
    '1559339352-11d035aa65de',
    '1583354608715-177553a4035e',
    '1494346480775-936a9f0d0877',
    '1565650834520-0b48a5c83f43',
  ],
  // 인력·고용 — team/workshop photography
  staff: [
    '1521737604893-d14cc237f11d',
    '1542744173-8e7e53415bb0',
    '1556761175-b413da4baf72',
    '1543269865-cbf427effbad',
    '1556761175-4b46a572b786',
  ],
  // 디지털·POS — laptop/digital screens
  digital: [
    '1499951360447-b19be8fe80f5',
    '1520607162513-77705c0f0d4a',
    '1539376248633-cf94fa8b7bd8',
    '1587614382346-4ec70e388b28',
    '1562577309-4932fdd64cd1',
  ],
}

// ── Mentor avatar pool — professional portraits ─────────────────────────────

const MENTOR_AVATARS: string[] = [
  '1507003211169-0a1dd7228f2d',
  '1500648767791-00dcc994a43e',
  '1438761681033-6461ffad8d80',
  '1494790108377-be9c29b29330',
  '1472099645785-5658abf4ff4e',
  '1534528741775-53994a69daeb',
  '1573497019418-b400bb3ab074',
  '1531427186611-ecfd6d936c79',
]

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

const FALLBACK_THUMB = '1450101499163-c8848c66ca85'

// ── Public API ──────────────────────────────────────────────────────────────

export function courseThumbnailFor(courseId: string, category: string): string {
  const pool = COURSE_POOL[category] ?? []
  const id = pick(pool.length > 0 ? pool : [FALLBACK_THUMB], courseId) ?? FALLBACK_THUMB
  return U + id + QL
}

export function mentorAvatarFor(mentorId: string): string {
  const id = pick(MENTOR_AVATARS, mentorId) ?? MENTOR_AVATARS[0]!
  return U + id + QS
}
