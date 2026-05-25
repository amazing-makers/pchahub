import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { COURSES, MENTORS } from '@/lib/mock-data'
import { KNOWHOW_ITEMS } from '@/lib/knowhow'
import { RECIPES } from '@/lib/recipes'
import { EVENTS } from '@/lib/mock-events'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('themanual', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/courses', changeFrequency: 'daily', priority: 0.9 },
    { path: '/mentors', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/knowhow', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/recipes', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/events', changeFrequency: 'weekly', priority: 0.8 },
    ...EVENTS.map((e) => ({
      path: `/events/${e.id}`,
      lastModified: e.date,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
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
    ...KNOWHOW_ITEMS.map((k) => ({
      path: `/knowhow/${k.id}`,
      lastModified: k.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...RECIPES.map((r) => ({
      path: `/recipes/${r.id}`,
      lastModified: r.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ])
}
