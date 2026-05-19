import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { CHANNELS, MEETINGS, POSTS } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryChannels = CHANNELS.filter((c) => c.type === 'category')
  const regionChannels = CHANNELS.filter((c) => c.type === 'region')

  return buildSitemap('jangsanote', [
    { path: '/', changeFrequency: 'hourly', priority: 1 },
    { path: '/general', changeFrequency: 'hourly', priority: 0.9 },
    { path: '/categories', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/regions', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/posts', changeFrequency: 'hourly', priority: 0.8 },
    { path: '/meetings', changeFrequency: 'daily', priority: 0.9 },
    ...categoryChannels.map((c) => ({
      path: `/categories/${c.key}`,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })),
    ...regionChannels.map((c) => ({
      path: `/regions/${c.key}`,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })),
    ...POSTS.map((p) => ({
      path: `/posts/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
    ...MEETINGS.map((m) => ({
      path: `/meetings/${m.id}`,
      lastModified: m.date,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ])
}
