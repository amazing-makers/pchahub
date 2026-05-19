import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { COURSES, MENTORS } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('themanual', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/courses', changeFrequency: 'daily', priority: 0.9 },
    { path: '/mentors', changeFrequency: 'weekly', priority: 0.8 },
    ...COURSES.map((c) => ({
      path: `/courses/${c.id}`,
      lastModified: c.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...MENTORS.map((m) => ({
      path: `/mentors/${m.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ])
}
