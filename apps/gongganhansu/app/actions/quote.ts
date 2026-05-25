'use server'

import { prisma } from '@amakers/db'

export async function submitQuote(data: {
  name: string
  phone: string
  region: string
  area: number
  budget?: number
  style?: string
  notes?: string
  requesterId?: string
}) {
  return prisma.quote.create({ data })
}

export async function updateQuoteStatus(
  quoteId: string,
  status: 'PENDING' | 'CONTACTED' | 'QUOTED' | 'ACCEPTED' | 'DECLINED',
  contractorId?: string,
) {
  return prisma.quote.update({
    where: { id: quoteId },
    data: { status, ...(contractorId ? { contractorId } : {}) },
  })
}
