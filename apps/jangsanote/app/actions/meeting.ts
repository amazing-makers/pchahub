'use server'

import { prisma } from '@amakers/db'
import { revalidatePath } from 'next/cache'

export async function createMeeting(data: {
  title: string
  description: string
  type: 'OFFLINE' | 'ONLINE' | 'HYBRID'
  region: string
  location: string
  date: string
  startTime: string
  endTime?: string
  maxParticipants: number
  isFree: boolean
  feeWon?: number
  hostId: string
}) {
  const meeting = await prisma.meeting.create({ data })

  revalidatePath('/meetings')
  revalidatePath('/meetings/map')

  return meeting
}

export async function joinMeeting(meetingId: string) {
  const meeting = await prisma.meeting.findUniqueOrThrow({ where: { id: meetingId } })

  if (meeting.currentParticipants >= meeting.maxParticipants) {
    throw new Error('정원이 마감되었습니다.')
  }

  const updated = await prisma.meeting.update({
    where: { id: meetingId },
    data: { currentParticipants: { increment: 1 } },
  })

  revalidatePath(`/meetings/${meetingId}`)
  revalidatePath('/meetings')

  return updated
}
