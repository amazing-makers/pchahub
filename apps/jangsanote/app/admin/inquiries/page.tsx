import { getServerSession } from 'next-auth'
import { authOptions } from '@amakers/auth'
import { redirect } from 'next/navigation'
import { getInquiries, updateInquiry } from '@amakers/db'
import { AdminInquiriesPanel, type InquiryStatus } from '@amakers/ui'

const PLATFORM = 'jangsanote'

export default async function AdminInquiriesPage() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') redirect('/auth/signin?callbackUrl=/admin/inquiries')

  const inquiries = await getInquiries({ platform: PLATFORM, take: 100 })

  async function handleUpdate(id: string, status: InquiryStatus, adminNote?: string) {
    'use server'
    await updateInquiry(id, {
      status,
      adminNote,
      resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : null,
    })
  }

  return (
    <div className="p-6">
      <AdminInquiriesPanel
        inquiries={inquiries.map((i) => ({
          ...i,
          metadata: i.metadata as Record<string, unknown> | null,
        }))}
        platform={PLATFORM}
        onUpdateStatus={handleUpdate}
      />
    </div>
  )
}
