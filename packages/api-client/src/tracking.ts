import { getToken } from '@amakers/auth/sso'

export interface TrackUserActivityInput {
  platform: string
  action: string
  resourceType: string
  resourceId: string
  metadata?: Record<string, unknown>
}

export async function trackUserActivity(data: TrackUserActivityInput): Promise<void> {
  const token = getToken()
  await fetch('/api/activity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  }).catch(() => {
    /* swallow tracking errors */
  })
}
