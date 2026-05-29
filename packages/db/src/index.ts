import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export * from '@prisma/client'

// ─── 공통 쿼리 헬퍼 ──────────────────────────────────────────────

/** 브랜드 목록 (카테고리 필터, 검색) */
export async function getBrands(opts: {
  category?: string
  q?: string
  verified?: boolean
  take?: number
  skip?: number
} = {}) {
  const { category, q, verified, take = 20, skip = 0 } = opts
  return prisma.brand.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(verified !== undefined ? { isVerified: verified } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { hqName: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { storeCount: 'desc' },
    take,
    skip,
  })
}

/** 매물 목록 (지역·유형 필터) */
export async function getListings(opts: {
  type?: 'TRANSFER' | 'NEW' | 'SALE'
  region?: string
  brandId?: string
  status?: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED'
  take?: number
  skip?: number
} = {}) {
  const { type, region, brandId, status = 'ACTIVE', take = 24, skip = 0 } = opts
  return prisma.listing.findMany({
    where: {
      status,
      ...(type ? { type } : {}),
      ...(region ? { address: { contains: region } } : {}),
      ...(brandId ? { brandId } : {}),
    },
    include: { brand: { select: { name: true, logoUrl: true } } },
    orderBy: { createdAt: 'desc' },
    take,
    skip,
  })
}

/** jangsanote 게시글 목록 */
export async function getPosts(opts: {
  channelType?: 'CATEGORY' | 'REGION' | 'GENERAL'
  channelKey?: string
  take?: number
  skip?: number
} = {}) {
  const { channelType, channelKey, take = 20, skip = 0 } = opts
  return prisma.post.findMany({
    where: {
      ...(channelType ? { channelType } : {}),
      ...(channelKey ? { channelKey } : {}),
    },
    include: { author: { select: { name: true, avatarUrl: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: 'desc' },
    take,
    skip,
  })
}

/** jangsanote 예정 모임 목록 */
export async function getUpcomingMeetings(region?: string) {
  return prisma.meeting.findMany({
    where: {
      status: 'UPCOMING',
      ...(region ? { region } : {}),
    },
    include: { host: { select: { name: true, avatarUrl: true } } },
    orderBy: { date: 'asc' },
  })
}

/** 고객 문의 생성 */
export async function createInquiry(data: {
  platform: string
  type?: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  metadata?: Record<string, unknown>
}) {
  return prisma.inquiry.create({ data })
}

/** 플랫폼 문의 목록 (관리자용) */
export async function getInquiries(opts: {
  platform: string
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  take?: number
  skip?: number
} = { platform: 'pchahub' }) {
  const { platform, status, take = 30, skip = 0 } = opts
  return prisma.inquiry.findMany({
    where: {
      platform,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take,
    skip,
  })
}

/** 단건 문의 조회 */
export async function getInquiry(id: string) {
  return prisma.inquiry.findUnique({ where: { id } })
}

/** 문의 상태·노트 업데이트 (관리자용) */
export async function updateInquiry(
  id: string,
  data: {
    status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    adminNote?: string
    resolvedAt?: Date | null
  }
) {
  return prisma.inquiry.update({ where: { id }, data })
}

/** jangsanote 상권 인텔 목록 */
export async function getIntels(opts: {
  region?: string
  category?: string
  trend?: 'UP' | 'STABLE' | 'DOWN'
  take?: number
  skip?: number
} = {}) {
  const { region, category, trend, take = 20, skip = 0 } = opts
  return prisma.intel.findMany({
    where: {
      ...(region ? { region } : {}),
      ...(category ? { category } : {}),
      ...(trend ? { trend } : {}),
    },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take,
    skip,
  })
}
