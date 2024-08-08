'use client'

import Link from 'next/link'

import { FeedbackModal } from '@/app/app/(dashboard)/_components/feedback-modal'
import {
  DashboardSidebar,
  DashboardSidebarFooter,
  DashboardSidebarHeader,
  DashboardSidebarLink,
  DashboardSidebarMain,
  DashboardSidebarMenu,
  DashboardSidebarTitle,
} from '@design-system/react/components/shared/dashboard/sidebar'
import {
  BookHeartIcon,
  HelpCircleIcon,
  Home,
  MessageCircle,
  PlugIcon,
  RocketIcon,
  RssIcon,
  Settings2,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { UserNav } from './user-nav'
import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { APP_CONFIGS } from '@/boilerplate.config'

export function MainSidebar() {
  const pathname = usePathname()

  const { dict } = useDictionary()

  const isActive = (path: string, exact = false) => {
    return exact ? pathname === path : pathname.startsWith(path)
  }

  return (
    <DashboardSidebar>
      <DashboardSidebarMenu>
        <DashboardSidebarHeader>
          <DashboardSidebarTitle>AdaPix ADMIN</DashboardSidebarTitle>
        </DashboardSidebarHeader>
        <DashboardSidebarMain className="space-y-4">
          <section>
            <main>
              <Link href="/app/settings/billing">
                <DashboardSidebarLink
                  className="text-primary"
                  isActive={isActive('/app/settings/billing', true)}
                  icon={<RocketIcon />}
                >
                  {dict.dashboard.sidebar.sections.main.items.upgrade}
                </DashboardSidebarLink>
              </Link>

              <FeedbackModal>
                <DashboardSidebarLink icon={<MessageCircle />}>
                  {dict.dashboard.sidebar.sections.main.items.feedback}
                </DashboardSidebarLink>
              </FeedbackModal>
            </main>
          </section>

          <section>
            <header className="ml-4 text-xs uppercase text-muted-foreground font-bold opacity-40 mb-2">
              {dict.dashboard.sidebar.sections.dashboard.title}
            </header>
            <main>
              <Link href="/app">
                <DashboardSidebarLink
                  isActive={isActive('/app', true)}
                  icon={<Home />}
                >
                  {dict.dashboard.sidebar.sections.dashboard.items.home}
                </DashboardSidebarLink>
              </Link>
              <Link href="/app/plugins">
                <DashboardSidebarLink
                  isActive={isActive('/app/plugins', false)}
                  icon={<PlugIcon />}
                >
                  {dict.dashboard.sidebar.sections.dashboard.items.plugins}
                </DashboardSidebarLink>
              </Link>
              <Link href="/app/settings">
                <DashboardSidebarLink
                  isActive={isActive('/app/settings', true)}
                  icon={<Settings2 />}
                >
                  {dict.dashboard.sidebar.sections.dashboard.items.settings}
                </DashboardSidebarLink>
              </Link>
            </main>
          </section>

          <section>
            <header className="ml-4 text-xs uppercase text-muted-foreground font-bold opacity-40 mb-2">
              {dict.dashboard.sidebar.sections.help.title}
            </header>
            <main>
              <Link href={APP_CONFIGS.app.links.support} target="_blank">
                <DashboardSidebarLink icon={<HelpCircleIcon />}>
                  {dict.dashboard.sidebar.sections.help.items.helpCenter}
                </DashboardSidebarLink>
              </Link>
              <Link href="/blog" target="_blank">
                <DashboardSidebarLink icon={<RssIcon />}>
                  {dict.dashboard.sidebar.sections.help.items.changelog}
                </DashboardSidebarLink>
              </Link>
              <Link href="/blog" target="_blank">
                <DashboardSidebarLink icon={<BookHeartIcon />}>
                  {dict.dashboard.sidebar.sections.help.items.blog}
                </DashboardSidebarLink>
              </Link>
            </main>
          </section>
        </DashboardSidebarMain>
        <DashboardSidebarFooter>
          <section className="border-t border-border pt-4 -mx-4 px-2">
            <UserNav />
          </section>
        </DashboardSidebarFooter>
      </DashboardSidebarMenu>
    </DashboardSidebar>
  )
}
