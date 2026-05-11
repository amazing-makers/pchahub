import { redirect } from 'next/navigation'
import { AVAILABLE_YEARS } from '@/lib/mock-data'

export default function AwardsIndexPage() {
  // Redirect to the most recent year.
  redirect(`/awards/${AVAILABLE_YEARS[0]}`)
}
