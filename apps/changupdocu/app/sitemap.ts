import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { ARTICLES, CATEGORY_LABEL, EPISODES } from '@/lib/mock-data'
import { SERIES } from '@/lib/mock-series'

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryKeys = Object.keys(CATEGORY_LABEL)
  return buildSitemap('changupdocu', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/episodes', changeFrequency: 'daily', priority: 0.9 },
    { path: '/magazine', changeFrequency: 'daily', priority: 0.9 },
    { path: '/series', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/submit-story', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/categories', changeFrequency: 'weekly', priority: 0.7 },
    ...categoryKeys.map((key) => ({
      path: `/categories/${key}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...SERIES.map((s) => ({
      path: `/series/${s.id}`,
      lastModified: s.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...EPISODES.map((e) => ({
      path: `/episodes/${e.id}`,
      lastModified: e.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...ARTICLES.map((a) => ({
      path: `/magazine/${a.id}`,
      lastModified: a.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ])
}
