'use server'

import { prisma } from '@amakers/db'

export async function upsertCourseProgress(data: {
  userId: string
  courseId: string
  progress: number
  completed?: boolean
}) {
  return prisma.userActivity.upsert({
    where: {
      id: `${data.userId}_course_${data.courseId}`,
    },
    create: {
      id: `${data.userId}_course_${data.courseId}`,
      userId: data.userId,
      platform: 'themanual',
      action: data.completed ? 'course_complete' : 'course_progress',
      resourceType: 'course',
      resourceId: data.courseId,
      metadata: { progress: data.progress, completed: data.completed ?? false },
    },
    update: {
      action: data.completed ? 'course_complete' : 'course_progress',
      metadata: { progress: data.progress, completed: data.completed ?? false },
    },
  })
}

export async function getCourseProgress(userId: string, courseId: string) {
  const activity = await prisma.userActivity.findUnique({
    where: { id: `${userId}_course_${courseId}` },
  })
  if (!activity?.metadata) return { progress: 0, completed: false }
  const meta = activity.metadata as { progress: number; completed: boolean }
  return { progress: meta.progress, completed: meta.completed }
}
