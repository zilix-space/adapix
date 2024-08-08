import { headers } from 'next/headers'
import { getApplicationSession } from '@/services/session/get-application-session'
import { redirect } from 'next/navigation'
import { DappProvider } from '../_components/providers'

export const revalidate = 0
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
    // Check if the user is on the dapp page
    const isDappPage = pathname.includes('/dapp')

    // Check if the user has KYC approved
    const isKycApproved = session.user.settings.kyc.status === 'approved'
    const isKycSubmitted = session.user.settings.kyc.status === 'submitted'

    // Redirect to KYC page if user is not on the KYC page and KYC is not approved
    if (isDappPage && !pathname.includes('/dapp/kyc') && !isKycApproved) {
      if (isKycSubmitted) return redirect('/dapp/kyc/validate-user-data')
      return redirect('/dapp/kyc')
    }

    // Redirect to home page if user is on the KYC page and KYC is approved
    if (pathname.includes('/dapp/kyc') && isKycApproved) {
      return redirect('/dapp')
    }
  }

  return <DappProvider>{children}</DappProvider>
}
