import type { MetadataRoute } from 'next'
import { buildSitemap } from '@amakers/design-system'
import { ARTICLES, CATEGORY_LABEL, EPISODES } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryKeys = Object.keys(CATEGORY_LABEL)
  return buildSitemap('changupdocu', [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/episodes', changeFrequency: 'daily', priority: 0.9 },
    { path: '/magazine', changeFrequency: 'daily', priority: 0.9 },
    ...categoryKeys.map((key) => ({
      path: `/categories/${key}`,
      changeFrequency: 'weekly' as const,
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
