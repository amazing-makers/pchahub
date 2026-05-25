import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { PORTFOLIO, SERVICES } from '@/lib/mock-data'
import { INSIGHTS } from '@/lib/mock-insights'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap('openrun', [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/insights', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/checklist', changeFrequency: 'monthly', priority: 0.8 },
    ...INSIGHTS.map((i) => ({
      path: `/insights/${i.id}`,
      lastModified: i.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...SERVICES.map((s) => ({
      path: `/services/${s.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...PORTFOLIO.map((c) => ({
      path: `/portfolio/${c.id}`,
      lastModified: c.startedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ])
}
