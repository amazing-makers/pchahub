import type { MetadataRoute } from 'next'
import { buildRobots } from '@amakers/design-system'

export default function robots(): MetadataRoute.Robots {
  return buildRobots('themyungdang')
}
