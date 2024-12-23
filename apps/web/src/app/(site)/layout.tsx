import { PropsWithChildren } from 'react'
import { Footer } from './_components/footer'
import { Header } from './_components/header'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
