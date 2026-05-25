// Hybrid data layer: DB first, mock-data fallback.
// Pages call these async functions — no direct mock-data imports needed.

import { prisma } from '@amakers/db'
import { POSTS, MEETINGS, CHANNELS, type MockPost, type MockMeeting } from './mock-data'
import { INTELS, type MockIntel } from './mock-intel'

// ─── Posts ──────────────────────────────────────────────────────

export async function getAllPosts(opts: {
  channelType?: string
  channelKey?: string
  sort?: 'recent' | 'likes' | 'comments' | 'views'
  q?: string
} = {}): Promise<MockPost[]> {
  try {
    const { channelType, channelKey, sort = 'recent', q } = opts
    const dbPosts = await prisma.post.findMany({
      where: {
        ...(channelType ? { channelType: channelType as 'CATEGORY' | 'REGION' | 'GENERAL' } : {}),
        ...(channelKey ? { channelKey } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { comments: true } },
      },
      orderBy:
        sort === 'likes' ? { likes: 'desc' }
        : sort === 'views' ? { views: 'desc' }
        : { createdAt: 'desc' },
      take: 200,
    })

    if (dbPosts.length > 0) {
      return dbPosts.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt ?? p.content.slice(0, 80),
        content: [p.content],
        authorId: p.authorId,
        channelType: p.channelType.toLowerCase() as MockPost['channelType'],
        channelKey: p.channelKey,
        category: p.category as MockPost['category'],
        tags: [],
        anonymous: p.isAnonymous,
        pinned: p.isPinned,
        hot: p.isHot,
        createdAt: p.createdAt.toISOString(),
        views: p.views,
        likes: p.likes,
        commentCount: p._count.comments,
        comments: [],
        heroImage: p.heroImageUrl ?? undefined,
      }))
    }
  } catch {
    // DB unavailable — fall through to mock
  }

  let results = POSTS.slice()
  const { channelType, channelKey, sort = 'recent', q } = opts

  if (channelType) results = results.filter((p) => p.channelType === channelType)
  if (channelKey) results = results.filter((p) => p.channelKey === channelKey)
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.excerpt.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }

  results.sort((a, b) =>
    sort === 'likes' ? b.likes - a.likes
    : sort === 'comments' ? b.commentCount - a.commentCount
    : sort === 'views' ? b.views - a.views
    : b.createdAt.localeCompare(a.createdAt),
  )

  return results
}

// ─── Meetings ───────────────────────────────────────────────────

export async function getAllMeetings(opts: {
  region?: string
  type?: string
  status?: string
} = {}): Promise<MockMeeting[]> {
  try {
    const { region, type, status } = opts
    const dbMeetings = await prisma.meeting.findMany({
      where: {
        ...(status ? { status: status.toUpperCase() as 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' } : {}),
        ...(region ? { region } : {}),
        ...(type ? { type: type.toUpperCase() as 'OFFLINE' | 'ONLINE' | 'HYBRID' } : {}),
      },
      include: { host: { select: { id: true, name: true } } },
      orderBy: { date: 'asc' },
    })

    if (dbMeetings.length > 0) {
      return dbMeetings.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        type: m.type.toLowerCase() as MockMeeting['type'],
        region: m.region,
        location: m.location,
        date: m.date,
        startTime: m.startTime,
        endTime: m.endTime ?? '',
        maxParticipants: m.maxParticipants,
        currentParticipants: m.currentParticipants,
        isFree: m.isFree,
        feeWon: m.feeWon,
        status: m.status.toLowerCase() as MockMeeting['status'],
        organizerId: m.hostId,
        organizer: m.host.name ?? '익명',
        tags: [],
        agenda: [],
        createdAt: m.createdAt.toISOString(),
      }))
    }
  } catch {
    // DB unavailable — fall through to mock
  }

  let results = MEETINGS.slice()
  const { region, type, status } = opts
  if (region) results = results.filter((m) => m.region === region)
  if (type) results = results.filter((m) => m.type === type)
  if (status) results = results.filter((m) => m.status === status)
  return results
}

// ─── Intel ──────────────────────────────────────────────────────

export async function getAllIntels(opts: {
  region?: string
  category?: string
  trend?: string
  traffic?: string
  rent?: string
  q?: string
  sort?: 'latest' | 'views' | 'likes'
} = {}): Promise<MockIntel[]> {
  try {
    const { region, category, trend, traffic, rent, q, sort = 'latest' } = opts
    const dbIntels = await prisma.intel.findMany({
      where: {
        ...(region ? { region } : {}),
        ...(category ? { category } : {}),
        ...(trend ? { trend: trend.toUpperCase() as 'UP' | 'STABLE' | 'DOWN' } : {}),
        ...(traffic ? { footTraffic: traffic.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW' } : {}),
        ...(rent ? { rentLevel: rent.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW' } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { district: { contains: q, mode: 'insensitive' } },
                { summary: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { author: { select: { name: true } } },
      orderBy:
        sort === 'views' ? { views: 'desc' }
        : sort === 'likes' ? { likes: 'desc' }
        : { createdAt: 'desc' },
      take: 200,
    })

    if (dbIntels.length > 0) {
      return dbIntels.map((i) => ({
        id: i.id,
        title: i.title,
        region: i.region,
        district: i.district,
        category: i.category as MockIntel['category'],
        summary: i.summary,
        body: i.content ? [i.content] : [],
        footTraffic: i.footTraffic.toLowerCase() as MockIntel['footTraffic'],
        rentLevel: i.rentLevel.toLowerCase() as MockIntel['rentLevel'],
        trend: i.trend.toLowerCase() as MockIntel['trend'],
        keyPoints: [],
        tags: i.tags,
        authorId: i.authorId,
        views: i.views,
        likes: i.likes,
        createdAt: i.createdAt.toISOString(),
      }))
    }
  } catch {
    // DB unavailable — fall through to mock
  }

  let results = INTELS.slice()
  const { region, category, trend, traffic, rent, q, sort = 'latest' } = opts
  if (region) results = results.filter((i) => i.region === region)
  if (category) results = results.filter((i) => i.category === category)
  if (trend) results = results.filter((i) => i.trend === trend)
  if (traffic) results = results.filter((i) => i.footTraffic === traffic)
  if (rent) results = results.filter((i) => i.rentLevel === rent)
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (i) =>
        i.title.toLowerCase().includes(needle) ||
        i.district.toLowerCase().includes(needle) ||
        i.summary.toLowerCase().includes(needle) ||
        i.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  results.sort((a, b) =>
    sort === 'views' ? b.views - a.views
    : sort === 'likes' ? b.likes - a.likes
    : b.createdAt.localeCompare(a.createdAt),
  )
  return results
}

// ─── Channels (static, no DB) ───────────────────────────────────
export { CHANNELS }
