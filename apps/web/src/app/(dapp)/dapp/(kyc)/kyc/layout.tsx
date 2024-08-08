import { headers } from 'next/headers'
import { getApplicationSession } from '@/services/session/get-application-session'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the session from the server
  const session = await getApplicationSession()

  // Get the pathname from the headers
  const pathname = headers().get('x-pathname')

  if (session.user) {
    // Check if the user has KYC approved
    const isKycApproved = session.user.settings.kyc.status === 'approved'
    const isKycSubmitted = session.user.settings.kyc.status === 'submitted'

    // Redirect to home page if user is on the KYC page and KYC is approved
    if (pathname.includes('/dapp/kyc')) {
      if (isKycApproved) return redirect('/dapp')
      if (isKycSubmitted && pathname !== '/dapp/kyc/validate-user-data')
        return redirect('/dapp/kyc/validate-user-data')
    }
  }

  return <>{children}</>
}
