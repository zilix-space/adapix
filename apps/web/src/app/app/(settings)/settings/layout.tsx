'use client'

import { DashboardWrapper } from '@design-system/react/components/shared/dashboard/wrapper'
import { TeamSettingsSidebar } from './_components/sidebar'
import { MobileNavMenu } from '../../(dashboard)/_components/mobile-nav-menu'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardWrapper sidebar={<TeamSettingsSidebar />}>
      {children}
      <MobileNavMenu />
    </DashboardWrapper>
  )
}
