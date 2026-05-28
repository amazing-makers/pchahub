// Hybrid data layer: DB first, mock-data (packages/listings) fallback.

import { prisma } from '@amakers/db'
import { LISTINGS, type MockListing } from '@amakers/listings'

export type ListingSort = 'recommended' | 'newest' | 'rent-asc' | 'rent-desc' | 'area-desc' | 'area-asc'

function mapDbListing(l: Awaited<ReturnType<typeof prisma.listing.findMany>>[number]): MockListing {
  return {
    id: l.id,
    type: l.type.toLowerCase() as MockListing['type'],
    title: l.title,
    status: (l.status.toLowerCase() === 'active' ? 'active' : l.status.toLowerCase() === 'completed' ? 'completed' : 'pending') as MockListing['status'],
    region: l.region ?? '',
    district: l.district ?? '',
    fullAddress: l.address,
    area: l.area,
    floor: l.floor ?? '',
    buildingType: '',
    rightFee: l.rightFee ?? undefined,
    deposit: l.deposit ?? 0,
    monthlyRent: l.monthlyRent ?? 0,
    salePrice: l.salePrice ?? undefined,
    fitCategories: l.fitCategories,
    tags: l.tags,
    currentBusiness: undefined,
    monthlyRevenue: l.monthlyRevenue ?? undefined,
    revenueVerified: l.revenueVerified,
    footTraffic: 0,
    availableFrom: l.createdAt.toISOString().split('T')[0] ?? '',
    verified: l.isVerified,
    featured: l.isFeatured,
    viewCount: l.viewCount,
    inquiryCount: l.inquiryCount,
    createdAt: l.createdAt.toISOString(),
    ownerType: 'direct',
    images: [],
    imageColors: ['#f3f4f6'],
  }
}

export async function getAllListings(opts: {
  type?: string
  region?: string
  fitCategory?: string
  source?: string
  q?: string
  sort?: ListingSort
} = {}): Promise<MockListing[]> {
  const { type, region, fitCategory, source, q, sort = 'recommended' } = opts

  try {
    const dbListings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        ...(type ? { type: type.toUpperCase() as 'TRANSFER' | 'NEW' | 'SALE' } : {}),
        ...(region ? { region } : {}),
        ...(fitCategory ? { fitCategories: { has: fitCategory } } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { address: { contains: q, mode: 'insensitive' } },
                { tags: { has: q } },
              ],
            }
          : {}),
      },
      orderBy:
        sort === 'newest' ? { createdAt: 'desc' }
        : sort === 'rent-asc' ? { monthlyRent: 'asc' }
        : sort === 'rent-desc' ? { monthlyRent: 'desc' }
        : sort === 'area-desc' ? { area: 'desc' }
        : sort === 'area-asc' ? { area: 'asc' }
        : { viewCount: 'desc' },
      take: 200,
    })

    if (dbListings.length > 0) {
      return dbListings.map(mapDbListing)
    }
  } catch {
    // DB unavailable — fall through to package listings
  }

  // Fallback: packages/listings static data
  let results = LISTINGS.slice()
  if (type) results = results.filter((l) => l.type === type)
  if (region) results = results.filter((l) => l.region === region)
  if (fitCategory) results = results.filter((l) => l.fitCategories.includes(fitCategory))
  if (source) {
    if (source === 'own') results = results.filter((l) => !l.externalSource)
    else results = results.filter((l) => l.externalSource?.name === source)
  }
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        l.fullAddress.toLowerCase().includes(needle) ||
        l.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  results.sort((a, b) =>
    sort === 'rent-asc' ? a.monthlyRent - b.monthlyRent
    : sort === 'rent-desc' ? b.monthlyRent - a.monthlyRent
    : sort === 'area-desc' ? b.area - a.area
    : sort === 'area-asc' ? a.area - b.area
    : sort === 'newest' ? b.createdAt.localeCompare(a.createdAt)
    : b.viewCount - a.viewCount,
  )
  return results
}

export async function getListingById(id: string): Promise<MockListing | undefined> {
  try {
    const l = await prisma.listing.findUnique({ where: { id } })
    if (l) return mapDbListing(l)
  } catch {
    // fall through
  }
  return LISTINGS.find((l) => l.id === id)
}
