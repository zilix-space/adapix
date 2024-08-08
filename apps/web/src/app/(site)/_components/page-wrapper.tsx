import { PropsWithChildren } from 'react'

export function PageWrapper({ children }: PropsWithChildren) {
  return (
    <div>
      <div className="container max-w-screen-xl relative grid md:grid-cols-[2fr_1.1fr] py-4 items-start gap-12">
        {children}
      </div>
    </div>
  )
}
