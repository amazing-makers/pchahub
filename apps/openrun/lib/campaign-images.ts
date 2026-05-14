// Curated campaign case photos + testimonial avatars under the Unsplash License.
//
// Used by /portfolio cards, case detail heros, and homepage testimonial
// quotes. Falls back gracefully when an industry key is missing.

const U = 'https://images.unsplash.com/photo-'
const QL = '?w=1200&q=80&auto=format&fit=crop'
const QS = '?w=200&q=80&auto=format&fit=crop'

// ── Industry-keyed photo pools (Korean keys to match mock data) ────────────

const INDUSTRY_POOL: Record<string, string[]> = {
  치킨: [
    '1569058242253-92a9c755a0ec',
    '1562967916-eb82221dfb92',
    '1586793783658-261cddf883ef',
    '1562967914-608f82629710',
    '1615322681853-52a81fb318ac',
    '1588923930957-81c81fd6262b',
  ],
  카페: [
    '1509042239860-f550ce710b93',
    '1542372147193-a7aca54189cd',
    '1511081692775-05d0f180a065',
    '1453614512568-c4024d13c247',
    '1521017432531-fbd92d768814',
    '1525610553991-2bede1a236e2',
  ],
  한식: [
    '1569718212165-3a8278d5f624',
    '1498654896293-37aacf113fd9',
    '1496116218417-1a781b1c416c',
    '1661366394743-fe30fe478ef7',
    '1590301157890-4810ed352733',
  ],
  일식: [
    '1608731002187-d3448d224d18',
    '1606064067674-e1d15f7a31b7',
    '1711588313680-1e09aa4d6751',
    '1678712704636-7d46073de37d',
    '1553016251-8e3a3946b08d',
  ],
  분식: [
    '1679581083909-daf9604102ac',
    '1753011767259-c6d57777fce2',
    '1746240071934-1be6c9c94fdf',
    '1601899998044-5bfc57f832a5',
  ],
  디저트: [
    '1588195538326-c5b1e9f80a1b',
    '1568827999250-3f6afff96e66',
    '1605807646983-377bc5a76493',
    '1516054575922-f0b8eeadec1a',
  ],
  음료: [
    '1622597467836-f3285f2131b8',
    '1622597468158-27733896a49d',
    '1622597468666-27cb9cae0e45',
    '1588465967258-636b1c445f4e',
  ],
  주점: [
    '1656516030074-afa7d20431ff',
    '1715598752362-a85baa74e843',
    '1697843898689-b6f6b27481ed',
    '1675419092955-3dfff1351e01',
  ],
}

const FALLBACK_ID = '1517248135467-4c7edcad34c4'

// ── Testimonial owner headshots ─────────────────────────────────────────────

const TESTIMONIAL_IDS: string[] = [
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

// ── Public API ──────────────────────────────────────────────────────────────

export function caseImageFor(caseId: string, industry: string): string {
  const pool = INDUSTRY_POOL[industry] ?? []
  const id = pick(pool.length > 0 ? pool : [FALLBACK_ID], caseId) ?? FALLBACK_ID
  return U + id + QL
}

export function testimonialAvatarFor(testimonialId: string): string {
  const id = pick(TESTIMONIAL_IDS, testimonialId) ?? TESTIMONIAL_IDS[0]!
  return U + id + QS
}
