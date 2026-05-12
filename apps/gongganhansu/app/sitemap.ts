import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { CONTRACTORS, INSIGHTS, PORTFOLIO } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('gongganhansu', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/gallery', changeFrequency: 'daily', priority: 0.9 },
    { path: '/contractors', changeFrequency: 'daily', priority: 0.9 },
    { path: '/contractors/new', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/insights', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/quote', changeFrequency: 'monthly', priority: 0.7 },
    ...PORTFOLIO.map((p) => ({
      path: `/gallery/${p.id}`,
      lastModified: p.completedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...CONTRACTORS.map((c) => ({
      path: `/contractors/${c.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...INSIGHTS.map((i) => ({
      path: `/insights/${i.id}`,
      lastModified: i.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ])
}
