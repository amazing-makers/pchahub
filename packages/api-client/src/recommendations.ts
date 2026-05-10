import { getToken } from '@amakers/auth/sso'

export interface CrossRecommendations {
  listings: unknown[]
  courses: unknown[]
  posts: unknown[]
  documentaries: unknown[]
  brands: unknown[]
}

export async function getCrossRecommendations(userId: string): Promise<CrossRecommendations> {
  const token = getToken()
  const res = await fetch('/api/recommendations/cross', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ userId }),
  })
  if (!res.ok) throw new Error(`getCrossRecommendations failed: ${res.status}`)
  return res.json()
}

export interface BrandRelated {
  listings: unknown[]
  courses: unknown[]
  reviews: unknown[]
  awards: unknown[]
  documentaries: unknown[]
  investments: unknown[]
}

export async function getBrandRelated(brandId: string): Promise<BrandRelated> {
  const res = await fetch(`/api/brands/${brandId}/related`)
  if (!res.ok) throw new Error(`getBrandRelated failed: ${res.status}`)
  return res.json()
}
