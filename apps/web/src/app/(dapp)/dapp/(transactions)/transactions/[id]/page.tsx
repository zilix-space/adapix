import { notFound } from 'next/navigation'
import { getTransactionByIdAction } from '../../../actions'
import { WaitingPaymentStep } from './_components/waiting-payment-step'
import { Refresher } from '../../../_components/refresher'

type PageProps = {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

export default async function Page({ params }: PageProps) {
  const transaction = await getTransactionByIdAction({ id: params.id })

  if (!transaction) return notFound()

  return (
    <>
      <Refresher refreshInterval={30000} />
      <WaitingPaymentStep transaction={transaction} />
    </>
  )
}
