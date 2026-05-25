'use server'

import { prisma } from '@amakers/db'
import { revalidatePath } from 'next/cache'

export async function createPost(data: {
  title: string
  content: string
  category: string
  channelType: 'CATEGORY' | 'REGION' | 'GENERAL'
  channelKey: string
  isAnonymous?: boolean
  authorId: string
}) {
  const post = await prisma.post.create({ data })

  revalidatePath('/general')
  revalidatePath('/posts')
  if (data.channelType === 'CATEGORY') revalidatePath(`/categories/${data.channelKey}`)
  if (data.channelType === 'REGION') revalidatePath(`/regions/${data.channelKey}`)

  return post
}

export async function incrementPostViews(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  })
}

export async function likePost(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  })
}
