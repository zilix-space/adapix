'use client'

import Link from 'next/link'

import { useApplication } from '@/app/app/_hooks/application.hook'
import { Button } from '@design-system/react/components/ui/button'
import { HelpCircleIcon, LogInIcon } from 'lucide-react'
import { APP_CONFIGS } from '@/boilerplate.config'

export function HeaderToolbar() {
  const application = useApplication()

  if (!application.session.user)
    return (
      <div className="flex items-center gap-4">
        <Link href="/dapp/auth">
          <Button variant="secondary" className="rounded-full bg-black/5">
            Entrar
            <LogInIcon className="w-3 h-3 ml-3 text-muted-foreground" />
          </Button>
        </Link>
      </div>
    )

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/5"
        asChild
      >
        <Link href={APP_CONFIGS.app.links.support} target="_blank">
          <HelpCircleIcon className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  )
}
