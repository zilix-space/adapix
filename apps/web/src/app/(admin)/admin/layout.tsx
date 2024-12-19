import { AdminSidebar } from './_components/layout/sidebar'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/services/session/get-current-user'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

/**
 * Admin layout component
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar user={user} />
      <main className="flex-1 h-full">{children}</main>
    </div>
  )
}
