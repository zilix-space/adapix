import { DashboardWrapper } from '@design-system/react/components/shared/dashboard/wrapper'
import { MainSidebar } from './_components/sidebar'
import { MobileNavMenu } from './_components/mobile-nav-menu'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardWrapper sidebar={<MainSidebar />}>
      {children}
      <MobileNavMenu />
    </DashboardWrapper>
  )
}
