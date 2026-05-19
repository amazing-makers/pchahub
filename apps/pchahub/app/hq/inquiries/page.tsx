import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { InquiriesClient } from './inquiries-client'

export default async function HQInquiriesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/hq/inquiries')
  return <InquiriesClient />
}
