'use server'

import { prisma } from '@amakers/db'
import { revalidatePath } from 'next/cache'

export async function createListing(data: {
  title: string
  description?: string
  type: 'TRANSFER' | 'NEW' | 'SALE'
  address: string
  detailAddress?: string
  area: number
  rightFee?: number
  deposit?: number
  monthlyRent?: number
  brandId?: string
  monthlyRevenue?: number
  ownerId: string
}) {
  const listing = await prisma.listing.create({ data })

  revalidatePath('/listings')

  return listing
}

export async function updateListingStatus(
  listingId: string,
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED',
) {
  const listing = await prisma.listing.update({
    where: { id: listingId },
    data: { status },
  })

  revalidatePath('/listings')
  revalidatePath(`/listings/${listingId}`)

  return listing
}

export async function incrementListingViews(listingId: string) {
  await prisma.listing.update({
    where: { id: listingId },
    data: { viewCount: { increment: 1 } },
  })
}
