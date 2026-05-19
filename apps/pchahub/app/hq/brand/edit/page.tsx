import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { BRANDS } from '@/lib/mock-data'
import { BrandEditForm } from './form'

export const metadata = {
  title: '브랜드 정보 수정',
}

export default async function HQBrandEditPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/hq/brand/edit')

  // Mock: first brand belongs to the logged-in HQ.
  // Real implementation would use session.brandId or a brand_owner_id lookup.
  const myBrand = BRANDS[0]
  if (!myBrand) redirect('/hq/dashboard')

  return <BrandEditForm brand={myBrand} />
}
