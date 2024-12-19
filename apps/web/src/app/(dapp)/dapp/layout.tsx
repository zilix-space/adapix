'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { Card, CardContent } from '@design-system/react/components/ui/card'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

export default function Layout({ children }: PropsWithChildren) {
  const [isInIframe, setIsInIframe] = useState(false)

  useEffect(() => {
    const isInIframe = window.self !== window.top
    setIsInIframe(isInIframe)
  }, [])

  if (isInIframe) return <div className={`h-screen p-6`}>{children}</div>

  return (
    <div className="flex flex-col justify-center items-center min-h-screen md:space-y-8">
      <Card className="h-full">
        <CardContent className="w-full h-screen md:w-[26rem] md:h-[45rem] pt-6 md:overflow-y-auto">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
