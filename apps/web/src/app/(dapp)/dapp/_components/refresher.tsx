'use client'

import { useTimeout } from '@design-system/react/hooks/use-timeout'
import { useRouter } from 'next/navigation'

export function Refresher({
  refreshInterval = 20000,
}: {
  refreshInterval: number
}) {
  const router = useRouter()

  useTimeout(() => {
    if (document.visibilityState !== 'visible') return
    router.refresh()
  }, refreshInterval)

  return <></>
}
