'use server'

import { prisma } from '@amakers/db'
import { revalidatePath } from 'next/cache'

export async function createIntel(data: {
  title: string
  region: string
  district: string
  category: string
  trend: 'UP' | 'STABLE' | 'DOWN'
  footTraffic: 'HIGH' | 'MEDIUM' | 'LOW'
  rentLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  summary: string
  content?: string
  tags: string[]
  authorId: string
}) {
  const intel = await prisma.intel.create({ data })

  revalidatePath('/intel')

  return intel
}

export async function incrementIntelViews(intelId: string) {
  await prisma.intel.update({
    where: { id: intelId },
    data: { views: { increment: 1 } },
  })
}

export async function likeIntel(intelId: string) {
  return prisma.intel.update({
    where: { id: intelId },
    data: { likes: { increment: 1 } },
  })
}
