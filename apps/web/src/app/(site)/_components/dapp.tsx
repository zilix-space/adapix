import { getUrl } from '@/helpers/get-url'
import { getApplicationSession } from '@/services/session/get-application-session'

export async function Dapp() {
  // Get the session from the server
  const session = await getApplicationSession()

  // Get the pathname from the headers
  let dappPath = '/dapp'

  if (session.user) {
    // Check if the user has KYC approved
    const isKycPending = session.user.settings.kyc.status === 'pending'
    const isKycSubmitted = session.user.settings.kyc.status === 'submitted'

    // Redirect to home page if user is on the KYC page and KYC is approved
    if (isKycSubmitted) dappPath = '/dapp/kyc/validate-user-data'
    if (isKycPending) dappPath = '/dapp/kyc'
  }

  return (
    <div className="bg-card border border-border rounded-3xl h-[44rem] sticky top-20 overflow-hidden">
      <iframe
        src={getUrl(dappPath)}
        className="w-full h-full relative overflow-hidden rounded-3xl"
        allow="clipboard-write; usb; camera; microphone; cookies; headers; *; web3"
        title=""
      ></iframe>
    </div>
  )
}
